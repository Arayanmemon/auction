<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'seller_type',
        'store_name',
        'store_description',
        'store_logo',
        'zip',
        'state',
        'country',
        'bank_enabled',
        'paypal_enabled',
        'card_enabled',
        'bank_iban',
        'bank_routing',
        'bank_account',
        'paypal_details',
        'card_details',
        'tax_form',
        'tax_id',
        'date_of_birth',
        'legal_tax_address',
        'gov_id_path',
        'selfie_path',
        'seller_rating',
        'total_sales',
        'total_revenue',
        'is_verified',
        'verified_at',
        'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'verified_at' => 'datetime',
        'bank_enabled' => 'boolean',
        'paypal_enabled' => 'boolean',
        'card_enabled' => 'boolean',
        'is_verified' => 'boolean',
        'seller_rating' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'total_sales' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Payout method helpers
    public function hasActivePayoutMethod(): bool
    {
        return $this->bank_enabled || $this->paypal_enabled || $this->card_enabled;
    }

    public function getActivePayoutMethods(): array
    {
        $methods = [];
        if ($this->bank_enabled) $methods[] = 'bank';
        if ($this->paypal_enabled) $methods[] = 'paypal';
        if ($this->card_enabled) $methods[] = 'card';
        return $methods;
    }

    // Status helpers
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function approve(): bool
    {
        return $this->update([
            'status' => 'approved',
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    public function reject(): bool
    {
        return $this->update([
            'status' => 'rejected',
            'is_verified' => false,
            'verified_at' => null,
        ]);
    }

    // File URL getters
    public function getStoreLogoUrlAttribute(): ?string
    {
        return $this->store_logo ? asset('storage/' . $this->store_logo) : null;
    }

    public function getGovIdUrlAttribute(): ?string
    {
        return $this->gov_id_path ? asset('storage/' . $this->gov_id_path) : null;
    }

    public function getSelfieUrlAttribute(): ?string
    {
        return $this->selfie_path ? asset('storage/' . $this->selfie_path) : null;
    }

    // Display name
    public function getDisplayNameAttribute(): string
    {
        return $this->seller_type === 'store' && $this->store_name 
            ? $this->store_name 
            : $this->user->full_name;
    }

    // Revenue and sales helpers
    public function addSale(float $amount): void
    {
        $this->increment('total_sales');
        $this->increment('total_revenue', $amount);
    }

    public function updateRating(float $newRating): void
    {
        // Simple average for now - you might want to implement a more sophisticated rating system
        $this->update(['seller_rating' => $newRating]);
    }
}
