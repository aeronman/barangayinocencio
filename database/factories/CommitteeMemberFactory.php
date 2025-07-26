<?php

namespace Database\Factories;

use App\Models\CommitteeMember;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CommitteeMember>
 */
class CommitteeMemberFactory extends Factory
{
    protected $model = CommitteeMember::class;

    public function definition(): array
    {
        $name = $this->faker->name();

        return [
            'setting_id' => 1,
            'name' => $this->faker->name,
            'position' => $this->faker->jobTitle,
            'image' => 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=random&size=400',
        ];
    }
}