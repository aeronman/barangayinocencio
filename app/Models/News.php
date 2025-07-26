<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'images',
        'status',
        'date_published',
    ];

    protected $casts = [
        'images' => 'array',
        'date_published' => 'datetime',
    ];

    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    public function getFormattedUpdatedAtAttribute()
    {
        return $this->created_at->format('M d, Y');
    }
}