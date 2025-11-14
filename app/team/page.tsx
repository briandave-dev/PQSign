'use client';

import { useEffect, useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamData = [
      { id: 1, name: 'Alice Chen', role: 'Project Lead', specialty: 'Cryptography' },
      { id: 2, name: 'Bob Thompson', role: 'Lead Developer', specialty: 'Backend Development' },
      { id: 3, name: 'Carol Martinez', role: 'UI/UX Designer', specialty: 'Interface Design' },
      { id: 4, name: 'David Kumar', role: 'Security Analyst', specialty: 'Vulnerability Assessment' },
      { id: 5, name: 'Emma Wilson', role: 'Frontend Developer', specialty: 'React Development' },
      { id: 6, name: 'Frank Johnson', role: 'DevOps Engineer', specialty: 'Infrastructure' },
      { id: 7, name: 'Grace Lee', role: 'Researcher', specialty: 'Post-Quantum Cryptography' },
      { id: 8, name: 'Henry Davis', role: 'QA Engineer', specialty: 'Testing & Validation' },
      { id: 9, name: 'Iris Patel', role: 'Documentation Lead', specialty: 'Technical Writing' },
      { id: 10, name: 'James Anderson', role: 'Systems Architect', specialty: 'Architecture Design' },
      { id: 11, name: 'Karen Brown', role: 'Security Officer', specialty: 'Risk Management' },
      { id: 12, name: 'Leo Martinez', role: 'Performance Engineer', specialty: 'Optimization' },
      { id: 13, name: 'Maya Gupta', role: 'Integration Lead', specialty: 'System Integration' },
      { id: 14, name: 'Nathan Wright', role: 'Compliance Officer', specialty: 'Regulatory Compliance' },
    ];
    setTeam(teamData);
    setLoading(false);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleDownloadReport = () => {
    alert('PDF report download initiated. (Simulated)');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-safe space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Project Team</h1>
          <p className="text-muted-foreground text-lg">
            Meet the experts behind PQSign Dashboard
          </p>
        </div>

        <Alert className="bg-primary/10 border-primary">
          <AlertDescription>
            <strong>Educational Project:</strong> University-led implementation of post-quantum cryptography standards using CRYSTALS-Dilithium Level 3 specification.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-xs text-primary font-semibold">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{member.specialty}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-3 h-3 mr-2" />
                    Contact
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Key details about this implementation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Research Focus</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This project implements CRYSTALS-Dilithium (Level 3) from the NIST Post-Quantum Cryptography Standardization project. We provide comprehensive comparisons with classical RSA-3072 and ECDSA-P256 algorithms.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Achievements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Implemented NIST-standardized post-quantum algorithm
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Comprehensive performance benchmarking across architectures
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Educational dashboard for cryptographic concepts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Comparative security analysis and recommendations
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <p className="text-sm text-muted-foreground">
                  For inquiries about this project, please contact the project lead at the university.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Project reports and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleDownloadReport} className="w-full bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                NIST Spec
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Benchmarks
              </Button>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Academic Publication Available Upon Request
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-secondary/5 border-secondary">
          <CardHeader>
            <CardTitle>Acknowledgments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This project builds upon the groundbreaking work of the Post-Quantum Cryptography research community. We acknowledge the contributions of:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• NIST Post-Quantum Cryptography Standardization Project</li>
              <li>• CRYSTALS (Cryptographic Suite for Algebraic Lattices) Team</li>
              <li>• University Faculty Advisors</li>
              <li>• Security Research Community</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
