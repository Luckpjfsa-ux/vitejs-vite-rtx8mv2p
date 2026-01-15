import { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, onValue, push, remove } from "firebase/database";

export type Missao = {
  id: string;
  texto: string;
  pontos: number;
};

export function usarMissoes(salaId: string) {
  const [missoes, setMissoes] = useState<Missao[]>([]);

  useEffect(() => {
    const missoesRef = ref(database, `salas/${salaId}/missoes`);

    const unsubscribe = onValue(missoesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaMissoes = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        setMissoes(listaMissoes);
      } else {
        setMissoes([]);
      }
    });

    return () => unsubscribe();
  }, [salaId]);

  const adicionarMissao = (texto: string, pontos: number) => {
    const missoesRef = ref(database, `salas/${salaId}/missoes`);
    push(missoesRef, { texto, pontos });
  };

  const limparMissoes = () => {
    const missoesRef = ref(database, `salas/${salaId}/missoes`);
    remove(missoesRef);
  };

  return { missoes, adicionarMissao, limparMissoes };
}