<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'date_published',
        'location',
        'event_organizer',
        'registration_start_date',
        'registration_end_date',
        'registration_type',
        'event_type',
        'requirements',
        'description',
        'time',
        'contact_number',
        'number_of_participants',
        'images',
        'status',
    ];

    protected $casts = [
        'images' => 'array',
        'date' => 'date',
        'date_published' => 'datetime',
        'registration_start_date' => 'date',
        'registration_end_date' => 'date',
    ];

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}