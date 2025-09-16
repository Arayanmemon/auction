<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuctionResource;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Category;
use App\Services\BidService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function allAuctions(){
        $auctions = Auction::all();
        return response()->json([
            'success' => true,
            'message' => 'All auctions fetched successfully',
            'data' => $auctions // Placeholder for auction data
        ]);
    }

    public function auctionDetails($id){
        $auction = Auction::find($id);
        if(!$auction){
            return response()->json([
                'success' => false,
                'message' => 'Auction not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Auction details fetched successfully',
            'data' => new AuctionResource($auction) // Placeholder for auction data
        ]);
    }

    public function categories(){
        // Placeholder for fetching categories
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'message' => 'Categories fetched successfully',
            'data' => $categories
        ]);
    }

    public function auctionsByCategory($id){

        $auctions = Auction::where('category_id', $id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Auctions fetched successfully',
            'data' => AuctionResource::collection($auctions)
        ]);
    }

    public function searchAuctions(Request $request){

        $query = $request->input('query');
        $auctions = Auction::where('title', 'like', "%{$query}%")->get();
        return response()->json([
            'success' => true,
            'message' => 'Search results fetched successfully',
            'data' => AuctionResource::collection($auctions)
        ]);
    }

    public function getBidsForAuction($id){
        $auction = Auction::find($id);
        if(!$auction){
            return response()->json([
                'success' => false,
                'message' => 'Auction not found',
            ], 404);
        }
        $bids = $auction->bids()->with('bidder')->get();
        return response()->json([
            'success' => true,
            'message' => 'Bids fetched successfully',
            'data' => $bids
        ]);
    }   
    public function placeBid(Request $request, $id){
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $auction = Auction::findOrFail($id);

        // $bid = Bid::create([
        //     'auction_id' => $auction->id,
        //     'bidder_id' => $request->user()->id,
        //     'amount' => $request->amount,
        //     'ip_address' => $request->ip(),
        //     'is_winning' => true,
        // ]);
        $bid = new Bid();
        $bid->auction_id = $auction->id;
        $bid->bidder_id = $request->user()->id;
        $bid->amount = $request->amount;
        $bid->ip_address = $request->ip();
        $bid->is_winning = true;

        $bidService = new BidService();
        $bidService->placeBid($auction, $bid);

        $bid_count = $auction->bids()->count();
        $auction->update(['current_bid' => $request->amount, 'bid_count' => $bid_count]);

        return response()->json([
            'success' => true,
            'message' => 'Bid placed successfully',
            'data' => [
                'auction_id' => $auction->id,
                'bid_amount' => $request->amount,
                'bidder_id' => $request->user()->id,
            ]
        ]);
    }
}
