import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin } from 'lucide-react';

// Casos reais com IDs de vídeos do YouTube (extraídos do componente SuccessCases.tsx existente)
const realCases = [
  {
    id: 1,
    youtubeId: 'nXMiKXmjEOs',
    title: 'Leilão de imóvel | Ipanema/RJ',
    location: 'Ipanema, Rio de Janeiro',
    description: 'Caso real de imóvel em leilão em Ipanema, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
  },
  {
    id: 2,
    youtubeId: 'AH_sNBsqIMg',
    title: 'Leilão de imóvel | Botafogo/RJ',
    location: 'Botafogo, Rio de Janeiro',
    description: 'Caso real de imóvel em leilão em Botafogo, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
  },
  {
    id: 3,
    youtubeId: '9vziuX_9kxA',
    title: 'Leilão de imóvel | Fonte da Saudade/RJ',
    location: 'Fonte da Saudade, Rio de Janeiro',
    description: 'Caso real de imóvel em leilão na Fonte da Saudade assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
  },
];

interface SuccessCasesSectionProps {
  region?: string;
}

export function SuccessCasesSection({ region }: SuccessCasesSectionProps) {
  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-4">
            Casos de Sucesso
          </h2>
        </div>

        {/* Cases Grid com vídeos do YouTube */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {realCases.map((caseItem) => (
            <article
              key={caseItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* YouTube Video Embed */}
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${caseItem.youtubeId}`}
                  title={caseItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-medium text-[#191919] mb-2">
                  {caseItem.title}
                </h3>
                
                <p className="font-body text-[#333333] text-sm mb-4">
                  {caseItem.description}
                </p>

                {/* Link para escritório */}
                <div className="text-[#d68e08] text-sm font-body font-semibold">
                  Cataldo Siston Advogados
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold px-8"
          >
            <a 
              href="https://leilaodeimoveis-cataldosiston.com/casos-reais/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Veja os nossos resultados
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
