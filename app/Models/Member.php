<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Member extends Model
{
    /** @use HasFactory<\Database\Factories\MemberFactory> */
    use HasFactory, Notifiable;

    protected $table = 'members';

    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'suffix',
        'address',
        'area',
        'sex',
        'age',
        'email',
        'contact_number',
        'civil_status',
        'age_group',
        'education',
        'employment',
        'sk_voter',
        'election_vote',
        'national_voter',
        'kk_assembly',
        'kk_attendances',
        'kk_reason',
        'youth_concerns',
        'recommendations',
        'project_recommendations',
    ];

    protected $appends = ['masked_email'];
    // protected $hidden = ['email'];

    public function getMaskedEmailAttribute()
    {
        $email = $this->attributes['email'];

        if (!$email || !str_contains($email, '@')) {
            return $email;
        }

        [$name, $domain] = explode('@', $email);

        $visibleChar = substr($name, 0, 1);
        $maskedName = str_pad($visibleChar, strlen($name), '*');

        return $maskedName . '@' . $domain;
    }
}