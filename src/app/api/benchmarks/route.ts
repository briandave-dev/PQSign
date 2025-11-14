import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const benchmarks = {
  x86: {
    keyGeneration: [
      { algorithm: "Dilithium", time: 245 },
      { algorithm: "RSA", time: 856 },
      { algorithm: "ECDSA", time: 12 }
    ],
    signing: [
      { algorithm: "Dilithium", time: 134 },
      { algorithm: "RSA", time: 45 },
      { algorithm: "ECDSA", time: 8 }
    ],
    verification: [
      { algorithm: "Dilithium", time: 156 },
      { algorithm: "RSA", time: 5 },
      { algorithm: "ECDSA", time: 23 }
    ],
    keySizes: [
      { algorithm: "Dilithium", publicKey: 1952, secretKey: 4000 },
      { algorithm: "RSA", publicKey: 398, secretKey: 2743 },
      { algorithm: "ECDSA", publicKey: 65, secretKey: 32 }
    ],
    signatureSizes: [
      { algorithm: "Dilithium", size: 2420 },
      { algorithm: "RSA", size: 384 },
      { algorithm: "ECDSA", size: 64 }
    ]
  },
  arm: {
    keyGeneration: [
      { algorithm: "Dilithium", time: 312 },
      { algorithm: "RSA", time: 1124 },
      { algorithm: "ECDSA", time: 18 }
    ],
    signing: [
      { algorithm: "Dilithium", time: 178 },
      { algorithm: "RSA", time: 62 },
      { algorithm: "ECDSA", time: 12 }
    ],
    verification: [
      { algorithm: "Dilithium", time: 201 },
      { algorithm: "RSA", time: 8 },
      { algorithm: "ECDSA", time: 31 }
    ],
    keySizes: [
      { algorithm: "Dilithium", publicKey: 1952, secretKey: 4000 },
      { algorithm: "RSA", publicKey: 398, secretKey: 2743 },
      { algorithm: "ECDSA", publicKey: 65, secretKey: 32 }
    ],
    signatureSizes: [
      { algorithm: "Dilithium", size: 2420 },
      { algorithm: "RSA", size: 384 },
      { algorithm: "ECDSA", size: 64 }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    console.log('Benchmarks data:', benchmarks); // Check if data loads
    const architecture = request.nextUrl.searchParams.get('arch') || 'x86';
    console.log('Architecture:', architecture); // Check parameter
    
    const data = benchmarks[architecture as keyof typeof benchmarks];
    console.log('Retrieved data:', data); // Check if data is retrieved

    if (!data) {
      return NextResponse.json({ error: 'Invalid architecture' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Actual error:', error); // See the real error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}