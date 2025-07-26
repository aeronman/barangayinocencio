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
        Schema::create('volunteer_services', function (Blueprint $table) {
            $table->id();
            $table->string('service_name');
            $table->text('description');
            $table->enum('category', ['Community Service', 'Environmental Projects', 'Educational Programs', 'Event Support', 'Other']);
            $table->string('location');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('contact_person');
            $table->string('contact_number');
            $table->string('contact_email');
            $table->text('volunteer_requirements');
            $table->boolean('penalty_enabled')->default(false);
            $table->text('penalty_description')->nullable();
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
        Schema::dropIfExists('volunteer_services');
    }
};