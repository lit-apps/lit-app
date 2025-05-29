import { LanguageNativeT } from "./language-native.js";

/**
 * List of all sign languages per spoken language.
 * 
 * source: 
 * - https://evertype.com/standards/iso639/sgn.html (main source)
 * - https://en.wikipedia.org/wiki/List_of_sign_languages
 * - https://www.signwriting.org/archive/docs1/sw0033-Sign-Language-Codes.pdf
 */

type NameT = string;
type AcronymT = string;
type CodeT = string;
export type SignLanguageRecT = Record<CodeT, [NameT, AcronymT | undefined, LanguageNativeT[]]>;

export const signLanguage = {
  'sgn-IS': ['International Sign Language', 'IS', []],
  'sgn-US': ['American Sign Language', 'ASL', ['en']],
  'sgn-GB': ['British Sign Language', 'BSL', ['en']],
  'sgn-IE': ['Irish Sign Language', 'ISL', ['en']],
  'sgn-AU': ['Australian Sign Language', 'Auslan', ['en']],
  'sgn-FR': ['Langue des Signes Française', 'LSF', ['fr']],
  'sgn-NZ': ['New Zealand Sign Language', undefined, ['en']],
  'sgn-BE-nl': ['Belgian-Flemish Sign Language', undefined, ['nl']],
  'sgn-BE-fr': ['Belgian-French Sign Language', undefined, ['fr']],
  'sgn-CA-QC': ['French Canadian Sign Language', 'LSQ', ['fr']],
  'sgn-CO': ['Colombian Sign Language', 'LSC', ['es']],
  'sgn-BR': ['Brazilian Sign Language', 'LIBRAS', ['pt']],
  'sgn-NL': ['Dutch Sign Language', 'NGT', ['nl']],
  'sgn-DE': ['German Sign Language', 'DGS', ['de']],
  'sgn-GR': ['Greek Sign Language', undefined, ['el']],
  'sgn-IT': ['Italian Sign Language', 'LIS', ['it']],
  'sgn-MX': ['Mexican Sign Language', 'LSM', ['es']],
  'sgn-NI': ['Nicaraguan Sign Language', 'ISN', ['es']],
  'sgn-NO': ['Norwegian Sign Language', 'NTS', ['no']],
  'sgn-PT': ['Portuguese Sign Language', 'LGP', ['pt']],
  'sgn-ZA': ['South African Sign Language', undefined, ['en']],
  'sgn-ES': ['Spanish Sign Language', 'LSE', ['es']],
  'sgn-SE': ['Swedish Sign Language', 'STS', ['sv']],
  'sgn-CH-de': ['Swiss-German Sign Language', 'DSGS', ['de']],
  'sgn-RU': ['Russian Sign Language', undefined, ['ru']],
  'sgn-CN': ['Chinese Sign Language', 'CSL', ['zh']],
  'sgn-AT': ['Austrian Sign Language', 'ÖGS', ['de']],
  'sgn-PL': ['Polish Sign Language', undefined, ['pl']],
  'sgn-AR': ['Arabic Sign Language', undefined, ['ar']],
  'sgn-IL': ['Hebrew Sign Language', undefined, ['iw']],
  'sgn-IR': ['Persian Sign Language', undefined, ['fa']],
  'sgn-IN': ['Indopakistani Sign Language', 'IPSL', ['hi']],
  // 'sgn-DK': ['Danish Sign Language', 'DTS', ['da']],
  // 'sgn-JP': ['Japanese Sign Language', undefined, ['ja']],
} as const satisfies SignLanguageRecT;

export type SignLanguageT = keyof typeof signLanguage;