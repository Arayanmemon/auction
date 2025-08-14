<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserProfileFactory extends Factory
{
    protected $model = UserProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-65 years', '-18 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'bio' => fake()->optional()->paragraph(),
            'website' => fake()->optional()->url(),
            'account_type' => fake()->randomElement(['buyer', 'seller', 'both']),
            'seller_rating' => fake()->randomFloat(2, 0, 5),
            'total_sales' => fake()->numberBetween(0, 1000),
            'total_revenue' => fake()->randomFloat(2, 0, 50000),
            'is_verified_seller' => fake()->boolean(20),
        ];
    }

    public function seller(): static
    {
        return $this->state(fn (array $attributes) => [
            'account_type' => 'seller',
            'is_verified_seller' => true,
            'seller_verified_at' => now(),
        ]);
    }

    public function buyer(): static
    {
        return $this->state(fn (array $attributes) => [
            'account_type' => 'buyer',
        ]);
    }
}

class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['billing', 'shipping', 'both']),
            'label' => fake()->optional()->randomElement(['Home', 'Office', 'Other']),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'company' => fake()->optional()->company(),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => fake()->optional()->secondaryAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country_code' => fake()->countryCode(),
            'phone' => fake()->optional()->phoneNumber(),
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    public function billing(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'billing',
        ]);
    }

    public function shipping(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'shipping',
        ]);
    }
}
