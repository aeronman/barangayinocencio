<?php

namespace App\Http\Controllers;

use App\Models\CommitteeMember;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function index()
    {
        // Get the latest setting with committee members
        $latestSetting = Setting::with('committeeMembers')->latest()->first();
        return response()->json($latestSetting);
    }

    public function save(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'website_name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'address' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email',
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'chairperson_name' => 'required|string|max:255',
            'chairperson_position' => 'required|string|max:255',
            'chairperson_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'committeeMembers' => 'nullable|array',
            'committeeMembers.*.name' => 'required|string|max:255',
            'committeeMembers.*.position' => 'required|string|max:255',
            'committeeMembers.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Extract and validate data
        $data = $this->extractData($request);

        // Either get the first existing setting or create it
        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create($data['setting']);
        } else {
            $setting->update($data['setting']);
        }

        // Refresh committee members
        $setting->committeeMembers()->delete();
        foreach ($data['committee_members'] as $member) {
            $member['setting_id'] = $setting->id;
            CommitteeMember::create($member);
        }

        return response()->json([
            'message' => $setting->wasRecentlyCreated ? 'Website information created successfully.' : 'Website information updated successfully.',
            'data' => $setting->load('committeeMembers')
        ], $setting->wasRecentlyCreated ? 201 : 200);
    }

    public function show(Setting $setting)
    {
        return response()->json($setting->load('committeeMembers'));
    }

    public function destroy(Setting $setting)
    {
        // Delete setting and associated committee members
        $setting->committeeMembers()->delete();
        $setting->delete();
        return response()->json(['message' => 'Website information deleted successfully.']);
    }

    private function extractData(Request $request): array
    {
        $settingData = [];

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            $settingData['logo'] = $request->file('logo')->storeAs('logos', 'Logo_' . time() . '.' . $request->file('logo')->extension(), 'public');
        }

        // Gather other settings data
        $settingData['website_name'] = $request->input('website_name');
        $settingData['address'] = $request->input('address');
        $settingData['phone_number'] = $request->input('phone_number');
        $settingData['email'] = $request->input('email');
        $settingData['mission'] = $request->input('mission');
        $settingData['vision'] = $request->input('vision');
        $settingData['chairperson_name'] = $request->input('chairperson_name');
        $settingData['chairperson_position'] = $request->input('chairperson_position');

        // Handle chairperson image
        if ($request->hasFile('chairperson_image')) {
            $settingData['chairperson_image'] = $request->file('chairperson_image')->storeAs('chairperson_images', 'Chairperson_' . time() . '.' . $request->file('chairperson_image')->extension(), 'public');
        }

        // Collect data for committee members
        $committeeMembers = [];
        foreach ($request->input('committeeMembers', []) as $index => $member) {
            $data = [
                'name' => $member['name'],
                'position' => $member['position'],
            ];

            // Handle each committee member's image upload
            if ($request->hasFile("committeeMembers.$index.image")) {
                $data['image'] = $request->file("committeeMembers.$index.image")->storeAs('committee_images', 'Member_' . $index . '_' . time() . '.' . $request->file("committeeMembers.$index.image")->extension(), 'public');
            }

            $committeeMembers[] = $data;
        }

        return [
            'setting' => $settingData,
            'committee_members' => $committeeMembers
        ];
    }
}