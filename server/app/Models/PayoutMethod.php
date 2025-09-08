<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayoutMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // e.g. 'bank', 'paypal'
        'details', // JSON: account info
        'is_default',
    ];

    public function casts(): array
    {
        return [
            'details' => 'array',
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}