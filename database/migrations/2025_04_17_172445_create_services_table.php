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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('service_type')->nullable();
            $table->string('service_name')->nullable();
            $table->text('description')->nullable();

            $table->boolean('timeslot_management')->nullable();
            $table->integer('timeslot_duration')->nullable();
            $table->integer('max_reservation_per_timeslot')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            // Resource/Facility Reservation
            $table->string('resource_name')->nullable();
            $table->integer('available_resources')->nullable();
            $table->integer('available_facilities')->nullable();
            $table->string('reservation_type')->nullable();
            $table->integer('individuals_per_reservation')->nullable();
            $table->integer('individual_max_booking_window')->nullable();
            $table->integer('min_group_size')->nullable();
            $table->integer('max_group_size')->nullable();
            $table->integer('group_max_booking_window')->nullable();

            // Event Registration
            $table->date('event_date')->nullable();
            $table->time('event_time')->nullable();
            $table->string('event_location')->nullable();
            $table->string('event_type')->nullable();
            $table->string('registration_type')->nullable();
            $table->date('registration_start_date')->nullable();
            $table->date('registration_end_date')->nullable();
            $table->integer('max_registrations')->nullable();
            $table->text('requirements')->nullable();

            // Resource Lending
            $table->string('resource_category')->nullable();
            $table->string('lending_location')->nullable();
            $table->string('availability_day_start')->nullable();
            $table->string('availability_day_end')->nullable();
            $table->time('available_time_start')->nullable();
            $table->time('available_time_end')->nullable();

            // Volunteer Management
            $table->string('volunteer_category')->nullable();
            $table->string('volunteer_location')->nullable();
            $table->date('volunteer_start_date')->nullable();
            $table->date('volunteer_end_date')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('volunteer_requirements')->nullable();

            // Shared fields
            $table->boolean('has_penalty_policy')->default(false);
            $table->text('penalty_description')->nullable();
            $table->date('launch_date')->nullable();
            $table->enum('availability_status', ['Available', 'Unavailable'])->default('Available');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};