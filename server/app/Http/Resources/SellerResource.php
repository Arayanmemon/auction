<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SellerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'seller_type' => $this->seller_type,
            'store_name' => $this->store_name,
            'store_description' => $this->store_description,
            'store_logo_url' => $this->store_logo_url,
            'display_name' => $this->display_name,
            'location' => [
                'zip' => $this->zip,
                'state' => $this->state,
                'country' => $this->country,
            ],
            'payout_methods' => [
                'bank_enabled' => $this->bank_enabled,
                'paypal_enabled' => $this->paypal_enabled,
                'card_enabled' => $this->card_enabled,
                'active_methods' => $this->getActivePayoutMethods(),
            ],
            'verification' => [
                'status' => $this->status,
                'is_verified' => $this->is_verified,
                'verified_at' => $this->verified_at,
            ],
            'stats' => [
                'rating' => $this->seller_rating,
                'total_sales' => $this->total_sales,
                'total_revenue' => $this->total_revenue,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
