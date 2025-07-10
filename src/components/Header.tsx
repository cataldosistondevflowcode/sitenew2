import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

interface HeaderProps {
  onContactClick?: () => void;
}

export const Header = ({ onContactClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { label: "Quem somos", href: "#" },
    { label: "Imóveis em Leilão", href: "/", active: true, hasDropdown: true },
    { label: "Assessoria em leilões", href: "#" },
    { label: "Direito Imobiliário", href: "#" },
    { label: "Casos Reais", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#", isContact: true },
  ];

  const dropdownItems = [
    { label: "Imóveis em Leilão RJ", href: "/" },
    { label: "Imóveis Leilão SP", href: "/leilao-sp" },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <img 
              src="/logotipo_cataldo_siston.png" 
              alt="Cataldo Siston Advogados" 
              className="h-10 sm:h-12 md:h-14 w-auto" 
            />
          </a>
          
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <nav className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:block absolute lg:relative top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none border-t lg:border-t-0`}>
            <ul className="flex flex-col lg:flex-row gap-2 lg:gap-4 xl:gap-6 p-4 lg:p-0">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-1 py-3 lg:py-2 px-2 text-sm lg:text-base text-secondary hover:text-primary transition-colors rounded lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent ${
                          item.active ? 'text-primary font-medium relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:h-0.5 lg:after:bg-primary' : ''
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <ul className="py-1">
                            {dropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <a
                                  href={dropdownItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {dropdownItem.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : item.isContact ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onContactClick?.();
                      }}
                      className={`block py-3 lg:py-2 px-2 text-sm lg:text-base text-secondary hover:text-primary transition-colors rounded lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent cursor-pointer ${
                        item.active ? 'text-primary font-medium relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:h-0.5 lg:after:bg-primary' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={`block py-3 lg:py-2 px-2 text-sm lg:text-base text-secondary hover:text-primary transition-colors rounded lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent ${
                        item.active ? 'text-primary font-medium relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:h-0.5 lg:after:bg-primary' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
