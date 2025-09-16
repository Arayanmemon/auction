<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\Bid;
use App\Notifications\OutbidNotification;
use App\Notifications\WinningBidNotification;

class BidService
{
    public function placeBid(Auction $auction, Bid $newBid)
    {
        $previousHighestBid = $auction->bids()->orderByDesc('amount')->first();
        \Log::info("Previous highest bid: " . ($previousHighestBid ? $previousHighestBid->amount : 'None'));
        \Log::info(json_encode($previousHighestBid));

        // Save the new bid
        $newBid->save();

        // Notify the previous highest bidder if they are outbid
        if ($previousHighestBid && $previousHighestBid->bidder_id !== $newBid->bidder_id) {
            $previousHighestBid->bidder->notify(new OutbidNotification($auction, $previousHighestBid->amount));
            $previousHighestBid->update(['is_winning' => false]);
            \Log::info("Notified user {$previousHighestBid->bidder_id} of being outbid on auction {$auction->id}");
        }

        // Update auction's highest bid
        // $auction->update(['highest_bid_id' => $newBid->id]);
    }

    public function handleAuctionEnd(Auction $auction)
    {
        $winningBid = $auction->bids()->orderByDesc('amount')->first();

        if ($winningBid) {
            // Notify the winning bidder
            $winningBid->user->notify(new WinningBidNotification($auction, $winningBid->amount));
        }
    }
}