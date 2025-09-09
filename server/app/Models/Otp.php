<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'code',
        'type',
        'expires_at',
        'verified_at',
        'ip_address',
        'data'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'data' => 'array'
    ];

    public static function generateForRegistration(string $phone, string $ipAddress, array $userData): self
    {
        // Delete any existing unverified codes for this phone and type
        self::where('phone', $phone)
            ->where('type', 'registration')
            ->whereNull('verified_at')
            ->delete();

        return self::create([
            'phone' => $phone,
            'code' => str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT),
            'type' => 'registration',
            'expires_at' => Carbon::now()->addMinutes(10),
            'ip_address' => $ipAddress,
            'data' => $userData
        ]);
    }

    public static function findValidCode(string $phone, string $code, string $type = 'registration'): ?self
    {
        return self::where('phone', $phone)
            ->where('code', $code)
            ->where('type', $type)
            ->where('expires_at', '>', Carbon::now())
            ->whereNull('verified_at')
            ->first();
    }

    public function markAsVerified(): void
    {
        $this->update(['verified_at' => Carbon::now()]);
    }

    public function isExpired(): bool
    {
        return Carbon::now()->greaterThan($this->expires_at);
    }

    public function isVerified(): bool
    {
        return !is_null($this->verified_at);
    }
}
