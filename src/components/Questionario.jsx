import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// ── ESTILOS ───────────────────────────────────────────────────────────────────
const css = `
  :root {
    --verde: #1B5E37; --verde-m: #2E7D52; --verde-l: #4CAF80;
    --ouro: #B8943A; --ouro-l: #D4AC50;
    --creme: #F5F2EC; --creme-d: #EAE5DB;
    --text: #1A1A1A; --muted: #6B6B6B; --border: #D8D2C6;
    --white: #FFFFFF; --erro: #C0392B;
  }
  body { background: var(--creme); }

  .header { background: var(--verde); position: relative; }
  .header::after { content:''; position:absolute; bottom:0; left:0; right:0; height:4px; background:var(--ouro); }
  .header-inner { max-width:720px; margin:0 auto; padding:2.5rem 1.5rem 2rem; display:flex; align-items:flex-start; gap:1.25rem; }
  .header-logos { display:flex; align-items:center; gap:10px; flex-shrink:0; margin-top:4px; }
  .logo-txt { font-size:9px; font-weight:500; letter-spacing:.04em; color:rgba(255,255,255,.55); text-align:center; line-height:1.3; text-transform:uppercase; }
  .logo-sep { width:1px; height:44px; background:rgba(255,255,255,.18); }
  .header-meta { flex:1; }
  .header-empresa { font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-bottom:4px; }
  .header-titulo { font-family:'DM Serif Display',serif; font-size:1.75rem; color:#fff; line-height:1.2; margin-bottom:6px; }
  .header-sub { font-size:13px; color:rgba(255,255,255,.7); font-weight:300; }
  .header-badge { display:inline-flex; align-items:center; gap:5px; background:rgba(184,148,58,.25); border:1px solid rgba(184,148,58,.45); color:var(--ouro-l); font-size:11px; font-weight:500; padding:3px 10px; border-radius:20px; margin-top:10px; }

  .progress-bar { position:fixed; top:0; left:0; height:3px; background:var(--ouro); transition:width .3s; z-index:100; }

  .wrap { max-width:720px; margin:0 auto; padding:0 1.5rem; }
  .card { background:var(--white); border:1px solid var(--border); border-radius:14px; padding:1.5rem 1.75rem; margin-bottom:1.25rem; }
  .card-header { display:flex; align-items:center; gap:10px; margin-bottom:1rem; padding-bottom:.75rem; border-bottom:1px solid var(--creme-d); }
  .card-titulo { font-size:.85rem; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--verde); }
  .card-desc { font-size:.9rem; color:var(--muted); line-height:1.6; }
  .card-desc + .card-desc { margin-top:.65rem; }

  .vaga-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:1rem; }
  .vaga-item { background:var(--creme); border-radius:8px; padding:.65rem .9rem; }
  .vaga-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ouro); margin-bottom:2px; }
  .vaga-val { font-size:.875rem; font-weight:500; color:var(--text); }
  .grade-nota { margin-top:.85rem; padding:.65rem .9rem; background:#FFF8EC; border-left:3px solid var(--ouro); border-radius:0 6px 6px 0; font-size:.8rem; color:#7A5C1E; line-height:1.55; }

  .req-table { border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-top:.25rem; }
  .req-row { display:grid; grid-template-columns:1fr 1.5fr; font-size:.83rem; }
  .req-header { background:var(--verde); }
  .req-col-a, .req-col-b { padding:.55rem .8rem; line-height:1.45; }
  .req-col-a { border-right:1px solid var(--border); font-weight:500; }
  .req-header .req-col-a, .req-header .req-col-b { color:#fff; font-weight:600; font-size:.75rem; letter-spacing:.06em; text-transform:uppercase; }
  .req-header .req-col-a { border-right:1px solid rgba(255,255,255,.2); }
  .req-col-b { color:var(--muted); }
  .req-alt { background:var(--creme); }
  .req-row + .req-row { border-top:1px solid var(--border); }

  .etapas-lista { display:flex; flex-direction:column; }
  .etapa-item { display:flex; align-items:flex-start; gap:10px; padding:.65rem 0; border-bottom:1px solid var(--creme-d); }
  .etapa-item:last-child { border-bottom:none; }
  .etapa-num { width:26px; height:26px; min-width:26px; background:var(--verde); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; margin-top:1px; }
  .etapa-num.cinza { background:#C8C5BD; }
  .etapa-nome { font-size:.875rem; font-weight:500; color:var(--text); line-height:1.3; }
  .etapa-detalhe { font-size:.78rem; color:var(--muted); margin-top:2px; line-height:1.45; }
  .etapa-tag { display:inline-block; background:#EBF5EF; color:var(--verde-m); font-size:10px; font-weight:600; padding:1px 7px; border-radius:20px; margin-left:5px; vertical-align:middle; border:1px solid #B8DEC8; }

  .lgpd-banner { margin:1.25rem 0 0; }
  .lgpd-box { background:#F0F5FF; border:1px solid #B8CBF0; border-left:4px solid #2E5FBF; border-radius:10px; padding:1rem 1.25rem; display:flex; gap:12px; align-items:flex-start; }
  .lgpd-icon { font-size:1.35rem; line-height:1; flex-shrink:0; margin-top:1px; }
  .lgpd-titulo { font-size:.8rem; font-weight:700; color:#1A3A80; letter-spacing:.04em; margin-bottom:4px; }
  .lgpd-texto { font-size:.8rem; color:#2C4080; line-height:1.6; }

  .secao-titulo { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ouro); margin:2rem 0 .75rem; display:flex; align-items:center; gap:8px; }
  .secao-titulo::after { content:''; flex:1; height:1px; background:var(--border); }
  .secao-num { background:var(--verde); color:#fff; border-radius:50%; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; flex-shrink:0; }

  .pergunta { background:var(--white); border:1px solid var(--border); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:.875rem; transition:border-color .15s; }
  .pergunta:focus-within { border-color:var(--verde-m); }
  .pergunta.erro { border-color:var(--erro); }
  .pergunta-label { font-size:.925rem; font-weight:500; color:var(--text); margin-bottom:.1rem; line-height:1.45; }
  .pergunta-hint { font-size:.78rem; color:var(--muted); margin-bottom:.85rem; }
  .obrig { color:var(--erro); font-size:.8rem; margin-left:2px; }
  .erro-msg { font-size:.78rem; color:var(--erro); margin-top:5px; }

  .opcoes { display:flex; flex-direction:column; gap:7px; }
  .opcao { display:flex; align-items:flex-start; gap:10px; padding:.6rem .85rem; border:1px solid var(--border); border-radius:8px; cursor:pointer; transition:background .12s, border-color .12s; font-size:.875rem; color:var(--text); user-select:none; }
  .opcao:hover { background:var(--creme); border-color:var(--verde-l); }
  .opcao.sel { background:#EBF5EF; border-color:var(--verde-m); }
  .opcao input { margin-top:2px; accent-color:var(--verde); flex-shrink:0; }

  textarea, input[type="text"], input[type="email"] {
    width:100%; border:1px solid var(--border); border-radius:8px;
    padding:.7rem .9rem; font-family:'DM Sans',sans-serif; font-size:.875rem;
    color:var(--text); background:var(--white); outline:none; transition:border-color .15s; line-height:1.55;
  }
  textarea { resize:vertical; min-height:90px; }
  textarea:focus, input:focus { border-color:var(--verde-m); }
  textarea::placeholder, input::placeholder { color:#AEAAA2; }

  .likert-wrap { display:flex; gap:6px; margin-top:4px; flex-wrap:wrap; }
  .likert-btn { flex:1; min-width:36px; padding:.5rem .3rem; border:1px solid var(--border); border-radius:8px; background:var(--white); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500; color:var(--muted); text-align:center; transition:all .12s; }
  .likert-btn:hover { border-color:var(--verde-l); color:var(--verde); }
  .likert-btn.ativo { background:var(--verde); border-color:var(--verde); color:#fff; }
  .likert-labels { display:flex; justify-content:space-between; font-size:.7rem; color:var(--muted); margin-top:4px; }

  .lgpd-check { display:flex; align-items:flex-start; gap:10px; background:#F0F5FF; border:1px solid #B8CBF0; border-radius:10px; padding:1rem 1.25rem; cursor:pointer; margin-bottom:1.5rem; }
  .lgpd-check input { margin-top:3px; accent-color:#2E5FBF; width:17px; height:17px; flex-shrink:0; cursor:pointer; }
  .lgpd-check-label { font-size:.85rem; color:#1A3A80; line-height:1.55; cursor:pointer; }
  .lgpd-check.erro-lgpd { border-color:var(--erro); background:#FEF0F0; }

  .submit-area { margin-top:2rem; display:flex; flex-direction:column; align-items:center; gap:1rem; }
  .btn-enviar { background:var(--verde); color:#fff; border:none; border-radius:10px; padding:.9rem 2.5rem; font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:600; cursor:pointer; transition:background .15s, transform .1s; }
  .btn-enviar:hover { background:var(--verde-m); }
  .btn-enviar:active { transform:scale(.98); }
  .btn-enviar:disabled { background:#9E9E9E; cursor:not-allowed; }
  .submit-nota { font-size:.78rem; color:var(--muted); text-align:center; max-width:440px; }

  .confirmacao { max-width:520px; margin:4rem auto; padding:1.5rem; text-align:center; }
  .check-circle { width:64px; height:64px; background:#EBF5EF; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; }
  .conf-titulo { font-family:'DM Serif Display',serif; font-size:1.5rem; color:var(--verde); margin-bottom:.5rem; }
  .conf-desc { font-size:.9rem; color:var(--muted); line-height:1.65; }

  .footer { background:var(--verde); padding:1.25rem 1.5rem; text-align:center; margin-top:2rem; }
  .footer p { font-size:.78rem; color:rgba(255,255,255,.5); }
  .footer strong { color:rgba(255,255,255,.8); }

  @media(max-width:540px) {
    .header-titulo { font-size:1.4rem; }
    .vaga-grid { grid-template-columns:1fr; }
    .likert-btn { font-size:.7rem; padding:.45rem .2rem; }
    .req-row { grid-template-columns:1fr; }
  }
`;

// ── DADOS ESTÁTICOS ───────────────────────────────────────────────────────────
const ETAPAS = [
  { n:'01', nome:'Inscrição interna', detalhe:'Colaborador manifesta interesse pela vaga dentro do prazo estabelecido no edital.', ativa:true },
  { n:'02', nome:'Análise de perfil', detalhe:'Verificação dos critérios de elegibilidade e aderência ao perfil do cargo.', ativa:true },
  { n:'03', nome:'Prova técnica', detalhe:'Avaliação de conhecimentos específicos exigidos pelo cargo.', ativa:false },
  { n:'04', nome:'Entrevista', detalhe:'Entrevista estruturada com Gestão de Pessoas e Liderança do departamento receptor.', ativa:false },
  { n:'05', nome:'Avaliação comportamental', detalhe:'Mapeamento de perfil comportamental e verificação de fit cultural.', ativa:true },
  { n:'06', nome:'Período de experiência', detalhe:'Atuação prática na nova função sob acompanhamento estruturado da liderança.', ativa:false },
  { n:'07', nome:'Feedback final', detalhe:'Devolutiva formal a todos os candidatos, com pontos fortes e oportunidades de desenvolvimento.', ativa:false },
];

const REQUISITOS = [
  ['Tempo mínimo no cargo atual', '6 meses ou mais'],
  ['Avaliação de desempenho', 'Conceito "Atende" ou superior na última avaliação formal'],
  ['Situação funcional', 'Sem advertência ativa nos últimos 6 meses'],
  ['Assiduidade', 'Ausências injustificadas: máximo 2 nos últimos 6 meses'],
  ['Requisitos do cargo alvo', 'Atendimento à formação e experiência mínima descritas no perfil do cargo'],
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function Questionario() {
  const [form, setForm] = useState({});
  const [likert, setLikert] = useState({});
  const [atos, setAtos] = useState([]);
  const [erros, setErros] = useState({});
  const [lgpd, setLgpd] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErros(e => { const n = { ...e }; delete n[k]; return n; });
    calcProgresso({ ...form, [k]: v });
  };

  const calcProgresso = (f) => {
    const total = 22;
    const preenchidos = [
      f.nome, f.cargo_atual, f.setor_atual, f.tempo_casa, f.motivo, f.formacao,
      f.exp_documental, f.prazos, f.certidoes, f.situacao_erro, f.desenvolvimento,
      f.val_respeito, f.trabalho_equipe, f.alta_demanda, f.feedback, f.valor_identificacao, f.projecao,
      likert.informatica, likert.comprometimento, likert.atencao_detalhe,
      atos.length > 0 ? 'ok' : null, lgpd ? 'ok' : null,
    ].filter(Boolean).length;
    setProgresso(Math.round((preenchidos / total) * 100));
  };

  const setLik = (k, v) => {
    setLikert(l => ({ ...l, [k]: v }));
    setErros(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const toggleAto = (v) => {
    setAtos(prev => {
      const novo = prev.includes(v) ? prev.filter(a => a !== v) : [...prev, v];
      return novo;
    });
    setErros(e => { const n = { ...e }; delete n.atos; return n; });
  };

  const validar = () => {
    const e = {};
    const obrigText = ['nome','cargo_atual','motivo','situacao_erro','desenvolvimento','val_respeito','trabalho_equipe','valor_identificacao','projecao'];
    const obrigRadio = ['setor_atual','tempo_casa','formacao','exp_documental','prazos','certidoes','alta_demanda','feedback'];
    const obrigLik = ['informatica','comprometimento','atencao_detalhe'];

    obrigText.forEach(k => { if (!form[k]?.trim()) e[k] = true; });
    obrigRadio.forEach(k => { if (!form[k]) e[k] = true; });
    obrigLik.forEach(k => { if (!likert[k]) e[k] = true; });
    if (atos.length === 0) e.atos = true;
    if (!lgpd) setLgpdErro(true);
    else setLgpdErro(false);

    setErros(e);
    return Object.keys(e).length === 0 && lgpd;
  };

  const enviar = async () => {
    if (!validar()) {
      const primeiro = document.querySelector('.erro');
      if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setEnviando(true);
    const payload = {
      vaga: 'Auxiliar de Escrevente – Notas',
      nome: form.nome, cargo_atual: form.cargo_atual, setor_atual: form.setor_atual,
      tempo_casa: form.tempo_casa, motivo: form.motivo, formacao: form.formacao,
      curso: form.curso || null, exp_documental: form.exp_documental,
      exp_detalhe: form.exp_detalhe || null, atos_conhecidos: atos.join(', '),
      informatica: likert.informatica, prazos: form.prazos,
      situacao_erro: form.situacao_erro, certidoes: form.certidoes,
      desenvolvimento: form.desenvolvimento, val_respeito: form.val_respeito,
      comprometimento: likert.comprometimento, trabalho_equipe: form.trabalho_equipe,
      alta_demanda: form.alta_demanda, feedback: form.feedback,
      atencao_detalhe: likert.atencao_detalhe, valor_identificacao: form.valor_identificacao,
      projecao: form.projecao, complemento: form.complemento || null, aceite_lgpd: true,
    };
    const { error } = await supabase.from('psi_respostas').insert([payload]);
    if (error) console.error(error);
    setEnviando(false);
    setEnviado(true);
    setProgresso(100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Pergunta = ({ id, label, hint, children }) => (
    <div className={`pergunta${erros[id] ? ' erro' : ''}`} id={`q-${id}`}>
      <div className="pergunta-label">{label} <span className="obrig">*</span></div>
      {hint && <div className="pergunta-hint">{hint}</div>}
      {children}
      {erros[id] && <div className="erro-msg">Campo obrigatório.</div>}
    </div>
  );

  const PerguntaOpt = ({ id, label, hint, children }) => (
    <div className={`pergunta${erros[id] ? ' erro' : ''}`} id={`q-${id}`}>
      <div className="pergunta-label">{label}</div>
      {hint && <div className="pergunta-hint">{hint}</div>}
      {children}
    </div>
  );

  const Radio = ({ name, value, label }) => (
    <label className={`opcao${form[name] === value ? ' sel' : ''}`}>
      <input type="radio" name={name} value={value} checked={form[name] === value} onChange={() => set(name, value)} />
      {label}
    </label>
  );

  const Likert = ({ id, min, max }) => (
    <>
      <div className="likert-wrap">
        {[1,2,3,4,5].map(v => (
          <button key={v} type="button" className={`likert-btn${likert[id] === String(v) ? ' ativo' : ''}`}
            onClick={() => setLik(id, String(v))}>{v}</button>
        ))}
      </div>
      <div className="likert-labels"><span>{min}</span><span>{max}</span></div>
      {erros[id] && <div className="erro-msg">Selecione um nível.</div>}
    </>
  );

  const SecTitulo = ({ n, label }) => (
    <div className="secao-titulo">
      <span className="secao-num">{n}</span>
      {label}
    </div>
  );

  if (enviado) return (
    <>
      <style>{css}</style>
      <div style={{ background: '#1B5E37', height: 4 }} />
      <div className="confirmacao">
        <div className="check-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B5E37" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="conf-titulo">Candidatura enviada!</h2>
        <p className="conf-desc">
          Recebemos sua inscrição para a vaga de <strong>Auxiliar de Escrevente – Notas</strong>.<br /><br />
          A equipe da <strong>Genthe Consultoria</strong> realizará a análise de perfil e entrará em contato
        </p>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="progress-bar" style={{ width: `${progresso}%` }} />

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logos">
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4AC50" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="logo-txt">Cartório<br/>Pantaneiro</span>
            </div>
            <div className="logo-sep" />
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <svg width="26" height="26" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="none" stroke="#D4AC50" strokeWidth="1.6"/>
                <text x="16" y="20.5" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="11" fill="#D4AC50">G</text>
              </svg>
              <span className="logo-txt">Genthe<br/>Consultoria</span>
            </div>
          </div>
          <div className="header-meta">
            <div className="header-empresa">Cartório Pantaneiro · Programa Notariado+ Carreiras</div>
            <h1 className="header-titulo">Auxiliar de Escrevente<br/><em>Setor de Notas</em></h1>
            <div className="header-sub">Processo Seletivo Interno — Formulário de Candidatura</div>
            <div className="header-badge">⏱ Tempo estimado: 12 a 15 minutos</div>
          </div>
        </div>
      </header>

      {/* INTRO CARDS */}
      <div className="wrap" style={{ marginTop: '1.75rem' }}>

        {/* Sobre a vaga */}
        <div className="card">
          <div className="card-header">
            <div style={{ width:30, height:30, background:'var(--ouro)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span className="card-titulo">Sobre a vaga</span>
          </div>
          <p className="card-desc">O <strong>Auxiliar de Escrevente – Notas</strong> atua no <strong>Setor de Notas</strong>, dentro do departamento de <strong>Notas e Atendimento</strong>, dando suporte direto ao Escrevente nas atividades de processamento, organização e controle dos atos notariais.</p>
          <p className="card-desc">O cargo envolve a preparação de dossiês para lavratura de escrituras e demais atos do Tabelionato — como escrituras de compra e venda, doação, inventário, procuração, testamento e divórcio — além do controle do arquivo físico e digital, digitalização de documentos, conferência de certidões e lançamento de dados nos sistemas internos, sempre sob supervisão técnica do Escrevente.</p>
          <p className="card-desc">A vaga é aberta para colaboradores que buscam crescimento dentro do cartório, com perspectiva de evolução para o cargo de Escrevente conforme desenvolvimento técnico e desempenho comprovado.</p>
          <div className="vaga-grid">
            <div className="vaga-item"><div className="vaga-label">Departamento</div><div className="vaga-val">Notas e Atendimento</div></div>
            <div className="vaga-item"><div className="vaga-label">Setor</div><div className="vaga-val">Notas</div></div>
            <div className="vaga-item"><div className="vaga-label">Superior Imediato</div><div className="vaga-val">Tabelião Substituto – Notas</div></div>
            <div className="vaga-item"><div className="vaga-label">Nível de entrada</div><div className="vaga-val">Auxiliar · Grade a definir</div></div>
          </div>
          <div className="grade-nota"><strong style={{ color:'var(--ouro)' }}>Grade salarial:</strong> A grade e o nível exatos serão definidos após análise do perfil do candidato selecionado, conforme o Plano de Cargos e Salários vigente do Cartório Pantaneiro.</div>
        </div>

        {/* Requisitos */}
        <div className="card">
          <div className="card-header">
            <div style={{ width:30, height:30, background:'var(--verde)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span className="card-titulo">Requisitos para participar</span>
          </div>
          <p className="card-desc" style={{ marginBottom:'.85rem' }}>Para participar do PSI, o colaborador deve atender, <strong>cumulativamente</strong>, a todos os requisitos abaixo:</p>
          <div className="req-table">
            <div className="req-row req-header"><div className="req-col-a">Requisito</div><div className="req-col-b">Critério</div></div>
            {REQUISITOS.map(([a, b], i) => (
              <div key={i} className={`req-row${i % 2 === 1 ? ' req-alt' : ''}`}>
                <div className="req-col-a">{a}</div><div className="req-col-b">{b}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Etapas */}
        <div className="card">
          <div className="card-header">
            <div style={{ width:30, height:30, background:'var(--verde)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            <span className="card-titulo">Como funciona o processo seletivo</span>
          </div>
          <p className="card-desc" style={{ marginBottom:'.85rem' }}>O PSI é composto por <strong>sete etapas sequenciais</strong>. <strong>Este formulário corresponde às etapas 1, 2 e 5.</strong></p>
          <div className="etapas-lista">
            {ETAPAS.map(e => (
              <div key={e.n} className="etapa-item">
                <div className={`etapa-num${e.ativa ? '' : ' cinza'}`}>{e.n}</div>
                <div>
                  <div className="etapa-nome">
                    {e.nome}
                    {e.ativa && <span className="etapa-tag">neste formulário</span>}
                  </div>
                  <div className="etapa-detalhe">{e.detalhe}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LGPD banner */}
        <div className="lgpd-banner">
          <div className="lgpd-box">
            <div className="lgpd-icon">🔒</div>
            <div>
              <div className="lgpd-titulo">Proteção de Dados — LGPD</div>
              <p className="lgpd-texto">As informações fornecidas neste questionário serão utilizadas <strong>exclusivamente para fins de seleção e recrutamento</strong>, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Seus dados serão armazenados com segurança, não serão compartilhados com terceiros sem sua autorização e poderão ser solicitados para exclusão a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.</p>
            </div>
          </div>
        </div>

        {/* ── ETAPA 1 ── */}
        <SecTitulo n="1" label="Inscrição interna" />
        <Pergunta id="nome" label="Nome completo">
          <input type="text" placeholder="Seu nome completo" value={form.nome||''} onChange={e=>set('nome',e.target.value)} />
        </Pergunta>
        <Pergunta id="cargo_atual" label="Cargo atual">
          <input type="text" placeholder="Ex.: Recepcionista, Auxiliar Administrativo..." value={form.cargo_atual||''} onChange={e=>set('cargo_atual',e.target.value)} />
        </Pergunta>
        <Pergunta id="setor_atual" label="Departamento / setor atual">
          <div className="opcoes">
            {['Notas e Atendimento','TDPJ e Atendimento','Administrativo'].map(v=>(
              <Radio key={v} name="setor_atual" value={v} label={v} />
            ))}
          </div>
          {erros.setor_atual && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <Pergunta id="tempo_casa" label="Há quanto tempo você trabalha no Cartório Pantaneiro?">
          <div className="opcoes">
            {[['menos_6m','Menos de 6 meses'],['6m_1a','Entre 6 meses e 1 ano'],['1a_2a','Entre 1 e 2 anos'],['mais_2a','Mais de 2 anos']].map(([v,l])=>(
              <Radio key={v} name="tempo_casa" value={v} label={l} />
            ))}
          </div>
          {erros.tempo_casa && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <Pergunta id="motivo" label="Por que você está se candidatando a esta vaga?" hint="Descreva sua motivação de forma objetiva.">
          <textarea rows={4} placeholder="Escreva aqui..." value={form.motivo||''} onChange={e=>set('motivo',e.target.value)} />
        </Pergunta>
        <Pergunta id="formacao" label="Qual a sua formação atual?">
          <div className="opcoes">
            {[['em_completo','Ensino Médio completo'],['sup_cursando','Ensino Superior em andamento'],['sup_completo','Ensino Superior completo'],['pos','Pós-graduação / especialização']].map(([v,l])=>(
              <Radio key={v} name="formacao" value={v} label={l} />
            ))}
          </div>
          {erros.formacao && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <PerguntaOpt id="curso" label="Se estiver cursando Direito ou área administrativa, informe o curso e o período." hint="Deixe em branco se não se aplicar.">
          <input type="text" placeholder="Ex.: Direito — 4º semestre (UFMS)" value={form.curso||''} onChange={e=>set('curso',e.target.value)} />
        </PerguntaOpt>

        {/* ── ETAPA 2 ── */}
        <SecTitulo n="2" label="Análise de perfil e requisitos" />
        <Pergunta id="exp_documental" label="Você já trabalhou com organização e controle de documentos físicos ou digitais?">
          <div className="opcoes">
            {[['sim_cartorio','Sim, em cartório ou serviço notarial'],['sim_outro','Sim, em outra área (jurídica, administrativa, saúde etc.)'],['nao','Não tenho experiência formal nessa atividade']].map(([v,l])=>(
              <Radio key={v} name="exp_documental" value={v} label={l} />
            ))}
          </div>
          {erros.exp_documental && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <PerguntaOpt id="exp_detalhe" label="Se tiver experiência com documentação ou rotinas de arquivo, descreva brevemente." hint="Deixe em branco se não tiver.">
          <textarea rows={3} placeholder="Ex.: Organizei prontuários físicos em clínica médica por 8 meses..." value={form.exp_detalhe||''} onChange={e=>set('exp_detalhe',e.target.value)} />
        </PerguntaOpt>
        <div className={`pergunta${erros.atos ? ' erro' : ''}`}>
          <div className="pergunta-label">Quais dos atos notariais a seguir você conhece, mesmo que superficialmente? <span className="obrig">*</span></div>
          <div className="pergunta-hint">Selecione todos que se aplicam.</div>
          <div className="opcoes">
            {[['procuracao','Procuração'],['compra_venda','Escritura de compra e venda'],['doacao','Escritura de doação'],['inventario','Inventário extrajudicial'],['testamento','Testamento'],['divorcio','Divórcio extrajudicial'],['nenhum','Não conheço nenhum desses atos']].map(([v,l])=>(
              <label key={v} className={`opcao${atos.includes(v)?' sel':''}`}>
                <input type="checkbox" checked={atos.includes(v)} onChange={()=>toggleAto(v)} />
                {l}
              </label>
            ))}
          </div>
          {erros.atos && <div className="erro-msg">Selecione pelo menos uma opção.</div>}
        </div>
        <div className={`pergunta${erros.informatica ? ' erro' : ''}`}>
          <div className="pergunta-label">Como você avalia seu domínio de informática (Windows, digitação, e-mail, scanner)? <span className="obrig">*</span></div>
          <Likert id="informatica" min="Muito básico" max="Avançado" />
        </div>
        <Pergunta id="prazos" label="Como você costuma lidar com múltiplas tarefas e prazos simultâneos?">
          <div className="opcoes">
            {[['a','Crio listas e priorizo conforme urgência e importância'],['b','Resolvo por ordem de chegada, independente da urgência'],['c','Peço orientação ao meu superior para definir prioridades'],['d','Ainda estou desenvolvendo essa habilidade de organização']].map(([v,l])=>(
              <Radio key={v} name="prazos" value={v} label={l} />
            ))}
          </div>
          {erros.prazos && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <Pergunta id="situacao_erro" label="Descreva uma situação em que você cometeu um erro no trabalho e como agiu para corrigi-lo." hint="Não há resposta certa — o que buscamos é consciência e postura responsável.">
          <textarea rows={4} placeholder="Escreva aqui..." value={form.situacao_erro||''} onChange={e=>set('situacao_erro',e.target.value)} />
        </Pergunta>
        <Pergunta id="certidoes" label="Você já realizou coleta ou conferência de certidões (negativas, de ônus reais, CND etc.)?">
          <div className="opcoes">
            {[['sim_freq','Sim, com frequência'],['sim_pouco','Sim, algumas vezes'],['nao_sei','Não, mas sei o que são e para que servem'],['nao','Não e não tenho conhecimento sobre o tema']].map(([v,l])=>(
              <Radio key={v} name="certidoes" value={v} label={l} />
            ))}
          </div>
          {erros.certidoes && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <Pergunta id="desenvolvimento" label="O que você está fazendo hoje para se desenvolver para um cargo técnico em cartório de notas?" hint="Cursos, leituras, observação do trabalho do setor, conversas com colegas etc.">
          <textarea rows={3} placeholder="Escreva aqui..." value={form.desenvolvimento||''} onChange={e=>set('desenvolvimento',e.target.value)} />
        </Pergunta>

        {/* ── ETAPA 5 ── */}
        <SecTitulo n="5" label="Avaliação comportamental" />
        <div className="card" style={{ marginBottom:'.875rem', borderLeft:'3px solid var(--ouro)' }}>
          <p style={{ fontSize:'.83rem', color:'var(--muted)', lineHeight:1.6 }}>Nesta seção não há respostas certas ou erradas. Responda com honestidade sobre como você realmente pensa e age no dia a dia. As respostas são tratadas de forma sigilosa e integram o parecer final da Genthe Consultoria.</p>
        </div>
        <Pergunta id="val_respeito" label="Para você, o que significa tratar o cliente com respeito em um cartório?">
          <textarea rows={3} placeholder="Escreva aqui..." value={form.val_respeito||''} onChange={e=>set('val_respeito',e.target.value)} />
        </Pergunta>
        <div className={`pergunta${erros.comprometimento ? ' erro' : ''}`}>
          <div className="pergunta-label">Avalie seu nível de comprometimento com prazos e qualidade, de forma geral. <span className="obrig">*</span></div>
          <Likert id="comprometimento" min="Preciso melhorar" max="Ponto forte" />
        </div>
        <Pergunta id="trabalho_equipe" label="Descreva uma situação em que você precisou trabalhar em equipe para resolver um problema ou entregar um resultado." hint="O que aconteceu? Qual foi o seu papel? Como foi o resultado?">
          <textarea rows={4} placeholder="Escreva aqui..." value={form.trabalho_equipe||''} onChange={e=>set('trabalho_equipe',e.target.value)} />
        </Pergunta>
        <Pergunta id="alta_demanda" label="Em situações de alta demanda, como você costuma reagir?">
          <div className="opcoes">
            {[['a','Mantenho o ritmo e a qualidade mesmo sob pressão'],['b','Fico mais acelerado e posso cometer mais erros, mas me corrijo'],['c','Comunico ao superior quando estou sobrecarregado e peço apoio'],['d','Costumo priorizar a velocidade em detrimento da precisão']].map(([v,l])=>(
              <Radio key={v} name="alta_demanda" value={v} label={l} />
            ))}
          </div>
          {erros.alta_demanda && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <Pergunta id="feedback" label="Como você recebe críticas ou correções sobre o seu trabalho?">
          <div className="opcoes">
            {[['a','Recebo bem, pergunto como melhorar e aplico o que aprendo'],['b','Aceito, mas levo um tempo para processar antes de agir'],['c','Depende de como a crítica é dada; o tom importa para mim'],['d','Tenho dificuldade em receber críticas, reconheço que é algo a desenvolver']].map(([v,l])=>(
              <Radio key={v} name="feedback" value={v} label={l} />
            ))}
          </div>
          {erros.feedback && <div className="erro-msg">Selecione uma opção.</div>}
        </Pergunta>
        <div className={`pergunta${erros.atencao_detalhe ? ' erro' : ''}`}>
          <div className="pergunta-label">O trabalho notarial exige precisão e atenção a detalhes acima da média. Como você se avalia nesse quesito? <span className="obrig">*</span></div>
          <Likert id="atencao_detalhe" min="Preciso desenvolver" max="Ponto muito forte" />
        </div>
        <Pergunta id="valor_identificacao" label="Qual valor do Cartório Pantaneiro você mais sente que se identifica? Explique com um exemplo do seu dia a dia." hint="Valores: Compromisso com a Justiça · Valorização · Respeito · Trabalho em Equipe · Acolhimento ao Cliente">
          <textarea rows={4} placeholder="Escreva aqui..." value={form.valor_identificacao||''} onChange={e=>set('valor_identificacao',e.target.value)} />
        </Pergunta>
        <Pergunta id="projecao" label="Onde você se imagina profissionalmente daqui a 2 anos dentro do Cartório Pantaneiro?">
          <textarea rows={3} placeholder="Escreva aqui..." value={form.projecao||''} onChange={e=>set('projecao',e.target.value)} />
        </Pergunta>
        <PerguntaOpt id="complemento" label="Há algo sobre você, sua trajetória ou sua motivação que considera relevante e que ainda não foi contemplado?" hint="Campo opcional.">
          <textarea rows={3} placeholder="Escreva aqui se desejar..." value={form.complemento||''} onChange={e=>set('complemento',e.target.value)} />
        </PerguntaOpt>

        {/* ACEITE LGPD */}
        <label className={`lgpd-check${lgpdErro ? ' erro-lgpd' : ''}`}>
          <input type="checkbox" checked={lgpd} onChange={e=>{ setLgpd(e.target.checked); setLgpdErro(false); }} />
          <span className="lgpd-check-label">🔒 <strong>Li e concordo</strong> com o tratamento dos meus dados pessoais para fins de participação neste processo seletivo, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Estou ciente de que posso solicitar a exclusão dos meus dados pelo e-mail <strong>contato@genthe.com.br</strong>.</span>
        </label>
        {lgpdErro && <div style={{ fontSize:'.78rem', color:'var(--erro)', marginTop:'-1rem', marginBottom:'1rem' }}>Você precisa aceitar os termos para enviar a candidatura.</div>}

        {/* ENVIAR */}
        <div className="submit-area">
          <button className="btn-enviar" onClick={enviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar candidatura'}
          </button>
          <p className="submit-nota">Ao enviar, você confirma que as informações prestadas são verdadeiras. O processo é conduzido pela <strong>Genthe Consultoria em Gestão de Pessoas</strong> com total sigilo e profissionalismo.</p>
        </div>
      </div>

      <footer className="footer">
        <p>Elaborado por <strong>Genthe Consultoria em Gestão de Pessoas</strong> · Revisado por <strong>Dr. Rodrigo Paulucci Santos</strong> — Tabelião Titular</p>
        <p style={{ marginTop:4 }}><strong>contato@genthe.com.br</strong> · genthe.com.br · Cartório Pantaneiro · Campo Grande – MS · 2026</p>
      </footer>
    </>
  );
}
