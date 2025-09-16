<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class OutbidNotification extends Notification
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
        return ['database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('You have been outbid!')
            ->line("You have been outbid on auction: {$this->auction->title}.")
            ->line("Your bid: \${$this->bidAmount}")
            ->action('View Auction', url("/auction/{$this->auction->id}"))
            ->line('Place a higher bid to win!');
    }

    public function toArray($notifiable)
    {
        return [
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'bid_amount' => $this->bidAmount,
            'type' => 'outbid',
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'You have been outbid!',
            'body' => "You have been outbid on auction: {$this->auction->title}. Your bid: \${$this->bidAmount}",
            'auction_id' => $this->auction->id,
            'auction_title' => $this->auction->title,
            'bid_amount' => $this->bidAmount,
            'type' => 'outbid',
        ];
    }
}
