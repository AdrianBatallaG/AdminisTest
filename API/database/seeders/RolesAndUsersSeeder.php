<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesAndUsersSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = ['usuario', 'editor', 'admin'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $admin = User::firstOrCreate(
            ['email' => env('DEFAULT_ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('DEFAULT_ADMIN_NAME', 'Administrador'),
                'password' => env('DEFAULT_ADMIN_PASSWORD', 'admin12345'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        $editor = User::firstOrCreate(
            ['email' => env('DEFAULT_EDITOR_EMAIL', 'editor@example.com')],
            [
                'name' => env('DEFAULT_EDITOR_NAME', 'Editor'),
                'password' => env('DEFAULT_EDITOR_PASSWORD', 'editor12345'),
                'email_verified_at' => now(),
            ]
        );
        $editor->syncRoles(['editor']);

        $usuario = User::firstOrCreate(
            ['email' => env('DEFAULT_USER_EMAIL', 'usuario@example.com')],
            [
                'name' => env('DEFAULT_USER_NAME', 'Usuario'),
                'password' => env('DEFAULT_USER_PASSWORD', 'usuario12345'),
                'email_verified_at' => now(),
            ]
        );
        $usuario->syncRoles(['usuario']);
    }
}