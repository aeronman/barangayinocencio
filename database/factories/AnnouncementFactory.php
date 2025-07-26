<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6, true),
            'date_published' => $this->faker->dateTimeBetween('2025-01-01', 'now'),
            'description' => $this->faker->paragraph(3, true),
            'images' => array_map(fn() => 'https://picsum.photos/id/' . $this->faker->numberBetween(1, 1000) . '/600/400', range(1, rand(2, 5))),
            'status' => $this->faker->randomElement(['published', 'draft']),
        ];
    }
}