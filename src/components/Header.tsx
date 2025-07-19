import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

interface HeaderProps {
  onContactClick?: () => void;
}

export const Header = ({ onContactClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Quem somos", href: "https://leilaodeimoveis-cataldosiston.com/escritorio/" },
    { label: "Imóveis em Leilão", href: "/", active: true, hasDropdown: true },
    { label: "Assessoria em leilões", href: "https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/" },
    { label: "Direito Imobiliário", href: "https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/" },
    { label: "Casos Reais", href: "https://leilaodeimoveis-cataldosiston.com/casos-reais/" },
    { label: "Blog", href: "https://leilaodeimoveis-cataldosiston.com/blog-leilao-de-imoveis/" },
    { label: "Contato", href: "https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/" },
  ];

  const dropdownItems = [
    { label: "Imóveis em Leilão RJ", href: "/" },
    { label: "Imóveis em Leilão SP", href: "/leilao-sp" },
  ];

  // Função para abrir o dropdown
  const handleDropdownOpen = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  // Função para fechar o dropdown com delay
  const handleDropdownClose = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 400); // 400ms de delay - mais tempo para navegar
  };

  // Função para toggle do dropdown (para clique)
  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

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
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={handleDropdownOpen}
                      onMouseLeave={handleDropdownClose}
                    >
                      <button
                        onClick={handleDropdownToggle}
                        className={`flex items-center gap-1 py-3 lg:py-2 px-2 text-sm lg:text-base text-secondary hover:text-primary transition-colors rounded lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent ${
                          item.active ? 'text-primary font-medium relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:h-0.5 lg:after:bg-primary' : ''
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                          onMouseEnter={handleDropdownOpen}
                          onMouseLeave={handleDropdownClose}
                        >
                          <ul className="py-1">
                            {dropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <a
                                  href={dropdownItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsDropdownOpen(false);
                                    if (dropdownTimeoutRef.current) {
                                      clearTimeout(dropdownTimeoutRef.current);
                                    }
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
