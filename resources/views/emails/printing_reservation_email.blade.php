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

        h2,
        h3 {
            color: #333 !important;
            margin-bottom: 20px !important;
        }

        .participant-name {
            color: #333 !important;
            font-size: 22px !important;
            font-weight: bold !important;
        }

        .details {
            margin-top: 20px !important;
            color: #333 !important;
            font-size: 16px !important;
        }

        .btn {
            display: inline-block !important;
            background-color: #28a745 !important;
            color: white !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            text-decoration: none !important;
            margin-top: 20px !important;
        }

        .btn:hover {
            background-color: #218838 !important;
        }

        hr {
            margin: 20px 0 !important;
        }

        .header-flex {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 20px !important;
        }

        .header-text {
            text-align: left !important;
            margin-left: 10px !important;
        }

        .header-text .title {
            font-size: 14px !important;
            font-weight: bold !important;
        }

        .header-text .sub {
            font-size: 12px !important;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header-flex">
            <img src="https://ibb.co/MxDpyV5F" alt="Batang Inocencio" class="logo">
            <div class="header-text">
                <div class="title">'Batang Inocencio'</div>
                <div class="sub">Brgy. Inocencio, Trece Martires</div>
            </div>
        </div>

        <h3>Printing Reservation Confirmation</h3>

        <p>Hi, {{ $reservation->name }}!</p>
        <p>You’ve successfully submitted a printing service request. We’ll prepare your file based on the details below.</p>

        <hr>

        <div class="participant-name">{{ $reservation->name }}</div>
        <div class="details">
            <strong>Reservation Date:</strong> {{ \Carbon\Carbon::parse($reservation->reservation_date)->format('F d, Y') }}<br>
            <strong>Address:</strong> {{ $reservation->address }}<br>
            <strong>Contact Number:</strong> {{ $reservation->contact_number }}<br>
            <strong>Paper Size:</strong> {{ $reservation->paper_size }}<br>
            <strong>Color:</strong> {{ $reservation->color }}<br>
            <strong>Purpose:</strong> {{ $reservation->purpose }}<br>
            <strong>Reservation Code:</strong> {{ $reservation->reservation_code }}
        </div>

        <hr>
        <a href="https://batanginocencio.com" class="btn">Visit Our Website</a>
    </div>
</body>

</html>
