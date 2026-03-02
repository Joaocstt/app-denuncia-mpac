<?php

namespace App\Http\Controllers;

use App\Services\DenunciaService;
use App\Http\Requests\StoreDenunciaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ApiDenunciaController extends Controller
{
    protected $denunciaService;

    /**
     * Injeta a camada de serviço necessária.
     */
    public function __construct(DenunciaService $denunciaService)
    {
        $this->denunciaService = $denunciaService;
    }

    /**
     * Cria uma nova denúncia.
     * Valida os campos obrigatórios e delega o salvamento ao serviço.
     * 
     * @param StoreDenunciaRequest $request
     * @return JsonResponse (Status 201)
     */
    public function store(StoreDenunciaRequest $request): JsonResponse
    {
        try {
            $denuncia = $this->denunciaService->store($request);
            return response()->json($denuncia, 201);
        } catch (\Exception $e) {
            Log::error('Erro ao salvar denúncia: ' . $e->getMessage());
            return response()->json(['message' => 'Erro interno ao salvar os dados.'], 500);
        }
    }

    /**
     * Recupera todas as denúncias para o usuário (Geral).
     * 
     * @return JsonResponse (Lista de denúncias)
     */
    public function minhas(Request $request): JsonResponse
    {
        try {
            $deviceId = $request->query('device_id');
            $denuncias = $this->denunciaService->getMyReports($deviceId);
            return response()->json($denuncias);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar denúncias: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao listar denúncias.'], 500);
        }
    }

    /**
     * Recupera as denúncias filtradas para o Mapa (Apenas 'aprovadas').
     * 
     * @return JsonResponse
     */
    public function mapa(): JsonResponse
    {
        try {
            $denuncias = $this->denunciaService->getMapReports();
            return response()->json($denuncias);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar dados do mapa: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao carregar mapa.'], 500);
        }
    }

    /**
     * Endpoint para simular a transcrição de áudio via IA.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function transcribe(Request $request): JsonResponse
    {
        try {
            if (!$request->hasFile('audio')) {
                return response()->json(['message' => 'Arquivo de áudio não fornecido.'], 400);
            }

            // Simulação de delay de processamento (1.5 segundos)
            sleep(1.5);

            return response()->json([
                'text' => 'Transcrição feita com sucesso: ' . $request->file('audio')->getClientOriginalName(),
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            Log::error('Erro na transcrição: ' . $e->getMessage());
            return response()->json(['message' => 'Falha no processamento do áudio.'], 500);
        }
    }
}
