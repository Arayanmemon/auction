<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BidResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'auction_id' => $this->auction_id,
            'amount' => $this->amount,
            'max_bid' => $this->when($this->bidder_id === $request->user()?->id, $this->max_bid),
            'is_winning' => $this->is_winning,
            'is_automatic' => $this->is_automatic,
            'created_at' => $this->created_at,
            'bidder' => $this->when(
                $request->routeIs('admin.*') || $this->bidder_id === $request->user()?->id,
                new UserResource($this->whenLoaded('bidder'))
            ),
            'auction' => new AuctionResource($this->whenLoaded('auction')),
        ];
    }
}
