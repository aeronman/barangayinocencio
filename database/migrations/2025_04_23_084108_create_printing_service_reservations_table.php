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
        Schema::create('printing_service_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('reservation_date');
            $table->string('address');
            $table->string('contact_number');
            $table->string('paper_size');
            $table->string('color');
            $table->string('file_path');
            $table->text('purpose');
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
        Schema::dropIfExists('printing_service_reservations');
    }
};