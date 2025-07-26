<?php

namespace App\Http\Controllers;

use App\Models\VolunteerService;
use Illuminate\Http\Request;

class VolunteerServiceController extends Controller
{
    // Get all volunteer services
    public function index()
    {
        return response()->json(VolunteerService::all());
    }

    // Create a new volunteer service
    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'location' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'contact_person' => 'required|string',
            'contact_number' => 'required|string',
            'contact_email' => 'required|email',
            'volunteer_requirements' => 'required|string',
            'penalty_enabled' => 'required|boolean',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|string',
        ]);

        $volunteerService = VolunteerService::create($request->all());

        return response()->json($volunteerService, 201);
    }

    // Show a specific volunteer service
    public function show($id)
    {
        $volunteerService = VolunteerService::findOrFail($id);
        return response()->json($volunteerService);
    }

    // Update a volunteer service
    public function update(Request $request, $id)
    {
        $volunteerService = VolunteerService::findOrFail($id);

        $request->validate([
            'service_name' => 'string',
            'description' => 'string',
            'category' => 'string',
            'location' => 'string',
            'start_date' => 'date',
            'end_date' => 'date',
            'contact_person' => 'string',
            'contact_number' => 'string',
            'contact_email' => 'email',
            'volunteer_requirements' => 'string',
            'penalty_enabled' => 'boolean',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'date',
            'availability_status' => 'string',
        ]);

        $volunteerService->update($request->all());

        return response()->json($volunteerService);
    }

    // Delete a volunteer service
    public function destroy($id)
    {
        $volunteerService = VolunteerService::findOrFail($id);
        $volunteerService->delete();

        return response()->json(null, 204);
    }
}