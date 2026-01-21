import { MapPin, Landmark, Building2, Star } from 'lucide-react';

interface RegionContent {
  neighborhoods?: string[];
  attractions?: string[];
  infrastructure?: string[];
  highlights?: string[];
}

interface RegionContentSectionProps {
  regionName: string;
  content?: RegionContent | null;
}

export function RegionContentSection({
  regionName,
  content
}: RegionContentSectionProps) {
  if (!content) return null;
  
  const hasContent = 
    (content.neighborhoods && content.neighborhoods.length > 0) ||
    (content.attractions && content.attractions.length > 0) ||
    (content.infrastructure && content.infrastructure.length > 0) ||
    (content.highlights && content.highlights.length > 0);
    
  if (!hasContent) return null;
  
  const sections = [
    {
      key: 'neighborhoods',
      title: 'Bairros da Região',
      icon: MapPin,
      items: content.neighborhoods
    },
    {
      key: 'attractions',
      title: 'Atrações',
      icon: Landmark,
      items: content.attractions
    },
    {
      key: 'infrastructure',
      title: 'Infraestrutura',
      icon: Building2,
      items: content.infrastructure
    },
    {
      key: 'highlights',
      title: 'Diferenciais',
      icon: Star,
      items: content.highlights
    }
  ].filter(section => section.items && section.items.length > 0);
  
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-10 text-center">
          Conheça mais sobre {regionName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            
            return (
              <div 
                key={section.key}
                className="bg-[#f5f5f5] rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#191919] flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-medium text-[#191919]">
                    {section.title}
                  </h3>
                </div>
                
                <ul className="space-y-2.5">
                  {section.items?.map((item, index) => (
                    <li 
                      key={index}
                      className="font-body text-[#333333] text-sm flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d68e08] mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
