<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Carousel>
 */
class CarouselFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'setting_id' => 1,
            'image' => 'https://picsum.photos/id/' . $this->faker->numberBetween(1, 1000) . '/600/400',
            'title' => $this->faker->sentence(6, true),
            'description' => $this->faker->paragraph(3, true),
            'page' => $this->faker->randomElement(['home', 'membership', 'news', 'events', 'services', 'about', 'faqs', 'transparency']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}