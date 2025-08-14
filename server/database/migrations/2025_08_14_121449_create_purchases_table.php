<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('auction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('winning_bid_id')->nullable()->constrained('bids')->nullOnDelete();
            $table->string('order_number')->unique();
            $table->decimal('winning_bid_amount', 15, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('commission_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 15, 2);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('shipping_status', ['pending', 'shipped', 'delivered', 'returned'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('payment_transaction_id')->nullable();
            $table->string('tracking_number')->nullable();
            $table->json('shipping_address');
            $table->json('billing_address');
            $table->timestamp('payment_completed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['buyer_id', 'created_at']);
            $table->index(['seller_id', 'created_at']);
            $table->index(['payment_status']);
            $table->index(['shipping_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
