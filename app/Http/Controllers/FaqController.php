<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return response()->json($faqs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $faq = Faq::create([
            'question' => $request->question,
            'answer' => $request->answer,
            'is_active' => $request->is_active,
        ]);

        return response()->json([
            'message' => 'FAQ created successfully',
            'faq' => $faq
        ], 201);
    }

    public function show($id)
    {
        $faq = Faq::find($id);

        if ($faq) {
            return response()->json($faq);
        } else {
            return response()->json(['message' => 'FAQ not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $faq = Faq::find($id);

        if ($faq) {
            $faq->update([
                'question' => $request->question,
                'answer' => $request->answer,
                'is_active' => $request->is_active,
            ]);

            return response()->json([
                'message' => 'FAQ updated successfully',
                'faq' => $faq
            ]);
        } else {
            return response()->json(['message' => 'FAQ not found'], 404);
        }
    }

    public function destroy($id)
    {
        $faq = Faq::find($id);

        if ($faq) {
            $faq->delete();
            return response()->json(['message' => 'FAQ deleted successfully']);
        } else {
            return response()->json(['message' => 'FAQ not found'], 404);
        }
    }
}