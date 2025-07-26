<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transparency;
use App\Models\TransparencyFile;
use Illuminate\Support\Facades\Storage;

class TransparencyController extends Controller
{
    public function index()
    {
        $transparencies = Transparency::with([
            'files' => function ($query) {
                $query->orderByDesc('created_at');
            }
        ])->orderByDesc('created_at')
            ->get();

        return response()->json($transparencies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255',
        ]);

        $category = Transparency::create([
            'category' => $request->category,
        ]);

        return response()->json($category, 201);
    }

    public function uploadFile(Request $request, $categoryId)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $category = Transparency::findOrFail($categoryId);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileUrl = $file->storeAs('transparency_files', $fileName, 'public');

        $fileEntry = TransparencyFile::create([
            'transparency_id' => $category->id,
            'file_name' => $fileName,
            'file_url' => $fileUrl,
        ]);

        return response()->json($fileEntry, 201);
    }

    public function show($id)
    {
        $transparency = TransparencyFile::with('transparency')->findOrFail($id);
        return response()->json($transparency);
    }


    public function update(Request $request, $id)
    {
        $file = TransparencyFile::with('transparency')->findOrFail($id);

        $request->validate([
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('file')) {
            if (Storage::disk('public')->exists($file->file_url)) {
                Storage::disk('public')->delete($file->file_url);
            }

            $newFile = $request->file('file');
            $newFileName = $newFile->getClientOriginalName();
            $newFileUrl = $newFile->storeAs('transparency_files', $newFileName, 'public');

            $file->update([
                'file_name' => $newFileName,
                'file_url' => $newFileUrl,
            ]);
        }

        return response()->json(['message' => 'File updated successfully.', 'file' => $file]);
    }

    public function destroy($id)
    {
        $file = TransparencyFile::findOrFail($id);

        if (Storage::disk('public')->exists($file->file_url)) {
            Storage::disk('public')->delete($file->file_url);
        }

        $file->delete();

        return response()->json(['message' => 'File deleted successfully.']);
    }
}