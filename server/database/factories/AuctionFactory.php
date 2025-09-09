<?php

namespace Database\Factories;

use App\Models\Auction;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuctionFactory extends Factory
{
    protected $model = Auction::class;

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-1 week', '+1 week');
        $endTime = fake()->dateTimeBetween($startTime, $startTime->format('Y-m-d H:i:s') . ' +7 days');
        $startingPrice = fake()->randomFloat(2, 10, 1000);
        
        return [
            'seller_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => fake()->words(4, true),
            'description' => fake()->paragraphs(3, true),
            'images' => [
                fake()->imageUrl(800, 600, 'products'),
                fake()->imageUrl(800, 600, 'products'),
                fake()->imageUrl(800, 600, 'products'),
            ],
            'starting_price' => $startingPrice,
            'reserve_price' => fake()->optional()->randomFloat(2, $startingPrice + 10, $startingPrice * 2),
            'buy_now_price' => fake()->optional()->randomFloat(2, $startingPrice * 2, $startingPrice * 5),
            'current_bid' => $startingPrice,
            'bid_count' => 0,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => fake()->randomElement(['draft', 'scheduled', 'active', 'ended']),
            'condition' => fake()->randomElement(['new', 'like_new', 'good', 'fair', 'poor']),
            'shipping_method' => fake()->randomElement(['standard', 'express', 'overnight']),
            'shipping_cost' => fake()->randomFloat(2, 5, 50),
            'shipping_locations' => ['US', 'CA', 'GB'],
            'views_count' => fake()->numberBetween(0, 1000),
            'watchers_count' => fake()->numberBetween(0, 50),
            'is_featured' => fake()->boolean(10),
            'auto_relist' => fake()->boolean(20),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_time' => now()->subHours(2),
            'end_time' => now()->addDays(fake()->numberBetween(1, 7)),
        ]);
    }

    public function ended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ended',
            'start_time' => now()->subDays(7),
            'end_time' => now()->subHours(2),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'featured_until' => now()->addDays(7),
        ]);
    }
}
