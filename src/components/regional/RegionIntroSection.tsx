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
    <section className="bg-gradient-to-r from-[#191919] to-[#464646] text-white relative overflow-hidden">
      {/* Background pattern overlay - Design System v2.1: gradiente grafite */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="flex items-center gap-2 text-[#d68e08] mb-4">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-body font-semibold uppercase tracking-wider">
            {filterType === 'bairro' ? 'Bairro' : filterType === 'zona' ? 'Zona' : 'Cidade'} • {stateName}
          </span>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl lg:text-[44px] font-medium text-white mb-6 leading-tight">
          {title}
        </h1>
        
        {introText && (
          <p className="font-body text-lg md:text-xl text-white/90 max-w-4xl leading-relaxed">
            {introText}
          </p>
        )}
      </div>
    </section>
  );
}
