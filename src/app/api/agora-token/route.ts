// app/api/agora-token/route.ts
import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');
    const uid = searchParams.get('uid');

    if (!channel) {
        return NextResponse.json(
            { error: 'Channel name is required' },
            { status: 400 }
        );
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
        return NextResponse.json(
            { error: 'Agora credentials not configured' },
            { status: 500 }
        );
    }

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const role = RtcRole.PUBLISHER;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channel,
        uid ? parseInt(uid) : 0,
        role,
        privilegeExpiredTs
    );

    return NextResponse.json({ token });
}