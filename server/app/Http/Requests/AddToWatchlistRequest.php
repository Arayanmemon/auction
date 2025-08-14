<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddToWatchlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'auction_id' => ['required', 'integer', 'exists:auctions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'auction_id.required' => 'Auction ID is required.',
            'auction_id.exists' => 'The selected auction does not exist.',
        ];
    }
}
