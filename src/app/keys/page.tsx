'use client';
import { useState } from 'react';
import { Copy, CheckCircle, AlertCircle, Shield, Key, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dilithium, ECDSAP256, RSA3072 } from './functions';


export default function CryptoOperations() {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedAlgo, setSelectedAlgo] = useState('rsa');
  const [generatedKey, setGeneratedKey] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Document important à signer de manière sécurisée');
  const [signature, setSignature] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copied, setCopied] = useState('');

  const handleGenerateKey = async () => {
    setLoading(true);
    setGeneratedKey(null);
    try {
      let result;
      switch (selectedAlgo) {
        case 'rsa':
          result = await RSA3072.generateKeyPair();
          break;
        case 'ecdsa':
          result = await ECDSAP256.generateKeyPair();
          break;
        case 'dilithium':
          result = await Dilithium.generateKeyPair();
          break;
        default:
          throw new Error('Algorithme non supporté');
      }
      setGeneratedKey(result);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération de clés');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!generatedKey) {
      alert('Veuillez d\'abord générer une paire de clés');
      return;
    }

    setLoading(true);
    setSignature(null);
    setVerificationResult(null);

    try {
      let result;
      const privateKey = selectedAlgo === 'rsa' || selectedAlgo === 'dilithium'
        ? generatedKey.privateKey
        : generatedKey.privateKey;

      switch (selectedAlgo) {
        case 'rsa':
          result = await RSA3072.sign(message, privateKey);
          break;
        case 'ecdsa':
          result = await ECDSAP256.sign(message, privateKey);
          break;
        case 'dilithium':
          result = await Dilithium.sign(message, privateKey);
          break;
        default:
          throw new Error('Algorithme non supporté');
      }
      setSignature(result);
    } catch (error) {
      console.error('Erreur lors de la signature:', error);
      alert('Erreur lors de la signature');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signature || !generatedKey) return;

    setLoading(true);
    try {
      let result;
      const publicKey = generatedKey.publicKey;

      switch (selectedAlgo) {
        case 'rsa':
          result = await RSA3072.verify(signature.message, signature.signature, publicKey);
          break;
        case 'ecdsa':
          result = await ECDSAP256.verify(signature.message, signature.signature, publicKey);
          break;
        case 'dilithium':
          result = await Dilithium.verify(signature.message, signature.signature, publicKey);
          break;
        default:
          throw new Error('Algorithme non supporté');
      }
      setVerificationResult(result);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      alert('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const getAlgoName = () => {
    switch (selectedAlgo) {
      case 'rsa': return 'RSA-3072';
      case 'ecdsa': return 'ECDSA-P256';
      case 'dilithium': return 'CRYSTALS-Dilithium';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Cryptographie Avancée</h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto">
            Plateforme de cryptographie post-quantique avec implémentation complète de RSA-3072, ECDSA-P256 et CRYSTALS-Dilithium
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Sélection de l'algorithme
            </CardTitle>
            <CardDescription>
              Choisissez l'algorithme cryptographique à utiliser
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* RSA */}
              <button
                onClick={() => setSelectedAlgo('rsa')}
                className={`
      p-4 rounded-lg transition-all bg-card text-card-foreground
      ${selectedAlgo === 'rsa'
                    ? 'border-2 border-primary bg-accent text-accent-foreground'
                    : 'border border-border hover:border-primary'
                  }
    `}
              >
                <h3 className="font-bold text-lg mb-1">RSA-3072</h3>
                <p className="text-sm text-muted-foreground">
                  Cryptographie classique, 128 bits de sécurité
                </p>
              </button>

              {/* ECDSA */}
              <button
                onClick={() => setSelectedAlgo('ecdsa')}
                className={`
      p-4 rounded-lg transition-all bg-card text-card-foreground
      ${selectedAlgo === 'ecdsa'
                    ? 'border-2 border-primary bg-accent text-accent-foreground'
                    : 'border border-border hover:border-primary'
                  }
    `}
              >
                <h3 className="font-bold text-lg mb-1">ECDSA-P256</h3>
                <p className="text-sm text-muted-foreground">
                  Courbe elliptique, compact et efficace
                </p>
              </button>

              {/* Dilithium */}
              <button
                onClick={() => setSelectedAlgo('dilithium')}
                className={`
      p-4 rounded-lg transition-all bg-card text-card-foreground
      ${selectedAlgo === 'dilithium'
                    ? 'border-2 border-primary bg-accent text-accent-foreground'
                    : 'border border-border hover:border-primary'
                  }
    `}
              >
                <h3 className="font-bold text-lg mb-1">CRYSTALS-Dilithium</h3>
                <p className="text-sm text-muted-foreground">
                  Post-quantique, résistant aux ordinateurs quantiques
                </p>
              </button>
            </div>

          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="generate" className="flex items-center gap-2 py-3">
              <Key className="w-4 h-4" />
              <span>Générer des clés</span>
            </TabsTrigger>
            <TabsTrigger value="sign" className="flex items-center gap-2 py-3">
              <FileSignature className="w-4 h-4" />
              <span>Signer</span>
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2 py-3">
              <CheckCircle className="w-4 h-4" />
              <span>Vérifier</span>
            </TabsTrigger>
          </TabsList>

          {/* ========== GÉNÉRATION DE CLÉS ========== */}
          <TabsContent value="generate" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Génération de paire de clés - {getAlgoName()}</CardTitle>
                <CardDescription>
                  {selectedAlgo === 'rsa' && 'Génère une paire de clés RSA de 3072 bits avec nombres premiers aléatoires'}
                  {selectedAlgo === 'ecdsa' && 'Génère une paire de clés sur la courbe elliptique P-256 (secp256r1)'}
                  {selectedAlgo === 'dilithium' && 'Génère une paire de clés post-quantique résistante aux attaques quantiques'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateKey}
                  disabled={loading}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Générer la paire de clés
                    </>
                  )}
                </Button>

                {generatedKey && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Clés générées avec succès !</strong>
                        <div className="mt-1 text-sm space-y-1">
                          <div>• Algorithme: {generatedKey.algorithm}</div>
                          <div>• Niveau de sécurité: {generatedKey.securityLevel}</div>
                          <div>• Temps de génération: {generatedKey.generationTime}ms</div>
                          <div>• Date: {new Date(generatedKey.timestamp).toLocaleString('fr-FR')}</div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Clé Publique */}
                      <div className="space-y-2">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Clé Publique
                        </Label>
                        <div className="text-sm text-gray-600 mb-2">
                          Taille: {generatedKey.publicKeySize} caractères
                        </div>
                        <div className="relative">
                          <div className="max-h-64 overflow-auto p-4 bg-gray-900 rounded-lg border-2 border-green-500">
                            <code className="text-green-400 text-xs break-all font-mono">
                              {generatedKey.publicKey}
                            </code>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(generatedKey.publicKey, 'pubkey')}
                          >
                            {copied === 'pubkey' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Clé Privée */}
                      <div className="space-y-2">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Clé Privée (Secrète)
                        </Label>
                        <div className="text-sm text-gray-600 mb-2">
                          Taille: {generatedKey.secretKeySize} caractères
                        </div>
                        <div className="relative">
                          <div className="max-h-64 overflow-auto p-4 bg-gray-900 rounded-lg border-2 border-red-500">
                            <code className="text-red-400 text-xs break-all font-mono">
                              {generatedKey.privateKey}
                            </code>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(generatedKey.privateKey, 'privkey')}
                          >
                            {copied === 'privkey' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Important:</strong> Conservez votre clé privée en lieu sûr. Ne la partagez jamais !
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========== SIGNATURE ========== */}
          <TabsContent value="sign" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Signature numérique - {getAlgoName()}</CardTitle>
                <CardDescription>
                  Créez une signature cryptographique pour authentifier votre document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!generatedKey && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Vous devez d'abord générer une paire de clés dans l'onglet "Générer des clés"
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-semibold">
                    Document à signer
                  </Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Entrez le contenu du document à signer..."
                    className="w-full min-h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <Button
                  onClick={handleSign}
                  disabled={loading || !generatedKey}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signature en cours...
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-4 h-4 mr-2" />
                      Signer le document
                    </>
                  )}
                </Button>

                {signature && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Signature créée avec succès !</strong>
                        <div className="mt-1 text-sm">
                          • Temps de signature: {signature.signingTime}ms
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-indigo-600" />
                        Signature numérique
                      </Label>
                      <div className="text-sm text-gray-600 mb-2">
                        Taille: {signature.signatureSize} caractères
                      </div>
                      <div className="relative">
                        <div className="max-h-48 overflow-auto p-4 bg-gray-900 rounded-lg border-2 border-indigo-500">
                          <code className="text-indigo-400 text-xs break-all font-mono">
                            {signature.signature}
                          </code>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(signature.signature, 'sig')}
                        >
                          {copied === 'sig' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => setActiveTab('verify')}
                      variant="outline"
                      className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Passer à la vérification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========== VÉRIFICATION ========== */}
          <TabsContent value="verify" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vérification de signature - {getAlgoName()}</CardTitle>
                <CardDescription>
                  Vérifiez l'authenticité et l'intégrité d'une signature numérique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!signature ? (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Vous devez d'abord signer un document dans l'onglet "Signer"
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="bg-purple-50 border-purple-200">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        <strong>Signature prête à être vérifiée</strong>
                        <div className="mt-2 text-sm space-y-1">
                          <div>• Algorithme: {signature.algorithm && signature.algorithm}</div>
                          <div>• Document: "{signature.message && signature.message.substring(0, 50)}..."</div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleVerify}
                      disabled={loading}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Vérification en cours...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Vérifier la signature
                        </>
                      )}
                    </Button>

                    {verificationResult && (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        {verificationResult.isValid ? (
                          <Alert className="bg-green-50 border-2 border-green-500">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription>
                              <div className="text-green-800">
                                <div className="text-lg font-bold mb-2">✓ SIGNATURE VALIDE</div>
                                <div className="text-sm space-y-1">
                                  <div>• La signature est authentique et n'a pas été altérée</div>
                                  <div>• Le document correspond exactement à celui qui a été signé</div>
                                  <div>• Temps de vérification: {verificationResult.verificationTime}ms</div>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-red-50 border-2 border-red-500">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertDescription>
                              <div className="text-red-800">
                                <div className="text-lg font-bold mb-2">✗ SIGNATURE INVALIDE</div>
                                <div className="text-sm space-y-1">
                                  <div>• La signature ne correspond pas au document</div>
                                  <div>• Le document a peut-être été modifié</div>
                                  <div>• La signature pourrait être frauduleuse</div>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        <Card className="bg-gray-50">
                          <CardHeader>
                            <CardTitle className="text-base">Détails de la vérification</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-600">Niveau de confiance</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {verificationResult.details.confidence}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-600">Fonction de hachage</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {verificationResult.details.messageHash}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-600">Algorithme</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {getAlgoName()}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-600">Temps de traitement</div>
                                <div className="text-lg font-bold text-gray-900">
                                  {verificationResult.verificationTime}ms
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer informatif */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  RSA-3072
                </h3>
                <p className="text-gray-700">
                  Algorithme asymétrique basé sur la factorisation de grands nombres premiers. Sécurité de 128 bits.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  ECDSA-P256
                </h3>
                <p className="text-gray-700">
                  Signature sur courbe elliptique secp256r1. Plus compact que RSA avec une sécurité équivalente.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  CRYSTALS-Dilithium
                </h3>
                <p className="text-gray-700">
                  Cryptographie post-quantique résistante aux attaques d'ordinateurs quantiques. Basé sur les réseaux euclidiens.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}