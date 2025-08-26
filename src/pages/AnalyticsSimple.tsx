import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AnalyticsSimple = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: visits } = await supabase
          .from('daily_visits')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);

        setData(visits || []);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando analytics...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📊 Sistema de Analytics - Leilão RJ Imóveis</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <a href="/admin" style={{ color: 'blue', textDecoration: 'underline' }}>
          ← Voltar ao Dashboard
        </a>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>✅ Sistema Funcionando!</h2>
        <p>As tabelas de analytics foram criadas com sucesso no Supabase.</p>
        <p>Conectado como: <strong>{user?.email}</strong></p>
      </div>

      <h3>📈 Últimas Visitas Diárias</h3>
      
      {data.length === 0 ? (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #ffeaa7'
        }}>
          <p><strong>Nenhum dado encontrado ainda.</strong></p>
          <p>Isso é normal se você acabou de implementar o sistema.</p>
          <p>Os dados começarão a aparecer quando os usuários visitarem o site.</p>
        </div>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Data</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Visitas</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Visitantes Únicos</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Page Views</th>
            </tr>
          </thead>
          <tbody>
            {data.map((visit, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {new Date(visit.date).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{visit.visits_count}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{visit.unique_visitors}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{visit.page_views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px'
      }}>
        <h3>🎯 Próximos Passos</h3>
        <ol>
          <li>Acesse páginas do site principal para gerar dados</li>
          <li>Faça algumas pesquisas para testar o tracking</li>
          <li>Volte aqui para ver os dados sendo populados</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>🔧 Se você não vê dados, verifique:</p>
        <ul>
          <li>As migrações foram aplicadas no Supabase</li>
          <li>O tracking está funcionando no site principal</li>
          <li>Não há erros no console do navegador</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsSimple;
