<?php

namespace App\Http\Controllers;

use App\Models\EventRegistrationService;
use Illuminate\Http\Request;

class EventRegistrationServiceController extends Controller
{
    public function index()
    {
        return EventRegistrationService::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i:s',
            'location' => 'required|string',
            'event_type' => 'required|in:Sport,Seminar,Workshop,Educational Assistance,Online Tournament,Other',
            'reservation_type' => 'required|in:Individual,Group',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date',
            'max_registrations' => 'required|integer',
            'requirements' => 'required|string',
            'penalty_enabled' => 'boolean',
            'description' => 'required|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|in:Available,Unavailable',
        ]);

        return EventRegistrationService::create($validated);
    }

    public function show($id)
    {
        return EventRegistrationService::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_name' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|time',
            'location' => 'required|string',
            'event_type' => 'required|in:Sport,Seminar,Workshop,Educational Assistance,Online Tournament,Other',
            'reservation_type' => 'required|in:Individual,Group',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date',
            'max_registrations' => 'required|integer',
            'requirements' => 'required|string',
            'penalty_enabled' => 'boolean',
            'description' => 'required|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|in:Available,Unavailable',
        ]);

        $eventRegistrationService = EventRegistrationService::findOrFail($id);
        $eventRegistrationService->update($validated);

        return $eventRegistrationService;
    }

    public function destroy($id)
    {
        $eventRegistrationService = EventRegistrationService::findOrFail($id);
        $eventRegistrationService->delete();

        return response()->noContent();
    }
}