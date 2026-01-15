import { ref, get, update } from "firebase/database";
import { database } from "./firebase";

// Entrar em uma sala existente
export async function entrarSala(codigoSala: string, nomeJogador: string) {
  const referenciaSala = ref(database, `salas/${codigoSala}`);

  const snapshot = await get(referenciaSala);

  if (!snapshot.exists()) {
    throw new Error("Sala não encontrada");
  }

  const idJogador = `jogador_${Date.now()}`;

  const referenciaJogador = ref(
    database,
    `salas/${codigoSala}/jogadores/${idJogador}`
  );

  await update(referenciaJogador, {
    nome: nomeJogador,
    pontos: 0
  });

  return {
    codigoSala,
    idJogador
  };
}
