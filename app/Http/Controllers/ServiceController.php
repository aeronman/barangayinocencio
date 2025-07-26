<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    /**
     * Validate the service input for creating/updating a service.
     */
    private function validateService(Request $request)
    {
        return $request->validate([
            'service_type' => 'nullable|string',
            'service_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'availability_status' => 'nullable|in:Available,Unavailable',
            'launch_date' => 'nullable|date',

            'name_of_resource' => 'nullable|string',
            'available_resources' => 'nullable|string',
            'available_facilities' => 'nullable|string',
            'timeslot_management' => 'nullable|boolean',
            'timeslot_duration' => 'nullable|integer',
            'max_reservation_per_timeslot' => 'nullable|integer',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',

            'reservation_type' => 'nullable|string|in:Individual,Group',
            'number_of_individuals_per_reservation' => 'nullable|integer',
            'max_booking_window' => 'nullable|integer',
            'min_group_size' => 'nullable|integer',
            'max_group_size' => 'nullable|integer',

            'event_date' => 'nullable|date',
            'event_time' => 'nullable|date_format:H:i',
            'location' => 'nullable|string',
            'event_type' => 'nullable|string',
            'registration_type' => 'nullable|in:Individual,Group',
            'registration_start_date' => 'nullable|date',
            'registration_end_date' => 'nullable|date',
            'max_registrations' => 'nullable|integer',
            'requirements' => 'nullable|string',

            'category' => 'nullable|string',
            'availability_day_start' => 'nullable|string',
            'availability_day_end' => 'nullable|string',
            'availability_time_start' => 'nullable|string',
            'availability_time_end' => 'nullable|string',

            'contact_person' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'contact_email' => 'nullable|email',

            'penalty_policy' => 'nullable|boolean',
            'penalty_description' => 'nullable|string',
        ]);
    }

    /**
     * Display all services.
     */
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    /**
     * Store a new service.
     */
    public function store(Request $request)
    {
        $validated = $this->validateService($request);

        $service = Service::create($validated);

        return response()->json(['message' => 'Service created successfully.', 'service' => $service], 201);
    }

    /**
     * Show details of a specific service.
     */
    public function show($id)
    {
        $service = Service::find($id);

        // If service not found, return a 404 error
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Return the service details
        return response()->json($service);
    }

    /**
     * Update an existing service.
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        // If service not found, return a 404 error
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Validate the service input
        $validated = $this->validateService($request);

        // Update the service
        $service->update($validated);

        // Return a success response with the updated service
        return response()->json(['message' => 'Service updated successfully.', 'service' => $service]);
    }

    /**
     * Delete a service.
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        // If service not found, return a 404 error
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Delete the service
        $service->delete();

        // Return a success message after deletion
        return response()->json(['message' => 'Service deleted successfully.']);
    }
}