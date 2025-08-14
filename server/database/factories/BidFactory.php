<?php

namespace Database\Factories;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BidFactory extends Factory
{
    protected $model = Bid::class;

    public function definition(): array
    {
        return [
            'auction_id' => Auction::factory(),
            'bidder_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 10, 1000),
            'max_bid' => fake()->optional()->randomFloat(2, 10, 2000),
            'is_winning' => false,
            'is_automatic' => fake()->boolean(30),
            'ip_address' => fake()->ipv4(),
        ];
    }

    public function winning(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_winning' => true,
        ]);
    }

    public function automatic(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_automatic' => true,
            'max_bid' => fake()->randomFloat(2, 100, 2000),
        ]);
    }
}
