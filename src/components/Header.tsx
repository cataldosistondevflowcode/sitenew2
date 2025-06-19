import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Quem somos", href: "#" },
    { label: "Imóveis em Leilão", href: "#", active: true },
    { label: "Assessoria em leilões", href: "#" },
    { label: "Direito Imobiliário", href: "#" },
    { label: "Casos Reais", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <img src="/logotipo_cataldo_siston.png" alt="Cataldo Siston Advogados" className="h-14" />
          </a>
          
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </Button>

          <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block absolute lg:relative top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent`}>
            <ul className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-0">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`block py-2 text-secondary hover:text-primary transition-colors ${
                      item.active ? 'text-primary relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
