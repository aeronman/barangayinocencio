<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtherServiceReservations extends Model
{
    /** @use HasFactory<\Database\Factories\OtherServiceReservationsFactory> */
    use HasFactory;

    protected $fillable = [
        'service_name',
        'resource_number',
        'reservation_date',
        'time_range',
        'name',
        'address',
        'email',
        'contact',
        'reservation_code',
        'status'
    ];
}