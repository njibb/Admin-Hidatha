import { type BjorkTone } from "./liquid-text-core-palette";

export function useBjorkTone(tone?: BjorkTone): BjorkTone {
  // Secara bawaan mengembalikan mode terang jika tidak didefinisikan
  return tone || "light";
}