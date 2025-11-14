'use client';

import { Shield, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QuantumPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-safe space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Résistance Quantique</h1>
          <p className="text-muted-foreground text-lg">
            Comprendre la menace et la solution
          </p>
        </div>

        <Card className="border-l-4 border-orange-500 bg-orange-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <div>
                <CardTitle>La menace quantique</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Les ordinateurs quantiques, une fois disponibles à grande échelle, seront capables de résoudre les problèmes mathématiques sur lesquels reposent les systèmes cryptographiques actuels. En particulier :
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <div>
                  <p className="font-semibold">Algorithme de Shor</p>
                  <p className="text-sm text-muted-foreground">
                    Peut factoriser efficacement de grands nombres, compromettant RSA
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <div>
                  <p className="font-semibold">Problème du logarithme discret</p>
                  <p className="text-sm text-muted-foreground">
                    Permet de casser ECDSA et Diffie-Hellman en temps polynomial
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <div>
                  <p className="font-semibold">Incertitude temporelle</p>
                  <p className="text-sm text-muted-foreground">
                    Les experts prévoient 10 à 30 ans avant l’arrivée d’ordinateurs quantiques pratiques
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-secondary bg-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-secondary" />
              <div>
                <CardTitle>Cryptographie Post-Quantique (PQC)</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Les algorithmes de cryptographie post-quantique sont conçus pour être sécurisés face aux ordinateurs classiques et quantiques. En 2022, le NIST a standardisé les premiers algorithmes PQC, incluant CRYSTALS-Dilithium pour les signatures numériques.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Basé sur les réseaux lattices</h4>
                <p className="text-sm text-muted-foreground">
                  Sécurité fondée sur la difficulté des problèmes de réseaux (utilisés par Dilithium)
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Basé sur les codes</h4>
                <p className="text-sm text-muted-foreground">
                  Sécurité fondée sur le décodage de codes linéaires aléatoires
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Basé sur les fonctions de hachage</h4>
                <p className="text-sm text-muted-foreground">
                  Sécurité fondée sur la difficulté des fonctions de hachage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparaison de Sécurité des Algorithmes</CardTitle>
            <CardDescription>
              Comment les algorithmes classiques et post-quantiques résistent aux attaques
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algorithme</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sécurité Classique</TableHead>
                  <TableHead>Sécurité Quantique</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Dilithium</TableCell>
                  <TableCell>Basé sur les réseaux</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      Sécurisé
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      Sécurisé
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
                      Recommandé
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">RSA-3072</TableCell>
                  <TableCell>Factorisation entière</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Sécurisé
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Cassé
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-700 rounded text-xs font-semibold">
                      Héritage
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">ECDSA-P256</TableCell>
                  <TableCell>Courbes elliptiques</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Sécurisé
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Cassé
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-700 rounded text-xs font-semibold">
                      Vulnérable
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Modèle de Menace Classique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-1">Factorisation RSA</p>
                <p className="text-sm text-muted-foreground">
                  Nécessite ~2^128 opérations avec des ordinateurs classiques — impraticable aujourd’hui
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Logarithme discret (ECDSA)</p>
                <p className="text-sm text-muted-foreground">
                  Nécessite ~2^128 opérations (méthode rho de Pollard) — impraticable
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                Modèle de Menace Quantique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm mb-1">Algorithme de Shor</p>
                <p className="text-sm text-muted-foreground">
                  Facteurise RSA en temps polynomial — dangereux avec de grands ordinateurs quantiques
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Problèmes de lattices</p>
                <p className="text-sm text-muted-foreground">
                  Aucun algorithme quantique connu plus rapide que les méthodes classiques — reste sécurisé
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Points Essentiels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white font-semibold">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Commencez la transition dès maintenant</p>
                  <p className="text-sm text-muted-foreground">
                    Les attaques “collecte maintenant, déchiffre plus tard” sont déjà possibles. Les données chiffrées aujourd’hui pourront être déchiffrées plus tard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white font-semibold">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Utilisez les standards NIST</p>
                  <p className="text-sm text-muted-foreground">
                    CRYSTALS-Dilithium est le standard PQC recommandé pour les signatures numériques.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Approches hybrides</p>
                  <p className="text-sm text-muted-foreground">
                    Combinez algorithmes classiques et post-quantiques pour maximiser compatibilité et sécurité.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white font-semibold">
                    4
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1">Performances acceptables</p>
                  <p className="text-sm text-muted-foreground">
                    Bien que les clés de Dilithium soient plus grandes, l’impact performance reste faible pour la majorité des applications.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
