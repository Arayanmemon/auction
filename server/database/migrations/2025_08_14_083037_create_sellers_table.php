<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('seller_type', ['individual', 'store'])->default('individual');
            $table->string('store_name')->nullable();
            $table->text('store_description')->nullable();
            $table->string('store_logo')->nullable();
            $table->string('zip')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            
            // Payout methods
            $table->boolean('bank_enabled')->default(false);
            $table->boolean('paypal_enabled')->default(false);
            $table->boolean('card_enabled')->default(false);
            $table->string('bank_iban')->nullable();
            $table->string('bank_routing')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('paypal_details')->nullable();
            $table->string('card_details')->nullable();
            
            // KYC & Tax
            $table->string('tax_form')->nullable();
            $table->string('tax_id')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('legal_tax_address')->nullable();
            $table->string('gov_id_path')->nullable();
            $table->string('selfie_path')->nullable();
            
            // Seller metrics
            $table->decimal('seller_rating', 3, 2)->default(0);
            $table->integer('total_sales')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            $table->timestamps();

            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
