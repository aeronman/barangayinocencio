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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('date');
            $table->timestamp('date_published')->nullable();
            $table->string('location');
            $table->string('event_organizer');
            $table->date('registration_start_date');
            $table->date('registration_end_date');
            $table->enum('registration_type', ['group', 'individual']);
            $table->string('event_type');
            $table->text('requirements')->nullable();
            $table->text('description')->nullable();
            $table->time('time');
            $table->string('contact_number');
            $table->integer('number_of_participants');
            $table->json('images')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};