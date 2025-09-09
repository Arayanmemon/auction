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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'profile_image_url' => $this->profile_image_url,
            'bio' => $this->bio,
            'website' => $this->website,
            'is_seller' => $this->is_seller,
            'email_verified_at' => $this->email_verified_at,
            'phone_verified_at' => $this->phone_verified_at,
            'has_verified_email' => $this->hasVerifiedEmail(),
            'has_verified_phone' => $this->hasVerifiedPhone(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'default_address' => new AddressResource($this->whenLoaded('defaultAddress')),
            'seller' => new SellerResource($this->whenLoaded('seller')),
        ];
    }
}
