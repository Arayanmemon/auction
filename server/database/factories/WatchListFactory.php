<?php

namespace Database\Factories;

use App\Models\Auction;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Eloquent\Factories\Factory;

class WatchlistFactory extends Factory
{
    protected $model = Watchlist::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'auction_id' => Auction::factory(),
        ];
    }
}
