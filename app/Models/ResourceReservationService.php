<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceReservationService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'service_system',
        'description',
        'resource_name',
        'available_resources',
        'timeslot_duration',
        'max_reservation_per_timeslot',
        'start_time',
        'end_time',
        'reservation_type',
        'individuals_per_reservation',
        'min_group_size',
        'max_group_size',
        'booking_window',
        'penalty_description',
        'launch_date',
        'availability_status',
        'timeslot_enabled',
        'penalty_enabled',
    ];
}