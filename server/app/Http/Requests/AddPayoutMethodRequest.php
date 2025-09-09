<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddPayoutMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:bank,paypal'],
            'details' => ['required', 'array'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Payout type is required.',
            'details.required' => 'Payout details are required.',
        ];
    }
}