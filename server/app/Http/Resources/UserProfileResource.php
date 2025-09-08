<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'profile_image' => $this->profile_image,
            'bio' => $this->bio,
            'website' => $this->website,
            'account_type' => $this->account_type,
            'seller_rating' => $this->seller_rating,
            'total_sales' => $this->total_sales,
            'total_revenue' => $this->total_revenue,
            'is_verified_seller' => $this->is_verified_seller,
            'seller_verified_at' => $this->seller_verified_at,
            'is_seller' => $this->isSeller(),
            'is_buyer' => $this->isBuyer(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
