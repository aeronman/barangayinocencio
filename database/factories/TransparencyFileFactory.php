<?php

namespace Database\Factories;

use App\Models\Transparency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransparencyFile>
 */
class TransparencyFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transparency_id' => Transparency::factory(),
            'file_name' => $this->faker->word() . '.pdf',
            'file_url' => 'files/' . $this->faker->uuid . '.pdf',
        ];
    }
}