import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Award, Users, Clock } from 'lucide-react';

export function AboutCompanySection() {
  return (
    <section className="bg-white py-12 md:py-16 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Conheça a Cataldo Siston
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              A Cataldo Siston é um escritório de advocacia especializado em leilões de imóveis, 
              com mais de 15 anos de experiência no mercado imobiliário do Rio de Janeiro e São Paulo. 
              Nossa equipe de advogados especializados oferece assessoria completa em todas as etapas 
              do processo de aquisição de imóveis em leilão.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-500">Anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Clientes atendidos</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Taxa de sucesso</div>
              </div>
            </div>
            
            {/* Contato */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>Rio de Janeiro e São Paulo</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>(21) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>contato@cataldosiston.com.br</span>
              </div>
            </div>
          </div>
          
          {/* Imagem/Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-2xl p-8 md:p-12">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">CS</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Cataldo Siston</h3>
                    <p className="text-gray-500">Advocacia Imobiliária</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Assessoria jurídica completa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Análise de riscos do imóvel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Acompanhamento pós-leilão</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-amber-500 hover:bg-amber-600">
                  Fale com um Especialista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
