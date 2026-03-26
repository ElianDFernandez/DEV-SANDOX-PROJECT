<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleAndAdminSeeder extends Seeder
{
    public function run(): void
    {
        $roleAdmin = Role::create(['name' => 'Administrador']);
        $admin = User::create([
            'nombre'   => 'Administrador',
            'email'    => 'admin@admin.com',
            'password' => Hash::make('elian'),
        ]);
        $admin->assignRole($roleAdmin);
    }
}
