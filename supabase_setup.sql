-- Execute no Supabase → SQL Editor → New Query

create table if not exists psi_respostas (
  id                   uuid default gen_random_uuid() primary key,
  created_at           timestamptz default now(),
  vaga                 text,
  nome                 text,
  cargo_atual          text,
  setor_atual          text,
  tempo_casa           text,
  motivo               text,
  formacao             text,
  curso                text,
  exp_documental       text,
  exp_detalhe          text,
  atos_conhecidos      text,
  informatica          text,
  prazos               text,
  situacao_erro        text,
  certidoes            text,
  desenvolvimento      text,
  val_respeito         text,
  comprometimento      text,
  trabalho_equipe      text,
  alta_demanda         text,
  feedback             text,
  atencao_detalhe      text,
  valor_identificacao  text,
  projecao             text,
  complemento          text,
  aceite_lgpd          boolean default false
);

-- Row Level Security
alter table psi_respostas enable row level security;

create policy "Candidatos podem inserir"
  on psi_respostas for insert
  with check (true);

create policy "Leitura liberada"
  on psi_respostas for select
  using (true);
