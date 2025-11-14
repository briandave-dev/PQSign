import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { algorithm, message } = body;

    const signatures = {
      dilithium: {
        algorithm: 'CRYSTALS-Dilithium',
        message: message || 'Sample message',
        signature:
          '308201880206...truncated...8b7c3d9e2f5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
        signatureSize: 2420,
        signingTime: 134,
        timestamp: new Date().toISOString(),
      },
      rsa: {
        algorithm: 'RSA-3072',
        message: message || 'Sample message',
        signature:
          '3082018006...truncated...8b7c3d9e2f5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
        signatureSize: 384,
        signingTime: 45,
        timestamp: new Date().toISOString(),
      },
      ecdsa: {
        algorithm: 'ECDSA-P256',
        message: message || 'Sample message',
        signature:
          '30440220...truncated...8b7c3d9e2f5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
        signatureSize: 64,
        signingTime: 8,
        timestamp: new Date().toISOString(),
      },
    };

    const sig = signatures[algorithm as keyof typeof signatures];

    if (!sig) {
      return NextResponse.json({ error: 'Invalid algorithm' }, { status: 400 });
    }

    return NextResponse.json(sig);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
