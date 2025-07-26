<?php

namespace App\Http\Controllers;

use App\Models\FacilityReservationService;
use Illuminate\Http\Request;

class FacilityReservationServiceController extends Controller
{
    public function index()
    {
        return FacilityReservationService::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'facility_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'available_facilities' => 'required|integer',
            'timeslot_duration' => 'required|string',
            'max_reservation_per_timeslot' => 'nullable|integer',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'reservation_type' => 'required|in:Individual,Group',
            'individuals_per_reservation' => 'nullable|integer',
            'min_group_size' => 'nullable|integer',
            'max_group_size' => 'nullable|integer',
            'booking_window' => 'nullable|string',
            'penalty_enabled' => 'required|boolean',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|in:Available,Unavailable',
        ]);

        $facility = FacilityReservationService::create($validated);
        return response()->json($facility, 201);
    }

    public function show($id)
    {
        return FacilityReservationService::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'facility_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'available_facilities' => 'required|integer',
            'timeslot_duration' => 'required|string',
            'max_reservation_per_timeslot' => 'nullable|integer',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'reservation_type' => 'required|in:Individual,Group',
            'individuals_per_reservation' => 'nullable|integer',
            'min_group_size' => 'nullable|integer',
            'max_group_size' => 'nullable|integer',
            'booking_window' => 'nullable|string',
            'penalty_enabled' => 'required|boolean',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|in:Available,Unavailable',
        ]);

        $facility = FacilityReservationService::findOrFail($id);
        $facility->update($validated);
        return response()->json($facility, 200);
    }

    public function destroy($id)
    {
        $facility = FacilityReservationService::findOrFail($id);
        $facility->delete();
        return response()->json(null, 204);
    }
}
