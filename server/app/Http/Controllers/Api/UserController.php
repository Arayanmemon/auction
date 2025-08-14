<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\AddressResource;
use App\Http\Resources\UserResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load(['profile', 'addresses', 'defaultAddress']);

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        
        // Create profile if it doesn't exist
        if (!$user->profile) {
            $user->profile()->create($request->validated());
        } else {
            $user->profile->update($request->validated());
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user->load(['profile', 'addresses'])),
        ]);
    }

    public function updateAddress(UpdateAddressRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $data['user_id'] = $user->id;

        // Check if address already exists for this user and type
        $address = $user->addresses()
            ->where('type', $data['type'])
            ->first();

        if ($address) {
            $address->update($data);
        } else {
            $address = Address::create($data);
        }

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => new AddressResource($address),
        ]);
    }
}
