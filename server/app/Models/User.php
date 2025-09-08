<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\VerifyEmailNotification;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'phone_verification_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'phone_verification_code_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the user's addresses.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get the user's default address.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function defaultAddress(): HasOne
    {
        return $this->hasOne(Address::class)->where('is_default', true);
    }

    // Auction relationships
    /**
     * Get the user's auctions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function auctions(): HasMany
    {
        return $this->hasMany(Auction::class, 'seller_id');
    }

    /**
     * Get the user's bids.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'bidder_id');
    }

    /**
     * Get the user's watchlist.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function watchlist(): HasMany
    {
        return $this->hasMany(Watchlist::class);
    }

    /**
     * Get the user's purchases.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class, 'buyer_id');
    }

    /**
     * Get the user's sales.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Purchase::class, 'seller_id');
    }

    /**
     * Get the user's winning bids.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function winningBids(): HasMany
    {
        return $this->hasMany(Bid::class, 'bidder_id')->where('is_winning', true);
    }

    /**
     * Get the user's active auctions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activeAuctions(): HasMany
    {
        return $this->hasMany(Auction::class, 'seller_id')->where('status', 'active');
    }

    /**
     * Determine if the user's phone is verified.
     *
     * @return bool
     */
    public function hasVerifiedPhone(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    /**
     * Mark the user's phone as verified.
     *
     * @return bool
     */
    public function markPhoneAsVerified(): bool
    {
        return $this->forceFill([
            'phone_verified_at' => $this->freshTimestamp(),
            'phone_verification_code' => null,
            'phone_verification_code_expires_at' => null,
        ])->save();
    }

    /**
     * Generate a phone verification code for the user.
     *
     * @return string
     */
    public function generatePhoneVerificationCode(): string
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        $this->forceFill([
            'phone_verification_code' => $code,
            'phone_verification_code_expires_at' => now()->addMinutes(10),
        ])->save();

        return $code;
    }

    /**
     * Determine if the provided phone verification code is valid.
     *
     * @param string $code
     * @return bool
     */
    public function isPhoneVerificationCodeValid(string $code): bool
    {
        return $this->phone_verification_code === $code 
            && $this->phone_verification_code_expires_at 
            && $this->phone_verification_code_expires_at->isFuture();
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification);
    }

    public function payoutMethods(): HasMany
    {
        return $this->hasMany(PayoutMethod::class);
    }
}
