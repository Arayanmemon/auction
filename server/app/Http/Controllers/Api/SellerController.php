<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddPayoutMethodRequest;
use App\Http\Requests\CreateAuctionRequest;
use App\Http\Requests\UpdateAuctionRequest;
use App\Http\Resources\AuctionResource;
use App\Http\Resources\PayoutMethodResource;
use App\Http\Resources\PurchaseResource;
use App\Models\Auction;
use App\Models\PayoutMethod;
use App\Models\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function addPayoutMethod(AddPayoutMethodRequest $request): JsonResponse
    {
        $user = $request->user();
        $payout = $user->payoutMethods()->create($request->validated());

        return response()->json([
            'message' => 'Payout method added successfully.',
            'payout_method' => new PayoutMethodResource($payout),
        ], 201);
    }

    public function payoutMethods(Request $request): JsonResponse
    {
        $user = $request->user();
        $methods = $user->payoutMethods()->get();

        return response()->json([
            'payout_methods' => PayoutMethodResource::collection($methods),
        ]);
    }

    public function auctions(Request $request): JsonResponse
    {
        $user = $request->user();
        $auctions = $user->auctions()->with(['category', 'highestBid'])->latest()->paginate(20);

        return response()->json([
            'auctions' => AuctionResource::collection($auctions->items()),
            'pagination' => [
                'current_page' => $auctions->currentPage(),
                'last_page' => $auctions->lastPage(),
                'per_page' => $auctions->perPage(),
                'total' => $auctions->total(),
            ],
        ]);
    }

    public function createAuction(CreateAuctionRequest $request): JsonResponse
    {
        $user = $request->user();
        $auctionData = $request->validated();
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Generate unique filename
                $filename = \Str::random(20) . '.' . $image->getClientOriginalExtension();
                
                // Store in public disk under auctions folder
                $path = $image->storeAs('auctions', $filename, 'public');
                
                // Store the full URL for frontend use
                $imagePaths[] = \Storage::url($path);
            }
        }
        $auctionData['images'] = $imagePaths;
        $auction = $user->auctions()->create($auctionData);
        

        return response()->json([
            'message' => 'Auction created successfully.',
            'auction' => new AuctionResource($auction),
        ], 201);
    }

    public function updateAuction(UpdateAuctionRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $auction = $user->auctions()->findOrFail($id);
        $auction->update($request->validated());

        return response()->json([
            'message' => 'Auction updated successfully.',
            'auction' => new AuctionResource($auction),
        ]);
    }

    public function salesHistory(Request $request): JsonResponse
    {
        $user = $request->user();
        $sales = $user->sales()->with(['auction', 'buyer'])->latest()->paginate(20);

        return response()->json([
            'sales' => PurchaseResource::collection($sales->items()),
            'pagination' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ],
        ]);
    }
}