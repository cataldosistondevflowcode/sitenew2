/**
 * Edge Function para fazer proxy seguro para Webflow CMS API
 * 
 * Esta função:
 * - Recebe requisições do frontend
 * - Busca conteúdo do Webflow CMS usando token seguro
 * - Retorna conteúdo com cache
 * - Nunca expõe o token Webflow no frontend
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebflowCollectionItem {
  id: string;
  [key: string]: any;
}

interface WebflowCMSResponse {
  items: WebflowCollectionItem[];
  [key: string]: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar autenticação (opcional, pode ser removido se quiser acesso público)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Obter token Webflow do secret (nunca expor no frontend)
    const webflowToken = Deno.env.get("WEBFLOW_API_TOKEN");
    const webflowSiteId = Deno.env.get("WEBFLOW_SITE_ID");

    if (!webflowToken || !webflowSiteId) {
      return new Response(
        JSON.stringify({
          error: "Webflow credentials not configured",
          message: "WEBFLOW_API_TOKEN and WEBFLOW_SITE_ID must be set as secrets",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { collectionId, limit = 10 } = await req.json().catch(() => ({}));

    if (!collectionId) {
      return new Response(
        JSON.stringify({
          error: "Missing collectionId",
          message: "collectionId is required in request body",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Buscar conteúdo do Webflow CMS
    const webflowUrl = `https://api.webflow.com/v2/sites/${webflowSiteId}/collections/${collectionId}/items?limit=${limit}`;
    
    const webflowResponse = await fetch(webflowUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${webflowToken}`,
        "Accept": "application/json",
        "Accept-Version": "1.0.0",
      },
    });

    if (!webflowResponse.ok) {
      const errorText = await webflowResponse.text();
      console.error("Webflow API error:", errorText);
      
      return new Response(
        JSON.stringify({
          error: "Failed to fetch from Webflow",
          message: `Webflow API returned ${webflowResponse.status}`,
          details: errorText,
        }),
        {
          status: webflowResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const webflowData: WebflowCMSResponse = await webflowResponse.json();

    // Retornar dados (com cache headers se necessário)
    return new Response(
      JSON.stringify({
        success: true,
        data: webflowData.items || [],
        count: webflowData.items?.length || 0,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          // Cache por 5 minutos (ajustar conforme necessário)
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (error) {
    console.error("Error in webflow-cms-proxy:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
