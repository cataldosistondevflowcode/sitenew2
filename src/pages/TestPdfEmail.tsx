import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Send, RefreshCw } from 'lucide-react';

const TestPdfEmail = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('Teste - Catálogo de Imóveis');
  const [sending, setSending] = useState(false);
  const [propertyIds, setPropertyIds] = useState('534113,419048,575826');
  const [pageType, setPageType] = useState<'RJ' | 'SP'>('RJ');

  const testSendEmail = async () => {
    if (!recipientEmail) {
      toast.error('Digite um email válido');
      return;
    }

    const ids = propertyIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) {
      toast.error('Digite IDs válidos de propriedades');
      return;
    }

    setSending(true);
    try {
      console.log('Enviando requisição:', {
        propertyIds: ids,
        recipientEmail,
        pageType,
        subject
      });

      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          propertyIds: ids,
          recipientEmail: recipientEmail,
          pageType: pageType,
          subject: subject
        }
      });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw error;
      }

      console.log('Resposta da Edge Function:', data);
      toast.success(`PDF enviado com sucesso para ${recipientEmail}!`);
    } catch (error) {
      console.error('Erro ao enviar PDF por email:', error);
      toast.error(`Erro ao enviar PDF: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Teste - Envio de PDF por Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email do Destinatário</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="destinatario@email.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subject">Assunto do Email</Label>
                <Input
                  id="subject"
                  placeholder="Assunto do email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="propertyIds">IDs das Propriedades (separados por vírgula)</Label>
                <Input
                  id="propertyIds"
                  placeholder="534113,419048,575826"
                  value={propertyIds}
                  onChange={(e) => setPropertyIds(e.target.value)}
                />
                <p className="text-sm text-gray-600 mt-1">
                  IDs válidos de exemplo: 534113, 419048, 575826, 737084, 727941
                </p>
              </div>

              <div>
                <Label htmlFor="pageType">Tipo da Página</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={pageType === 'RJ' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPageType('RJ')}
                  >
                    RJ
                  </Button>
                  <Button
                    variant={pageType === 'SP' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPageType('SP')}
                  >
                    SP
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Teste da Integração</h4>
              <p className="text-sm text-yellow-700">
                Esta página é para testar a Edge Function de envio de PDF por email. 
                Certifique-se de que os IDs das propriedades existem no banco de dados.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">🔧 Configuração</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Edge Function: send-pdf-email</li>
                <li>• Endpoint: https://jmcurflvrvuvzoddjkcg.supabase.co/functions/v1/send-pdf-email</li>
                <li>• API Resend: Configurada</li>
                <li>• Conversão HTML→PDF: APIs externas</li>
              </ul>
            </div>

            <Button
              onClick={testSendEmail}
              disabled={!recipientEmail || sending}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              {sending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Enviando PDF...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar PDF por Email
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Para acessar esta página em produção: /test-pdf-email
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPdfEmail;
