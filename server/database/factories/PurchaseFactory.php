<?php

namespace Database\Factories;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseFactory extends Factory
{
    protected $model = Purchase::class;

    public function definition(): array
    {
        $winningBidAmount = fake()->randomFloat(2, 50, 5000);
        $shippingCost = fake()->randomFloat(2, 5, 50);
        $commissionAmount = $winningBidAmount * 0.10; // 10% commission
        
        return [
            'buyer_id' => User::factory(),
            'seller_id' => User::factory(),
            'auction_id' => Auction::factory(),
            'winning_bid_id' => Bid::factory(),
            'order_number' => 'ORD-' . strtoupper(fake()->bothify('??######')),
            'winning_bid_amount' => $winningBidAmount,
            'shipping_cost' => $shippingCost,
            'commission_amount' => $commissionAmount,
            'total_amount' => $winningBidAmount + $shippingCost,
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed', 'refunded']),
            'shipping_status' => fake()->randomElement(['pending', 'shipped', 'delivered', 'returned']),
            'payment_method' => fake()->randomElement(['credit_card', 'paypal', 'bank_transfer']),
            'payment_transaction_id' => fake()->optional()->regexify('[A-Z0-9]{20}'),
            'tracking_number' => fake()->optional()->regexify('[A-Z0-9]{15}'),
            'shipping_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address_line_1' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country_code' => 'US',
            ],
            'billing_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'address_line_1' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country_code' => 'US',
            ],
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
            'payment_completed_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    public function shipped(): static
    {
        return $this->state(fn (array $attributes) => [
            'shipping_status' => 'shipped',
            'shipped_at' => fake()->dateTimeBetween('-15 days', 'now'),
            'tracking_number' => fake()->regexify('[A-Z0-9]{15}'),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'shipping_status' => 'delivered',
            'delivered_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}
