<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
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
            // Internal order status (admin/system only)
            'status' => [
                'sometimes',
                'string',
                Rule::in([
                    'pending',
                    'paid',
                    'processing',
                    'fulfilled',
                    'canceled',
                    'refunded',
                ]),
            ],

            // Dropshipping provider status (CJ sync)
            'ds_status' => [
                'sometimes',
                'string',
                Rule::in([
                    'pending',
                    'paid',
                    'processing',
                    'shipped',
                    'delivered',
                    'failed',
                ]),
            ],

            // Tracking updates
            'ds_tracking_number' => ['sometimes', 'nullable', 'string', 'max:255'],

            // Flags
            'sent_to_ds_provider' => ['sometimes', 'boolean'],
            'sent_to_ds_provider_at' => ['sometimes', 'nullable', 'date'],
            'fulfilled_at' => ['sometimes', 'nullable', 'date'],

            // Payment status (admin/system only)
            'payment_status' => [
                'sometimes',
                'string',
                Rule::in(['unpaid', 'paid', 'failed', 'refunded']),
            ],

            // Notes (safe editable field)
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
