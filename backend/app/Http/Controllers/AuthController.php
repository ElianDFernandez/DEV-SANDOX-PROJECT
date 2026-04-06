<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'mensaje' => 'Las credenciales son incorrectas.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'mensaje' => '¡Login exitoso!',
            'access_token' => $token,
            'usuario' => $user,
            'roles' => $user->getRoleNames()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'mensaje' => 'Sesión cerrada correctamente'
        ]);
    }

    public function perfil(Request $request)
    {
        return response()->json([
            'usuario' => $request->user(),
            'roles' => $request->user()->getRoleNames()
        ]);
    }

    public function actualizarPerfil(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'newPassword' => 'nullable|string|min:8',
        ]);

        if ($request->filled('newPassword')) {
            if (!$request->filled('currentPassword')) {
                return response()->json([
                    'mensaje' => 'Debes ingresar tu contraseña actual para cambiarla.'
                ], 422);
            }
            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json([
                    'mensaje' => 'La contraseña actual es incorrecta.'
                ], 422);
            }
            $user->password = Hash::make($request->newPassword);
        }

        $user->nombre = $request->nombre;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'mensaje' => 'Perfil actualizado correctamente.',
            'usuario' => $user
        ]);
    }
}