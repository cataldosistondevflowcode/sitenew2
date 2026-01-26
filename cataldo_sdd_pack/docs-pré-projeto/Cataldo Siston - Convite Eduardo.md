**Escopo detalhado**

Vídeo explicativo: [Gravação de Tela 2026-01-12 às 11.50.54.mov](https://drive.google.com/file/d/18Mr7YYSinjX3w_gCHdoUI4fCOyt3fkP7/view?usp=sharing)  
Orçamento disponível: R$ 2.5000,00  
Entrada \+ Entrega  
Prazo estimado: 2 semanas, porém como existe uma empresa externa para enviar alguns pontos, essa parte poderia demorar, mas a remuneração não dependeria disso.

Estamos recriando o site [www.cataldosiston.com.br](http://www.cataldosiston.com.br) e faltam algumas etapas:

**1 \- Sistema de criação e gerenciamento de páginas regionais (fase 1):**

- Por exemplo, as páginas mais buscadas como barra da tijuca, zona sul rio de janeiro, podem ter uma página específica que carrega os imóveis, e já traz dentro dela os imóveis dessa região. 

- Isso é importante porque a API (LeiloOn) não mantém os imóveis no site, eles são deletados todos os dias. E mesmo se mantivesse, se o imovel fosse deletado do sistema deles, e do site, isso traria efeitos negativos e concorrentes para a home.

- Esse sistema já está em construção e quase funcionando:

- Um requisito importante e que os slugs dessas páginas substituam os filtros dessas regiões

**2 \- Sistema de gerenciamento dos filtros que possa englobar regiões e zonas e assim mudar o filtro (fase 2\)**

**3 \- Conectar as demais páginas que estão sendo criadas em código por outra empresa (quando as páginas chegarem)**

**4 \- Conectar CMS do Webflow com campos do Frontend para edição do cliente. Todas imagens e textos (última fase)**

**5 \- Revisão e configuração de eventos na RD Station**

**6 \- SEO (já podemos fazer os testes e ajustes necessários nas paginas imoveis-rj/sp e as regionais que devem ter esses dados: https://app.liveseo.com.br/projeto/CB742/task/12336/205270/preview?key=RE2Go6ZXGj55Q79q)**

## **1\. Controle de Indexação (Fase de Migração)**

### **Entregáveis**

* Aplicação da meta tag abaixo em **todas as páginas** durante a migração:  
  \<meta name="robots" content="noindex, follow"\>  
* Garantia de que nenhuma página seja indexada antes da finalização do ambiente.

### **Critério de aceite**

* Todas as páginas retornam a meta tag corretamente.  
* Nenhuma URL aparece indexada nos mecanismos de busca.

### **Ação futura**

* Remover ou alterar para index, follow após validação final em produção.

---

## **2\. Tag Canônica**

### **Entregáveis**

* Inclusão de tag canônica autorreferenciada em todas as páginas padrão:  
  \<link rel="canonical" href="URL da própria página" /\>  
* Definição de padrão para páginas com filtros (quando aplicável):  
  * Canônica apontando para a versão principal da página.

### **Critério de aceite**

* Todas as páginas possuem apenas **uma** tag canônica válida.  
* URLs com parâmetros não geram canônicas inconsistentes.

---

## **3\. Status Code HTTP**

### **Entregáveis**

* Garantia de retorno **HTTP 2xx** para todas as páginas válidas do site.

### **Critério de aceite**

* Nenhuma página principal retorna erro 4xx ou 5xx.  
* Redirecionamentos 3xx configurados apenas quando necessários.

---

## **4\. Preparação de SEO On-page**

### **Entregáveis**

* Estrutura preparada para:  
  * Hierarquia correta de headings (H1–H6)  
  * Meta title e meta description  
  * Renderização correta do conteúdo

### **Observação**

* Esses pontos serão **validados individualmente por página** na etapa de testes finais.

---

## **5\. Testes de Rastreio e Saúde Técnica**

### **Ferramenta utilizada**

* Screaming Frog

### **Entregáveis**

* Auditoria de rastreamento simulando o acesso do Google.  
* Validação de:  
  * Status codes  
  * Meta robots  
  * Tag canônica  
  * Titles e descriptions  
  * Headings  
  * Arquitetura do site

### **Critério de aceite**

* Nenhum erro crítico de rastreio.  
* Estrutura técnica consistente em páginas estáticas e dinâmicas.

---

## **6\. Análises de SEO Estratégico**

### **Ferramenta utilizada**

* Ahrefs

### **Entregáveis**

* Análise de palavras-chave relevantes.  
* Avaliação de backlinks.  
* Monitoramento de desempenho orgânico.  
* Benchmark competitivo.

### **Critério de aceite**

* Base de palavras-chave definida.  
* Diagnóstico claro de oportunidades de crescimento orgânico.

---

## **7\. Performance e Velocidade**

### **Ferramentas utilizadas**

* Lighthouse  
* WebPageTest

### **Entregáveis**

* Análise de métricas de performance:  
  * LCP  
  * CLS  
  * TTFB  
* Identificação de gargalos de carregamento.  
* Lista de oportunidades de otimização (imagens, scripts, renderização).

### **Critério de aceite**

* Performance adequada para produção.  
* Não existência de bloqueios críticos de carregamento.

---

## **8\. Implementação Técnica**

### **Entregáveis**

* Revisão do template HTML base.  
* Garantia de que todas as tags e regras de SEO estão presentes em:  
  * Páginas estáticas  
  * Páginas dinâmicas

### **Critério de aceite**

* Checklist de SEO aplicado de forma consistente em todo o site.

---

