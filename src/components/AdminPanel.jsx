import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const css = `
  :root {
    --verde:#1B5E37; --verde-m:#2E7D52; --verde-l:#4CAF80;
    --ouro:#B8943A; --ouro-l:#D4AC50;
    --creme:#F5F2EC; --creme-d:#EAE5DB;
    --text:#1A1A1A; --muted:#6B6B6B; --border:#D8D2C6;
    --white:#FFFFFF; --erro:#C0392B;
  }
  body { background: var(--creme); }

  .login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--verde); }
  .login-box { background:var(--white); border-radius:16px; padding:2.5rem 2rem; width:100%; max-width:360px; box-shadow:0 8px 40px rgba(0,0,0,.18); }
  .login-logo { display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:1.5rem; }
  .login-marca { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--verde); line-height:1.2; }
  .login-marca small { display:block; font-family:'DM Sans',sans-serif; font-size:.72rem; color:var(--muted); font-weight:400; }
  .login-box label { font-size:.78rem; font-weight:600; letter-spacing:.04em; color:var(--muted); display:block; margin-bottom:4px; text-transform:uppercase; }
  .login-box input { width:100%; border:1px solid var(--border); border-radius:8px; padding:.65rem .9rem; font-family:'DM Sans',sans-serif; font-size:.875rem; outline:none; margin-bottom:1rem; transition:border-color .15s; }
  .login-box input:focus { border-color:var(--verde-m); }
  .btn-entrar { width:100%; background:var(--verde); color:#fff; border:none; border-radius:10px; padding:.85rem; font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:600; cursor:pointer; transition:background .15s; }
  .btn-entrar:hover { background:var(--verde-m); }
  .login-erro { font-size:.8rem; color:var(--erro); text-align:center; margin-top:.6rem; }

  .ph { background:var(--verde); position:relative; }
  .ph::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--ouro); }
  .ph-inner { max-width:1140px; margin:0 auto; padding:1.1rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  .ph-nome { font-family:'DM Serif Display',serif; font-size:1.1rem; color:#fff; }
  .ph-sub { font-size:.72rem; color:rgba(255,255,255,.55); letter-spacing:.06em; text-transform:uppercase; }
  .btn-sair { background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); color:rgba(255,255,255,.8); border-radius:8px; padding:.4rem 1rem; font-family:'DM Sans',sans-serif; font-size:.78rem; cursor:pointer; }
  .btn-sair:hover { background:rgba(255,255,255,.2); }

  .stats { max-width:1140px; margin:1.5rem auto 0; padding:0 1.5rem; display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .stat { background:var(--white); border:1px solid var(--border); border-radius:10px; padding:.9rem 1.1rem; }
  .stat-l { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:3px; }
  .stat-v { font-size:1.55rem; font-weight:500; color:var(--verde); line-height:1; }

  .toolbar { max-width:1140px; margin:1.25rem auto 0; padding:0 1.5rem; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .toolbar-titulo { font-size:.95rem; font-weight:500; flex:1; min-width:120px; }
  .btn-acao { display:flex; align-items:center; gap:5px; background:var(--white); border:1px solid var(--border); border-radius:8px; padding:.4rem .85rem; font-family:'DM Sans',sans-serif; font-size:.78rem; cursor:pointer; color:var(--text); transition:background .12s; }
  .btn-acao:hover { background:var(--creme); }
  .btn-acao.verde { background:var(--verde); color:#fff; border-color:var(--verde); }
  .btn-acao.verde:hover { background:var(--verde-m); }

  .busca-wrap { max-width:1140px; margin:.75rem auto 0; padding:0 1.5rem; }
  .busca { width:100%; border:1px solid var(--border); border-radius:8px; padding:.6rem .9rem; font-family:'DM Sans',sans-serif; font-size:.875rem; outline:none; transition:border-color .15s; background:var(--white); }
  .busca:focus { border-color:var(--verde-m); }

  .cards-wrap { max-width:1140px; margin:.75rem auto 2.5rem; padding:0 1.5rem; display:flex; flex-direction:column; gap:10px; }

  .card { background:var(--white); border:1px solid var(--border); border-radius:12px; overflow:hidden; transition:border-color .15s; }
  .card:hover { border-color:var(--verde-l); }
  .card-top { display:flex; align-items:center; justify-content:space-between; padding:.85rem 1.25rem; cursor:pointer; gap:10px; }
  .card-nome { font-weight:500; font-size:.9rem; }
  .card-tags { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:3px; }
  .tag { font-size:.72rem; padding:2px 8px; border-radius:20px; font-weight:500; white-space:nowrap; }
  .tag-data { color:var(--muted); }
  .tag-cargo { background:var(--creme); color:var(--verde-m); }
  .tag-setor { background:#EBF5EF; color:var(--verde); }
  .chevron { width:24px; height:24px; background:var(--creme); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .2s; }
  .chevron.aberto { transform:rotate(180deg); }

  .card-body { padding:0 1.25rem 1.25rem; border-top:1px solid var(--creme-d); }

  .secao { margin-top:1rem; }
  .secao-titulo { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--ouro); margin-bottom:.55rem; display:flex; align-items:center; gap:6px; }
  .secao-titulo::after { content:''; flex:1; height:1px; background:var(--creme-d); }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .item { background:var(--creme); border-radius:8px; padding:.55rem .8rem; }
  .item.full { grid-column:1/-1; }
  .item-l { font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--ouro); margin-bottom:2px; }
  .item-v { font-size:.82rem; color:var(--text); line-height:1.5; }

  .empty { text-align:center; padding:3rem 1.5rem; color:var(--muted); font-size:.88rem; }
  .loading { text-align:center; padding:2.5rem; color:var(--muted); font-size:.88rem; }

  @media(max-width:600px) {
    .stats { grid-template-columns:1fr 1fr; }
    .grid { grid-template-columns:1fr; }
  }
`;

const LABELS = {
  nome:'Nome completo', cargo_atual:'Cargo atual', setor_atual:'Departamento atual',
  tempo_casa:'Tempo de casa', motivo:'Motivação para a vaga', formacao:'Formação',
  curso:'Curso em andamento', exp_documental:'Exp. com documentação',
  exp_detalhe:'Detalhe da experiência', atos_conhecidos:'Atos notariais conhecidos',
  informatica:'Domínio de informática (1–5)', prazos:'Gestão de prazos',
  situacao_erro:'Situação de erro relatada', certidoes:'Exp. com certidões',
  desenvolvimento:'Ações de desenvolvimento', val_respeito:'Significado de respeito',
  comprometimento:'Comprometimento (1–5)', trabalho_equipe:'Trabalho em equipe',
  alta_demanda:'Reação sob alta demanda', feedback:'Receptividade a feedback',
  atencao_detalhe:'Atenção a detalhes (1–5)', valor_identificacao:'Valor de identificação',
  projecao:'Projeção de carreira', complemento:'Informações complementares',
  aceite_lgpd:'Aceite LGPD',
};

const SECOES = {
  'Inscrição interna':       ['nome','cargo_atual','setor_atual','tempo_casa','motivo','formacao','curso'],
  'Análise de perfil':       ['exp_documental','exp_detalhe','atos_conhecidos','informatica','prazos','situacao_erro','certidoes','desenvolvimento'],
  'Avaliação comportamental':['val_respeito','comprometimento','trabalho_equipe','alta_demanda','feedback','atencao_detalhe','valor_identificacao','projecao','complemento'],
};

const LONGAS = new Set(['motivo','situacao_erro','desenvolvimento','val_respeito','trabalho_equipe','valor_identificacao','projecao','complemento','exp_detalhe']);

function fmt(key, val) {
  if (val === null || val === undefined || val === '') return '—';
  if (key === 'aceite_lgpd') return val ? 'Sim — concordou' : 'Não';
  return String(val);
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [senhaErro, setSenhaErro] = useState(false);
  const [dados, setDados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [abertos, setAbertos] = useState({});

  const login = () => {
    if (senha === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAutenticado(true);
      carregarDados();
    } else {
      setSenhaErro(true);
    }
  };

  const carregarDados = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from('psi_respostas')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) { setDados(data); setFiltrados(data); }
    setCarregando(false);
  };

  const buscar = (q) => {
    if (!q) { setFiltrados(dados); return; }
    setFiltrados(dados.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())));
  };

  const exportarCSV = () => {
    if (dados.length === 0) { alert('Nenhuma resposta para exportar.'); return; }
    const campos = ['created_at','vaga',...Object.keys(LABELS)];
    const header = campos.map(c => LABELS[c] || c);
    const linhas = dados.map(r => campos.map(c => {
      const v = r[c];
      return v === null || v === undefined ? '' : String(v).replace(/"/g,'""');
    }));
    const csv = [header,...linhas].map(row=>row.map(c=>`"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download=`PSI_AuxiliarEscrevente_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const hoje = new Date().toISOString().slice(0,10);
  const semAtras = new Date(Date.now()-7*86400000).toISOString();
  const totalHoje = dados.filter(r=>r.created_at?.startsWith(hoje)).length;
  const totalSemana = dados.filter(r=>r.created_at>semAtras).length;
  const maisRecente = dados[0]?.created_at ? new Date(dados[0].created_at).toLocaleString('pt-BR') : '—';

  if (!autenticado) return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-logo">
            <svg width="38" height="38" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="16" fill="none" stroke="#1B5E37" strokeWidth="2"/>
              <text x="19" y="24.5" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="14" fill="#1B5E37">G</text>
            </svg>
            <div className="login-marca">Genthe Consultoria<small>Painel PSI — Cartório Pantaneiro</small></div>
          </div>
          <label>Senha de acesso</label>
          <input type="password" placeholder="••••••••" value={senha} onChange={e=>{setSenha(e.target.value);setSenhaErro(false);}} onKeyDown={e=>e.key==='Enter'&&login()} />
          <button className="btn-entrar" onClick={login}>Entrar</button>
          {senhaErro && <p className="login-erro">Senha incorreta. Tente novamente.</p>}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <header className="ph">
        <div className="ph-inner">
          <div>
            <div className="ph-sub">Genthe Consultoria · Cartório Pantaneiro</div>
            <div className="ph-nome">Painel PSI — Auxiliar de Escrevente · Notas</div>
          </div>
          <button className="btn-sair" onClick={()=>setAutenticado(false)}>Sair</button>
        </div>
      </header>

      <div className="stats">
        <div className="stat"><div className="stat-l">Total</div><div className="stat-v">{dados.length}</div></div>
        <div className="stat"><div className="stat-l">Hoje</div><div className="stat-v">{totalHoje}</div></div>
        <div className="stat"><div className="stat-l">Esta semana</div><div className="stat-v">{totalSemana}</div></div>
        <div className="stat"><div className="stat-l">Mais recente</div><div className="stat-v" style={{fontSize:'.85rem',paddingTop:4}}>{maisRecente}</div></div>
      </div>

      <div className="toolbar">
        <span className="toolbar-titulo">Candidaturas recebidas</span>
        <button className="btn-acao" onClick={carregarDados}>↻ Atualizar</button>
        <button className="btn-acao verde" onClick={exportarCSV}>↓ Exportar CSV</button>
      </div>

      <div className="busca-wrap">
        <input className="busca" placeholder="Buscar por nome, cargo ou setor..." onChange={e=>buscar(e.target.value)} />
      </div>

      <div className="cards-wrap">
        {carregando && <div className="loading">Carregando candidaturas...</div>}
        {!carregando && filtrados.length === 0 && <div className="empty">Nenhuma candidatura recebida ainda.</div>}
        {filtrados.map(r => {
          const isAberto = abertos[r.id];
          return (
            <div key={r.id} className="card">
              <div className="card-top" onClick={()=>setAbertos(a=>({...a,[r.id]:!a[r.id]}))}>
                <div>
                  <div className="card-nome">{r.nome || '(sem nome)'}</div>
                  <div className="card-tags">
                    <span className="tag tag-data">{r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '—'}</span>
                    <span className="tag tag-cargo">{r.cargo_atual || '—'}</span>
                    <span className="tag tag-setor">{r.setor_atual || '—'}</span>
                  </div>
                </div>
                <div className={`chevron${isAberto?' aberto':''}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              {isAberto && (
                <div className="card-body">
                  {Object.entries(SECOES).map(([nomeSec, campos]) => (
                    <div key={nomeSec} className="secao">
                      <div className="secao-titulo">{nomeSec}</div>
                      <div className="grid">
                        {campos.map(c => {
                          const v = fmt(c, r[c]);
                          if (v === '—' && !['complemento','exp_detalhe','curso'].includes(c)) return null;
                          return (
                            <div key={c} className={`item${LONGAS.has(c)?' full':''}`}>
                              <div className="item-l">{LABELS[c]||c}</div>
                              <div className="item-v">{v}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
