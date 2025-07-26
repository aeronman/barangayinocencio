<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectedBottle extends Model
{
    use HasFactory;

    protected $fillable = ['plastic_count', 'glass_count'];

    protected $appends = ['total_count'];

    public function getTotalCountAttribute()
    {
        return $this->plastic_count + $this->glass_count;
    }
}