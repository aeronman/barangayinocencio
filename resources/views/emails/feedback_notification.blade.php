<!DOCTYPE html>
<html>
<head>
    <style>
        * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }
        body {
            font-family: Arial, sans-serif !important;
            background-color: #f9f9f9 !important;
            padding: 20px !important;
        }
        .container {
            background: white !important;
            padding: 30px !important;
            max-width: 600px !important;
            margin: auto !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05) !important;
            text-align: center !important;
        }
        .logo {
            width: 80px !important;
            margin-bottom: 20px !important;
        }
        .title {
            font-size: 22px !important;
            font-weight: bold !important;
            margin-bottom: 10px !important;
            color: #333 !important;
        }
        .details {
            margin-top: 10px !important;
            color: #333 !important;
            font-size: 16px !important;
            text-align: left !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://ibb.co/MxDpyV5F" alt="Batang Inocencio" class="logo">
        <div class="title">New Feedback Received</div>

        <div class="details">
            <p><strong>Name:</strong> {{ $feedback['name'] }}</p>
            <p><strong>Email:</strong> {{ $feedback['email'] }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ $feedback['message'] }}</p>
        </div>
    </div>
</body>
</html>
