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
        Schema::create('event_registration_services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->date('date');
            $table->time('time');
            $table->string('location');
            $table->enum('event_type', ['Sport', 'Seminar', 'Workshop', 'Educational Assistance', 'Online Tournament', 'Other']);
            $table->enum('registration_type', ['Individual', 'Group']);
            $table->date('registration_start');
            $table->date('registration_end');
            $table->integer('max_registrations');
            $table->string('requirements');
            $table->boolean('penalty_enabled')->default(false);
            $table->text('description');
            $table->date('launch_date');
            $table->enum('availability_status', ['Available', 'Unavailable'])->default('Available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registration_services');
    }
};