import { ref, set } from "firebase/database";
import { database } from "./firebase";

// Função para gerar código de sala com 4 dígitos
function gerarCodigoSala(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Criar uma nova sala (Organizador)
export async function criarSala(nomeOrganizador: string, tempoPartida: number) {
  const codigoSala = gerarCodigoSala();

  const referenciaSala = ref(database, `salas/${codigoSala}`);

  await set(referenciaSala, {
    codigo: codigoSala,
    organizador: nomeOrganizador,
    tempo: tempoPartida, // minutos
    criadaEm: Date.now(),
    status: "aguardando",
    jogadores: {
      host: {
        nome: nomeOrganizador,
        pontos: 0
      }
    }
  });

  return codigoSala;
}
