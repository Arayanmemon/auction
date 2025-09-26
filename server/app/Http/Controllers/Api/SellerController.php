<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAuctionRequest;
use App\Http\Requests\UpdateAuctionRequest;
use App\Http\Resources\AuctionResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SellerResource;
use App\Http\Resources\UserResource;
use App\Models\Auction;
use App\Models\Purchase;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SellerController extends Controller
{

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
        // dd($request->all());
        // $request->mergeIfMissing(['is_bid' => true]);
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
        $auctionData['status'] = 'active'; // Default status
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

    public function deleteAuction(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $auction = $user->auctions()->findOrFail($id);
        // Optionally, delete associated images from storage
        if ($auction->images) {
            foreach ($auction->images as $imagePath) {
                $relativePath = str_replace('/storage/', '', $imagePath);
                Storage::disk('public')->delete($relativePath);
            }
        }
        $auction->delete();

        return response()->json([
            'message' => 'Auction deleted successfully.',
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

    public function becomeSeller(Request $request): JsonResponse
    {
        // dd($request->all());
        $request->validate([
            'seller_type' => ['required', 'in:individual,store'],
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_description' => ['nullable', 'string'],
            'store_logo' => ['nullable', 'image', 'max:2048'],
            'zip' => ['required', 'string'],
            'state' => ['required', 'string'],
            'country' => ['required', 'string'],
            'bank_enabled' => 'in:true,false,1,0',
            'paypal_enabled' => 'in:true,false,1,0',
            'card_enabled' => 'in:true,false,1,0',
            'bank_iban' => ['nullable', 'string'],
            'bank_routing' => ['nullable', 'string'],
            'bank_account' => ['nullable', 'string'],
            'paypal_details' => ['nullable', 'string'],
            'card_details' => ['nullable', 'string'],
            'tax_form' => ['required', 'string'],
            'tax_id' => ['required', 'string'],
            'date_of_birth' => ['required', 'date'],
            'legal_tax_address' => ['required', 'string'],
            'gov_id' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
            'selfie' => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        // Check if user can become seller
        if (!$user->canBecomeSeller()) {
            return response()->json([
                'success' => false,
                'message' => 'You must verify your email and phone before becoming a seller',
            ], 400);
        }

        // Check if user is already a seller
        if ($user->is_seller) {
            return response()->json([
                'success' => false,
                'message' => 'You are already a seller',
            ], 400);
        }

        // Validate at least one payout method is enabled
        if (!($request->bank_enabled || $request->paypal_enabled || $request->card_enabled)) {
            return response()->json([
                'success' => false,
                'message' => 'At least one payout method must be enabled',
            ], 400);
        }

        $sellerData = $request->only([
            'seller_type', 'store_name', 'store_description', 'zip', 'state', 'country',
            'bank_enabled', 'paypal_enabled', 'card_enabled',
            'bank_iban', 'bank_routing', 'bank_account', 'paypal_details', 'card_details',
            'tax_form', 'tax_id', 'date_of_birth', 'legal_tax_address'
        ]);

        // Handle file uploads
        if ($request->hasFile('store_logo')) {
            $sellerData['store_logo'] = $request->file('store_logo')->store('seller/logos', 'public');
        }

        if ($request->hasFile('gov_id')) {
            $sellerData['gov_id_path'] = $request->file('gov_id')->store('seller/documents', 'public');
        }

        if ($request->hasFile('selfie')) {
            $sellerData['selfie_path'] = $request->file('selfie')->store('seller/selfies', 'public');
        }

        $sellerData['user_id'] = $user->id;

        // Create seller record
        $seller = Seller::create($sellerData);

        // Update user to mark as seller
        $user->update(['is_seller' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Seller application submitted successfully. We will review and get back to you soon.',
            'data' => new SellerResource($seller->load('user')),
        ], 201);
    }

    public function getSellerProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isSeller()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a seller',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new SellerResource($user->seller->load('user')),
        ]);
    }

    public function updateSellerProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isSeller()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a seller',
            ], 404);
        }

        $seller = $user->seller;

        // If seller is already approved, limit what can be updated
        if ($seller->isApproved()) {
            $request->validate([
                'store_name' => ['nullable', 'string', 'max:255'],
                'store_description' => ['nullable', 'string'],
                'store_logo' => ['nullable', 'image', 'max:2048'],
            ]);

            $updateData = $request->only(['store_name', 'store_description']);

            if ($request->hasFile('store_logo')) {
                // Delete old logo
                if ($seller->store_logo) {
                    Storage::disk('public')->delete($seller->store_logo);
                }
                $updateData['store_logo'] = $request->file('store_logo')->store('seller/logos', 'public');
            }
        } else {
            // Full validation for pending sellers
            $request->validate([
                'seller_type' => ['required', 'in:individual,store'],
                'store_name' => ['nullable', 'string', 'max:255'],
                'store_description' => ['nullable', 'string'],
                'store_logo' => ['nullable', 'image', 'max:2048'],
                'zip' => ['required', 'string'],
                'state' => ['required', 'string'],
                'country' => ['required', 'string'],
            ]);

            $updateData = $request->only([
                'seller_type', 'store_name', 'store_description', 'zip', 'state', 'country'
            ]);

            if ($request->hasFile('store_logo')) {
                if ($seller->store_logo) {
                    Storage::disk('public')->delete($seller->store_logo);
                }
                $updateData['store_logo'] = $request->file('store_logo')->store('seller/logos', 'public');
            }
        }

        $seller->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Seller profile updated successfully',
            'data' => new SellerResource($seller->load('user')),
        ]);
    }

    public function getSellerDashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isSeller()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a seller',
            ], 404);
        }

        $seller = $user->seller;

        return response()->json([
            'success' => true,
            'data' => [
                'seller' => new SellerResource($seller->load('user')),
                'stats' => [
                    'total_sales' => $seller->total_sales,
                    'total_revenue' => $seller->total_revenue,
                    'rating' => $seller->seller_rating,
                    'status' => $seller->status,
                    'is_verified' => $seller->is_verified,
                ],
                'payout_methods' => $seller->getActivePayoutMethods(),
            ],
        ]);
    }
}