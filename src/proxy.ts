import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const forwardedProtocol = request.headers.get('x-forwarded-proto');
    const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';

    if (!isLocalhost && forwardedProtocol === 'http') {
        const httpsUrl = request.nextUrl.clone();
        httpsUrl.protocol = 'https:';
        return NextResponse.redirect(httpsUrl, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
