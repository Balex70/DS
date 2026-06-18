<?php

namespace App\Http\Requests;

use App\Enums\OrderDsStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
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
                    OrderStatusEnum::CREATED,
                    OrderStatusEnum::PROCESSING,
                    OrderStatusEnum::SHIPPED,
                    OrderStatusEnum::DELIVERED,
                    OrderStatusEnum::CANCELED,
                    OrderStatusEnum::REFUNDED,
                ]),
            ],

            // Dropshipping provider status (CJ sync)
            'ds_status' => [
                'sometimes',
                'string',
                Rule::in([
                    OrderDsStatusEnum::CREATED,
                    OrderDsStatusEnum::UNPAID,
                    OrderDsStatusEnum::PROCESSING,
                    OrderDsStatusEnum::SHIPPED,
                    OrderDsStatusEnum::DELIVERED,
                    OrderDsStatusEnum::CANCELLED,
                    OrderDsStatusEnum::FAILED,
                ]),
            ],

            // Tracking updates
            'ds_tracking_number' => ['sometimes', 'nullable', 'string', 'max:255'],

            // Flags
            'sent_to_ds_provider' => ['sometimes', 'boolean'],
            'sent_to_ds_provider_at' => ['sometimes', 'nullable', 'date'],
            'shipped_at' => ['sometimes', 'nullable', 'date'],
            'delivered_at' => ['sometimes', 'nullable', 'date'],

            // Payment status (admin/system only)
            'payment_status' => [
                'sometimes',
                'string',
                Rule::in([
                    PaymentStatusEnum::PENDING,
                    PaymentStatusEnum::PAID,
                    PaymentStatusEnum::FAILED,
                    PaymentStatusEnum::REFUNDED,
                    PaymentStatusEnum::CANCELED,
                ]),
            ],

            // Notes (safe editable field)
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
