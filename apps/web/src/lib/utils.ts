import { getLocale } from "#/paraglide/runtime.js";

/**
 * Deterministic 32-bit hash (FNV-1a) of a string.
 * Same input always yields the same output, across runs and platforms.
 */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function relativeLuminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** WCAG contrast ratio against pure white. */
function contrastWithWhite(hex: string): number {
  return 1.05 / (relativeLuminance(hex) + 0.05);
}

export type NameColorOptions = {
  /** Saturation in percent. Default 65. */
  saturation?: number;
  /** Starting lightness in percent. Default 45. */
  lightness?: number;
  /**
   * Minimum WCAG contrast against white text. The lightness is stepped down
   * until it is met, so yellow and green hues get darker automatically.
   * Pass 0 to use the given lightness as-is. Default 4.5.
   */
  minContrast?: number;
};

/**
 * Turns an arbitrary name into a stable hex color.
 * The hue comes from the hashed name; saturation and lightness stay in a
 * fixed range, so every generated color carries white text legibly.
 *
 * nameToHex("Pizzeria Napoli") // => "#8a7715" (always the same)
 */
export function nameToHex(name: string, options: NameColorOptions = {}): string {
  const { saturation = 65, lightness = 45, minContrast = 4.5 } = options;
  const hue = hashString(name.trim().toLowerCase()) % 360;

  let l = lightness;
  let hex = hslToHex(hue, saturation, l);
  while (l > 10 && contrastWithWhite(hex) < minContrast) {
    l -= 2;
    hex = hslToHex(hue, saturation, l);
  }
  return hex;
}

/**
 * Initials for avatar fallbacks: "Pizzeria Napoli" => "PN", "Napoli" => "NA".
 */
export function nameToInitials(name: string, max = 2): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, max).toUpperCase();
  return words
    .slice(0, max)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Formats a date in the active locale, e.g. "17 Sep 2026" / "17. Sept. 2026".
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium" }).format(
    new Date(date),
  );
}
