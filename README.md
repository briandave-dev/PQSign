# PQSign Dashboard - Post-Quantum Cryptography Implementation

A modern web dashboard showcasing CRYSTALS-Dilithium, NIST's standardized post-quantum cryptographic algorithm, with comprehensive comparisons to classical RSA-3072 and ECDSA-P256.

## Overview

PQSign Dashboard is an educational implementation designed to demonstrate post-quantum cryptography concepts through an interactive web interface. It provides hands-on exploration of key generation, digital signatures, and performance benchmarking across different cryptographic algorithms.

## Features

### Core Functionality
- **Key Generation**: Generate cryptographic key pairs for Dilithium, RSA, and ECDSA
- **Digital Signatures**: Sign documents and verify signatures with multiple algorithms
- **Performance Benchmarks**: Compare operation times, key sizes, and signature sizes across architectures (x86-64 and ARM64)
- **Quantum Resistance Analysis**: Understand quantum threats and post-quantum solutions

### Pages

1. **Home (/)** - Overview and introduction to post-quantum cryptography
2. **Keys & Signatures (/keys)** - Interactive key generation and signature operations
3. **Benchmarks (/benchmarks)** - Performance comparisons with architecture selection
4. **Quantum Resistance (/quantum)** - Educational content on quantum threats and PQC
5. **Team (/team)** - Project team information and documentation

## Technology Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: ShadCN UI
- **Charting**: Recharts
- **Font**: Space Grotesk
- **Theme**: Light/Dark mode with next-themes

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── keygen/            # Key generation endpoint
│   │   ├── sign/              # Document signing endpoint
│   │   ├── verify/            # Signature verification endpoint
│   │   ├── benchmarks/        # Performance benchmark data
│   │   └── algorithms/        # Algorithm information
│   ├── (pages)                # Main application pages
│   ├── layout.tsx             # Root layout with theme provider
│   ├── page.tsx               # Homepage
│   ├── globals.css            # Global styles
│   └── ...
├── components/
│   ├── charts/                # Recharts components
│   ├── ui/                    # ShadCN UI components
│   ├── navigation.tsx         # Main navigation header
│   └── footer.tsx             # Application footer
├── data/
│   ├── algorithms.json        # Algorithm specifications
│   ├── benchmarks.json        # Performance data
│   └── team.json              # Team member information
├── lib/
│   └── utils.ts               # Utility functions
└── hooks/
    └── use-toast.ts           # Toast notification hook
```

## Color Palette

- **Primary**: #6366F1 (Indigo)
- **Secondary**: #10B981 (Emerald)
- **Light Background**: #F9FAFB
- **Dark Background**: #0F172A
- **Text**: #1E293B

## API Endpoints

### POST /api/keygen
Generate a cryptographic key pair.

**Request Body**:
```json
{ "algorithm": "dilithium" | "rsa" | "ecdsa" }
```

**Response**:
```json
{
  "algorithm": "CRYSTALS-Dilithium",
  "publicKey": "...",
  "secretKey": "...",
  "publicKeySize": 1952,
  "secretKeySize": 4000,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /api/sign
Sign a document with a cryptographic key.

**Request Body**:
```json
{
  "algorithm": "dilithium" | "rsa" | "ecdsa",
  "message": "Document content"
}
```

**Response**:
```json
{
  "algorithm": "CRYSTALS-Dilithium",
  "signature": "...",
  "signatureSize": 2420,
  "signingTime": 134,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /api/verify
Verify a digital signature.

**Request Body**:
```json
{
  "algorithm": "dilithium" | "rsa" | "ecdsa",
  "signature": "...",
  "message": "Document content"
}
```

**Response**:
```json
{
  "isValid": true,
  "verificationTime": 156,
  "details": {
    "signatureFormat": "DER-encoded",
    "messageHash": "SHA-512",
    "verified": true,
    "confidence": "99.99%"
  }
}
```

### GET /api/benchmarks?arch=x86|arm
Retrieve performance benchmarks for selected architecture.

**Response**: Benchmark data including key generation time, signing time, verification time, key sizes, and signature sizes.

### GET /api/algorithms
Get information about all available algorithms.

**Response**: Array of algorithm specifications with features and security information.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Key Features Explained

### Quantum Resistance
- **Dilithium**: Lattice-based algorithm resistant to quantum attacks
- **RSA/ECDSA**: Classical algorithms vulnerable to Shor's algorithm on quantum computers

### Performance Benchmarks
- Benchmarks test key generation, signing, and verification operations
- Data includes both x86-64 and ARM64 architecture results
- Key and signature sizes are compared for practical implementation considerations

### Educational Focus
- Comprehensive explanations of post-quantum cryptography concepts
- Visual comparisons of algorithm characteristics
- Team information highlighting diverse expertise areas

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Information

**Type**: University Educational Project
**Focus**: Post-Quantum Cryptography Implementation
**Standard**: NIST Post-Quantum Cryptography Standardization
**Algorithms**: CRYSTALS-Dilithium (Level 3), RSA-3072, ECDSA-P256

## Team

The PQSign Dashboard development team consists of 14 members with expertise spanning:
- Cryptography and security
- Software development and architecture
- UI/UX design and frontend development
- Infrastructure and deployment
- Quality assurance and testing
- Documentation and compliance

## Acknowledgments

This project is built upon:
- NIST Post-Quantum Cryptography Standardization Project
- CRYSTALS (Cryptographic Suite for Algebraic Lattices) research
- Modern web development best practices
- ShadCN UI component library
- Next.js framework

## License

Educational Project - University Implementation

## Contact

For inquiries about this project, please reach out to the project lead through the university's official channels.

---

**Note**: This is an educational implementation. Signatures and keys are simulated for demonstration purposes and should not be used in production environments without proper cryptographic backend implementation.
