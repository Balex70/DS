<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;color:#333333;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
    <tr>
        <td align="center">

            {{-- Logo --}}
            <table role="presentation" width="600" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding-bottom:24px;">
                        <a href="{{ config('app.url') }}">
                            <img
                                src="{{ config('app.url') }}/logo.svg"
                                alt="{{ config('app.name') }}"
                                style="max-height:60px;"
                            >
                        </a>
                    </td>
                </tr>
            </table>

            {{-- Card --}}
            <table
                role="presentation"
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="background:#ffffff;border-radius:8px;"
            >
                <tr>
                    <td style="padding:40px;">
                        @yield('content')
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>
