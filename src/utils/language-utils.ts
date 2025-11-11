/**
 * Language and script detection utilities for multilingual support
 */

// Kannada Unicode range: U+0C80–U+0CFF
export const isKannadaText = (text: string): boolean => {
  return /[ಅ-ಹ]/.test(text);
};

// English/Latin script detection
export const isEnglishText = (text: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(text.trim());
};

// Detect the primary language/script of a text
export const detectLanguage = (text: string): "kn" | "en" | "mixed" => {
  const hasKannada = isKannadaText(text);
  const hasEnglish = isEnglishText(text);

  if (hasKannada && !hasEnglish) return "kn";
  if (hasEnglish && !hasKannada) return "en";
  if (hasKannada && hasEnglish) return "mixed";

  // Default to English for other scripts/characters
  return "en";
};

// Format name for display based on language preference
export const formatDisplayName = (
  names: {
    firstNameKn?: string;
    lastNameKn?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    firstName: string; // fallback
    lastName: string; // fallback
  },
  language: "kn" | "en" | string,
  title?: "sri" | "srimati"
): string => {
  const firstName =
    language === "kn"
      ? names.firstNameKn || names.firstName
      : names.firstNameEn || names.firstName;

  const lastName =
    language === "kn"
      ? names.lastNameKn || names.lastName
      : names.lastNameEn || names.lastName;

  if (title) {
    const titleText =
      language === "kn"
        ? title === "sri"
          ? "ಶ್ರೀ"
          : "ಶ್ರೀಮತಿ"
        : title === "sri"
        ? "Mr."
        : "Mrs.";

    const respectSuffix = language === "kn" ? "ರವರೆ" : "";

    return `${titleText} ${firstName} ${respectSuffix}`.trim();
  }

  return `${firstName}${lastName ? " " + lastName : ""}`;
};

export type NameUpdate = {
  firstName: string;
  lastName: string;
  detectedLanguage: "kn" | "en";
  firstNameKn?: string;
  lastNameKn?: string;
  firstNameEn?: string;
  lastNameEn?: string;
};

// Process name input and determine how to store it
export const processNameInput = (
  firstName: string,
  lastName: string
): NameUpdate => {
  const detected = detectLanguage(firstName);
  const detectedLanguage: "kn" | "en" = detected === "mixed" ? "kn" : detected; // Default mixed to Kannada

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    detectedLanguage,
    firstNameKn: detectedLanguage === "kn" ? firstName.trim() : undefined,
    lastNameKn:
      detectedLanguage === "kn" && lastName ? lastName.trim() : undefined,
    firstNameEn: detectedLanguage === "en" ? firstName.trim() : undefined,
    lastNameEn:
      detectedLanguage === "en" && lastName ? lastName.trim() : undefined,
  };
};
