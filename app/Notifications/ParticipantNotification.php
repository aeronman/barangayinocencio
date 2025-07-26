<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ParticipantNotification extends Notification
{
    use Queueable;

    protected $participant;
    protected $event;

    public function __construct($participant, $event)
    {
        $this->participant = $participant;
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('You’ve successfully registered for ' . $this->event->title)
            ->view('emails.participant_email_notification', [
                'participant' => $this->participant,
                'event' => $this->event,
            ]);
    }
}