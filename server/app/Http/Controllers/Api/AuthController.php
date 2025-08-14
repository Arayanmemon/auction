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
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        // Create user profile
        UserProfile::create([
            'user_id' => $user->id,
            'account_type' => 'buyer', // Default to buyer
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => new UserResource($user->load('profile')),
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
            'message' => 'Login successful',
            'user' => new UserResource($user->load(['profile', 'addresses'])),
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
                'message' => 'Invalid verification link',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ]);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => new UserResource($user->load(['profile', 'addresses'])),
        ]);
    }

    public function resendEmailVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
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
                'message' => 'Failed to send verification code. Please try again.',
            ], 500);
        }

        return response()->json([
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
            'message' => 'Phone verified successfully',
            'user' => $user ? new UserResource($user->load(['profile', 'addresses'])) : null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}
