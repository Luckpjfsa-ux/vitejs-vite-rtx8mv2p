import { useState } from "react";
import { usarJogadores } from "./usarJogadores";
import { usarMissoes } from "./usarMissoes";

export default function App() {
  const salaId = "1234";
  const jogadores = usarJogadores(salaId);
  const { missoes, adicionarMissao, limparMissoes } = usarMissoes(salaId);

  /* ===== ESTADOS ===== */
  const [tela, setTela] = useState<"inicio" | "mestre" | "jogo" | "resultado">("inicio");
  const [nome, setNome] = useState("");
  const [indiceMissao, setIndiceMissao] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [foto, setFoto] = useState<string | null>(null);

  // Estados para área do mestre e senha
  const [novaMissaoTexto, setNovaMissaoTexto] = useState("");
  const [novaMissaoPontos, setNovaMissaoPontos] = useState(100);
  const [senhaDigitada, setSenhaDigitada] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const SENHA_CORRETA = "1234"; // <--- MUDE SUA SENHA AQUI

  const missaoAtual = missoes[indiceMissao];

  /* ===== COMPONENTE DE ESTILO GLOBAL ===== */
  const GlobalStyle = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');
      body { font-family: 'Fredoka', sans-serif; margin: 0; padding: 0; background: #0f172a; }
      input::placeholder { color: #94a3b8; }
    `}</style>
  );

  /* ===== TELA INICIAL ===== */
  if (tela === "inicio") {
    return (
      <div style={estilos.container}>
        <GlobalStyle />
        <div style={estilos.card}>
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <h3 style={{ color: "#fbbf24", margin: 0 }}>🏆 Placar ao vivo</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
              {Object.entries(jogadores).map(([id, jogador]) => (
                <div key={id} style={estilos.placarItem}>
                  <span>{jogador.nome}</span>
                  <strong>{jogador.pontos} pts</strong>
                </div>
              ))}
            </div>
          </div>

          <h1 style={estilos.titulo}>🕵️ Detetive Real</h1>

          <input
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={estilos.input}
          />

          <button
            style={!nome || missoes.length === 0 ? estilos.botaoDesabilitado : estilos.botaoVerde}
            disabled={!nome || missoes.length === 0}
            onClick={() => nome && setTela("jogo")}
          >
            {missoes.length === 0 ? "⏳ Aguardando Missões..." : "🚀 Começar Jogo"}
          </button>

          <div style={estilos.areaPais}>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Área Restrita</p>
            <button
              style={estilos.botaoAzulPequeno}
              onClick={() => setTela("mestre")}
            >
              🛠️ Sou o Mestre
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== TELA DO MESTRE (COM SENHA) ===== */
  if (tela === "mestre") {
    if (!autorizado) {
      return (
        <div style={estilos.container}>
          <GlobalStyle />
          <div style={estilos.card}>
            <h2 style={{ color: "#fbbf24" }}>🔒 Área do Mestre</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Digite a senha para gerenciar missões:</p>
            
            <input 
              type="password"
              style={estilos.input}
              placeholder="Senha de acesso"
              value={senhaDigitada}
              onChange={e => setSenhaDigitada(e.target.value)}
            />
            
            <button 
              style={estilos.botaoAzul}
              onClick={() => {
                if (senhaDigitada === SENHA_CORRETA) {
                  setAutorizado(true);
                } else {
                  alert("Senha Incorreta! 🚫");
                  setSenhaDigitada("");
                }
              }}
            >
              Acessar Painel
            </button>

            <button 
              style={{ ...estilos.botaoCinza, marginTop: 10, width: '100%' }} 
              onClick={() => {
                setSenhaDigitada("");
                setTela("inicio");
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={estilos.container}>
        <GlobalStyle />
        <div style={estilos.card}>
          <h2 style={{ color: "#60a5fa" }}>🛠️ Criar Missões</h2>
          
          <div style={estilos.boxEscuro}>
            <label style={estilos.label}>O que procurar?</label>
            <input 
              style={estilos.inputEscuro}
              placeholder="Ex: Uma meia azul"
              value={novaMissaoTexto}
              onChange={e => setNovaMissaoTexto(e.target.value)}
            />

            <label style={estilos.label}>Pontos:</label>
            <input 
              type="number"
              style={estilos.inputEscuro}
              value={novaMissaoPontos}
              onChange={e => setNovaMissaoPontos(Number(e.target.value))}
            />

            <button 
              style={estilos.botaoAzul}
              onClick={() => {
                if (novaMissaoTexto) {
                  adicionarMissao(novaMissaoTexto, novaMissaoPontos);
                  setNovaMissaoTexto("");
                }
              }}
            >
              + Adicionar
            </button>
          </div>

          <div style={{ marginTop: 20, width: "100%" }}>
            <h3 style={{ fontSize: 16, color: "#cbd5e1" }}>Missões Ativas ({missoes.length})</h3>
            <div style={{ maxHeight: 150, overflowY: "auto" }}>
              {missoes.map((m, index) => (
                <div key={index} style={estilos.itemLista}>
                  <span>{index + 1}. {m.texto}</span>
                  <strong style={{ color: "#fbbf24" }}>{m.pontos}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20, width: "100%" }}>
            <button style={{ ...estilos.botaoCinza, flex: 1, background: '#ef4444' }} onClick={() => {
              if(confirm("Apagar todas as missões?")) limparMissoes();
            }}>
              🗑️ Limpar
            </button>
            <button 
              style={{ ...estilos.botaoCinza, flex: 1 }} 
              onClick={() => {
                setAutorizado(false);
                setSenhaDigitada("");
                setTela("inicio");
              }}
            >
              🔙 Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== TELA DO JOGO ===== */
  if (tela === "jogo") {
    if (!missaoAtual) {
        return (
            <div style={estilos.container}>
                <GlobalStyle />
                <div style={estilos.card}>
                  <h1>🎉 Fim das Missões!</h1>
                  <p>Você encontrou tudo o que o mestre pediu.</p>
                  <button style={estilos.botaoVerde} onClick={() => setTela("resultado")}>
                    🏆 Ver Resultado
                  </button>
                </div>
            </div>
        )
    }

    return (
      <div style={estilos.container}>
        <GlobalStyle />
        <div style={estilos.card}>
          <div style={estilos.badge}>Missão {indiceMissao + 1} de {missoes.length}</div>
          <h2 style={estilos.missaoTexto}>{missaoAtual.texto}</h2>
          <div style={estilos.pontosBox}>
            <span>💰 Vale: <strong>{missaoAtual.pontos}</strong></span>
            <span>🎒 Seus: <strong>{pontuacao}</strong></span>
          </div>

          <label style={estilos.botaoCamera}>
            📸 Tirar Foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFoto(URL.createObjectURL(e.target.files[0]));
                }
              }}
              style={{ display: "none" }} 
            />
          </label>

          {foto && (
            <div style={estilos.fotoWrapper}>
              <img src={foto} alt="Prova" style={estilos.foto} />
            </div>
          )}

          <button
            style={foto ? estilos.botaoVerde : estilos.botaoDesabilitado}
            disabled={!foto}
            onClick={() => {
              setPontuacao(pontuacao + missaoAtual.pontos);
              setFoto(null);
              if (indiceMissao + 1 < missoes.length) {
                setIndiceMissao(indiceMissao + 1);
              } else {
                setTela("resultado");
              }
            }}
          >
            ✅ Achei!
          </button>
        </div>
      </div>
    );
  }

  /* ===== TELA FINAL ===== */
  return (
    <div style={estilos.container}>
      <GlobalStyle />
      <div style={estilos.card}>
        <h1>🏆 Vitória!</h1>
        <p style={{ fontSize: 18 }}>{nome}, sua pontuação final:</p>
        <div style={estilos.pontuacaoFinal}>{pontuacao}</div>
        <p>pontos!</p>
        <button
          style={estilos.botaoAzul}
          onClick={() => {
            setPontuacao(0);
            setIndiceMissao(0);
            setTela("inicio");
          }}
        >
          🔄 Jogar Novamente
        </button>
      </div>
    </div>
  );
}

/* ===== ESTILOS (Sempre em Inglês) ===== */
const estilos: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "rgba(30, 41, 59, 0.95)",
    backdropFilter: "blur(10px)",
    padding: 30,
    borderRadius: 24,
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #334155",
  },
  titulo: {
    fontSize: 32,
    background: "linear-gradient(to right, #4ade80, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 20,
    fontWeight: 900,
  },
  input: {
    padding: 15,
    fontSize: 18,
    borderRadius: 12,
    border: "2px solid #334155",
    background: "#0f172a",
    color: "white",
    width: "100%",
    textAlign: "center",
    marginBottom: 15,
    boxSizing: "border-box",
  },
  botaoVerde: {
    width: "100%",
    padding: "15px",
    fontSize: 18,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(to bottom, #4ade80, #22c55e)",
    color: "#064e3b",
    fontWeight: "bold",
    boxShadow: "0 4px 0 #15803d",
  },
  botaoAzul: {
    width: "100%",
    padding: "12px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(to bottom, #60a5fa, #3b82f6)",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 0 #1d4ed8",
  },
  botaoCinza: {
    padding: "10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#475569",
    color: "white",
    fontWeight: "bold",
  },
  botaoDesabilitado: {
    width: "100%",
    padding: "15px",
    fontSize: 18,
    borderRadius: 12,
    border: "none",
    background: "#334155",
    color: "#94a3b8",
    fontWeight: "bold",
  },
  botaoAzulPequeno: {
    padding: "8px 16px",
    fontSize: 12,
    borderRadius: 20,
    background: "transparent",
    color: "#60a5fa",
    border: "1px solid #60a5fa",
    cursor: "pointer",
  },
  botaoCamera: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#f59e0b",
    color: "#78350f",
    borderRadius: 50,
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 15,
    boxShadow: "0 4px 0 #b45309",
  },
  missaoTexto: {
    fontSize: 26,
    textAlign: "center",
    margin: "20px 0",
  },
  pontosBox: {
    background: "#334155",
    padding: "10px 20px",
    borderRadius: 50,
    display: "flex",
    gap: 15,
    marginBottom: 20,
    fontSize: 14,
  },
  badge: {
    background: "#3b82f6",
    color: "white",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
  },
  fotoWrapper: {
    padding: 5,
    background: "white",
    borderRadius: 12,
    transform: "rotate(-2deg)",
    marginBottom: 15,
    boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
  },
  foto: {
    width: 200,
    height: 200,
    objectFit: "cover",
    borderRadius: 8,
  },
  areaPais: {
    marginTop: 30, 
    borderTop: "1px dashed #334155", 
    paddingTop: 20, 
    width: "100%", 
    textAlign: "center"
  },
  placarItem: {
    background: "#1e293b",
    padding: "8px 12px",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 220,
    border: "1px solid #334155",
    boxSizing: 'border-box'
  },
  boxEscuro: {
    background: "#0f172a", 
    padding: 15, 
    borderRadius: 12, 
    width: "100%", 
    boxSizing: "border-box",
  },
  label: {
    display: "block", 
    marginBottom: 5, 
    color: "#94a3b8", 
    fontSize: 13,
    textAlign: "left"
  },
  inputEscuro: {
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #475569",
    background: "#1e293b",
    color: "white",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 10,
  },
  itemLista: {
    background: "#334155", 
    padding: "8px 12px", 
    margin: "6px 0", 
    borderRadius: 8, 
    display: "flex", 
    justifyContent: "space-between",
    fontSize: 14
  },
  pontuacaoFinal: {
    fontSize: 64,
    fontWeight: 900,
    color: "#fbbf24",
    margin: "10px 0",
  },
};