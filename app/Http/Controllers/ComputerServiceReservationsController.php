<?php

namespace App\Http\Controllers;
use App\Notifications\ComputerReservationNotification;
use App\Models\ComputerServiceReservations;

use App\Http\Requests\StoreComputerServiceReservationsRequest;
use App\Http\Requests\UpdateComputerServiceReservationsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Notification;


class ComputerServiceReservationsController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date');
        $pcNumber = $request->query('pc_number');

        $query = ComputerServiceReservations::query();

        if ($pcNumber) {
            $query->where('pc_number', $pcNumber);
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
        'pc_number' => 'required|string',
        'reservation_date' => 'required|date',
        'time_range' => 'required|string',
        'name' => 'required|string',
        'address' => 'nullable|string',
        'email' => 'required|email',
        'contact' => 'required|string',
    ]);

    $reservationCode = strtoupper(Str::random(8));

    $reservation = ComputerServiceReservations::create([
        'pc_number' => $request->pc_number,
        'reservation_date' => $request->reservation_date,
        'time_range' => $request->time_range,
        'name' => $request->name,
        'address' => $request->address,
        'email' => $request->email,
        'contact' => $request->contact,
        'reservation_code' => $reservationCode,
    ]);


    Notification::route('mail', $request->email)
        ->notify(new ComputerReservationNotification($reservation));

    return response()->json($reservation, 201);
}


    public function show($id)
    {
        $reservation = ComputerServiceReservations::findOrFail($id);
        return response()->json($reservation, 200);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'pc_number' => 'sometimes|string',
            'reservation_date' => 'sometimes|date',
            'time_range' => 'sometimes|string',
            'name' => 'sometimes|string',
            'address' => 'nullable|string',
            'email' => 'sometimes|email',
            'contact' => 'sometimes|string',
        ]);

        $reservation = ComputerServiceReservations::findOrFail($id);
        $reservation->update($validated);

        return response()->json($reservation, 200);
    }

    public function markAsDone($id)
    {
        $reservation = ComputerServiceReservations::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found.'], 404);
        }

        $reservation->status = 'completed';
        $reservation->save();

        return response()->json(['message' => 'Reservation marked as completed.']);
    }


    public function destroy($id)
    {
        $reservation = ComputerServiceReservations::findOrFail($id);
        $reservation->delete();
        return response()->json(null, 204);
    }
}