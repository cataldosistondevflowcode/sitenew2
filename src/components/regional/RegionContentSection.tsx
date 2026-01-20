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
      items: content.neighborhoods,
      color: 'blue'
    },
    {
      key: 'attractions',
      title: 'Atrações',
      icon: Landmark,
      items: content.attractions,
      color: 'amber'
    },
    {
      key: 'infrastructure',
      title: 'Infraestrutura',
      icon: Building2,
      items: content.infrastructure,
      color: 'green'
    },
    {
      key: 'highlights',
      title: 'Diferenciais',
      icon: Star,
      items: content.highlights,
      color: 'purple'
    }
  ].filter(section => section.items && section.items.length > 0);
  
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-900' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-900' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-900' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900' }
  };
  
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Conheça mais sobre {regionName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const colors = colorClasses[section.color];
            
            return (
              <div 
                key={section.key}
                className={`${colors.bg} rounded-xl p-6 transition-transform hover:scale-105`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <h3 className={`font-semibold ${colors.text}`}>
                    {section.title}
                  </h3>
                </div>
                
                <ul className="space-y-2">
                  {section.items?.map((item, index) => (
                    <li 
                      key={index}
                      className="text-gray-700 text-sm flex items-start gap-2"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
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
