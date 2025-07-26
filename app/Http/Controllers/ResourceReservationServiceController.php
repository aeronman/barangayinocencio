<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ResourceReservationService;
use Carbon\CarbonInterface;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB as FacadesDB;

class ResourceReservationServiceController extends Controller
{
    public function index()
    {
        return ResourceReservationService::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'resource_name' => 'required|string|max:255',
            'available_resources' => 'required|integer|min:1',
            'timeslot_duration' => 'nullable|string',
            'max_reservation_per_timeslot' => 'nullable|integer',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'reservation_type' => 'required|in:Individual,Group',
            'individuals_per_reservation' => 'nullable|integer',
            'min_group_size' => 'nullable|integer',
            'max_group_size' => 'nullable|integer',
            'booking_window' => 'required|string',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'required|date',
            'availability_status' => 'required|in:Available,Unavailable',
        ]);

        return ResourceReservationService::create($validated);
    }

    public function show($id)
    {
        return ResourceReservationService::findOrFail($id);
    }

    public function availableComputerResources()
    {
        $service = ResourceReservationService::where('id', 1)->first();
        $resources = [];

        if ($service) {
            $count = $service->available_resources;
            for ($i = 1; $i <= $count; $i++) {
                $resources[] = [
                    'id' => $i,
                    'name' => "$service->resource_name-$i",
                ];
            }
        }

        return response()->json($resources);
    }

    public function availablePrintingResources()
    {
        $service = ResourceReservationService::where('id', 2)->first();
        $resources = [];

        if ($service) {
            $count = $service->available_resources;
            for ($i = 1; $i <= $count; $i++) {
                $resources[] = [
                    'id' => $i,
                    'name' => "$service->resource_name-$i",
                ];
            }
        }

        return response()->json($resources);
    }


    public function availableResources($service_id)
    {
        $service = ResourceReservationService::where('id', $service_id)->first();
        $resources = [];

        if ($service) {
            $count = $service->available_resources;
            for ($i = 1; $i <= $count; $i++) {
                $resources[] = [
                    'id' => $i,
                    'name' => "$service->resource_name-$i",
                ];
            }
        }

        return response()->json($resources);
    }

    public function update(Request $request, $id)
    {
        $service = ResourceReservationService::findOrFail($id);

        $validated = $request->validate([
            'service_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'resource_name' => 'sometimes|string|max:255',
            'available_resources' => 'required|integer|min:1',
            'timeslot_duration' => 'nullable|string',
            'max_reservation_per_timeslot' => 'nullable|integer',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'reservation_type' => 'sometimes|in:Individual,Group',
            'individuals_per_reservation' => 'nullable|integer',
            'min_group_size' => 'nullable|integer',
            'max_group_size' => 'nullable|integer',
            'booking_window' => 'sometimes|string',
            'penalty_description' => 'nullable|string',
            'launch_date' => 'sometimes|date',
            'availability_status' => 'sometimes|in:Available,Unavailable',
        ]);

        $service->update($validated);
        return $service;
    }

    public function destroy($id)
    {
        $service = ResourceReservationService::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully.']);
    }

    public function computerWeeklyReservations()
    {
        $startOfWeek = Carbon::now()->startOfWeek(CarbonInterface::SUNDAY)->startOfDay();
        $endOfWeek = Carbon::now()->endOfWeek(CarbonInterface::SATURDAY)->endOfDay();

        $reservations = FacadesDB::table('computer_service_reservations')
            ->selectRaw('YEAR(reservation_date) as year, WEEK(reservation_date) as week, COUNT(*) as reservationCount')
            ->whereBetween('reservation_date', [$startOfWeek, $endOfWeek])
            ->groupBy(FacadesDB::raw('YEAR(reservation_date), WEEK(reservation_date)'))
            ->orderBy('year')
            ->orderBy('week')
            ->get()
            ->map(function ($reservation) use ($startOfWeek) {
                $start = Carbon::now()->setISODate($reservation->year, $reservation->week, Carbon::SUNDAY)->startOfDay();
                $end = $start->copy()->endOfWeek(CarbonInterface::SATURDAY)->endOfDay();

                return [
                    'start' => $start->toDateString(),
                    'end' => $end->toDateString(),
                    'reservationCount' => $reservation->reservationCount
                ];
            });

        return response()->json($reservations);
    }
    public function printingWeeklyReservations()
    {
        $startOfWeek = Carbon::now()->startOfWeek(CarbonInterface::SUNDAY)->startOfDay();
        $endOfWeek = Carbon::now()->endOfWeek(CarbonInterface::SATURDAY)->endOfDay();

        $reservations = FacadesDB::table('printing_service_reservations')
            ->selectRaw('YEAR(reservation_date) as year, WEEK(reservation_date) as week, COUNT(*) as reservationCount')
            ->whereBetween('reservation_date', [$startOfWeek, $endOfWeek])
            ->groupBy(FacadesDB::raw('YEAR(reservation_date), WEEK(reservation_date)'))
            ->orderBy('year')
            ->orderBy('week')
            ->get()
            ->map(function ($reservation) use ($startOfWeek) {
                $start = Carbon::now()->setISODate($reservation->year, $reservation->week, Carbon::SUNDAY)->startOfDay();
                $end = $start->copy()->endOfWeek(CarbonInterface::SATURDAY)->endOfDay();

                return [
                    'start' => $start->toDateString(),
                    'end' => $end->toDateString(),
                    'reservationCount' => $reservation->reservationCount
                ];
            });

        return response()->json($reservations);
    }
}