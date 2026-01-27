/**
 * NoScriptFallback Component
 * 
 * Fornece conteúdo alternativo ÚNICO para motores de busca e usuários
 * com JavaScript desabilitado. Crítico para SEO - cada página regional
 * deve ter conteúdo diferenciado para evitar duplicação.
 * 
 * Sprint 7 - Melhoria de acessibilidade e SEO
 * Sprint 8 - Conteúdo único por região para evitar páginas idênticas
 */

import { getRegionContent, RegionContent } from '@/data/regionContent';

interface NoScriptFallbackProps {
  pageTitle: string;
  pageDescription: string;
  region?: string;
  estado?: string;
  pageId?: string;
}

export const NoScriptFallback = ({
  pageTitle,
  pageDescription,
  region,
  estado,
  pageId,
}: NoScriptFallbackProps) => {
  const whatsappLink = "https://wa.me/5521977294848";
  const contactEmail = "contato@cataldosiston-adv.com.br";
  const mainSiteUrl = "https://leilaodeimoveis-cataldosiston.com";
  const baseUrl = "https://sitenew2.vercel.app";
  
  // Obter conteúdo específico da região
  const regionContent: RegionContent | null = pageId ? getRegionContent(pageId) : null;
  
  return (
    <noscript>
      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6',
        backgroundColor: '#fff'
      }}>
        {/* Header */}
        <header style={{ 
          backgroundColor: '#3C3C3C', 
          padding: '20px', 
          marginBottom: '30px',
          borderRadius: '8px',
          textAlign: 'center' as const
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            marginBottom: '10px', 
            color: '#d68e08',
            fontFamily: 'Playfair Display, Georgia, serif'
          }}>
            Cataldo Siston Advogados
          </h1>
          <p style={{ color: '#fff', margin: 0 }}>
            Especialistas em Leilões de Imóveis no Rio de Janeiro e São Paulo
          </p>
        </header>

        {/* Hero Section - Título Único */}
        <section style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            marginBottom: '15px', 
            color: '#191919',
            fontFamily: 'Playfair Display, Georgia, serif'
          }}>
            {regionContent?.heroTitle || pageTitle}
          </h1>
          
          <p style={{ fontSize: '16px', marginBottom: '20px', color: '#333' }}>
            {regionContent?.heroDescription || pageDescription}
          </p>
        </section>

        {/* Seção Sobre - Conteúdo Único */}
        {regionContent && (
          <section style={{ 
            backgroundColor: '#EBE5DE', 
            padding: '25px', 
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              fontSize: '22px', 
              marginBottom: '15px', 
              color: '#191919',
              fontFamily: 'Playfair Display, Georgia, serif'
            }}>
              {regionContent.aboutTitle}
            </h2>
            <p style={{ color: '#333', marginBottom: '20px' }}>
              {regionContent.aboutDescription}
            </p>

            {/* Grid de Informações Únicas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginTop: '20px'
            }}>
              {/* Bairros */}
              <div>
                <h3 style={{ fontSize: '16px', color: '#191919', marginBottom: '10px' }}>
                  Bairros da Região
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#555', margin: 0 }}>
                  {regionContent.neighborhoods.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Atrações */}
              <div>
                <h3 style={{ fontSize: '16px', color: '#191919', marginBottom: '10px' }}>
                  Atrações
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#555', margin: 0 }}>
                  {regionContent.attractions.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Infraestrutura */}
              <div>
                <h3 style={{ fontSize: '16px', color: '#191919', marginBottom: '10px' }}>
                  Infraestrutura
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#555', margin: 0 }}>
                  {regionContent.infrastructure.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Diferenciais */}
              <div>
                <h3 style={{ fontSize: '16px', color: '#191919', marginBottom: '10px' }}>
                  Diferenciais
                </h3>
                <ul style={{ paddingLeft: '20px', color: '#555', margin: 0 }}>
                  {regionContent.highlights.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Informações Adicionais Únicas */}
            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #d5d0c8' }}>
              <p style={{ color: '#333', marginBottom: '10px' }}>
                <strong>Tipos de Imóveis:</strong> {regionContent.propertyTypes.join(', ')}
              </p>
              <p style={{ color: '#333', marginBottom: '10px' }}>
                <strong>Faixa de Preço Médio:</strong> {regionContent.averagePriceRange}
              </p>
              <p style={{ color: '#333', margin: 0 }}>
                <strong>Transporte:</strong> {regionContent.transportInfo}
              </p>
            </div>
          </section>
        )}

        {/* Imóveis em Leilão */}
        <section style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '25px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            marginBottom: '15px', 
            color: '#191919',
            fontFamily: 'Playfair Display, Georgia, serif'
          }}>
            Imóveis em Leilão {region && estado ? `em ${region} - ${estado}` : ''}
          </h2>
          <p style={{ color: '#555', marginBottom: '15px' }}>
            O escritório Cataldo Siston Advogados oferece assessoria jurídica completa para 
            arrematação de imóveis em leilões judiciais e extrajudiciais{region ? ` em ${region}` : ''}, 
            com mais de 20 anos de experiência no mercado.
          </p>
          <ul style={{ paddingLeft: '20px', color: '#555' }}>
            <li style={{ marginBottom: '8px' }}>Análise jurídica completa antes da arrematação</li>
            <li style={{ marginBottom: '8px' }}>Acompanhamento em todas as fases do processo</li>
            <li style={{ marginBottom: '8px' }}>Equipe especializada em direito imobiliário</li>
            <li style={{ marginBottom: '8px' }}>Histórico de sucesso em centenas de arrematações</li>
            <li style={{ marginBottom: '8px' }}>Imóveis até 50% abaixo do valor de mercado</li>
          </ul>
        </section>

        {/* Regiões Relacionadas - Links Internos Únicos */}
        {regionContent && regionContent.relatedRegions.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '20px', 
              marginBottom: '15px', 
              color: '#191919',
              fontFamily: 'Playfair Display, Georgia, serif'
            }}>
              Regiões Atendidas
            </h2>
            <p style={{ color: '#555', marginBottom: '15px' }}>
              Oferecemos assessoria para imóveis em leilão nas seguintes regiões:
            </p>
            <nav>
              <ul style={{ paddingLeft: '20px', color: '#555' }}>
                {regionContent.relatedRegions.map((related, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>
                    <a 
                      href={`${baseUrl}/catalogo/${related.slug}`} 
                      style={{ color: '#d68e08', textDecoration: 'none' }}
                    >
                      Imóveis em Leilão em {related.name}
                    </a>
                  </li>
                ))}
                <li style={{ marginBottom: '10px' }}>
                  <a 
                    href={baseUrl} 
                    style={{ color: '#d68e08', textDecoration: 'none' }}
                  >
                    Ver todos os imóveis em leilão
                  </a>
                </li>
              </ul>
            </nav>
          </section>
        )}

        {/* Contato */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            marginBottom: '15px', 
            color: '#191919',
            fontFamily: 'Playfair Display, Georgia, serif'
          }}>
            Entre em Contato
          </h2>
          <p style={{ marginBottom: '10px' }}>
            <strong>WhatsApp:</strong>{' '}
            <a href={whatsappLink} style={{ color: '#d68e08' }}>
              +55 (21) 97729-4848
            </a>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Telefone:</strong>{' '}
            <a href="tel:+552131733795" style={{ color: '#d68e08' }}>
              +55 (21) 3173-3795
            </a>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${contactEmail}`} style={{ color: '#d68e08' }}>
              {contactEmail}
            </a>
          </p>
          <p>
            <strong>Site Institucional:</strong>{' '}
            <a href={mainSiteUrl} style={{ color: '#d68e08' }}>
              {mainSiteUrl}
            </a>
          </p>
        </section>

        {/* CTA */}
        <section style={{ 
          backgroundColor: '#d68e08', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '8px',
          textAlign: 'center' as const,
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            marginBottom: '15px', 
            fontWeight: 'bold',
            fontFamily: 'Playfair Display, Georgia, serif'
          }}>
            Fale Conosco pelo WhatsApp
          </h2>
          <p style={{ marginBottom: '15px' }}>
            Receba oportunidades personalizadas de imóveis em leilão{region ? ` em ${region}` : ''}.
          </p>
          <a 
            href={whatsappLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#d68e08',
              padding: '12px 30px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Quero receber oportunidades
          </a>
        </section>

        {/* Footer */}
        <footer style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #ddd',
          textAlign: 'center' as const,
          color: '#777',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '10px' }}>
            © 2025 Cataldo Siston Advogados. Todos os direitos reservados.
          </p>
          <p style={{ marginBottom: '10px' }}>
            Av. Rio Branco, 156, Gr. 3336 a 3339 - Centro - Rio de Janeiro - RJ
          </p>
          <nav style={{ marginTop: '15px' }}>
            <a href={`${mainSiteUrl}/escritorio/`} style={{ color: '#d68e08', marginRight: '15px' }}>Quem Somos</a>
            <a href={`${mainSiteUrl}/leilao-imoveis-rj/`} style={{ color: '#d68e08', marginRight: '15px' }}>Assessoria em Leilões</a>
            <a href={`${mainSiteUrl}/casos-reais/`} style={{ color: '#d68e08', marginRight: '15px' }}>Casos de Sucesso</a>
            <a href={`${mainSiteUrl}/contato-advogados-imobiliarios/`} style={{ color: '#d68e08' }}>Contato</a>
          </nav>
        </footer>
      </div>
    </noscript>
  );
};

export default NoScriptFallback;
