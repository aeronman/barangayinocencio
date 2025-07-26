<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'default');
        $date = $request->query('date');

        $query = Event::with(['participants', 'teams']);

        if ($date) {
            $query->whereDate('date', $date);
        }

        if ($sort === 'published') {
            $query->where('status', 'published')->orderBy('date');
        } else {
            $query->orderByDesc('id');
        }

        $events = $query->get();

        return response()->json($events, 200);
    }

    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

       

        return response()->json($event);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'date' => 'required|date',
            'location' => 'required|string',
            'event_organizer' => 'required|string',
            'registration_start_date' => 'required|date',
            'registration_end_date' => 'required|date',
            'registration_type' => 'required|string',
            'event_type' => 'required|string',
            'requirements' => 'nullable|string',
            'description' => 'nullable|string',
            'time' => ['required', 'regex:/^\d{2}:\d{2}$/'],
            'contact_number' => 'required|string',
            'number_of_participants' => 'required|integer',
            'status' => 'nullable|in:draft,published',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $imagePaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $imagePaths[] = $image->store('events_images', 'public');
            }
        }

        $status = $validated['status'] ?? 'draft';

        $event = Event::create([
            ...$validated,
            'status' => $status,
            'date_published' => $status === 'published' ? now() : null,
            'images' => $imagePaths,
        ]);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'date' => 'required|date',
            'location' => 'required|string',
            'event_organizer' => 'required|string',
            'registration_start_date' => 'required|date',
            'registration_end_date' => 'required|date',
            'registration_type' => 'required|string',
            'event_type' => 'required|string',
            'requirements' => 'nullable|string',
            'description' => 'nullable|string',
            'time' => 'required|date_format:H:i',
            'contact_number' => 'required|string',
            'number_of_participants' => 'required|integer',
            'status' => 'nullable|in:draft,published',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $existingImages = $request->input('existing_images', []);
        $newImagePaths = [];

        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $newImagePaths[] = $image->store('events_images', 'public');
            }
        }

        // Delete old images that were removed from existingImages
        $oldImages = $event->images ?? [];
        $toDelete = array_diff($oldImages, $existingImages);
        foreach ($toDelete as $img) {
            Storage::disk('public')->delete($img);
        }

        $finalImageList = array_values(array_merge($existingImages, $newImagePaths));

        $event->update([
            ...$validated,
            'images' => $finalImageList,
            'status' => $validated['status'] ?? $event->status,
            'date_published' => ($validated['status'] ?? $event->status) === 'published' ? now() : $event->date_published,
        ]);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event
        ]);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        if (is_array($event->images)) {
            foreach ($event->images as $img) {
                Storage::disk('public')->delete($img);
            }
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
