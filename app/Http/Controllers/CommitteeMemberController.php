<?php

namespace App\Http\Controllers;

use App\Models\CommitteeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommitteeMemberController extends Controller
{
    public function index()
    {
        return response()->json(CommitteeMember::with('setting')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'setting_id' => 'required|exists:settings,id',
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('committee_images', 'public');
        }

        $member = CommitteeMember::create($validated);

        return response()->json([
            'message' => 'Committee member created successfully.',
            'data' => $member,
        ], 201);
    }

    public function show($id)
    {
        $committeeMember = CommitteeMember::with('setting')->find($id);

        if (!$committeeMember) {
            return response()->json([
                'message' => 'Committee member not found.',
            ], 404);
        }

        return response()->json($committeeMember);
    }

    public function update(Request $request, $id)
    {
        $committeeMember = CommitteeMember::find($id);

        if (!$committeeMember) {
            return response()->json([
                'message' => 'Committee member not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('committee_images', 'public');
        }

        $committeeMember->update($validated);

        return response()->json([
            'message' => 'Committee member updated successfully.',
            'data' => $committeeMember,
        ]);
    }


    public function destroy($id)
    {
        $committeeMember = CommitteeMember::find($id);

        if (!$committeeMember) {
            return response()->json([
                'message' => 'Committee member not found.',
            ], 404);
        }

        $committeeMember->delete();

        return response()->json([
            'message' => 'Committee member deleted successfully.'
        ]);
    }

}