<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistrationService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'date',
        'time',
        'location',
        'event_type',
        'reservation_type',
        'registration_start',
        'registration_end',
        'max_registrations',
        'requirements',
        'penalty_enabled',
        'description',
        'launch_date',
        'availability_status',
    ];
}