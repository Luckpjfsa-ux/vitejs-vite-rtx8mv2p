import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

export interface Jogador {
  nome: string;
  pontos: number;
}

export function usarJogadores(codigoSala: string) {
  const [jogadores, setJogadores] = useState<Record<string, Jogador>>({});

  useEffect(() => {
    if (!codigoSala) return;

    const referenciaJogadores = ref(
      database,
      `salas/${codigoSala}/jogadores`
    );

    const pararEscuta = onValue(referenciaJogadores, (snapshot) => {
      if (snapshot.exists()) {
        setJogadores(snapshot.val());
      } else {
        setJogadores({});
      }
    });

    return () => pararEscuta();
  }, [codigoSala]);

  return jogadores;
}
