import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Quote, Star } from 'lucide-react';

interface SuccessCase {
  id: number;
  title: string;
  description: string;
  client_name: string;
  client_image_url?: string;
  property_type: string;
  region: string;
  testimonial: string;
  is_featured: boolean;
}

interface SuccessCasesSectionProps {
  region?: string;
  limit?: number;
}

export function SuccessCasesSection({ region, limit = 3 }: SuccessCasesSectionProps) {
  const [cases, setCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuccessCases();
  }, [region]);

  const fetchSuccessCases = async () => {
    try {
      let query = supabase
        .from('success_cases')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .limit(limit);

      // Se uma região específica for passada, filtrar por ela
      if (region) {
        query = query.ilike('region', `%${region}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar casos de sucesso:', error);
      } else {
        setCases(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar casos de sucesso:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cases.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-4">
            Casos de Sucesso
          </h2>
          <p className="font-body text-[#333333] max-w-2xl mx-auto">
            Conheça histórias de clientes que realizaram o sonho do imóvel próprio através de leilões
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((successCase) => (
            <div
              key={successCase.id}
              className="bg-[#f5f5f5] rounded-lg p-6 md:p-8 relative border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-[#d68e08]/20">
                <Quote className="h-12 w-12" />
              </div>

              {/* Featured badge */}
              {successCase.is_featured && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-[#d68e08]/10 text-[#d68e08] px-3 py-1 rounded-full text-xs font-body font-semibold">
                    <Star className="h-3 w-3 fill-current" />
                    Destaque
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="mt-8">
                <h3 className="font-display text-lg font-medium text-[#191919] mb-2">
                  {successCase.title}
                </h3>
                
                <p className="font-body text-[#333333] text-sm mb-4">
                  {successCase.description}
                </p>

                {successCase.testimonial && (
                  <blockquote className="font-body text-[#333333] italic mb-6 border-l-4 border-[#d68e08] pl-4">
                    "{successCase.testimonial}"
                  </blockquote>
                )}

                {/* Client info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-12 h-12 bg-[#265c54] rounded-full flex items-center justify-center text-white font-display font-medium">
                    {successCase.client_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="font-body font-semibold text-[#191919]">
                      {successCase.client_name}
                    </div>
                    <div className="font-body text-sm text-[#333333]">
                      {successCase.property_type} • {successCase.region}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
