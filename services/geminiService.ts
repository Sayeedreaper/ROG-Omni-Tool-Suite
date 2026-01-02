import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Existing Function
export const generateSmartPythonScript = async (
  fileName: string,
  fileType: string,
  filePreview: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-3-flash-preview";

    const prompt = `
      I have a file named "${fileName}" with MIME type "${fileType}".
      Here is a hex preview of the beginning of the file:
      ${filePreview}
      Please write a robust, professional Python script to:
      1. Load this file.
      2. Identify what library would be best to parse it.
      3. Provide a code snippet that opens the file and prints basic metadata.
      If the file type is generic binary, use the 'struct' module.
      Return ONLY the Python code block.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.text || "";
    return text.replace(/```python/g, '').replace(/```/g, '').trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `# Error generating smart script.\n# Details: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// New Chat Functionality
export const createChatSession = (modelName: string, systemInstruction: string) => {
  const ai = getClient();
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};