import { Button } from '@/components/ui/button';
import { Play, ExternalLink, MapPin, TrendingDown } from 'lucide-react';

// Casos reais extraídos do site institucional Cataldo Siston
const realCases = [
  {
    id: 1,
    title: 'Leilão de imóvel | Ipanema/RJ',
    location: 'Ipanema, Rio de Janeiro',
    videoThumbnail: 'https://img.youtube.com/vi/VIDEO_ID_1/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ID_1',
    description: 'Caso real de imóvel em leilão em Ipanema, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
    arrematacao: 'R$ 2.984.000,00',
    mercado: 'R$ 6.200.000,00',
  },
  {
    id: 2,
    title: 'Leilão de imóvel | Botafogo/RJ',
    location: 'Botafogo, Rio de Janeiro',
    videoThumbnail: 'https://img.youtube.com/vi/VIDEO_ID_2/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ID_2',
    description: 'Caso real de imóvel em leilão em Botafogo, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
    arrematacao: 'R$ 501.000,00',
    mercado: 'R$ 1.147.015,67',
  },
  {
    id: 3,
    title: 'Leilão de imóvel | Copacabana/RJ',
    location: 'Copacabana, Rio de Janeiro',
    videoThumbnail: 'https://img.youtube.com/vi/VIDEO_ID_3/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ID_3',
    description: 'Caso real de imóvel em leilão em Copacabana, assessorado pela equipe jurídica do escritório Cataldo Siston Advogados.',
    arrematacao: 'R$ 2.855.000,00',
    mercado: 'R$ 4.262.270,00',
  },
];

interface SuccessCasesSectionProps {
  region?: string;
}

export function SuccessCasesSection({ region }: SuccessCasesSectionProps) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-4">
            Casos de Sucesso
          </h2>
          <p className="font-body text-[#333333] max-w-2xl mx-auto">
            Mais de <span className="font-semibold text-[#d68e08]">1200 arrematações imobiliárias</span> em 19 anos de experiência
          </p>
        </div>

        {/* Cases Grid - Estilo de vídeos do YouTube */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {realCases.map((caseItem) => (
            <article
              key={caseItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-[#191919]">
                <img
                  src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop`}
                  alt={caseItem.title}
                  className="w-full h-full object-cover opacity-80"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm font-body line-clamp-2">
                    {caseItem.title}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-medium text-[#191919] mb-2">
                  {caseItem.title}
                </h3>
                
                <p className="font-body text-[#333333] text-sm mb-4">
                  {caseItem.description}
                </p>

                {/* Valores */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-[#f5f5f5] rounded-lg">
                  <div>
                    <p className="font-body text-xs text-[#333333] mb-1">Valor de arrematação</p>
                    <p className="font-display text-lg font-semibold text-[#d68e08]">
                      {caseItem.arrematacao}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#333333] mb-1">Histórico de mercado</p>
                    <p className="font-display text-lg font-semibold text-[#333333] line-through opacity-70">
                      {caseItem.mercado}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm font-body text-[#d68e08]">
                  <MapPin className="h-4 w-4" />
                  {caseItem.location}
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
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
