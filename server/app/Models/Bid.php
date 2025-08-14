<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'auction_id',
        'bidder_id',
        'amount',
        'max_bid',
        'is_winning',
        'is_automatic',
        'ip_address',
    ];

    public function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'max_bid' => 'decimal:2',
            'is_winning' => 'boolean',
            'is_automatic' => 'boolean',
        ];
    }

    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    public function bidder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'bidder_id');
    }

    public function scopeWinning($query)
    {
        return $query->where('is_winning', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('bidder_id', $userId);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
