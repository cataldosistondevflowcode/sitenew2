-- Adicionar campos para armazenar filtros aplicados nas páginas estáticas
alter table public.static_pages
  add column applied_filters jsonb null,
  add column filter_config jsonb null;

-- Criar índice para busca por filtros
create index static_pages_applied_filters_idx on public.static_pages using gin (applied_filters);
create index static_pages_filter_config_idx on public.static_pages using gin (filter_config);

-- Comentários para documentação
comment on column public.static_pages.applied_filters is 'Filtros aplicados quando a página foi gerada (cidade, bairros, preços, etc.)';
comment on column public.static_pages.filter_config is 'Configuração de filtros para compatibilidade com sistema de agendamento';
