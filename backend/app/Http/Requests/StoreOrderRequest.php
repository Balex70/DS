<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
            // Optional customer (guest checkout allowed)
            'customer_id' => ['nullable', 'integer', 'exists:customers,id'],

            // Currency / payment
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_method' => ['nullable', 'string', Rule::in(['stripe', 'wayforpay', 'paypal', 'cod', 'bank_transfer'])],

            // Shipping info (required)
            'shipping_full_name' => ['required', 'string', 'max:255'],
            'shipping_phone' => ['nullable', 'string', 'max:50'],
            'shipping_email' => ['required', 'email', 'max:255'],

            'shipping_address_line1' => ['required', 'string', 'max:255'],
            'shipping_address_line2' => ['nullable', 'string', 'max:255'],
            'shipping_city' => ['required', 'string', 'max:255'],
            'shipping_state' => ['nullable', 'string', 'max:255'],
            'shipping_postal_code' => ['nullable', 'string', 'max:50'],
            'shipping_country' => ['required', 'string', 'size:2'],

            // Optional totals (you may also recalculate in backend)
            'subtotal' => ['nullable', 'integer', 'min:0'],
            'shipping_cost' => ['nullable', 'integer', 'min:0'],
            'shipping_method' => ['nullable', 'string', 'max:255'],
            'total' => ['nullable', 'integer', 'min:0'],

            // Notes
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
