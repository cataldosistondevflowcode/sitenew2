import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';

// Posts do blog institucional Cataldo Siston (extraídos do site)
const blogPosts = [
  {
    id: 1,
    title: 'Saiba como ocorre a imissão na posse em leilões de imóveis',
    excerpt: 'A imissão na posse em leilões de imóveis, seja extrajudiciais ou judiciais, é algo que suscita muitos questionamentos por parte dos licitantes ou interessados em participar desta modalidade de...',
    image: 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/imissao-na-posse-em-leiloes-judiciais-e-extrajudiciais.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/imissao-na-posse-em-leiloes-judiciais-e-extrajudiciais/',
    category: 'Leilões',
  },
  {
    id: 2,
    title: 'Impugnação à arrematação do imóvel: quando pode ocorrer?',
    excerpt: 'Um dos maiores receios de quem participa de leilões de imóveis, ou daqueles que têm interesse em participar, é chegar ao final de todo o processo e ocorrer algo...',
    image: 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/Em-quais-casos-uma-arrematacao-pode-ser-anulada.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/impugnacao-a-arrematacao-do-imovel/',
    category: 'Jurídico',
  },
  {
    id: 3,
    title: 'Leilão de imóveis: como funciona e dicas para participar',
    excerpt: 'O Raphael Siston, sócio do escritório Cataldo Siston, deu uma entrevista para a Casa & Jardim falando como funcionam os leilões de imóveis e de que forma é possível...',
    image: 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/Entrevista-do-Raphael-Siston-a-CASA-e-JARDIM.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-como-funciona/',
    category: 'Entrevista',
  },
  {
    id: 4,
    title: 'Imóveis em leilão costumam estar em péssimo estado de conservação?',
    excerpt: 'É preciso gastar uma fortuna em reforma após arrematar imóveis em leilão? Descubra a verdade sobre o estado de conservação dos imóveis leiloados.',
    image: 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/E-preciso-gastar-uma-fortuna-em-reforma-apos-arrematar-imoveis-em-leilao.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/imoveis-em-leilao-estado-de-conservacao/',
    category: 'Dicas',
  },
  {
    id: 5,
    title: 'O que você deve pagar, após arrematar um imóvel em leilão?',
    excerpt: 'Quais os custos após o leilão, além do valor da arrematação? Entenda todas as despesas envolvidas no processo de aquisição de imóveis em leilão.',
    image: 'https://leilaodeimoveis-cataldosiston.com/wp-content/uploads/2024/07/Quais-os-custos-apos-o-leilao-alem-do-valor-arrematacao.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/custos-apos-arrematar-imovel-leilao/',
    category: 'Financeiro',
  },
];

export function BlogPostsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 
                       typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= blogPosts.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? blogPosts.length - 1 : prev - 1
    );
  };

  // Criar array circular para exibição
  const getVisiblePosts = () => {
    const posts = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % blogPosts.length;
      posts.push(blogPosts[index]);
    }
    return posts;
  };

  const visiblePosts = getVisiblePosts();

  return (
    <section className="bg-gradient-to-r from-[#191919] to-[#464646] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white mb-4">
            Confira entrevistas e artigos do advogado Raphael
          </h2>
          <p className="font-display text-xl md:text-2xl text-white/90">
            Cataldo Siston sobre leilão de imóveis
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-[#d68e08] border-[#d68e08] text-white hover:bg-[#b87a07] hover:border-[#b87a07] shadow-lg hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-[#d68e08] border-[#d68e08] text-white hover:bg-[#b87a07] hover:border-[#b87a07] shadow-lg hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
            {visiblePosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#191919] rounded-lg overflow-hidden hover:shadow-xl transition-all group border border-gray-800"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-medium text-white mb-3 line-clamp-2 group-hover:text-[#d68e08] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="font-body text-white/70 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Read more indicator */}
                  <div className="flex items-center gap-2 text-[#d68e08] font-body text-sm font-semibold">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
                      <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
                      <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-[#d68e08] border-[#d68e08] text-white hover:bg-[#b87a07]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-[#d68e08] border-[#d68e08] text-white hover:bg-[#b87a07]"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* CTA para o blog */}
        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white/10 font-body font-semibold px-8"
          >
            <a 
              href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver todos os artigos
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
