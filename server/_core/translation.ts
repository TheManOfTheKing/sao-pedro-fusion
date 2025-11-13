import { ENV } from "./env";

// Language codes mapping
const LANGUAGE_CODES: Record<string, string> = {
  pt: "pt",
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
};

// Supported languages (excluding Portuguese as it's the source)
const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "it"];

let translateClient: any = null;
let TranslateClass: any = null;

async function getTranslateClient(): Promise<any> {
  if (!ENV.googleTranslateApiKey) {
    console.warn("[Translation] Google Translate API key not configured");
    return null;
  }

  if (!translateClient) {
    try {
      // Dynamic import to avoid errors if package is not available
      if (!TranslateClass) {
        try {
          const translateModule = await import("@google-cloud/translate");
          TranslateClass = translateModule.Translate || translateModule.default?.Translate;
        } catch (importError) {
          console.warn("[Translation] Google Cloud Translate package not available:", importError);
          return null;
        }
      }

      if (!TranslateClass) {
        return null;
      }

      translateClient = new TranslateClass({
        key: ENV.googleTranslateApiKey,
      });
    } catch (error) {
      console.error("[Translation] Failed to initialize Google Translate client:", error);
      return null;
    }
  }

  return translateClient;
}

export interface TranslationResult {
  language: string;
  name: string;
  description: string;
}

/**
 * Translates menu item name and description to all supported languages
 */
export async function translateMenuItem(
  namePt: string,
  descriptionPt?: string | null
): Promise<TranslationResult[]> {
  const client = await getTranslateClient();
  
  if (!client) {
    console.warn("[Translation] Google Translate not available, returning empty translations");
    return [];
  }

  const translations: TranslationResult[] = [];

  try {
    // Translate name and description for each language
    for (const targetLang of SUPPORTED_LANGUAGES) {
      const targetCode = LANGUAGE_CODES[targetLang];
      if (!targetCode) continue;

      try {
        // Translate name
        const [nameTranslation] = await client.translate(namePt, {
          from: "pt",
          to: targetCode,
        });

        // Translate description if provided
        let descriptionTranslation = "";
        if (descriptionPt && descriptionPt.trim()) {
          const [descTranslation] = await client.translate(descriptionPt, {
            from: "pt",
            to: targetCode,
          });
          descriptionTranslation = descTranslation as string;
        }

        translations.push({
          language: targetLang,
          name: (nameTranslation as string) || namePt,
          description: descriptionTranslation || "",
        });
      } catch (error) {
        console.error(`[Translation] Error translating to ${targetLang}:`, error);
        // Continue with other languages even if one fails
        translations.push({
          language: targetLang,
          name: namePt, // Fallback to Portuguese
          description: descriptionPt || "",
        });
      }
    }
  } catch (error) {
    console.error("[Translation] Error in translateMenuItem:", error);
    // Return empty array on critical error
    return [];
  }

  return translations;
}

/**
 * Translates a single text to a target language
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "pt"
): Promise<string> {
  const client = await getTranslateClient();
  
  if (!client) {
    return text; // Return original if translation not available
  }

  try {
    const targetCode = LANGUAGE_CODES[targetLanguage];
    if (!targetCode) {
      return text;
    }

    const [translation] = await client.translate(text, {
      from: sourceLanguage,
      to: targetCode,
    });

    return (translation as string) || text;
  } catch (error) {
    console.error(`[Translation] Error translating to ${targetLanguage}:`, error);
    return text; // Return original on error
  }
}

