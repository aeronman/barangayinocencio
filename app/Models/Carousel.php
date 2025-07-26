<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    use HasFactory;

    protected $fillable = [
        'setting_id',
        'image',
        'title',
        'description',
        'page',
    ];

    public function setting()
    {
        return $this->belongsTo(Setting::class);
    }
}