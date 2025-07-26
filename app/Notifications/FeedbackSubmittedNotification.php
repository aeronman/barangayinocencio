<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class FeedbackSubmittedNotification extends Notification
{
    use Queueable;

    protected $feedback;

    public function __construct(array $feedback)
    {
        $this->feedback = $feedback;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Feedback Submitted')
            ->view('emails.feedback_notification', [
                'feedback' => $this->feedback
            ]);
    }
}
