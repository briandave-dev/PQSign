'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Algorithm {
  id: string;
  name: string;
  quantumResistant: boolean;
  description: string;
  features: string[];
  color: string;
}

export default function Home() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/algorithms')
      .then((res) => res.json())
      .then((data) => {
        setAlgorithms(data.algorithms);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <section className="py-20 md:py-32 container-safe fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Cryptographie <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Post-Quantique</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explorez CRYSTALS-Dilithium, l’algorithme post-quantique standardisé par le NIST. Comparez sa sécurité et ses performances aux implémentations classiques RSA et ECDSA.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/keys">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Tester la Signature <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/benchmarks">
                <Button size="lg" variant="outline">
                  Voir Benchmarks
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-96 hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl animate-pulse" />
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Lock className="w-24 h-24 mx-auto text-primary animate-bounce" />
                <div className="text-sm font-semibold text-muted-foreground">
                  Sécurité Résistante au Quantique
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-safe">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comparaison des Algorithmes</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez comment la cryptographie post-quantique se positionne face aux standards actuels
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {algorithms.map((algo) => (
                <Card key={algo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle>{algo.name}</CardTitle>
                      {algo.quantumResistant ? (
                        <Shield className="w-5 h-5 text-secondary" />
                      ) : (
                        <Zap className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <CardDescription>{algo.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">Caractéristiques Clés :</p>
                      <ul className="space-y-1">
                        {algo.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {algo.quantumResistant ? (
                        <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
                          <Shield className="w-4 h-4" />
                          Résistant au Quantique
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold">
                          <Zap className="w-4 h-4" />
                          Algorithme Classique
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-safe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-6 h-6 text-primary" />
                  <CardTitle>Génération de Clés</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Générez des paires de clés cryptographiques pour les trois algorithmes. Comprenez les tailles de clés et les implications de sécurité.
                </p>
                <Link href="/keys">
                  <Button variant="outline" className="w-full">
                    Générer des Clés <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/10 hover:border-secondary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                  <CardTitle>Analyse de Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comparez les métriques de performance selon les architectures. Analysez les tailles de signatures, les temps de génération et la vitesse de vérification.
                </p>
                <Link href="/benchmarks">
                  <Button variant="outline" className="w-full">
                    Voir Benchmarks <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container-safe text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Pourquoi la Cryptographie Post-Quantique ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les ordinateurs quantiques représentent une menace majeure pour les systèmes cryptographiques actuels. Les algorithmes post-quantiques comme Dilithium sont conçus pour rester sûrs même face aux attaques quantiques.
          </p>
          <Link href="/quantum">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              En Savoir Plus <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
