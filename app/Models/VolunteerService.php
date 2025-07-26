<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'description',
        'category',
        'location',
        'start_date',
        'end_date',
        'contact_person',
        'contact_number',
        'contact_email',
        'volunteer_requirements',
        'penalty_enabled',
        'penalty_description',
        'launch_date',
        'availability_status',
    ];
}