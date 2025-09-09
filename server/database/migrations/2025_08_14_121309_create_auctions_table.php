<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->json('images')->nullable();
            $table->decimal('starting_price', 15, 2);
            $table->decimal('reserve_price', 15, 2)->nullable();
            $table->decimal('buy_now_price', 15, 2)->nullable();
            $table->decimal('current_bid', 15, 2)->default(0);
            $table->integer('bid_count')->default(0);
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->enum('status', ['draft', 'scheduled', 'active', 'ended', 'sold', 'cancelled'])->default('draft');
            $table->enum('condition', ['new', 'like_new', 'good', 'fair', 'poor'])->default('good');
            $table->string('shipping_method')->nullable();
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->json('shipping_locations')->nullable(); // Array of country codes
            $table->integer('views_count')->default(0);
            $table->integer('watchers_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('auto_relist')->default(false);
            $table->timestamp('featured_until')->nullable();
            $table->timestamps();

            $table->index(['seller_id', 'status']);
            $table->index(['category_id', 'status']);
            $table->index(['status', 'end_time']);
            $table->index(['is_featured', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};
