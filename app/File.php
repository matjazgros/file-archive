<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class File extends Model
{
    use HasApiTokens, Notifiable;

    protected $hidden = [
        'thumb', 'path', 'updated_at'
    ];
}
