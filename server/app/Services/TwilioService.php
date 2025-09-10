<?php

namespace App\Services;

use Exception;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;

class TwilioService
{
    private Client $client;
    private string $fromNumber;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
        $this->fromNumber = config('services.twilio.from');
    }

    public function sendSms(string $to, string $message): bool
    {
        try {
            $this->client->messages->create($to, [
                'from' => $this->fromNumber,
                'body' => $message,
            ]);

            return true;
        } catch (Exception $e) {
            logger()->error('Failed to send SMS', [
                'to' => $to,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function sendVerificationCode(string $phone, string $code): bool
    {
        $message = "Your verification code is: {$code}. This code will expire in 10 minutes.";
        return true;
        // return $this->sendSms($phone, $message);
    }

    public function sendVerificationEmail(string $email, string $code): bool
    {
        // Implement email sending logic here, e.g., using Laravel's Mail facade
        Mail::raw("Your verification code is: {$code}. This code will expire in 10 minutes.", function ($message) use ($email) {
            $message->to($email)->subject('Your Verification Code');
        });
        return true;
    }
}