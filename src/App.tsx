import { useState } from "react";
import { usarJogadores } from "./usarJogadores";
import { usarMissoes } from "./usarMissoes"; 

export default function App() {
  const salaId = "1234"; // ID fixo da sala por enquanto
  const jogadores = usarJogadores(salaId);
  const { missoes, adicionarMissao, limparMissoes } = usarMissoes(salaId);

  /* ===== ESTADOS ===== */
  const [tela, setTela] = useState<"inicio" | "mestre" | "jogo" | "resultado">("inicio");
  const [nome, setNome] = useState("");
  const [indiceMissao, setIndiceMissao] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [foto, setFoto] = useState<string | null>(null);

  // Estados para criar nova missão (Área do Mestre)
  const [novaMissaoTexto, setNovaMissaoTexto] = useState("");
  const [novaMissaoPontos, setNovaMissaoPontos] = useState(100);

  const missaoAtual = missoes[indiceMissao];

  /* ===== TELA INICIAL ===== */
  if (tela === "inicio") {
    return (
      <div style={estilos.container}>
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <h3>🏆 Placar ao vivo</h3>
          {Object.entries(jogadores).map(([id, jogador]) => (
            <div key={id}>
              {jogador.nome} — {jogador.pontos} pontos
            </div>
          ))}
        </div>

        <h1>🕵️ Detetive Real</h1>

        <input
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={estilos.input}
        />

        <button
          style={estilos.botao}
          disabled={!nome || missoes.length === 0}
          onClick={() => nome && setTela("jogo")}
        >
          {missoes.length === 0 ? "Aguardando Missões..." : "Começar Jogo"}
        </button>

        <div style={{ marginTop: 30, borderTop: "1px solid #334155", paddingTop: 20, width: "100%", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>Área dos Pais</p>
          <button
            style={{ ...estilos.botao, background: "#3b82f6", fontSize: 14 }}
            onClick={() => setTela("mestre")}
          >
            Sou o Mestre (Criar Missões)
          </button>
        </div>
      </div>
    );
  }

  /* ===== TELA DO MESTRE (CRIAR MISSÕES) ===== */
  if (tela === "mestre") {
    return (
      <div style={estilos.container}>
        <h2>🛠️ Criar Missões</h2>
        
        <div style={{ background: "#1e293b", padding: 15, borderRadius: 10, width: "90%", maxWidth: 300 }}>
          <label style={{ display: "block", marginBottom: 5 }}>O que procurar?</label>
          <input 
            style={{ ...estilos.input, width: "100%", boxSizing: "border-box", marginBottom: 10 }}
            placeholder="Ex: Uma meia azul"
            value={novaMissaoTexto}
            onChange={e => setNovaMissaoTexto(e.target.value)}
          />

          <label style={{ display: "block", marginBottom: 5 }}>Quantos pontos?</label>
          <input 
            type="number"
            style={{ ...estilos.input, width: "100%", boxSizing: "border-box", marginBottom: 10 }}
            value={novaMissaoPontos}
            onChange={e => setNovaMissaoPontos(Number(e.target.value))}
          />

          <button 
            style={{ ...estilos.botao, width: "100%" }}
            onClick={() => {
              if (novaMissaoTexto) {
                adicionarMissao(novaMissaoTexto, novaMissaoPontos);
                setNovaMissaoTexto("");
              }
            }}
          >
            + Adicionar Missão
          </button>
        </div>

        <div style={{ marginTop: 20, width: "90%", maxWidth: 300 }}>
          <h3>Missões Atuais ({missoes.length})</h3>
          {missoes.map((m, index) => (
            <div key={index} style={{ background: "#334155", padding: 10, margin: "5px 0", borderRadius: 5, display: "flex", justifyContent: "space-between" }}>
              <span>{index + 1}. {m.texto}</span>
              <strong>{m.pontos}pts</strong>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button style={{ ...estilos.botao, background: "#ef4444" }} onClick={limparMissoes}>
            Limpar Tudo
          </button>
          <button style={{ ...estilos.botao, background: "#64748b" }} onClick={() => setTela("inicio")}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  /* ===== TELA DO JOGO ===== */
  if (tela === "jogo") {
    // Se não tiver missões ou acabou as missões
    if (!missaoAtual) {
        return (
            <div style={estilos.container}>
                <h2>Todas missões completas!</h2>
                <button style={estilos.botao} onClick={() => setTela("resultado")}>Ver Placar Final</button>
            </div>
        )
    }

    return (
      <div style={estilos.container}>
        <h2>Missão {indiceMissao + 1}/{missoes.length}</h2>

        <p style={estilos.missao}>{missaoAtual.texto}</p>

        <p>Valendo: {missaoAtual.pontos} pontos</p>
        <p>Seus pontos: {pontuacao}</p>

        {/* CÂMERA */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFoto(URL.createObjectURL(e.target.files[0]));
            }
          }}
          style={{ marginBottom: 12 }}
        />

        {/* PREVISUALIZAÇÃO */}
        {foto && (
          <img
            src={foto}
            alt="Foto da missão"
            style={{
              width: 200,
              borderRadius: 10,
              marginBottom: 12,
              border: "2px solid white",
            }}
          />
        )}

        <button
          style={{
            ...estilos.botao,
            opacity: foto ? 1 : 0.5,
            cursor: foto ? "pointer" : "not-allowed",
          }}
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
          Achei!
        </button>
      </div>
    );
  }

  /* ===== TELA FINAL ===== */
  return (
    <div style={estilos.container}>
      <h1>🏆 Fim de Jogo</h1>
      <p>{nome}, sua pontuação final foi:</p>
      <h2>{pontuacao} pontos</h2>

      <button
        style={estilos.botao}
        onClick={() => {
          setPontuacao(0);
          setIndiceMissao(0);
          setTela("inicio");
        }}
      >
        Jogar Novamente
      </button>
    </div>
  );
}

/* ===== ESTILOS ===== */
const estilos: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    width: 220,
    textAlign: "center",
  },
  botao: {
    padding: "12px 20px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#22c55e",
    color: "#052e16",
    fontWeight: "bold",
  },
  missao: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
};