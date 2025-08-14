<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'profile_image',
        'bio',
        'website',
        'account_type',
        'seller_rating',
        'total_sales',
        'total_revenue',
        'is_verified_seller',
        'seller_verified_at',
    ];

    public function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'seller_rating' => 'decimal:2',
            'total_revenue' => 'decimal:2',
            'is_verified_seller' => 'boolean',
            'seller_verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function isSeller(): bool
    {
        return in_array($this->account_type, ['seller', 'both']);
    }

    public function isBuyer(): bool
    {
        return in_array($this->account_type, ['buyer', 'both']);
    }
}
