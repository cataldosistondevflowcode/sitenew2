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
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Casos de Sucesso
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça histórias de clientes que realizaram o sonho do imóvel próprio através de leilões
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((successCase) => (
            <div
              key={successCase.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-amber-200">
                <Quote className="h-12 w-12" />
              </div>

              {/* Featured badge */}
              {successCase.is_featured && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    Destaque
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="mt-8">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {successCase.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {successCase.description}
                </p>

                {successCase.testimonial && (
                  <blockquote className="text-gray-700 italic mb-6 border-l-4 border-amber-400 pl-4">
                    "{successCase.testimonial}"
                  </blockquote>
                )}

                {/* Client info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {successCase.client_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {successCase.client_name}
                    </div>
                    <div className="text-sm text-gray-500">
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
