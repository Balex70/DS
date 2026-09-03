@extends('mails.layouts.app')

@section('content')

<h2 style="margin-top:0;">
    {{ __('mails.order_created.greeting', ['name' => $fullName]) }}
</h2>

<p>
    {{ __('mails.order_created.created') }}
</p>
<p>
    {{ __('mails.order_created.order_number') }}: <strong>{{ $orderNumber }}</strong>.
</p>

<h2 style="margin-top:32px;">
    {{ __('mails.order_created.order_items') }}:
</h2>
<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="border-collapse:collapse;margin-top:24px;"
>
    <thead>
        <tr>
            <th
                align="left"
                style="padding:10px 0;border-bottom:1px solid #dddddd;"
            >
                {{ __('mails.order_created.product') }}
            </th>

            <th
                align="center"
                style="padding:10px 0;border-bottom:1px solid #dddddd;"
            >
                {{ __('mails.order_created.quantity') }}
            </th>

            <th
                align="right"
                style="padding:10px 0;border-bottom:1px solid #dddddd;"
            >
                {{ __('mails.order_created.price') }}
            </th>
        </tr>
    </thead>

    <tbody>
        @foreach ($items as $item)
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #eeeeee;">
                    {{ $item->translated_title }}
                </td>

                <td align="center" style="padding:12px 0;border-bottom:1px solid #eeeeee;">
                    {{ $item->quantity }}
                </td>

                <td align="right" style="padding:12px 0;border-bottom:1px solid #eeeeee;">
                    ${{ number_format($item->price / 100, 2) }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="margin-top:20px;"
>
    <tr>
        <td align="right">
            {{ __('mails.order_created.subtotal') }}:
        </td>
        <td align="right" width="100" style="padding-left:20px;">
            ${{ number_format($subtotal / 100, 2) }}
        </td>
    </tr>

    <tr>
        <td align="right">
            {{ __('mails.order_created.shipping') }}:
        </td>
        <td align="right" style="padding-left:20px;">
            ${{ number_format($shipping_cost / 100, 2) }}
        </td>
    </tr>

    <tr>
        <td align="right" style="padding-top:10px;">
            <strong>{{ __('mails.order_created.total') }}:</strong>
        </td>
        <td align="right" style="padding-top:10px;padding-left:20px;">
            <strong>${{ number_format($total / 100, 2) }}</strong>
        </td>
    </tr>
</table>

<p>
    {{ __('mails.order_created.thanks') }},<br>
    {{ config('app.name') }}
</p>

@endsection
