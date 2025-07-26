<?php

namespace App\Http\Controllers;

use App\Models\OtherServiceReservations;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OtherServiceReservationsController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date');
        $resourceNumber = $request->query('resource_number');

        $query = OtherServiceReservations::query();

        if ($resourceNumber) {
            $query->where('resource_number', $resourceNumber);
        }
        if ($date) {
            $query->whereDate('reservation_date', $date);
        }

        $reservations = $query->get();

        return response()->json($reservations, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string',
            'resource_number' => 'required|string',
            'reservation_date' => 'required|date',
            'time_range' => 'required|string',
            'name' => 'required|string',
            'address' => 'nullable|string',
            'email' => 'required|email',
            'contact' => 'required|string',
        ]);


        $reservationCode = strtoupper(Str::random(8));

        $reservation = OtherServiceReservations::create([
            'service_name' => $request->service_name,
            'resource_number' => $request->resource_number,
            'reservation_date' => $request->reservation_date,
            'time_range' => $request->time_range,
            'name' => $request->name,
            'address' => $request->address,
            'email' => $request->email,
            'contact' => $request->contact,
            'reservation_code' => $reservationCode,
        ]);

        return response()->json($reservation, 201);
    }

    public function show($id)
    {
        $reservation = OtherServiceReservations::findOrFail($id);
        return response()->json($reservation, 200);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_name' => 'required|string',
            'resource_number' => 'sometimes|string',
            'reservation_date' => 'sometimes|date',
            'time_range' => 'sometimes|string',
            'name' => 'sometimes|string',
            'address' => 'nullable|string',
            'email' => 'sometimes|email',
            'contact' => 'sometimes|string',
        ]);

        $reservation = OtherServiceReservations::findOrFail($id);
        $reservation->update($validated);

        return response()->json($reservation, 200);
    }


    public function destroy($id)
    {
        $reservation = OtherServiceReservations::findOrFail($id);
        $reservation->delete();
        return response()->json(null, 204);
    }
}