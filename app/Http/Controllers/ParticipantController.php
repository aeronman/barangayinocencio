<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Notifications\ParticipantNotification;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index()
    {
        return response()->json(Participant::all());
    }

    public function show($id)
    {
        $participant = Participant::find($id);
        if ($participant) {
            return response()->json($participant);
        }
        return response()->json(['message' => 'Participant not found'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'required|email',
            'contact_number' => 'required|string',
        ]);

        $participant = Participant::create($request->all());

        $event = Event::findOrFail($request->event_id);

        $participant->notify(new ParticipantNotification($participant, $event));

        return response()->json($participant, 201);
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::find($id);
        if (!$participant) {
            return response()->json(['message' => 'Participant not found'], 404);
        }

        $request->validate([
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'required|email|unique:participants,email,' . $id,
            'contact_number' => 'required|string',
        ]);

        $participant->update($request->all());

        return response()->json($participant);
    }

    public function destroy($id)
    {
        $participant = Participant::find($id);
        if (!$participant) {
            return response()->json(['message' => 'Participant not found'], 404);
        }

        $participant->delete();

        return response()->json(['message' => 'Participant deleted successfully']);
    }
}