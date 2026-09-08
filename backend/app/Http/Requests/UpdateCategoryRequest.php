<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('translations') && is_string($this->translations)) {
            $this->merge([
                'translations' => json_decode($this->translations, true),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['sometimes', 'max:255'],
            "description" => ['sometimes', 'max:1255'],
            "image" => ['nullable', 'image', 'max:2048'],
            "translations" => ['sometimes', 'array'],
            "meta_title" => ['sometimes', 'max:255'],
            "meta_description" => ['sometimes', 'max:1255'],
        ];
    }
}
