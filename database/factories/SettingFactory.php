<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();

        return [
            'website_name' => 'Batang Inocencio',
            // 'logo' => 'images/Logo.png',
            'address' => $this->faker->address,
            'phone_number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'mission' => $this->faker->paragraph,
            'vision' => $this->faker->paragraph,
            'chairperson_name' => $this->faker->name,
            'chairperson_position' => 'SK Chairperson',
            'chairperson_image' => 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=random&size=400',
        ];
    }
}