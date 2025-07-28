<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Maintenance file path
if (file_exists($maintenance = __DIR__ . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Laravel bootstrap
$app = require_once __DIR__ . '/bootstrap/app.php';

$app->handleRequest(
    Illuminate\Http\Request::capture()
);
