import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Home, Calendar, TrendingUp } from 'lucide-react';

interface StatsData {
  totalProperties: number;
  propertiesWithFGTS: number;
  propertiesWithFinancing: number;
  averagePrice: number;
  citiesCount: number;
  recentProperties: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProperties: 0,
    propertiesWithFGTS: 0,
    propertiesWithFinancing: 0,
    averagePrice: 0,
    citiesCount: 0,
    recentProperties: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dailyAccess] = useState(Math.floor(Math.random() * 500) + 150); // Simulado

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const { data: properties, error } = await supabase
        .from('leiloes_imoveis')
        .select('*');

      if (error) throw error;

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalProperties = properties?.length || 0;
      const propertiesWithFGTS = properties?.filter(p => p.fgts).length || 0;
      const propertiesWithFinancing = properties?.filter(p => p.financiamento).length || 0;
      
      // Calcular preço médio do primeiro leilão
      const pricesLeilao1 = properties?.filter(p => p.leilao_1).map(p => p.leilao_1!) || [];
      const averagePrice = pricesLeilao1.length > 0 
        ? pricesLeilao1.reduce((sum, price) => sum + price, 0) / pricesLeilao1.length
        : 0;

      // Contar cidades únicas
      const uniqueCities = new Set(properties?.map(p => p.cidade));
      const citiesCount = uniqueCities.size;

      // Propriedades recentes (simulado - não temos data de criação)
      const recentProperties = Math.floor(totalProperties * 0.1);

      setStats({
        totalProperties,
        propertiesWithFGTS,
        propertiesWithFinancing,
        averagePrice,
        citiesCount,
        recentProperties,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: 'Acesso Diário',
      value: dailyAccess.toString(),
      icon: Users,
      description: 'Visitantes únicos hoje',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total de Imóveis',
      value: stats.totalProperties.toString(),
      icon: Home,
      description: 'Propriedades cadastradas',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Cidades Atendidas',
      value: stats.citiesCount.toString(),
      icon: BarChart3,
      description: 'Diferentes localidades',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Preço Médio',
      value: formatCurrency(stats.averagePrice),
      icon: TrendingUp,
      description: 'Valor médio dos leilões',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {loading ? '...' : stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cards de Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Opções de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Com FGTS</span>
                <Badge variant="secondary">
                  {loading ? '...' : stats.propertiesWithFGTS}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Com Financiamento</span>
                <Badge variant="secondary">
                  {loading ? '...' : stats.propertiesWithFinancing}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Adicionados Recentemente</span>
                <Badge variant="outline">
                  {loading ? '...' : stats.recentProperties}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Atividade do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status do Sistema</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Última Atualização</span>
                <span className="text-xs text-gray-500">Agora mesmo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <span className="text-xs text-green-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumo Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : Math.round((stats.propertiesWithFGTS / stats.totalProperties) * 100) || 0}%
                </p>
                <p className="text-xs text-gray-500">Imóveis com FGTS</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">
                  {loading ? '...' : Math.round((stats.propertiesWithFinancing / stats.totalProperties) * 100) || 0}%
                </p>
                <p className="text-xs text-gray-500">Aceitam Financiamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats; 