<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceLendingService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_name',
        'description',
        'resource_name',
        'available_resources',
        'category',
        'location',
        'day_start',
        'day_end',
        'time_start',
        'time_end',
        'penalty_description',
        'launch_date',
        'availability_status',
        'penalty_enabled',
    ];
}