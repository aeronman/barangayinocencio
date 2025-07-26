<?php

namespace App\Http\Controllers;

use App\Models\CollectedBottle;
use Illuminate\Http\Request;

class CollectedBottleController extends Controller
{

    public function getCollectedBottles()
    {
        $collectedBottles = CollectedBottle::firstOrCreate(['id' => 1]);

        return response()->json($collectedBottles);
    }


    public function updateCollectedBottles(Request $request)
    {
        $request->validate([
            'plastic_count' => 'required|integer|min:0',
            'glass_count' => 'required|integer|min:0',
        ]);

        $collectedBottles = CollectedBottle::find(1);
        $collectedBottles->plastic_count = $request->plastic_count;
        $collectedBottles->glass_count = $request->glass_count;
        $collectedBottles->save();

        return response()->json(['message' => 'Successfully updated the collected bottles']);
    }
}