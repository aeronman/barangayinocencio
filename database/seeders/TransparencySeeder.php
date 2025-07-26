<?php

namespace Database\Seeders;

use App\Models\Transparency;
use App\Models\TransparencyFile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransparencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transparency::factory()
            ->count(5)
            ->create()
            ->each(function ($transparency) {
                TransparencyFile::factory()
                    ->count(3)
                    ->create(['transparency_id' => $transparency->id]);
            });
    }
}