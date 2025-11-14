export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container-safe py-8 md:py-12">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Signature Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Post-quantum cryptography implementation showcase using CRYSTALS-Dilithium.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">About PQC</a></li>
              <li><a href="#" className="hover:text-foreground transition">NIST Standards</a></li>
              <li><a href="#" className="hover:text-foreground transition">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">GitHub</a></li>
              <li><a href="#" className="hover:text-foreground transition">Research Paper</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Information</h4>
            <p className="text-sm text-muted-foreground">
              University Project - Post-Quantum Cryptography Implementation
            </p>
          </div>
        </div> */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Signature. Tous Droits Reservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Examen de Cryptographie | Groupe 1 GL
          </p>
        </div>
      </div>
    </footer>
  );
}
