/**
 * NoScriptFallback Component
 * 
 * Fornece conteúdo alternativo para motores de busca e usuários
 * com JavaScript desabilitado. Importante para SEO.
 * 
 * Sprint 7 - Melhoria de acessibilidade e SEO
 */

interface NoScriptFallbackProps {
  pageTitle: string;
  pageDescription: string;
  region?: string;
  estado?: string;
}

export const NoScriptFallback = ({
  pageTitle,
  pageDescription,
  region,
  estado,
}: NoScriptFallbackProps) => {
  const whatsappLink = "https://wa.me/5521977294848";
  const contactEmail = "contato@cataldosiston-adv.com.br";
  const mainSiteUrl = "https://leilaodeimoveis-cataldosiston.com";
  
  return (
    <noscript>
      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '800px', 
        margin: '0 auto', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#191919' }}>
          {pageTitle}
        </h1>
        
        <p style={{ fontSize: '16px', marginBottom: '20px', color: '#333' }}>
          {pageDescription}
        </p>
        
        {region && estado && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#191919' }}>
              Imóveis em Leilão em {region} - {estado}
            </h2>
            <p style={{ color: '#555' }}>
              Encontre as melhores oportunidades de imóveis em leilão em {region}. 
              A Cataldo Siston Advogados oferece assessoria jurídica especializada 
              para arrematação segura em leilões judiciais e extrajudiciais.
            </p>
          </div>
        )}
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '25px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#191919' }}>
            Por que escolher a Cataldo Siston?
          </h3>
          <ul style={{ paddingLeft: '20px', color: '#555' }}>
            <li style={{ marginBottom: '8px' }}>Mais de 20 anos de experiência em leilões de imóveis</li>
            <li style={{ marginBottom: '8px' }}>Assessoria jurídica completa e especializada</li>
            <li style={{ marginBottom: '8px' }}>Análise de viabilidade jurídica antes da arrematação</li>
            <li style={{ marginBottom: '8px' }}>Acompanhamento de todo o processo até o registro</li>
            <li style={{ marginBottom: '8px' }}>Imóveis até 50% abaixo do valor de mercado</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#191919' }}>
            Entre em Contato
          </h3>
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
            <strong>Site:</strong>{' '}
            <a href={mainSiteUrl} style={{ color: '#d68e08' }}>
              {mainSiteUrl}
            </a>
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#d68e08', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center' as const
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Para ver a listagem completa de imóveis, habilite o JavaScript no seu navegador.
          </p>
          <p style={{ fontSize: '14px' }}>
            Ou entre em contato conosco para receber oportunidades personalizadas.
          </p>
        </div>
        
        <footer style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #ddd',
          textAlign: 'center' as const,
          color: '#777',
          fontSize: '14px'
        }}>
          <p>© 2025 Cataldo Siston Advogados. Todos os direitos reservados.</p>
          <p>Av. Rio Branco, 156, Gr. 3336 a 3339 - Centro - Rio de Janeiro - RJ</p>
        </footer>
      </div>
    </noscript>
  );
};

export default NoScriptFallback;
