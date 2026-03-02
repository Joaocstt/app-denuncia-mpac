<?php

namespace App\Services;

use App\Models\Denuncia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DenunciaService
{
    /**
     * Processa a criação de uma nova denúncia.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \App\Models\Denuncia
     */
    public function store(Request $request): Denuncia
    {
        $data = $request->except(['media', 'location']);

        // Persiste o ID do dispositivo para filtrar denúncias do mesmo usuário
        if ($request->has('device_id')) {
            $data['device_id'] = $request->input('device_id');
        }

        // Trata os dados de localização enviados via JSON ou campos diretos
        if ($request->has('location')) {
            $locationData = is_string($request->input('location'))
                ? json_decode($request->input('location'), true)
                : $request->input('location');

            if (is_array($locationData)) {
                $data['latitude'] = $locationData['latitude'] ?? null;
                $data['longitude'] = $locationData['longitude'] ?? null;
            }
        }

        // Processa o upload de arquivos (fotos/vídeos) no disco público
        $mediaUrls = [];
        if ($request->hasFile('media')) {
            $files = is_array($request->file('media')) ? $request->file('media') : [$request->file('media')];
            foreach ($files as $file) {
                $path = $file->store('uploads', 'public');
                $mediaUrls[] = url('/storage/' . $path);
            }
        }
        $data['mediaUrls'] = $mediaUrls;

        // Define o status inicial se não for enviado
        if (empty($data['status'])) {
            $data['status'] = 'pendente';
        }

        return Denuncia::create($data);
    }

    /**
     * Retorna a lista de denúncias de um dispositivo específico.
     * 
     * @param string|null $deviceId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMyReports($deviceId = null)
    {
        $query = Denuncia::query();

        if ($deviceId) {
            $query->where('device_id', $deviceId);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Retorna denúncias aprovadas com coordenadas para o mapa.
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMapReports()
    {
        return Denuncia::whereIn('status', ['aprovada', 'aprovado'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();
    }
}