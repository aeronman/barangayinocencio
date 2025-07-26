<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacilityReservationService extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_name',
        'service_name',
        'service_system',
        'description',
        'available_facilities',
        'timeslot_duration',
        'max_reservation_per_timeslot',
        'start_time',
        'end_time',
        'reservation_type',
        'individuals_per_reservation',
        'min_group_size',
        'max_group_size',
        'booking_window',
        'penalty_enabled',
        'penalty_description',
        'launch_date',
        'availability_status',
    ];
}