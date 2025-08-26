-- Criar tabela para páginas estáticas de catálogos
create table
  public.static_pages (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone null default now(),
    page_id character varying not null unique,
    title character varying not null,
    description text null,
    page_type character varying not null default 'RJ',
    property_ids integer[] not null default '{}',
    properties_data jsonb null,
    total_properties integer not null default 0,
    created_by uuid null,
    expires_at timestamp with time zone null,
    is_active boolean null default true,
    view_count integer null default 0,
    last_viewed_at timestamp with time zone null,
    constraint static_pages_pkey primary key (id),
    constraint static_pages_page_id_key unique (page_id)
  ) tablespace pg_default;

-- Criar índices
create index static_pages_page_id_idx on public.static_pages using btree (page_id);
create index static_pages_created_at_idx on public.static_pages using btree (created_at);
create index static_pages_page_type_idx on public.static_pages using btree (page_type);
create index static_pages_is_active_idx on public.static_pages using btree (is_active);

-- Permitir acesso público para visualização das páginas
alter table public.static_pages enable row level security;

-- Policy para permitir leitura pública de páginas ativas
create policy "Páginas ativas são públicas"
  on public.static_pages for select
  using (is_active = true);

-- Policy para permitir inserção apenas para usuários autenticados (admin)
create policy "Apenas admins podem criar páginas"
  on public.static_pages for insert
  with check (auth.role() = 'authenticated');

-- Policy para permitir atualização apenas para usuários autenticados (admin)
create policy "Apenas admins podem atualizar páginas"
  on public.static_pages for update
  using (auth.role() = 'authenticated');
