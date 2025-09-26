<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Auction extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'description',
        'images',
        'starting_price',
        'reserve_price',
        'buy_now_price',
        'current_bid',
        'bid_count',
        'start_time',
        'end_time',
        'status',
        'condition',
        'shipping_method',
        'shipping_cost',
        'shipping_locations',
        'views_count',
        'watchers_count',
        'is_featured',
        'auto_relist',
        'featured_until',
        'is_bid',
    ];

    public function casts(): array
    {
        return [
            'images' => 'array',
            'shipping_locations' => 'array',
            'starting_price' => 'decimal:2',
            'reserve_price' => 'decimal:2',
            'buy_now_price' => 'decimal:2',
            'current_bid' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_featured' => 'boolean',
            'auto_relist' => 'boolean',
            'featured_until' => 'datetime',
            'is_bid' => 'boolean',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class)->orderBy('amount', 'desc');
    }

    public function winningBid(): HasOne
    {
        return $this->hasOne(Bid::class)->where('is_winning', true);
    }

    public function highestBid(): HasOne
    {
        return $this->hasOne(Bid::class)->orderBy('amount', 'desc');
    }

    public function watchlists(): HasMany
    {
        return $this->hasMany(Watchlist::class);
    }

    public function purchase(): HasOne
    {
        return $this->hasOne(Purchase::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_time', '<=', now())
            ->where('end_time', '>', now());
    }

    public function scopeEnded($query)
    {
        return $query->where('status', 'ended')
            ->orWhere('end_time', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)
            ->where(function ($q) {
                $q->whereNull('featured_until')
                  ->orWhere('featured_until', '>', now());
            });
    }

    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->start_time <= now() 
            && $this->end_time > now();
    }

    public function hasEnded(): bool
    {
        return $this->end_time <= now();
    }

    public function timeRemaining(): array
    {
        if ($this->hasEnded()) {
            return ['ended' => true];
        }

        $diff = now()->diff($this->end_time);
        
        return [
            'ended' => false,
            'days' => $diff->days,
            'hours' => $diff->h,
            'minutes' => $diff->i,
            'seconds' => $diff->s,
            'total_seconds' => $this->end_time->timestamp - now()->timestamp,
        ];
    }

    public function getFirstImageAttribute(): ?string
    {
        return $this->images ? $this->images[0] ?? null : null;
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function incrementWatchers(): void
    {
        $this->increment('watchers_count');
    }

    public function decrementWatchers(): void
    {
        $this->decrement('watchers_count');
    }
}
