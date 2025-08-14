<?php

namespace App\Listeners;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendEmailVerificationNotification implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        if (!$event->user->hasVerifiedEmail()) {
            $event->user->notify(new VerifyEmailNotification);
        }
    }
}