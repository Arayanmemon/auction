<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddToWatchlistRequest;
use App\Http\Resources\AuctionResource;
use App\Http\Resources\BidResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\WatchlistResource;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Purchase;
use App\Models\Watchlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get dashboard statistics
        $stats = [
            'total_bids' => $user->bids()->count(),
            'winning_bids' => $user->winningBids()->count(),
            'total_purchases' => $user->purchases()->count(),
            'watchlist_count' => $user->watchlist()->count(),
            'total_spent' => $user->purchases()->sum('total_amount'),
            'active_auctions_bidding' => $user->bids()
                ->whereHas('auction', fn($q) => $q->where('status', 'active'))
                ->distinct('auction_id')
                ->count(),
        ];

        // Get recent activity
        $recentBids = $user->bids()
            ->with(['auction.category', 'auction.seller'])
            ->latest()
            ->limit(5)
            ->get();

        $recentPurchases = $user->purchases()
            ->with(['auction.category', 'seller'])
            ->latest()
            ->limit(5)
            ->get();

        $watchlistItems = $user->watchlist()
            ->with(['auction.category', 'auction.seller'])
            ->whereHas('auction', fn($q) => $q->where('status', 'active'))
            ->latest()
            ->limit(5)
            ->get();

        // Get auctions ending soon that user is watching
        $endingSoon = Auction::query()
            ->whereHas('watchlists', fn($q) => $q->where('user_id', $user->id))
            ->where('status', 'active')
            ->where('end_time', '<=', now()->addHours(24))
            ->with(['category', 'seller', 'highestBid'])
            ->orderBy('end_time')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_bids' => BidResource::collection($recentBids),
            'recent_purchases' => PurchaseResource::collection($recentPurchases),
            'watchlist' => WatchlistResource::collection($watchlistItems),
            'ending_soon' => AuctionResource::collection($endingSoon),
        ]);
    }

    public function bids(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);
        
        $query = $user->bids()
            ->with(['auction.category', 'auction.seller', 'auction.highestBid'])
            ->latest();

        // Filter by status
        if ($request->has('status')) {
            $status = $request->get('status');
            if ($status === 'winning') {
                $query->where('is_winning', true);
            } elseif ($status === 'outbid') {
                $query->where('is_winning', false)
                    ->whereHas('auction', fn($q) => $q->where('status', 'active'));
            } elseif ($status === 'won') {
                $query->where('is_winning', true)
                    ->whereHas('auction', fn($q) => $q->where('status', 'ended'));
            }
        }

        // Filter by auction status
        if ($request->has('auction_status')) {
            $auctionStatus = $request->get('auction_status');
            $query->whereHas('auction', fn($q) => $q->where('status', $auctionStatus));
        }

        $bids = $query->paginate($perPage);

        return response()->json([
            'bids' => BidResource::collection($bids->items()),
            'pagination' => [
                'current_page' => $bids->currentPage(),
                'last_page' => $bids->lastPage(),
                'per_page' => $bids->perPage(),
                'total' => $bids->total(),
                'has_more' => $bids->hasMorePages(),
            ],
        ]);
    }

    public function purchases(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);
        
        $query = $user->purchases()
            ->with(['auction.category', 'seller', 'winningBid'])
            ->latest();

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->get('payment_status'));
        }

        // Filter by shipping status
        if ($request->has('shipping_status')) {
            $query->where('shipping_status', $request->get('shipping_status'));
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->get('from_date'));
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->get('to_date'));
        }

        $purchases = $query->paginate($perPage);

        return response()->json([
            'purchases' => PurchaseResource::collection($purchases->items()),
            'pagination' => [
                'current_page' => $purchases->currentPage(),
                'last_page' => $purchases->lastPage(),
                'per_page' => $purchases->perPage(),
                'total' => $purchases->total(),
                'has_more' => $purchases->hasMorePages(),
            ],
        ]);
    }

    public function watchlist(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);
        
        $query = $user->watchlist()
            ->with(['auction.category', 'auction.seller', 'auction.highestBid'])
            ->latest();

        // Filter by auction status
        if ($request->has('auction_status')) {
            $auctionStatus = $request->get('auction_status');
            $query->whereHas('auction', fn($q) => $q->where('status', $auctionStatus));
        } else {
            // By default, show only active auctions
            $query->whereHas('auction', fn($q) => $q->where('status', 'active'));
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->whereHas('auction', fn($q) => $q->where('category_id', $request->get('category_id')));
        }

        // Filter by ending soon (next 24 hours)
        if ($request->boolean('ending_soon')) {
            $query->whereHas('auction', function($q) {
                $q->where('status', 'active')
                  ->where('end_time', '<=', now()->addHours(24));
            });
        }

        $watchlist = $query->paginate($perPage);

        return response()->json([
            'watchlist' => WatchlistResource::collection($watchlist->items()),
            'pagination' => [
                'current_page' => $watchlist->currentPage(),
                'last_page' => $watchlist->lastPage(),
                'per_page' => $watchlist->perPage(),
                'total' => $watchlist->total(),
                'has_more' => $watchlist->hasMorePages(),
            ],
        ]);
    }

    public function addToWatchlist(AddToWatchlistRequest $request): JsonResponse
    {
        $user = $request->user();
        $auctionId = $request->auction_id;

        // Check if auction exists and is active
        $auction = Auction::findOrFail($auctionId);
        
        if (!$auction->isActive()) {
            return response()->json([
                'message' => 'Cannot watch an inactive auction.',
            ], 400);
        }

        // Check if already in watchlist
        $existingWatchlist = $user->watchlist()->where('auction_id', $auctionId)->first();
        
        if ($existingWatchlist) {
            return response()->json([
                'message' => 'Auction is already in your watchlist.',
            ], 400);
        }

        // Add to watchlist
        $watchlist = $user->watchlist()->create([
            'auction_id' => $auctionId,
        ]);

        // Increment watchers count
        $auction->incrementWatchers();

        return response()->json([
            'message' => 'Auction added to watchlist successfully.',
            'watchlist' => new WatchlistResource($watchlist->load('auction')),
        ], 201);
    }

    public function removeFromWatchlist(Request $request, int $watchlistId): JsonResponse
    {
        $user = $request->user();
        
        $watchlist = $user->watchlist()->findOrFail($watchlistId);
        
        // Decrement watchers count
        $watchlist->auction->decrementWatchers();
        
        $watchlist->delete();

        return response()->json([
            'message' => 'Auction removed from watchlist successfully.',
        ]);
    }
}
