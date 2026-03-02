<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDenunciaRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     * Permitimos por padrão pois a segurança é tratada pelo Middleware.
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Define as regras de validação para os campos da denúncia.
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => 'required|string|min:10',
            'category'    => 'required|string',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
            'media'       => 'nullable',
            'media.*'     => 'file|mimes:jpg,jpeg,png,mp4,m4a|max:30240', // Máximo 30MB
        ];
    }

    /**
     * Mensagens de erro personalizadas para facilitar o feedback no Frontend.
     * 
     * @return array
     */
    public function messages(): array
    {
        return [
            'description.required' => 'A descrição da denúncia é obrigatória.',
            'description.min'      => 'A descrição deve ter pelo menos 10 caracteres para ser válida.',
            'category.required'    => 'Você deve selecionar uma categoria para a denúncia.',
            'media.*.mimes'        => 'Apenas arquivos de imagem (JPG, PNG) ou vídeo (MP4) são aceitos.',
            'media.*.max'          => 'Cada arquivo enviado não pode ultrapassar o limite de 30MB.',
        ];
    }
}
