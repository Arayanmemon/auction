<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WatchlistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'auction_id' => $this->auction_id,
            'created_at' => $this->created_at,
            'auction' => new AuctionResource($this->whenLoaded('auction')),
        ];
    }
}
