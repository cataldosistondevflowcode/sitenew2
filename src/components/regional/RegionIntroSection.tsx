import { MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegionIntroSectionProps {
  regionName: string;
  introText?: string | null;
  h1Title?: string | null;
  estado: string;
  filterType: string;
  filterValue: string;
  propertyCount?: number;
}

// Imagens de fundo por região/estado (podem ser substituídas por imagens específicas)
const getBackgroundImage = (estado: string, regionName: string): string => {
  // Imagens genéricas por estado - podem ser personalizadas por região no futuro
  const images: Record<string, string> = {
    'RJ': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80', // Rio de Janeiro
    'SP': 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1920&q=80', // São Paulo
  };
  return images[estado] || images['RJ'];
};

export function RegionIntroSection({
  regionName,
  introText,
  h1Title,
  estado,
  filterType,
  filterValue,
  propertyCount
}: RegionIntroSectionProps) {
  const title = h1Title || `Imóveis em Leilão em ${regionName}`;
  const stateName = estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo';
  const backgroundImage = getBackgroundImage(estado, regionName);
  
  // Texto introdutório padrão se não fornecido
  const defaultIntroText = `Encontre as melhores oportunidades de imóveis em leilão em ${regionName}. Nossa equipe especializada pode ajudá-lo a encontrar e arrematar a melhor oportunidade em ${regionName}/${estado}.`;
  const displayIntroText = introText || defaultIntroText;

  const handleCTAClick = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent(
      `Olá! Tenho interesse em receber oportunidades de imóveis em leilão em ${regionName}/${estado}. Gostaria de mais informações.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };
  
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          {/* Breadcrumb / Location indicator */}
          <div className="flex items-center gap-2 text-[#d68e08] mb-6">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-body font-semibold uppercase tracking-wider">
              {filterType === 'bairro' ? 'Bairro' : filterType === 'zona' ? 'Zona' : 'Cidade'} • {stateName}
            </span>
          </div>
          
          {/* H1 Title - Principal */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-[48px] font-medium text-white mb-6 leading-tight max-w-3xl">
            {title}
          </h1>
          
          {/* Intro Text - Contextualização da região */}
          <p className="font-body text-base md:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed mb-8">
            {displayIntroText}
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 h-auto shadow-lg hover:shadow-xl transition-all group"
          >
            Quero receber novas oportunidades
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Property count indicator (optional) */}
          {propertyCount !== undefined && propertyCount > 0 && (
            <p className="mt-6 text-white/70 font-body text-sm">
              <span className="text-[#d68e08] font-semibold">{propertyCount}</span> imóveis disponíveis nesta região
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
