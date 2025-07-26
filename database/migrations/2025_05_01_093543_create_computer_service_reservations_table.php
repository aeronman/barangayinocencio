<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('computer_service_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('pc_number');
            $table->date('reservation_date');
            $table->string('time_range');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email');
            $table->string('contact');
            $table->string('reservation_code')->unique();
            $table->string('status')->default('Reserved');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('computer_service_reservations');
    }
};