import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface WhatsAppRequest {
  phoneNumber: string;
  pageUrl: string;
  pageType: 'RJ' | 'SP';
}

Deno.serve(async (req: Request) => {
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Tratar OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phoneNumber, pageUrl, pageType }: WhatsAppRequest = await req.json();

    // Validar dados de entrada
    if (!phoneNumber || !pageUrl || !pageType) {
      return new Response(
        JSON.stringify({
          error: 'Parâmetros obrigatórios: phoneNumber, pageUrl, pageType',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Formatear número de telefone (garantir que tenha +55)
    let formattedNumber = phoneNumber.replace(/\D/g, ''); // Remover caracteres não numéricos
    
    // Se não começar com 55, adicionar
    if (!formattedNumber.startsWith('55')) {
      formattedNumber = '55' + formattedNumber;
    }

    // Extrair apenas a parte relativa da URL (sem o domínio)
    let relativeUrl = pageUrl;
    try {
      const url = new URL(pageUrl);
      relativeUrl = url.pathname + url.search;
    } catch {
      // Se não conseguir fazer parse da URL, usar como está
      if (relativeUrl.startsWith('http')) {
        relativeUrl = relativeUrl.split('.com')[1] || relativeUrl.split('.br')[1] || relativeUrl;
      }
    }

    // Determinar webhook baseado no tipo da página
    const webhookUrl = pageType === 'RJ' 
      ? 'https://n8n-production-49ae.up.railway.app/webhook/wpprj'
      : 'https://n8n-production-49ae.up.railway.app/webhook/wppsp';

    // Preparar payload para o webhook
    const webhookPayload = {
      num: formattedNumber,
      url: relativeUrl
    };

    console.log('Enviando para webhook:', {
      webhook: webhookUrl,
      payload: webhookPayload,
      originalPhone: phoneNumber,
      formattedPhone: formattedNumber,
      pageType,
      originalUrl: pageUrl,
      relativeUrl
    });

    // Enviar para o webhook do n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do webhook:', response.status, errorText);
      
      return new Response(
        JSON.stringify({
          error: `Erro ao enviar WhatsApp: ${response.status} - ${errorText}`,
          details: {
            status: response.status,
            webhook: webhookUrl,
            payload: webhookPayload
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const webhookResult = await response.text();
    console.log('Resposta do webhook:', webhookResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Página enviada com sucesso para ${formattedNumber} via WhatsApp`,
        details: {
          phoneNumber: formattedNumber,
          pageUrl: relativeUrl,
          pageType,
          webhook: webhookUrl,
          webhookResponse: webhookResult
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na edge function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
