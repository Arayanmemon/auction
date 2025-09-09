<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,other'],
            'profile_image' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'website' => ['nullable', 'url', 'max:255'],
            'account_type' => ['nullable', 'in:buyer,seller,both'],
        ];
    }

    public function messages(): array
    {
        return [
            'date_of_birth.before' => 'Date of birth must be before today.',
            'gender.in' => 'Gender must be male, female, or other.',
            'bio.max' => 'Bio cannot exceed 1000 characters.',
            'website.url' => 'Please enter a valid website URL.',
            'account_type.in' => 'Account type must be buyer, seller, or both.',
        ];
    }
}
