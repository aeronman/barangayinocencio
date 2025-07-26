<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'default');

        $query = News::query();

        if ($sort === 'published') {
            $query->where('status', 'published')->orderByDesc('date_published');
        } else {
            $query->orderByDesc('id');
        }

        $news = $query->get();

        return response()->json($news);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'description' => 'required|string',
            'status' => 'nullable|in:draft,published',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('news_images', 'public');
            }
        }

        $status = $validated['status'] ?? 'draft';

        $news = News::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'images' => $imagePaths,
            'status' => $status,
            'date_published' => $status === 'published' ? now() : null,
        ]);

        return response()->json([
            'message' => 'News article created successfully',
            'news' => $news
        ], 201);
    }


    public function show(News $news)
    {
        return response()->json($news);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'nullable|in:draft,published,archived',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        // Get existing images to retain
        $preservedImages = $request->input('existing_images', []);
        $originalImages = $news->images ?? [];

        // Delete removed images from storage
        $removedImages = array_diff($originalImages, $preservedImages);
        foreach ($removedImages as $img) {
            Storage::disk('public')->delete($img);
        }

        $finalImages = $preservedImages;

        // Upload new images if any
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $finalImages[] = $image->store('news_images', 'public');
            }
        }

        // Update the model
        $news->title = $validated['title'];
        $news->description = $validated['description'];
        $news->images = $finalImages;
        $news->status = $validated['status'] ?? $news->status;

        if ($news->status === 'published' && !$news->date_published) {
            $news->date_published = now();
        }

        $news->save();

        return response()->json([
            'message' => 'News article updated successfully',
            'news' => $news
        ]);
    }



    public function destroy(News $news)
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return response()->json(['message' => 'News article deleted successfully']);
    }

    public function archive(News $news)
    {
        $news->update(['status' => 'archived']);
        return response()->json(['message' => 'News article archived successfully']);
    }
}