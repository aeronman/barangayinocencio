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
        Schema::create('resource_reservation_services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->string('service_system')->default('Resource Reservation Services');
            $table->text('description');
            $table->string('resource_name');
            $table->integer('available_resources');
            $table->string('timeslot_duration')->default('30 minutes');
            $table->integer('max_reservation_per_timeslot')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->enum('reservation_type', ['Individual', 'Group'])->default('Individual');
            $table->integer('individuals_per_reservation')->nullable();
            $table->integer('min_group_size')->nullable();
            $table->integer('max_group_size')->nullable();
            $table->string('booking_window');
            $table->text('penalty_description')->nullable();
            $table->date('launch_date');
            $table->enum('availability_status', ['Available', 'Unavailable'])->default('Available');
            $table->boolean('timeslot_enabled')->default(true);
            $table->boolean('penalty_enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_reservation_services');
    }
};