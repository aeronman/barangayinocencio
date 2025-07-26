<?php

// app/Models/CommitteeMember.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommitteeMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'setting_id',  // Foreign key to settings
        'name',
        'position',
        'image',
    ];

    // Define the inverse relationship to Setting
    public function setting()
    {
        return $this->belongsTo(Setting::class);
    }

    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image);
    }
}