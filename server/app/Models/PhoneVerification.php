<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhoneVerification extends Model
{
    protected $fillable = [
        'phone',
        'code',
        'expires_at',
        'verified_at',
        'ip_address',
    ];

    public function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isVerified(): bool
    {
        return !is_null($this->verified_at);
    }

    public function markAsVerified(): bool
    {
        return $this->update(['verified_at' => now()]);
    }

    public static function generateCodeForPhone(string $phone, string $ipAddress = null): self
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return static::create([
            'phone' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
            'ip_address' => $ipAddress,
        ]);
    }

    public static function findValidCode(string $phone, string $code): ?self
    {
        return static::where('phone', $phone)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->whereNull('verified_at')
            ->first();
    }
}
