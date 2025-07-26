<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    {{-- <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://trecebatanginocencio.site/" /> --}}

    <title>Batang Inocencio</title>
    <link rel="icon" type="image/png" href="{{ asset('images/Logo.png') }}">

    @viteReactRefresh
    @vite('resources/js/main.jsx')


<body>
    <div id="root"></div>
</body>

</html>
