<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole($role)) {
            return new JsonResponse([
                'message' => 'No tienes permisos para acceder a este recurso.',
            ], 403);
        }

        return $next($request);
    }
}