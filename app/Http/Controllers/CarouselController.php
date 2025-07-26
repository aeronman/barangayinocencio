<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use App\Models\Setting;
use Illuminate\Http\Request;

class CarouselController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->query('page');

        if (!is_null($page)) {
            return response()->json(
                Carousel::where('page', $page)->get()
            );
        }

        return response()->json(Carousel::all());
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'setting_id' => 'required|exists:settings,id',
            'image' => 'nullable|image|max:2048',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'page' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('carousels', 'public');
        }

        $carousel = Carousel::create($validated);

        return response()->json([
            'message' => 'Carousel item created successfully.',
            'data' => $carousel,
        ], 201);
    }

    public function show(Carousel $carousel)
    {
        return response()->json($carousel);
    }

    public function update(Request $request, Carousel $carousel)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'page' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('carousels', 'public');
        }

        $carousel->update($data);

        return response()->json([
            'message' => 'Carousel item updated successfully.',
            'data' => $carousel,
        ]);
    }

    public function destroy(Carousel $carousel)
    {
        $carousel->delete();

        return response()->json(['message' => 'Carousel item deleted successfully.']);
    }
}