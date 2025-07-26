<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'team_name',
        'team_leader_id',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }

    public function leader()
    {
        return $this->belongsTo(TeamMember::class, 'team_leader_id');
    }
}