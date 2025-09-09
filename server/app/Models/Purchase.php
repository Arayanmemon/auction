<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'auction_id',
        'winning_bid_id',
        'order_number',
        'winning_bid_amount',
        'shipping_cost',
        'commission_amount',
        'total_amount',
        'payment_status',
        'shipping_status',
        'payment_method',
        'payment_transaction_id',
        'tracking_number',
        'shipping_address',
        'billing_address',
        'payment_completed_at',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    public function casts(): array
    {
        return [
            'winning_bid_amount' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'shipping_address' => 'array',
            'billing_address' => 'array',
            'payment_completed_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    public function winningBid(): BelongsTo
    {
        return $this->belongsTo(Bid::class, 'winning_bid_id');
    }

    public function scopeForBuyer($query, $buyerId)
    {
        return $query->where('buyer_id', $buyerId);
    }

    public function scopeForSeller($query, $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeShipped($query)
    {
        return $query->where('shipping_status', 'shipped');
    }

    public function scopeDelivered($query)
    {
        return $query->where('shipping_status', 'delivered');
    }

    protected static function booted(): void
    {
        static::creating(function (Purchase $purchase) {
            if (!$purchase->order_number) {
                $purchase->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }
}
