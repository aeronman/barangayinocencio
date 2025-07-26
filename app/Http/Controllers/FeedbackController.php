<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\FeedbackSubmittedNotification;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Feedback::create($validated);

        // Send to fixed email using a Blade template
        Notification::route('mail', 'batanginocencio.sk@gmail.com')
            ->notify(new FeedbackSubmittedNotification($validated));

        return response()->json(['message' => 'Thank you for your feedback!']);
    }
}
