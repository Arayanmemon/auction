<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bidder_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('max_bid', 15, 2)->nullable(); // For automatic bidding
            $table->boolean('is_winning')->default(false);
            $table->boolean('is_automatic')->default(false);
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index(['auction_id', 'amount']);
            $table->index(['bidder_id', 'created_at']);
            $table->index(['auction_id', 'is_winning']);
            $table->unique(['auction_id', 'bidder_id', 'amount']); // Prevent duplicate bids
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
