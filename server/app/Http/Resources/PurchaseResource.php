<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'winning_bid_amount' => $this->winning_bid_amount,
            'shipping_cost' => $this->shipping_cost,
            'commission_amount' => $this->commission_amount,
            'total_amount' => $this->total_amount,
            'payment_status' => $this->payment_status,
            'shipping_status' => $this->shipping_status,
            'payment_method' => $this->payment_method,
            'tracking_number' => $this->tracking_number,
            'shipping_address' => $this->shipping_address,
            'billing_address' => $this->billing_address,
            'payment_completed_at' => $this->payment_completed_at,
            'shipped_at' => $this->shipped_at,
            'delivered_at' => $this->delivered_at,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'buyer' => new UserResource($this->whenLoaded('buyer')),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'auction' => new AuctionResource($this->whenLoaded('auction')),
            'winning_bid' => new BidResource($this->whenLoaded('winningBid')),
        ];
    }
}
