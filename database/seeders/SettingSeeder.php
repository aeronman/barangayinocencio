<?php

namespace Database\Seeders;

use App\Models\CommitteeMember;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setting = Setting::factory()->create();
        CommitteeMember::factory()->count(6)->create(['setting_id' => $setting->id]);
    }
}