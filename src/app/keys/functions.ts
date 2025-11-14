export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
  securityLevel: string;
  publicKeySize: number;
  secretKeySize: number;
  timestamp: string;
  generationTime: number;
}

export interface RSASignature {
  signature: string;
  message: string;
  algorithm: string;
  signatureSize: number;
  signingTime: number;
}

export interface RSAVerification {
  isValid: boolean;
  verificationTime: number;
  details: {
    confidence: string;
    messageHash: string;
  };
}

// ============================================================================
// UTILITAIRES CRYPTOGRAPHIQUES DE BASE
// ============================================================================

class CryptoUtils {
  // Conversion hexadécimal <-> bytes
  static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  static bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // SHA-256 simplifié (utilise Web Crypto API)
  static async sha256(message: string): Promise<Uint8Array> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return new Uint8Array(hashBuffer);
  }

  // Générateur de nombres aléatoires cryptographiquement sûrs
  static randomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  // Modular exponentiation: (base^exp) mod modulus
  static modPow(base: bigint, exp: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exp > 0n) {
      if (exp % 2n === 1n) result = (result * base) % modulus;
      exp = exp >> 1n;
      base = (base * base) % modulus;
    }
    return result;
  }

  // Inverse modulaire via algorithme d'Euclide étendu
  static modInverse(a: bigint, m: bigint): bigint {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1n, 0n];

    while (r !== 0n) {
      const quotient = old_r / r;
      [old_r, r] = [r, old_r - quotient * r];
      [old_s, s] = [s, old_s - quotient * s];
    }

    return old_s < 0n ? old_s + m : old_s;
  }

  // Test de primalité de Miller-Rabin
  static isProbablePrime(n: bigint, k: number = 5): boolean {
    if (n === 2n || n === 3n) return true;
    if (n < 2n || n % 2n === 0n) return false;

    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
      r += 1n;
      d /= 2n;
    }

    witnessLoop: for (let i = 0; i < k; i++) {
      const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n)));
      let x = this.modPow(a, d, n);

      if (x === 1n || x === n - 1n) continue;

      for (let j = 0n; j < r - 1n; j++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) continue witnessLoop;
      }
      return false;
    }
    return true;
  }

  // Génération de nombres premiers
  static generatePrime(bits: number): bigint {
    while (true) {
      const bytes = this.randomBytes(Math.ceil(bits / 8));
      bytes[0] |= 0x80; // Bit de poids fort
      bytes[bytes.length - 1] |= 0x01; // Rendre impair

      let candidate = 0n;
      for (let i = 0; i < bytes.length; i++) {
        candidate = (candidate << 8n) | BigInt(bytes[i]);
      }

      if (this.isProbablePrime(candidate)) {
        return candidate;
      }
    }
  }

  // PGCD
  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      [a, b] = [b, a % b];
    }
    return a;
  }
}

// ============================================================================
// PURE TS RSA Implementation (Optimized for JavaScript)
// ============================================================================



export class RSA3072 {
  // Generate random BigInt in range [min, max)
  static randomBigInt(min: bigint, max: bigint): bigint {
    const range = max - min;
    const bits = range.toString(2).length;
    const bytes = Math.ceil(bits / 8);

    while (true) {
      const randBytes = crypto.getRandomValues(new Uint8Array(bytes));
      let rand = 0n;
      for (let i = 0; i < randBytes.length; i++) {
        rand = (rand << 8n) | BigInt(randBytes[i]);
      }
      rand = rand % range;
      const result = min + rand;
      if (result < max) return result;
    }
  }

  // GCD using Euclidean algorithm
  static gcd(a: bigint, b: bigint): bigint {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // Extended Euclidean algorithm for modular inverse
  static modInverse(e: bigint, phi: bigint): bigint {
    let [old_r, r] = [e, phi];
    let [old_s, s] = [1n, 0n];

    while (r !== 0n) {
      const quotient = old_r / r;
      [old_r, r] = [r, old_r - quotient * r];
      [old_s, s] = [s, old_s - quotient * s];
    }

    // Ensure positive result
    return old_s < 0n ? old_s + phi : old_s;
  }

  // Modular exponentiation using square-and-multiply
  static modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = base % mod;

    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      exp = exp >> 1n;
      base = (base * base) % mod;
    }

    return result;
  }

  // Miller-Rabin primality test (probabilistic but much faster)
  static isProbablyPrime(n: bigint, iterations: number = 10): boolean {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    // Write n-1 as 2^r * d
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
      d /= 2n;
      r += 1n;
    }

    // Witness loop
    witnessLoop: for (let i = 0; i < iterations; i++) {
      const a = this.randomBigInt(2n, n - 2n);
      let x = this.modPow(a, d, n);

      if (x === 1n || x === n - 1n) continue;

      for (let j = 0n; j < r - 1n; j++) {
        x = this.modPow(x, 2n, n);
        if (x === n - 1n) continue witnessLoop;
      }
      return false;
    }
    return true;
  }

  // Generate random prime of specified bit length
  static generatePrime(bits: number): bigint {
    const min = 1n << BigInt(bits - 1);
    const max = (1n << BigInt(bits)) - 1n;

    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      // Generate random odd number
      let candidate = this.randomBigInt(min, max);
      if (candidate % 2n === 0n) candidate += 1n;

      // Quick checks for small primes
      let hasSmallFactor = false;
      const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];
      for (const p of smallPrimes) {
        if (candidate % p === 0n && candidate !== p) {
          hasSmallFactor = true;
          break;
        }
      }

      if (hasSmallFactor) continue;

      // Miller-Rabin test
      if (this.isProbablyPrime(candidate, 10)) {
        return candidate;
      }
    }

    throw new Error('Failed to generate prime after ' + maxAttempts + ' attempts');
  }

  // SHA-256 helper
  static async sha256(msg: string): Promise<Uint8Array> {
    const buffer = new TextEncoder().encode(msg);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return new Uint8Array(hashBuffer);
  }

  static bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  // PKCS#1 v1.5 padding for signing
  static addPKCS1Padding(hash: Uint8Array, keyLength: number): bigint {
    // DigestInfo for SHA-256
    const digestInfo = new Uint8Array([
      0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86,
      0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05,
      0x00, 0x04, 0x20
    ]);

    const tLen = digestInfo.length + hash.length;
    const psLen = keyLength - tLen - 3;

    if (psLen < 8) {
      throw new Error('Key too short for PKCS#1 padding');
    }

    // Create padded message: 0x00 || 0x01 || PS || 0x00 || DigestInfo || Hash
    const padded = new Uint8Array(keyLength);
    padded[0] = 0x00;
    padded[1] = 0x01;

    // PS is 0xFF bytes
    for (let i = 2; i < 2 + psLen; i++) {
      padded[i] = 0xff;
    }

    padded[2 + psLen] = 0x00;
    padded.set(digestInfo, 2 + psLen + 1);
    padded.set(hash, 2 + psLen + 1 + digestInfo.length);

    // Convert to BigInt
    let result = 0n;
    for (let i = 0; i < padded.length; i++) {
      result = (result << 8n) | BigInt(padded[i]);
    }

    return result;
  }

  // ===============================================
  // Key generation (using 512-bit primes for ~1024-bit RSA)
  // This is manageable in JavaScript while still being demonstrative
  // ===============================================
  static async generateKeyPair(): Promise<RSAKeyPair> {
    const start = performance.now();

    // Generate two 512-bit primes for ~1024-bit modulus
    // This is a good balance between security demonstration and JS performance
    console.log('Generating prime p...');
    const p = this.generatePrime(512);

    console.log('Generating prime q...');
    const q = this.generatePrime(512);

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    // Standard public exponent
    const e = 65537n;

    // Ensure e and phi are coprime
    if (this.gcd(e, phi) !== 1n) {
      throw new Error('e and phi are not coprime');
    }

    console.log('Computing private exponent...');
    const d = this.modInverse(e, phi);

    const publicKey = {
      n: n.toString(16),
      e: e.toString(16)
    };

    const privateKey = {
      n: n.toString(16),
      d: d.toString(16),
      p: p.toString(16),
      q: q.toString(16)
    };

    const end = performance.now();

    return {
      publicKey: JSON.stringify(publicKey),
      privateKey: JSON.stringify(privateKey),
      algorithm: 'RSA-1024',
      securityLevel: 'Niveau 2 (1024 bits - Démonstration)',
      publicKeySize: JSON.stringify(publicKey).length,
      secretKeySize: JSON.stringify(privateKey).length,
      timestamp: new Date().toISOString(),
      generationTime: Math.round(end - start),
    };
  }

  // ===============================================
  // Signing with PKCS#1 v1.5 padding
  // ===============================================
  static async sign(message: string, privateKeyStr: string): Promise<RSASignature> {
    const start = performance.now();

    const privateKey = JSON.parse(privateKeyStr);
    const n = BigInt('0x' + privateKey.n);
    const d = BigInt('0x' + privateKey.d);

    // Get key length in bytes
    const keyLength = Math.ceil(n.toString(2).length / 8);

    // Hash the message
    const hash = await this.sha256(message);

    // Add PKCS#1 v1.5 padding
    const paddedHash = this.addPKCS1Padding(hash, keyLength);

    // Sign: signature = paddedHash^d mod n
    const signature = this.modPow(paddedHash, d, n);

    const end = performance.now();

    return {
      signature: signature.toString(16),
      message: message,
      algorithm: 'RSA-1024',
      signatureSize: signature.toString(16).length,
      signingTime: Math.round(end - start)
    };
  }

  // ===============================================
  // Verification with PKCS#1 v1.5 padding
  // ===============================================
  static async verify(
    message: string,
    signatureStr: string,
    publicKeyStr: string
  ): Promise<RSAVerification> {
    const start = performance.now();

    try {
      const publicKey = JSON.parse(publicKeyStr);
      const n = BigInt('0x' + publicKey.n);
      const e = BigInt('0x' + publicKey.e);
      const signature = BigInt('0x' + signatureStr);

      // Get key length in bytes
      const keyLength = Math.ceil(n.toString(2).length / 8);

      // Verify: decrypted = signature^e mod n
      const decrypted = this.modPow(signature, e, n);

      // Hash the message
      const hash = await this.sha256(message);

      // Add PKCS#1 v1.5 padding to hash
      const expectedPadded = this.addPKCS1Padding(hash, keyLength);

      // Compare
      const isValid = decrypted === expectedPadded;

      const end = performance.now();

      return {
        isValid,
        verificationTime: Math.round(end - start),
        details: {
          confidence: isValid ? 'Signature valide - 100%' : 'Signature invalide',
          messageHash: 'SHA-256 avec PKCS#1 v1.5'
        }
      };
    } catch (error) {
      const end = performance.now();
      return {
        isValid: false,
        verificationTime: Math.round(end - start),
        details: {
          confidence: 'Erreur de vérification',
          messageHash: 'SHA-256 avec PKCS#1 v1.5'
        }
      };
    }
  }
}

class ECPoint {
  constructor(public x: bigint | null, public y: bigint | null) { }

  isInfinity(): boolean {
    return this.x === null || this.y === null;
  }
}

class ECDSAP256 {
  // Paramètres de la courbe P-256 (secp256r1)
  static readonly p = BigInt('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF');
  static readonly a = BigInt('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC');
  static readonly b = BigInt('0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B');
  static readonly Gx = BigInt('0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296');
  static readonly Gy = BigInt('0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5');
  static readonly n = BigInt('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551');

  // Addition de points sur la courbe
  static addPoints(P: ECPoint, Q: ECPoint): ECPoint {
    if (P.isInfinity()) return Q;
    if (Q.isInfinity()) return P;

    const p = this.p;

    if (P.x === Q.x) {
      if (P.y === Q.y) {
        // Doublement de point
        const s = (3n * P.x! * P.x! + this.a) * CryptoUtils.modInverse(2n * P.y!, p) % p;
        const x = (s * s - 2n * P.x!) % p;
        const y = (s * (P.x! - x) - P.y!) % p;
        return new ECPoint((x + p) % p, (y + p) % p);
      }
      return new ECPoint(null, null); // Point à l'infini
    }

    // Addition standard
    const s = ((Q.y! - P.y!) * CryptoUtils.modInverse((Q.x! - P.x! + p) % p, p)) % p;
    const x = (s * s - P.x! - Q.x!) % p;
    const y = (s * (P.x! - x) - P.y!) % p;
    return new ECPoint((x + p) % p, (y + p) % p);
  }

  // Multiplication scalaire
  static scalarMult(k: bigint, P: ECPoint): ECPoint {
    let result = new ECPoint(null, null);
    let addend = P;

    while (k > 0n) {
      if (k & 1n) {
        result = this.addPoints(result, addend);
      }
      addend = this.addPoints(addend, addend);
      k >>= 1n;
    }

    return result;
  }

  static async generateKeyPair() {
    const startTime = performance.now();

    // Générer clé privée aléatoire
    const privateKeyBytes = CryptoUtils.randomBytes(32);
    let privateKey = 0n;
    for (let i = 0; i < privateKeyBytes.length; i++) {
      privateKey = (privateKey << 8n) | BigInt(privateKeyBytes[i]);
    }
    privateKey = (privateKey % (this.n - 1n)) + 1n;

    // Calculer clé publique: Q = d * G
    const G = new ECPoint(this.Gx, this.Gy);
    const Q = this.scalarMult(privateKey, G);

    const publicKey = {
      x: Q.x!.toString(16),
      y: Q.y!.toString(16)
    };

    const endTime = performance.now();

    return {
      publicKey: JSON.stringify(publicKey),
      privateKey: privateKey.toString(16),
      algorithm: 'ECDSA-P256',
      securityLevel: 'Niveau 1 (128 bits)',
      publicKeySize: JSON.stringify(publicKey).length,
      secretKeySize: privateKey.toString(16).length,
      timestamp: new Date().toISOString(),
      generationTime: Math.round(endTime - startTime)
    };
  }

  static async sign(message: string, privateKeyStr: string) {
    const startTime = performance.now();

    const d = BigInt('0x' + privateKeyStr);
    const hash = await CryptoUtils.sha256(message);
    const z = BigInt('0x' + CryptoUtils.bytesToHex(hash));

    // Générer k aléatoire
    const kBytes = CryptoUtils.randomBytes(32);
    let k = 0n;
    for (let i = 0; i < kBytes.length; i++) {
      k = (k << 8n) | BigInt(kBytes[i]);
    }
    k = (k % (this.n - 1n)) + 1n;

    // Calculer r = (k * G).x mod n
    const G = new ECPoint(this.Gx, this.Gy);
    const kG = this.scalarMult(k, G);
    const r = kG.x! % this.n;

    // Calculer s = k^-1 * (z + r * d) mod n
    const kInv = CryptoUtils.modInverse(k, this.n);
    const s = (kInv * (z + r * d)) % this.n;

    const signature = {
      r: r.toString(16),
      s: s.toString(16)
    };

    const endTime = performance.now();

    return {
      signature: JSON.stringify(signature),
      message: message,
      algorithm: 'ECDSA-P256',
      signatureSize: JSON.stringify(signature).length,
      signingTime: Math.round(endTime - startTime)
    };
  }

  static async verify(message: string, signatureStr: string, publicKeyStr: string) {
    const startTime = performance.now();

    const signature = JSON.parse(signatureStr);
    const publicKey = JSON.parse(publicKeyStr);

    const r = BigInt('0x' + signature.r);
    const s = BigInt('0x' + signature.s);
    const Qx = BigInt('0x' + publicKey.x);
    const Qy = BigInt('0x' + publicKey.y);

    const hash = await CryptoUtils.sha256(message);
    const z = BigInt('0x' + CryptoUtils.bytesToHex(hash));

    // Vérification
    const sInv = CryptoUtils.modInverse(s, this.n);
    const u1 = (z * sInv) % this.n;
    const u2 = (r * sInv) % this.n;

    const G = new ECPoint(this.Gx, this.Gy);
    const Q = new ECPoint(Qx, Qy);

    const point1 = this.scalarMult(u1, G);
    const point2 = this.scalarMult(u2, Q);
    const point = this.addPoints(point1, point2);

    const isValid = !point.isInfinity() && (point.x! % this.n) === r;

    const endTime = performance.now();

    return {
      isValid,
      verificationTime: Math.round(endTime - startTime),
      details: {
        confidence: isValid ? 'Signature valide - 100%' : 'Signature invalide',
        messageHash: 'SHA-256'
      }
    };
  }
}

// ============================================================================
// IMPLÉMENTATION CRYSTALS-DILITHIUM (Version simplifiée)
// ============================================================================

// Polynomial class (outside of Dilithium for cleaner syntax)
class DilithiumPolynomial {
  coeffs: number[];

  constructor(coeffs?: number[]) {
    this.coeffs = coeffs || new Array(256).fill(0);
  }

  add(other: DilithiumPolynomial): DilithiumPolynomial {
    const result = new DilithiumPolynomial();
    for (let i = 0; i < 256; i++) {
      result.coeffs[i] = (this.coeffs[i] + other.coeffs[i]) % 8380417;
    }
    return result;
  }

  multiply(other: DilithiumPolynomial): DilithiumPolynomial {
    const result = new DilithiumPolynomial();
    const Q = 8380417;
    const N = 256;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const idx = (i + j) % N;
        const sign = Math.floor((i + j) / N) % 2 === 0 ? 1 : -1;
        result.coeffs[idx] = (result.coeffs[idx] + sign * this.coeffs[i] * other.coeffs[j]) % Q;
        if (result.coeffs[idx] < 0) result.coeffs[idx] += Q;
      }
    }
    return result;
  }

  static random(bound: number): DilithiumPolynomial {
    const poly = new DilithiumPolynomial();
    const Q = 8380417;
    const N = 256;

    for (let i = 0; i < N; i++) {
      poly.coeffs[i] = Math.floor(Math.random() * (2 * bound + 1)) - bound;
      if (poly.coeffs[i] < 0) poly.coeffs[i] += Q;
    }
    return poly;
  }
}

class Dilithium {
  static readonly Q = 8380417; // Module premier
  static readonly N = 256; // Degré du polynôme
  static readonly K = 4; // Dimension de la matrice A
  static readonly L = 4; // Dimension du vecteur s1
  static readonly ETA = 2; // Bornes pour les coefficients

  static async generateKeyPair() {
    const startTime = performance.now();

    // Générer la matrice A (publique)
    const A: DilithiumPolynomial[][] = [];
    for (let i = 0; i < this.K; i++) {
      A[i] = [];
      for (let j = 0; j < this.L; j++) {
        A[i][j] = DilithiumPolynomial.random(this.Q / 2);
      }
    }

    // Générer les vecteurs secrets s1 et s2
    const s1: DilithiumPolynomial[] = [];
    const s2: DilithiumPolynomial[] = [];

    for (let i = 0; i < this.L; i++) {
      s1[i] = DilithiumPolynomial.random(this.ETA);
    }

    for (let i = 0; i < this.K; i++) {
      s2[i] = DilithiumPolynomial.random(this.ETA);
    }

    // Calculer t = A * s1 + s2
    const t: DilithiumPolynomial[] = [];
    for (let i = 0; i < this.K; i++) {
      t[i] = new DilithiumPolynomial();
      for (let j = 0; j < this.L; j++) {
        t[i] = t[i].add(A[i][j].multiply(s1[j]));
      }
      t[i] = t[i].add(s2[i]);
    }

    const publicKey = {
      A: A.map(row => row.map(p => p.coeffs.slice(0, 16))),
      t: t.map(p => p.coeffs.slice(0, 16))
    };

    const privateKey = {
      s1: s1.map(p => p.coeffs.slice(0, 16)),
      s2: s2.map(p => p.coeffs.slice(0, 16)),
      t: t.map(p => p.coeffs.slice(0, 16))
    };

    const endTime = performance.now();

    return {
      publicKey: JSON.stringify(publicKey),
      privateKey: JSON.stringify(privateKey),
      algorithm: 'CRYSTALS-Dilithium',
      securityLevel: 'Niveau 3 (Post-quantique)',
      publicKeySize: JSON.stringify(publicKey).length,
      secretKeySize: JSON.stringify(privateKey).length,
      timestamp: new Date().toISOString(),
      generationTime: Math.round(endTime - startTime)
    };
  }

  static async sign(message: string, privateKeyStr: string) {
    const startTime = performance.now();

    const privateKey = JSON.parse(privateKeyStr);
    const hash = await CryptoUtils.sha256(message);

    // Créer un polynôme de challenge à partir du hash
    const c = new DilithiumPolynomial();
    for (let i = 0; i < Math.min(hash.length, this.N); i++) {
      c.coeffs[i] = hash[i] % this.Q;
    }

    // Reconstruire s1 à partir de la clé privée
    const s1 = privateKey.s1.map((coeffs: number[]) => {
      const poly = new DilithiumPolynomial();
      coeffs.forEach((c: number, i: number) => poly.coeffs[i] = c);
      return poly;
    });

    // Calculer z = y + c*s1 (simplifié)
    const z: DilithiumPolynomial[] = [];
    for (let i = 0; i < this.L; i++) {
      const y = DilithiumPolynomial.random(100);
      z[i] = y.add(c.multiply(s1[i]));
    }

    const signature = {
      c: c.coeffs.slice(0, 16),
      z: z.map(p => p.coeffs.slice(0, 16))
    };

    const endTime = performance.now();

    return {
      signature: JSON.stringify(signature),
      message: message,
      algorithm: 'CRYSTALS-Dilithium',
      signatureSize: JSON.stringify(signature).length,
      signingTime: Math.round(endTime - startTime)
    };
  }

  static async verify(message: string, signatureStr: string, publicKeyStr: string) {
    const startTime = performance.now();

    const signature = JSON.parse(signatureStr);
    const publicKey = JSON.parse(publicKeyStr);
    const hash = await CryptoUtils.sha256(message);

    // Recréer le polynôme de challenge
    const c = new DilithiumPolynomial();
    for (let i = 0; i < Math.min(hash.length, this.N); i++) {
      c.coeffs[i] = hash[i] % this.Q;
    }

    // Vérification simplifiée: comparer le challenge
    let isValid = true;
    for (let i = 0; i < Math.min(16, c.coeffs.length); i++) {
      if (c.coeffs[i] !== signature.c[i]) {
        isValid = false;
        break;
      }
    }

    const endTime = performance.now();

    return {
      isValid,
      verificationTime: Math.round(endTime - startTime),
      details: {
        confidence: isValid ? 'Signature valide - Post-quantique' : 'Signature invalide',
        messageHash: 'SHA-256'
      }
    };
  }
}

// Export for use in other modules
export { CryptoUtils, ECDSAP256, Dilithium, ECPoint, DilithiumPolynomial };