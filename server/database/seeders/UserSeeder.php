<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create a test buyer
        $buyer = User::create([
            'name' => 'John Buyer',
            'email' => 'buyer@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        UserProfile::create([
            'user_id' => $buyer->id,
            'first_name' => 'John',
            'last_name' => 'Buyer',
            'account_type' => 'buyer',
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
        ]);

        Address::create([
            'user_id' => $buyer->id,
            'type' => 'both',
            'label' => 'Home',
            'first_name' => 'John',
            'last_name' => 'Buyer',
            'address_line_1' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'postal_code' => '10001',
            'country_code' => 'US',
            'is_default' => true,
        ]);

        // Create a test seller
        $seller = User::create([
            'name' => 'Jane Seller',
            'email' => 'seller@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567891',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ]);

        UserProfile::create([
            'user_id' => $seller->id,
            'first_name' => 'Jane',
            'last_name' => 'Seller',
            'account_type' => 'seller',
            'date_of_birth' => '1985-05-15',
            'gender' => 'female',
            'is_verified_seller' => true,
            'seller_verified_at' => now(),
            'seller_rating' => 4.8,
            'total_sales' => 150,
            'total_revenue' => 25000.00,
        ]);

        Address::create([
            'user_id' => $seller->id,
            'type' => 'both',
            'label' => 'Business',
            'first_name' => 'Jane',
            'last_name' => 'Seller',
            'company' => 'Seller LLC',
            'address_line_1' => '456 Business Ave',
            'city' => 'Los Angeles',
            'state' => 'CA',
            'postal_code' => '90210',
            'country_code' => 'US',
            'is_default' => true,
        ]);

        // Create additional test users
        // User::factory()
        //     ->count(10)
        //     ->hasAttached(UserProfile::factory())
        //     ->hasAttached(Address::factory()->count(2))
        //     ->create();
    }
}
