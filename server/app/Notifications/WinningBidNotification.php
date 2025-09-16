<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WinningBidNotification extends Notification
{
    use Queueable;

    public $auction;
    public $bidAmount;

    public function __construct($auction, $bidAmount)
    {
        $this->auction = $auction;
        $this->bidAmount = $bidAmount;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Congratulations! You won the auction')
            ->line("You have won the auction: {$this->auction->title}.")
            ->line("Winning bid: \${$this->bidAmount}")
            ->action('View Auction', url("/auction/{$this->auction->id}"))
            ->line('Thank you for participating!');
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'bid_amount' => $this->bidAmount,
            'type' => 'winning_bid',
        ];
    }
}
