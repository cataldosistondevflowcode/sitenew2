import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Eye, Search, Users, MessageSquare } from 'lucide-react';

const AnalyticsTablesView = () => {
  const [dailyVisits, setDailyVisits] = useState<any[]>([]);
  const [propertyViews, setPropertyViews] = useState<any[]>([]);
  const [propertyClicks, setPropertyClicks] = useState<any[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([]);
  const [contactLeads, setContactLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Buscar dados das tabelas de analytics
      const [visitsResult, viewsResult, clicksResult, searchResult, leadsResult] = await Promise.all([
        supabase.from('daily_visits').select('*').order('date', { ascending: false }).limit(10),
        supabase.from('property_views').select(`
          *,
          leiloes_imoveis:property_id(titulo_propriedade, cidade, estado)
        `).order('viewed_at', { ascending: false }).limit(20),
        supabase.from('property_clicks').select(`
          *,
          leiloes_imoveis:property_id(titulo_propriedade, cidade, estado)
        `).order('clicked_at', { ascending: false }).limit(20),
        supabase.from('search_analytics').select('*').order('searched_at', { ascending: false }).limit(20),
        supabase.from('contact_leads').select(`
          *,
          leiloes_imoveis:property_id(titulo_propriedade, cidade, estado)
        `).order('created_at', { ascending: false }).limit(20)
      ]);

      setDailyVisits(visitsResult.data || []);
      setPropertyViews(viewsResult.data || []);
      setPropertyClicks(clicksResult.data || []);
      setSearchAnalytics(searchResult.data || []);
      setContactLeads(leadsResult.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados de analytics...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tabelas de Analytics</h2>
        <Button onClick={fetchAnalyticsData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Visitas Diárias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visitas Diárias ({dailyVisits.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Visitantes Únicos</TableHead>
                  <TableHead>Page Views</TableHead>
                  <TableHead>Atualizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyVisits.map((visit, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(visit.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{visit.visits_count}</TableCell>
                    <TableCell>{visit.unique_visitors}</TableCell>
                    <TableCell>{visit.page_views}</TableCell>
                    <TableCell>{new Date(visit.updated_at).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Visualizações de Propriedades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visualizações de Propriedades ({propertyViews.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>IP Visitante</TableHead>
                  <TableHead>Tempo Gasto</TableHead>
                  <TableHead>Visualizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyViews.map((view, index) => (
                  <TableRow key={index}>
                    <TableCell>ID {view.property_id}</TableCell>
                    <TableCell className="max-w-64 truncate">
                      {view.leiloes_imoveis?.titulo_propriedade || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {view.leiloes_imoveis ? 
                        `${view.leiloes_imoveis.cidade}, ${view.leiloes_imoveis.estado}` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>{view.visitor_ip}</TableCell>
                    <TableCell>{view.time_spent_seconds}s</TableCell>
                    <TableCell>{new Date(view.viewed_at).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
              </Card>

      {/* Cliques em Propriedades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Cliques em Propriedades ({propertyClicks.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Tipo Clique</TableHead>
                  <TableHead>IP Visitante</TableHead>
                  <TableHead>Clicado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyClicks.map((click, index) => (
                  <TableRow key={index}>
                    <TableCell>ID {click.property_id}</TableCell>
                    <TableCell className="max-w-64 truncate">
                      {click.leiloes_imoveis?.titulo_propriedade || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {click.leiloes_imoveis ? 
                        `${click.leiloes_imoveis.cidade}, ${click.leiloes_imoveis.estado}` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        click.click_type === 'saiba_mais' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {click.click_type}
                      </span>
                    </TableCell>
                    <TableCell>{click.visitor_ip}</TableCell>
                    <TableCell>{new Date(click.clicked_at).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics de Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisas e Filtros ({searchAnalytics.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Filtros</TableHead>
                  <TableHead>Resultados</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Pesquisado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchAnalytics.map((search, index) => (
                  <TableRow key={index}>
                    <TableCell>{search.search_query || 'N/A'}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {search.filters_used ? JSON.stringify(search.filters_used) : 'N/A'}
                    </TableCell>
                    <TableCell>{search.results_count}</TableCell>
                    <TableCell>{search.visitor_ip}</TableCell>
                    <TableCell>{new Date(search.searched_at).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Leads de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Leads de Contato ({contactLeads.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactLeads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell>{lead.name || 'N/A'}</TableCell>
                    <TableCell>{lead.email || 'N/A'}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {lead.property_id ? `ID ${lead.property_id}` : 'Newsletter Geral'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lead.contact_method === 'whatsapp' ? 'bg-green-100 text-green-800' :
                        lead.contact_method === 'email' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.contact_method}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(lead.created_at).toLocaleString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTablesView;
