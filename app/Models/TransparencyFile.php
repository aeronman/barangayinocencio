<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransparencyFile extends Model
{
    use HasFactory;

    protected $fillable = ['transparency_id', 'file_name', 'file_url'];

    public function transparency()
    {
        return $this->belongsTo(Transparency::class);
    }
}