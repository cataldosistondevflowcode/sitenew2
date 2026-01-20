import { Info } from 'lucide-react';

interface RegionDescriptionSectionProps {
  regionName: string;
  description?: string | null;
}

export function RegionDescriptionSection({
  regionName,
  description
}: RegionDescriptionSectionProps) {
  if (!description) return null;
  
  return (
    <section className="bg-white py-10 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Sobre {regionName}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-4xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
