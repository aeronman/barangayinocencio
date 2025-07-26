<?php

// app/Models/Setting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'website_name',
        'logo',
        'address',
        'phone_number',
        'email',
        'mission',
        'vision',
        'chairperson_name',
        'chairperson_position',
        'chairperson_image',
        'committee_members',
    ];

    // If you have a relation for committee members, you can define it here
    public function committeeMembers()
    {
        return $this->hasMany(CommitteeMember::class);
    }

    // Optional: Logic for handling logo and chairperson image
    public function getLogoUrlAttribute()
    {
        return asset('storage/' . $this->logo);
    }

    public function getChairpersonImageUrlAttribute()
    {
        return asset('storage/' . $this->chairperson_image);
    }
}