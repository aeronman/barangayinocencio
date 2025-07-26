<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = Carbon::now()->addDays(rand(5, 30));
        $endDate = (clone $startDate)->addDays(rand(1, 3));
        $eventDate = (clone $endDate)->addDays(rand(1, 5));

        $status = rand(0, 1) ? 'draft' : 'published';

        return [
            'title' => 'Community Event ' . $this->faker->numberBetween(1, 100),
            'date' => $eventDate,
            'date_published' => $this->faker->dateTimeBetween('2025-01-01', 'now'),
            'location' => 'Barangay Hall ' . $this->faker->numberBetween(1, 5),
            'event_organizer' => 'Organizer ' . $this->faker->name,
            'registration_start_date' => $startDate,
            'registration_end_date' => $endDate,
            'registration_type' => $this->faker->randomElement(['individual', 'group']),
            'event_type' => $this->faker->randomElement(['Sports', 'Seminar']),
            'requirements' => 'Bring ID, Registration Form',
            'description' => $this->faker->sentence(10),
            'time' => sprintf('%02d:%02d:00', rand(8, 15), 0),
            'contact_number' => '09' . $this->faker->numberBetween(100000000, 999999999),
            'number_of_participants' => rand(30, 100),
            'images' => array_map(fn() => 'https://picsum.photos/id/' . $this->faker->numberBetween(1, 1000) . '/600/400', range(1, rand(2, 5))),
            'status' => $status,
        ];
    }
}