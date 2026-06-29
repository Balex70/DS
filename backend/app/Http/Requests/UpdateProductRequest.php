<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_raw' => ['sometimes', 'string', 'max:255'],
            'name_processed' => ['sometimes', 'string', 'max:255'],

            'description_raw' => ['sometimes', 'string', 'max:1200'],
            'description_processed' => ['sometimes', 'string', 'max:1200'],
            
            'price' => ['sometimes', 'numeric'],
            'now_price' => ['sometimes', 'numeric'],
            'suggested_price' => ['sometimes', 'numeric'],
            'translations' => ['sometimes', 'array'],
        ];
    }
}
