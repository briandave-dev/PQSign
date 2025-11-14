'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BenchmarkBarChart from '@/components/charts/benchmark-bar-chart';
import { Cpu } from 'lucide-react';

interface BenchmarkData {
  keyGeneration?: Array<{ algorithm: string; time: number }>;
  signing?: Array<{ algorithm: string; time: number }>;
  verification?: Array<{ algorithm: string; time: number }>;
  keySizes?: Array<{ algorithm: string; publicKey: number; secretKey: number }>;
  signatureSizes?: Array<{ algorithm: string; size: number }>;
}

// Import data directly or define it inline
const benchmarksData = {
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

export default function BenchmarksPage() {
  const [arch, setArch] = useState<'x86' | 'arm'>('x86');
  const [loading, setLoading] = useState(false);
  
  const data = benchmarksData[arch];

  // Handle architecture change with loading simulation
  const handleArchChange = (value: string) => {
    if (value && (value === 'x86' || value === 'arm')) {
      setLoading(true);
      setArch(value);
      // Simulate loading delay for smoother UX
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-safe space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Indicateurs de Performance</h1>
          <p className="text-muted-foreground text-lg">
            Comparez les algorithmes cryptographiques selon différentes architectures
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5" />
              <CardTitle>Architecture</CardTitle>
            </div>
            <CardDescription>Sélectionnez l'architecture processeur pour les benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup type="single" value={arch} onValueChange={handleArchChange}>
              <ToggleGroupItem value="x86">x86-64</ToggleGroupItem>
              <ToggleGroupItem value="arm">ARM64</ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="times" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="times">Temps d'Opération</TabsTrigger>
              <TabsTrigger value="sizes">Tailles des Clés</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            <TabsContent value="times" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temps de Génération de Clé</CardTitle>
                  <CardDescription>Temps pour générer une paire de clés cryptographiques (millisecondes)</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.keyGeneration && (
                    <BenchmarkBarChart
                      data={data.keyGeneration}
                      dataKey="time"
                      title="Temps de Génération de Clé"
                      color="#6366F1"
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps de Signature</CardTitle>
                  <CardDescription>Temps nécessaire pour créer une signature numérique (millisecondes)</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.signing && (
                    <BenchmarkBarChart
                      data={data.signing}
                      dataKey="time"
                      title="Temps de Signature"
                      color="#10B981"
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps de Vérification</CardTitle>
                  <CardDescription>Temps pour vérifier une signature numérique (millisecondes)</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.verification && (
                    <BenchmarkBarChart
                      data={data.verification}
                      dataKey="time"
                      title="Temps de Vérification"
                      color="#F59E0B"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sizes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tailles des Clés Cryptographiques</CardTitle>
                  <CardDescription>Comparaison des tailles de clés publiques et secrètes (octets)</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Algorithme</TableHead>
                        <TableHead className="text-right">Clé Publique</TableHead>
                        <TableHead className="text-right">Clé Secrète</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.keySizes?.map((row) => (
                        <TableRow key={row.algorithm}>
                          <TableCell className="font-semibold">{row.algorithm}</TableCell>
                          <TableCell className="text-right">{row.publicKey.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.secretKey.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {(row.publicKey + row.secretKey).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tailles des Signatures</CardTitle>
                  <CardDescription>Comparaison des tailles des signatures numériques (octets)</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Algorithme</TableHead>
                        <TableHead className="text-right">Taille de Signature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.signatureSizes?.map((row) => (
                        <TableRow key={row.algorithm}>
                          <TableCell className="font-semibold">{row.algorithm}</TableCell>
                          <TableCell className="text-right">{row.size.toLocaleString()} octets</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques Résumées</CardTitle>
                  <CardDescription>{arch === 'x86' ? 'Architecture x86-64' : 'Architecture ARM64'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Opérations les Plus Rapides</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Génération de Clé :</span>
                          <span className="font-semibold">ECDSA-P256</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signature :</span>
                          <span className="font-semibold">ECDSA-P256</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vérification :</span>
                          <span className="font-semibold">RSA-3072</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Tailles les Plus Petites</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Clé Publique :</span>
                          <span className="font-semibold">ECDSA-P256</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clé Secrète :</span>
                          <span className="font-semibold">ECDSA-P256</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signature :</span>
                          <span className="font-semibold">ECDSA-P256</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Résistance Quantique</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Dilithium :</span>
                          <span className="text-secondary font-semibold">✓ Résistant</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>RSA :</span>
                          <span className="text-red-500 font-semibold">✗ Vulnérable</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ECDSA :</span>
                          <span className="text-red-500 font-semibold">✗ Vulnérable</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Informations Clés</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tests effectués sur :</span>
                          <p className="font-semibold">{arch === 'x86' ? 'Intel Xeon' : 'AWS Graviton'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}