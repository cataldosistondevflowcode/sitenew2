import { MapPin } from 'lucide-react';

interface RegionIntroSectionProps {
  regionName: string;
  introText?: string | null;
  h1Title?: string | null;
  estado: string;
  filterType: string;
  filterValue: string;
}

export function RegionIntroSection({
  regionName,
  introText,
  h1Title,
  estado,
  filterType,
  filterValue
}: RegionIntroSectionProps) {
  const title = h1Title || `Imóveis em Leilão em ${regionName}`;
  const stateName = estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo';
  
  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 text-amber-700 mb-4">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            {filterType === 'bairro' ? 'Bairro' : filterType === 'zona' ? 'Zona' : 'Cidade'} • {stateName}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        
        {introText && (
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl leading-relaxed">
            {introText}
          </p>
        )}
      </div>
    </section>
  );
}
