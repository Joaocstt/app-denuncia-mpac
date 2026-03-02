<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Denuncia extends Model
{
    protected $guarded = [];

    protected $casts = [
        'mediaUrls' => 'array',
    ];
}
