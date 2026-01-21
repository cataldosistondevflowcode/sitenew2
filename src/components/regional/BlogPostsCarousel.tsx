import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url?: string;
  category?: string;
  published_at: string;
  author_name?: string;
}

interface BlogPostsCarouselProps {
  limit?: number;
}

export function BlogPostsCarousel({ limit = 4 }: BlogPostsCarouselProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 
                       typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 4;

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_active', true)
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar posts do blog:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar posts do blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= posts.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, posts.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  const visiblePosts = posts.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="bg-gradient-to-r from-[#191919] to-[#464646] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-white">
              Blog & Dicas
            </h2>
            <p className="font-body text-white/80 mt-2">
              Conteúdos para ajudar você a investir com segurança
            </p>
          </div>
          
          {posts.length > itemsPerPage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full border-white/30 text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full border-white/30 text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {post.featured_image_url ? (
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#ebe5de] flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                {post.category && (
                  <Badge className="absolute top-2 left-2 bg-[#d68e08] text-white text-xs font-body">
                    {post.category}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-[#333333] text-xs mb-2 font-body">
                  <Calendar className="h-3 w-3 text-[#d68e08]" />
                  {formatDate(post.published_at)}
                </div>
                
                <h3 className="font-display text-base font-medium text-[#191919] mb-2 line-clamp-2 group-hover:text-[#d68e08] transition-colors">
                  {post.title}
                </h3>
                
                {post.excerpt && (
                  <p className="font-body text-[#333333] text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}

                <a 
                  href={`/blog/${post.slug}`}
                  className="text-[#d68e08] text-sm font-body font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Ler mais
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination dots */}
        {posts.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(posts.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsPerPage)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerPage) === i 
                    ? 'bg-[#d68e08]' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
