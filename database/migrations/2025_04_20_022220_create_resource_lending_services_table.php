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
        Schema::create('resource_lending_services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->text('description');
            $table->string('resource_name');
            $table->integer('available_resources');
            $table->string('category')->default('Event Materials');
            $table->string('location');
            $table->date('day_start');
            $table->date('day_end');
            $table->time('time_start');
            $table->time('time_end');
            $table->text('penalty_description')->nullable();
            $table->date('launch_date');
            $table->enum('availability_status', ['Available', 'Unavailable'])->default('Available');
            $table->boolean('penalty_enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_lending_services');
    }
};