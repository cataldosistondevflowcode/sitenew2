import { MapPin, Home, TrendingUp } from 'lucide-react';

interface RegionDescriptionSectionProps {
  regionName: string;
  description?: string | null;
  estado: string;
  propertyCount?: number;
}

export function RegionDescriptionSection({
  regionName,
  description,
  estado,
  propertyCount = 0
}: RegionDescriptionSectionProps) {
  const stateName = estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo';
  
  // Descrição padrão se não fornecida
  const defaultDescription = `${regionName}/${estado} oferece excelentes oportunidades para quem busca imóveis em leilão. A região conta com boa infraestrutura, fácil acesso e valorização imobiliária constante. Seja para investir ou comprar um imóvel para morar, a equipe do Cataldo Siston pode ajudar você a encontrar e arrematar a melhor oportunidade em ${regionName}/${estado}. Veja abaixo todos os leilões de imóveis disponíveis.`;
  
  const displayDescription = description || defaultDescription;
  
  return (
    <section className="bg-white py-10 md:py-14 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-6">
          Veja todos os imóveis de leilão em {regionName}/{estado}
        </h2>
        
        {/* Description */}
        <p className="font-body text-[#333333] leading-relaxed text-base md:text-lg max-w-5xl mb-8">
          {displayDescription}
        </p>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-body text-[#333333]">
          <a href="/" className="hover:text-[#d68e08] transition-colors">Home</a>
          <span className="text-gray-400">→</span>
          <a href={`/leilao-${estado.toLowerCase()}`} className="hover:text-[#d68e08] transition-colors">{estado}</a>
          <span className="text-gray-400">→</span>
          <span className="text-[#d68e08] font-medium">{regionName}</span>
        </nav>
      </div>
    </section>
  );
}
