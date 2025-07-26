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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('address');
            $table->enum('area', [
                'Inocencio Proper',
                'Tradition Homes Phase 1 and 2',
                'Sampaguita Village',
                'Regina Ville 2000',
                'BRIA Homes',
                'South Ville Phase 1A and B',
            ]);
            $table->enum('sex', ['Male', 'Female']);
            $table->integer('age');
            $table->string('email')->unique();
            $table->string('contact_number');
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Divorced', 'Deparated']);
            $table->enum('age_group', [
                'Child Youth (15-17)',
                'Core Youth (18-24)',
                'Young Adult (25-30)',
            ]);
            $table->enum('education', [
                'Elementary Level',
                'Elementary Graduate',
                'High School Level',
                'High School Graduate',
                'College Level',
                'College Graduate',
                'Masters Graduate',
                'Doctorate Level',
                'Doctorate Graduate',
                'Out of School',
                'Unemployed',
                'Employed'
            ]);
            $table->enum('sk_voter', ['Yes', 'No']);
            $table->enum('election_vote', ['Yes', 'No'])->nullable();
            $table->enum('national_voter', ['Yes', 'No'])->nullable();
            $table->enum('kk_assembly', ['Yes', 'No'])->nullable();
            $table->text('kk_reason')->nullable();
            $table->text('youth_concerns')->nullable();
            $table->text('recommendations')->nullable();
            $table->text('project_recommendations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};