<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SendOtpRequest;
use App\Http\Requests\VerifyPhoneRequest;
use App\Http\Resources\UserResource;
use App\Models\PhoneVerification;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Otp;
use App\Services\TwilioService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly TwilioService $twilioService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        // Check if user already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User with this email already exists',
            ], 422);
        }

        if (User::where('phone', $request->phone)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User with this phone number already exists',
            ], 422);
        }

        // Prepare user data
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'address' => $request->address,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ];

        // Generate OTP for registration
        $otp = Otp::generateForRegistration($request->phone, $request->ip(), $userData);
        \Log::info('otp code: ' . $otp->code);
        // Send OTP via SMS
        $sent = $this->twilioService->sendVerificationCode($request->phone, $otp->code);

        if (!$sent) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code. Please try again.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Registration initiated. Please verify your phone number with the OTP sent.',
            'phone' => $request->phone,
            'expires_at' => $otp->expires_at,
        ], 200);
    }

    public function verifyRegistrationOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $otp = Otp::findValidCode($request->phone, $request->code, 'registration');

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code',
            ], 400);
        }

        // Mark OTP as verified
        $otp->markAsVerified();

        // Create user with data from OTP
        $userData = $otp->data;
        $user = User::create([
            'name' => $userData['name'],
            'first_name' => $userData['first_name'],
            'last_name' => $userData['last_name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
            'phone' => $userData['phone'],
            'address' => $userData['address'] ?? null,
            'phone_verified_at' => now(),
            'is_seller' => false,
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration completed successfully',
            'data' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => new UserResource($user->load(['addresses'])),
            'token' => $token,
        ]);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'id' => ['required', 'integer'],
            'hash' => ['required', 'string'],
        ]);
        
        $user = User::findOrFail($request->id);

        if (!hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified',
            ]);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully',
            // 'data' => new UserResource($user->load(['profile', 'addresses'])),
        ]);
    }

    public function resendEmailVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent',
        ]);
    }

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        $phone = $request->phone;
        $ipAddress = $request->ip();

        // Check if user exists with this phone
        $user = Auth::user();
        if ($user && $user->phone !== $phone) {
            // Update user's phone number
            $user->update(['phone' => $phone]);
        }

        // Create verification record
        $verification = PhoneVerification::generateCodeForPhone($phone, $ipAddress);

        // Send SMS
        $sent = $this->twilioService->sendVerificationCode($phone, $verification->code);

        if (!$sent) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code. Please try again.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Verification code sent successfully',
            'expires_at' => $verification->expires_at,
        ]);
    }

    public function verifyPhone(VerifyPhoneRequest $request): JsonResponse
    {
        $phone = $request->phone;
        $code = $request->code;

        $verification = PhoneVerification::findValidCode($phone, $code);

        if (!$verification) {
            return response()->json([
                'message' => 'Invalid or expired verification code',
            ], 400);
        }

        // Mark verification as used
        $verification->markAsVerified();

        // Update user's phone verification status
        $user = Auth::user();
        if ($user) {
            $user->update(['phone' => $phone]);
            $user->markPhoneAsVerified();
        }

        return response()->json([
            'success' => true,
            'message' => 'Phone verified successfully',
            'user' => $user ? new UserResource($user->load(['profile', 'addresses'])) : null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error during logout. Please try again.',
            ], 500);
        }
    }

    public function currentUser(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => new UserResource($user->load(['seller', 'addresses'])),
        ]);
    }
}
