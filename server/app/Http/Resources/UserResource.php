<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'email_verified_at' => $this->email_verified_at,
            'phone_verified_at' => $this->phone_verified_at,
            'has_verified_email' => $this->hasVerifiedEmail(),
            'has_verified_phone' => $this->hasVerifiedPhone(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'profile' => new UserProfileResource($this->whenLoaded('profile')),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'default_address' => new AddressResource($this->whenLoaded('defaultAddress')),
        ];
    }
}
