import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// Posts do blog institucional Cataldo Siston com imagens locais do /public
const blogPosts = [
  {
    id: 1,
    title: 'Imóveis em leilão costumam estar em péssimo estado de conservação?',
    excerpt: 'Muitos investidores e compradores em potencial se preocupam com o estado de conservação dos imóveis em leilão. A ideia de que essas propriedades estão completamente deterioradas, exigindo reformas onerosas,...',
    image: '/imoveis-em-leilao-costumam-estar-em-pessimo-estado-de-conservacao-blog-cataldo-siston-advogados.jpg',
    url: 'https://leilaodeimoveis-cataldosiston.com/imoveis-em-leilao-estado-de-conservacao/',
  },
  {
    id: 2,
    title: 'O que você deve pagar, após arrematar um imóvel em leilão?',
    excerpt: 'Quando você decide adquirir um imóvel em leilão, seja judicial ou extrajudicial, a arrematação é apenas o primeiro passo para garantir a sua propriedade. O valor do lance é...',
    image: '/custos-apos-a-arrematacao-blog-cataldo-siston-advogados.jpg',
    url: 'https://leilaodeimoveis-cataldosiston.com/custos-apos-arrematar-imovel-leilao/',
  },
  {
    id: 3,
    title: 'Saiba como ocorre a imissão na posse em leilões de imóveis',
    excerpt: 'A imissão na posse em leilões de imóveis, seja extrajudiciais ou judiciais, é algo que suscita muitos questionamentos por parte dos licitantes ou interessados em participar desta modalidade de...',
    image: '/como-ocorre-a-imissao-na-posse-leiloes-de-imoveis-blog-escritorio-cataldo-siston.webp',
    url: 'https://leilaodeimoveis-cataldosiston.com/imissao-na-posse-em-leiloes-judiciais-e-extrajudiciais/',
  },
  {
    id: 4,
    title: 'Impugnação à arrematação do imóvel: quando pode ocorrer?',
    excerpt: 'Um dos maiores receios de quem participa de leilões de imóveis, ou daqueles que têm interesse em participar, é chegar ao final de todo o processo e ocorrer algo...',
    image: '/impugnacao-a-arrematacao-quando-pode-ocorrer-blog-escritorio-cataldo-siston.webp',
    url: 'https://leilaodeimoveis-cataldosiston.com/impugnacao-a-arrematacao-do-imovel/',
  },
  {
    id: 5,
    title: 'Leilão de imóveis: como funciona e dicas para participar',
    excerpt: 'O Raphael Siston, sócio do escritório Cataldo Siston, deu uma entrevista para a Casa & Jardim falando como funcionam os leilões de imóveis e de que forma é possível...',
    image: '/entrevista-casa-jardim-como-funcionam-leiloes-de-imoveis.png',
    url: 'https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-como-funciona/',
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
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Estilo do site institucional */}
        <div className="text-center mb-12">
          <p className="font-body text-[#333333] mb-2">— Postagens do Blog —</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919]">
            Últimas Publicações
          </h2>
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

          {/* Posts Grid - Estilo cards escuros como no site institucional */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
            {visiblePosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#191919] rounded-lg overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/imagem-padrao.webp';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-medium text-white mb-3 line-clamp-2 group-hover:text-[#d68e08] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="font-body text-white/70 text-sm line-clamp-4 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Read more indicator - 3 pontos dourados */}
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
                    <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
                    <span className="w-2 h-2 bg-[#d68e08] rounded-full"></span>
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
            size="lg"
            className="bg-[#d68e08] hover:bg-[#b87a07] text-white font-body font-semibold px-8"
          >
            <a 
              href="https://leilaodeimoveis-cataldosiston.com/blog-cataldo-siston-advogados/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Veja todas
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
