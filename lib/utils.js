import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const toTitleCase = (str) => {
  if (typeof str !== "string") return "";
  const lowerWords = [
    "and",
    "or",
    "the",
    "of",
    "in",
    "on",
    "a",
    "an",
    "for",
    "to",
    "with",
    "at",
    "by",
    "from",
  ];
  return str
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      i === 0 || !lowerWords.includes(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
};
