"use client";
import * as React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  onWhatsAppClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onWhatsAppClick }) => {
  return (
    <footer className="bg-gray-50 py-12 max-md:mt-12 max-md:pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/bf5a59e7e68461e9ad6a56b785454e48938ce393?placeholderIfAbsent=true"
              className="h-16 w-auto object-contain"
              alt="Company logo"
            />
            <p className="text-gray-700 text-sm">
              Leilões de imóveis e advocacia imobiliária
            </p>
            <address className="text-gray-700 text-sm not-italic space-y-1">
              <div>Av. Rio Branco, 156, Gr. 3336 a 3339 Centro</div>
              <div>- Rio de Janeiro - RJ - Brasil</div>
              <a 
                href="tel:+55-21-3173-3795"
                className="cursor-pointer hover:text-[#d68e08] transition-colors"
              >
                +55 (21) 3173-3795
              </a>
              <div 
                className="font-bold cursor-pointer hover:text-[#d68e08] transition-colors"
                onClick={onWhatsAppClick}
              >
                +55 (21) 97729-4848
              </div>
            </address>
          </div>

          {/* Site Map */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Mapa do Site
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/escritorio/" target="_blank" rel="noopener noreferrer">Quem Somos</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <Link to="/leilao-rj" onClick={() => window.scrollTo(0, 0)}>Imóveis em Leilão RJ</Link>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <Link to="/leilao-sp" onClick={() => window.scrollTo(0, 0)}>Imóveis em Leilão SP</Link>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/" target="_blank" rel="noopener noreferrer">Assessoria em leilões</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/direito-imobiliario/" target="_blank" rel="noopener noreferrer">Direito Imobiliário</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/distrato-imobiliario/" target="_blank" rel="noopener noreferrer">Distrato imobiliário</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/?page_id=1052" target="_blank" rel="noopener noreferrer">Direito civil</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" target="_blank" rel="noopener noreferrer">Casos Reais</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/" target="_blank" rel="noopener noreferrer">Blog</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/" target="_blank" rel="noopener noreferrer">Contato</a>
              </li>
              <li className="hover:text-[#d68e08] cursor-pointer transition-colors">
                <a href="https://leilaodeimoveis-cataldosiston.com/privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-[#d68e08] transition-colors"
              onClick={onWhatsAppClick}
            >
              Entre em Contato
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Tire suas dúvidas ou siga-nos nas redes sociais</p>
              <a
                href="mailto:contato@cataldosiston-adv.com.br"
                className="block font-bold text-gray-900 hover:text-[#d68e08] transition-colors"
              >
                contato@cataldosiston-adv.com.br
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="https://www.facebook.com/cataldosistonadvogados/" target="_blank" rel="noopener noreferrer" title="Facebook">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/72d95d25980c13a7793be843a3be119eac9a23d4?placeholderIfAbsent=true"
                  className="w-8 h-8 object-contain hover:opacity-80 cursor-pointer transition-opacity"
                  alt="Facebook"
                />
              </a>
              <a href="https://www.instagram.com/cataldosiston.advogados/" target="_blank" rel="noopener noreferrer" title="Instagram">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/244b9c45e595799dda32400ab0c739ab1dcf1e36?placeholderIfAbsent=true"
                  className="w-8 h-8 object-contain hover:opacity-80 cursor-pointer transition-opacity"
                  alt="Instagram"
                />
              </a>
              <a href="https://www.youtube.com/channel/UCldbgxJU1D9h3UAVUIRIRYg" target="_blank" rel="noopener noreferrer" title="YouTube">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/ca38ae4db7a6428881f7c632440d043a/e31888807ac0e2e4d00224790a076ac9216edea3?placeholderIfAbsent=true"
                  className="w-8 h-8 object-contain hover:opacity-80 cursor-pointer transition-opacity"
                  alt="YouTube"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Cataldo Siston Advogados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
