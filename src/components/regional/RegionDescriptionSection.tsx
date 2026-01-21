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
    <section className="bg-[#ebe5de] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-[#191919] rounded-full flex items-center justify-center">
            <Info className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-[#191919] mb-4">
              Sobre {regionName}
            </h2>
            <p className="font-body text-[#333333] leading-relaxed max-w-4xl text-base md:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
