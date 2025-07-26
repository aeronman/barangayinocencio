<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return response()->json(Team::with('members', 'leader', 'event')->get());
    }

    public function show($id)
    {
        $team = Team::with('members', 'leader', 'event')->find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        return response()->json($team);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'team_name' => 'required|string|unique:teams,team_name',
            'leader_name' => 'required|string',
            'leader_age' => 'required|integer',
            'leader_contact' => 'required|string',
            'leader_email' => 'required|email|unique:team_members,email',
            'members' => 'nullable|array',
            'members.*.name' => 'required|string',
            'members.*.age' => 'required|integer',
            'members.*.contact' => 'required|string',
            'members.*.email' => 'nullable|email|unique:team_members,email',
        ]);

        $team = Team::create([
            'event_id' => $request->event_id,
            'team_name' => $request->team_name,
        ]);

        $leader = TeamMember::create([
            'team_id' => $team->id,
            'name' => $request->leader_name,
            'age' => $request->leader_age,
            'contact' => $request->leader_contact,
            'email' => $request->leader_email,
        ]);

        $team->update(['team_leader_id' => $leader->id]);

        if ($request->has('members')) {
            foreach ($request->members as $member) {
                TeamMember::create([
                    'team_id' => $team->id,
                    'name' => $member['name'],
                    'age' => $member['age'],
                    'contact' => $member['contact'],
                    'email' => $member['email'] ?? null,
                ]);
            }
        }

        return response()->json($team->load('leader', 'members', 'event'), 201);
    }

    public function update(Request $request, $id)
    {
        $team = Team::with('leader')->find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        $request->validate([
            'team_name' => 'required|string|unique:teams,team_name,' . $id,
            'leader_name' => 'required|string',
            'leader_age' => 'required|integer',
            'leader_contact' => 'required|string',
            'leader_email' => 'required|email|unique:team_members,email,' . $team->team_leader_id,
        ]);

        $team->update([
            'team_name' => $request->team_name,
        ]);

        if ($team->leader) {
            $team->leader->update([
                'name' => $request->leader_name,
                'age' => $request->leader_age,
                'contact' => $request->leader_contact,
                'email' => $request->leader_email,
            ]);
        }

        return response()->json($team->load('leader', 'members', 'event'));
    }

    public function destroy($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        $team->delete(); // cascade deletes team_members
        return response()->json(['message' => 'Team deleted successfully']);
    }
}