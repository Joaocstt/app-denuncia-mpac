<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-API-Token');
        $expectedToken = env('API_ACCESS_TOKEN', 'mpac');

        if (!$token || $token !== $expectedToken) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acesso negado. Token de API inválido ou ausente.'
            ], 401);
        }

        return $next($request);
    }
}
