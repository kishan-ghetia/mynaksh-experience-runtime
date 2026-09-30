import { Button, Text, View } from "react-native";
import { delay } from "../api/mockApi";
import { ExperienceProps } from "../runtime/types";
import { registerExperience } from "../runtime/registry";
import { useEffect, useState } from "react";

type TarotConfig = { deck?: string; maxCards?: number };

const DECKS: Record<string, string[]> = {
  classic: [
    "Card 1",
    "Card 2",
    "Card 3",
    "Card 4",
    "Card 5",
    "Card 6",
    "Card 7",
    "Card 8",
  ],
};

async function fetchDeck(deckName: string) {
  await delay(1000);
  const deck = DECKS[deckName];
  if (!deck) throw new Error(`Unknown deck: ${deckName}`);
  return deck;
}

function TarotV1({ config, onStatusChange }: ExperienceProps<TarotConfig>) {
  const deckName = config.deck ?? "classic";
  const maxCards = config.maxCards ?? 3;

  const [deck, setDeck] = useState<string[]>([]);
  const [drawn, setDrawn] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    onStatusChange("loading");
    fetchDeck(deckName)
      .then((cards) => {
        if (cancelled) return;
        setDeck(cards);
        onStatusChange("ready");
      })
      .catch((err: Error) => {
        if (!cancelled) onStatusChange("failed", err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [deckName, onStatusChange]);

  const isDone = drawn.length >= maxCards;

  function drawCard() {
    const remaining = deck.filter((card) => !drawn.includes(card));
    const card = remaining[Math.floor(Math.random() * remaining.length)];
    const next = [...drawn, card];
    setDrawn(next);
    if (next.length === maxCards) onStatusChange("completed");
  }

  if (deck.length === 0) {
    return <Text>shuffling the {deckName} deck...</Text>;
  }
  return (
    <View>
      <Text>
        {deckName} deck, draw {maxCards} cards
      </Text>
      {drawn.map((card) => (
        <Text key={card}>{`| ${card}`}</Text>
      ))}
      {!isDone && <Button title="Draw a card" onPress={drawCard} />}
    </View>
  );
}

registerExperience("tarot", "v1", TarotV1);
