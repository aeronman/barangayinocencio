<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Participant extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'event_id',
        'last_name',
        'first_name',
        'address',
        'email',
        'contact_number',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}