<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SocialProfileController extends Controller
{
    /**
     * Display the logged-in user's social profile.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('profile', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'bio' => $user->bio,
                'location' => $user->location,
                'avatar_path' => $user->avatar_path,
                'cover_path' => $user->cover_path,
            ],
        ]);
    }

    /**
     * Update the logged-in user's social profile.
     */

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'nullable',
                'string',
                'alpha_dash',
                'max:30',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'bio' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'cover' => ['nullable', 'image', 'max:5120'],
        ]);

        $oldAvatar = $user->avatar_path;
        $oldCover = $user->cover_path;

        $user->name = $validated['name'];
        $user->username = $validated['username'] ?? null;
        $user->bio = $validated['bio'] ?? null;
        $user->location = $validated['location'] ?? null;

        if ($request->hasFile('avatar')) {
            $user->avatar_path = $request->file('avatar')
                ->store('avatars', 'public');
        }

        if ($request->hasFile('cover')) {
            $user->cover_path = $request->file('cover')
                ->store('covers', 'public');
        }

        $user->save();

        // Delete old images only after saving the new paths.
        if ($request->hasFile('avatar') && $oldAvatar) {
            Storage::disk('public')->delete($oldAvatar);
        }

        if ($request->hasFile('cover') && $oldCover) {
            Storage::disk('public')->delete($oldCover);
        }

        return back()->with('success', 'Profile updated successfully!');
    }

}
