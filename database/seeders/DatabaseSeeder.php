<?php

namespace Database\Seeders;

use App\Models\ResourceReservationService;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            NewsSeeder::class,
            EventSeeder::class,
            AnnouncementSeeder::class,
            SettingSeeder::class,
            CarouselSeeder::class,
            FaqSeeder::class,
            TransparencySeeder::class,
        ]);

        User::create([
            'username' => '123',
            'password' => Hash::make('123'),
        ]);


        ResourceReservationService::create([
            'service_name' => 'Computer Rental',
            'description' => 'Rent computers for projects, research or personal use.',
            'resource_name' => 'PC',
            'available_resources' => 10,
            'timeslot_duration' => '30 minutes',
            'max_reservation_per_timeslot' => 5,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'reservation_type' => 'Individual',
            'individuals_per_reservation' => 1,
            'booking_window' => '7',
            'penalty_description' => 'Late returns incur a penalty of $5 per hour.',
            'launch_date' => now(),
            'availability_status' => 'Available',
            'timeslot_enabled' => true,
            'penalty_enabled' => true,
        ]);

        ResourceReservationService::create([
            'service_name' => 'Printing Services',
            'description' => 'Reserve a slot for printing documents, reports, and more.',
            'resource_name' => 'Printer',
            'available_resources' => 5,
            'timeslot_duration' => '15 minutes',
            'max_reservation_per_timeslot' => 2,
            'start_time' => '10:00',
            'end_time' => '16:00',
            'reservation_type' => 'Individual',
            'individuals_per_reservation' => 1,
            'booking_window' => '5',
            'penalty_description' => 'A $2 penalty will apply for no-shows or overtime.',
            'launch_date' => now(),
            'availability_status' => 'Available',
            'timeslot_enabled' => true,
            'penalty_enabled' => true,
        ]);


        // DB::table('members')->insert([
        //     [
        //         'last_name' => 'Abancia Jr',
        //         'first_name' => 'Danilo',
        //         'middle_name' => 'Delector',
        //         'suffix' => 'Jr.',
        //         'address' => 'Blk 2 Lot 1 Section 1 Phase 1 Pabahay Bagtas Tanza Cavite',
        //         'area' => 'Inocencio Proper',
        //         'sex' => 'male',
        //         'age' => 23,
        //         'email' => 'danilojrabancia@gmail.com',
        //         'contact_number' => '09919526418',
        //         'civil_status' => 'married',
        //         'age_group' => 'Core Youth (18-24)',
        //         'education' => 'Elementary Graduate',
        //         'employment' => 'Employed',
        //         'sk_voter' => 'No',
        //         'election_vote' => 'No',
        //         'national_voter' => 'No',
        //         'kk_assembly' => 'No',
        //         'kk_reason' => json_encode(['No KK Assembly']),
        //         'youth_concerns' => 'asd',
        //         'recommendations' => 'asd',
        //         'project_recommendations' => 'asd',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'last_name' => 'Santos',
        //         'first_name' => 'Maria',
        //         'middle_name' => 'Perez',
        //         'suffix' => 'Sr.',
        //         'address' => 'Blk 5 Lot 10 Phase 2 Sampaguita Village',
        //         'area' => 'Sampaguita Village',
        //         'sex' => 'female',
        //         'age' => 30,
        //         'email' => 'mariasantos@gmail.com',
        //         'contact_number' => '09181234567',
        //         'civil_status' => 'single',
        //         'age_group' => 'Young Adult (25-30)',
        //         'education' => 'College Graduate',
        //         'employment' => 'Employed',
        //         'sk_voter' => 'Yes',
        //         'election_vote' => 'Yes',
        //         'national_voter' => 'Yes',
        //         'kk_assembly' => 'No',
        //         'kk_reason' => json_encode(['Regular Attendance']),
        //         'youth_concerns' => 'Need more youth activities',
        //         'recommendations' => 'Start a youth entrepreneurship program',
        //         'project_recommendations' => 'Youth leadership training',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]
        // ]);
    }
}