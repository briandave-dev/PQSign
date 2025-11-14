import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { algorithm } = body;

    const mockKeys = {
      dilithium: {
        algorithm: 'CRYSTALS-Dilithium',
        securityLevel: 'Level 3',
        publicKey:
          '308201220300...truncated...8b7c3d9e2f5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
        secretKey:
          '308204e0020100...truncated...a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        publicKeySize: 1952,
        secretKeySize: 4000,
        timestamp: new Date().toISOString(),
      },
      rsa: {
        algorithm: 'RSA-3072',
        securityLevel: 'Level 3',
        publicKey:
          '3082016a0282010100...truncated...8b7c3d9e2f5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
        secretKey:
          '308204a20201000282...truncated...a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        publicKeySize: 398,
        secretKeySize: 2743,
        timestamp: new Date().toISOString(),
      },
      ecdsa: {
        algorithm: 'ECDSA-P256',
        securityLevel: 'Level 1',
        publicKey:
          '0448f5af4f...truncated...5a1b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
        secretKey:
          'e54726e77f...truncated...e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        publicKeySize: 65,
        secretKeySize: 32,
        timestamp: new Date().toISOString(),
      },
    };

    const key = mockKeys[algorithm as keyof typeof mockKeys];

    if (!key) {
      return NextResponse.json({ error: 'Invalid algorithm' }, { status: 400 });
    }

    return NextResponse.json(key);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
