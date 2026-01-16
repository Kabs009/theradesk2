import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const generateNoteDraft = async (rawInput: string, format: 'SOAP' | 'Narrative' | 'Intake') => {
  const ai = getAI();
  const systemInstruction = `
    You are an expert Clinical Documentation Assistant.
    Convert rough clinical observations into a professional ${format} note.
    - S (Subjective): Client's perspective and statements.
    - O (Objective): Measurable therapist observations.
    - A (Assessment): Clinical synthesis of S and O.
    - P (Plan): Future interventions and schedule.
    Maintain an objective, clinical tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a clinical note from these observations: ${rawInput}`,
      config: { systemInstruction, temperature: 0.3 },
    });
    return response.text || "Failed to generate note. Please try manual entry.";
  } catch (error) {
    console.error("Gemini Note Error:", error);
    return "Failed to generate note. Please try manual entry.";
  }
};

export const processTranscription = async (audioBase64: string, mimeType: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      contents: {
        parts: [
          { inlineData: { data: audioBase64.split(',')[1] || audioBase64, mimeType } },
          { text: "Transcribe this clinical summary accurately, removing filler words." }
        ]
      },
      config: { temperature: 0.1 },
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Audio Error:", error);
    return "";
  }
};

export const generateBillingItem = async (type: string, duration: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a one-line professional billing description for a ${duration}min ${type} session.`,
      config: { temperature: 0.1 },
    });
    return (response.text || `${type} - ${duration}m`).trim();
  } catch {
    return `${type} - ${duration}m`;
  }
};