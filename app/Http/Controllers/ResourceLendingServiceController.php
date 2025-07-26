<?php

namespace App\Http\Controllers;

use App\Models\ResourceLendingService;
use Illuminate\Http\Request;

class ResourceLendingServiceController extends Controller
{
    public function index()
    {
        return response()->json(ResourceLendingService::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'required|string',
            'resource_name' => 'required|string|max:255',
            'available_resources' => 'required|integer',
            'category' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'day_start' => 'required|date',
            'day_end' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|string|in:Available,Unavailable',
            'penalty_enabled' => 'required|boolean',
        ]);

        $resourceLendingService = ResourceLendingService::create($request->all());

        return response()->json($resourceLendingService, 201);
    }

    public function show($id)
    {
        $resourceLendingService = ResourceLendingService::findOrFail($id);
        return response()->json($resourceLendingService);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'required|string',
            'resource_name' => 'required|string|max:255',
            'available_resources' => 'required|integer',
            'category' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'day_start' => 'required|date',
            'day_end' => 'required|date',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|string|in:Available,Unavailable',
            'penalty_enabled' => 'required|boolean',
        ]);

        $resourceLendingService = ResourceLendingService::findOrFail($id);
        $resourceLendingService->update($request->all());

        return response()->json($resourceLendingService);
    }

    public function destroy($id)
    {
        $resourceLendingService = ResourceLendingService::findOrFail($id);
        $resourceLendingService->delete();

        return response()->json(null, 204);
    }
}