<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuctionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'images' => $this->images,
            'video' => $this->video,
            'first_image' => $this->first_image,
            'starting_price' => $this->starting_price,
            'reserve_price' => $this->reserve_price,
            'buy_now_price' => $this->buy_now_price,
            'current_bid' => $this->current_bid,
            'bid_count' => $this->bid_count,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'time_remaining' => $this->timeRemaining(),
            'status' => $this->status,
            'condition' => $this->condition,
            'shipping_method' => $this->shipping_method,
            'shipping_cost' => $this->shipping_cost,
            'shipping_locations' => $this->shipping_locations,
            'views_count' => $this->views_count,
            'watchers_count' => $this->watchers_count,
            'is_featured' => $this->is_featured,
            'auto_relist' => $this->auto_relist,
            'is_active' => $this->isActive(),
            'is_bid' => $this->is_bid,
            'has_ended' => $this->hasEnded(),
            'seller' => new UserResource($this->whenLoaded('seller')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'highest_bid' => new BidResource($this->whenLoaded('highestBid')),
            'winning_bid' => new BidResource($this->whenLoaded('winningBid')),
            'is_watched' => $this->when(
                $request->user(),
                fn() => $this->watchlists()->where('user_id', $request->user()->id)->exists()
            ),
            'user_highest_bid' => $this->when(
                $request->user(),
                fn() => $this->bids()->where('bidder_id', $request->user()->id)->max('amount')
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
