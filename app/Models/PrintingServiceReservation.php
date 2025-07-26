<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrintingServiceReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'reservation_date',
        'address',
        'email',
        'contact_number',
        'paper_size',
        'color',
        'file_path',
        'purpose',
        'reservation_code',
        'status'
    ];
}