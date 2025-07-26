<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_type',
        'service_name',
        'description',

        // Shared Fields
        'timeslot_management',
        'timeslot_duration',
        'max_reservations_per_timeslot',
        'start_time',
        'end_time',
        'reservation_type',

        // Individual Reservation Fields
        'individuals_per_reservation',
        'max_booking_window_individual',

        // Group Reservation Fields
        'min_group_size',
        'max_group_size',
        'max_booking_window_group',

        // Resource Reservation Fields
        'resource_name',
        'available_resources',

        // Facility Reservation Fields
        'available_facilities',

        // Event Registration System Fields
        'event_date',
        'event_time',
        'event_location',
        'event_type',
        'registration_type',
        'registration_start_date',
        'registration_end_date',
        'max_registrations',
        'requirements',

        // Resource Lending Fields
        'resource_category',
        'resource_location',
        'availability_day_start',
        'availability_day_end',
        'availability_time_start',
        'availability_time_end',

        // Volunteer Fields
        'volunteer_category',
        'volunteer_location',
        'volunteer_start_date',
        'volunteer_end_date',
        'contact_person',
        'contact_number',
        'contact_email',
        'volunteer_requirements',

        // Penalty and Launch
        'penalty_policy',
        'penalty_description',
        'launch_date',
        'availability_status',
    ];

    protected $casts = [
        'timeslot_management' => 'boolean',
        'penalty_policy' => 'boolean',
        'launch_date' => 'date',
        'event_date' => 'date',
        'event_time' => 'datetime:H:i',
        'registration_start_date' => 'date',
        'registration_end_date' => 'date',
        'volunteer_start_date' => 'date',
        'volunteer_end_date' => 'date',
        'availability_day_start' => 'date',
        'availability_day_end' => 'date',
        'availability_time_start' => 'datetime:H:i',
        'availability_time_end' => 'datetime:H:i',
    ];

}