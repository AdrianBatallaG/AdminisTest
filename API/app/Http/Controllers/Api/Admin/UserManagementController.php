<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->with('roles')
            ->latest()
            ->get()
            ->map(fn (User $user) => $this->formatUser($user));

        return response()->json([
            'users' => $users,
        ]);
    }

    public function roles(): JsonResponse
    {
        return response()->json([
            'roles' => ['usuario', 'editor', 'admin'],
        ]);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['usuario', 'editor', 'admin'])],
        ]);

        $user->syncRoles([$validated['role']]);
        $user->refresh()->load('roles');

        return response()->json([
            'message' => 'Rol actualizado correctamente.',
            'user' => $this->formatUser($user),
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
        ];
    }
}