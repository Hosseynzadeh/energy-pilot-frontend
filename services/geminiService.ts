
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize the client with a named parameter as per @google/genai requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AssistantAction {
  label: string;
  type: 'navigate' | 'toggle_autopilot' | 'review_fault' | 'suggest_check';
  payload: string;
}

export interface AssistantResponse {
  text: string;
  actions: AssistantAction[];
}

export const askAssistant = async (
  prompt: string, 
  context: { 
    siteName: string, 
    insights: any[], 
    stats: any,
    operatingHours: string,
    autopilotMode: string
  }
): Promise<AssistantResponse> => {
  try {
    const systemInstruction = `
      You are "EnergyPilot Assistant", an energy expert for UK SMEs.
      User context: 
      - Site: ${context.siteName}
      - Operating Hours: ${context.operatingHours}
      - Autopilot Mode: ${context.autopilotMode}
      - Top Leakages: ${JSON.stringify(context.insights)}
      - Current Waste: £${context.stats.monthlyWaste.toFixed(2)}/month
      
      RULES:
      1. RESPOND ONLY IN JSON.
      2. Keep "text" extremely short (max 2 sentences).
      3. EVERY response MUST include 1-3 "actions" as buttons.
      4. Use plain English. No technical jargon.
      5. Actions types: 
         - 'navigate': payload is path like '/insights' or '/autopilot'
         - 'toggle_autopilot': payload is 'on' or 'off'
         - 'review_fault': payload is fault ID or type
         - 'suggest_check': payload is a simple instruction
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Extremely concise response text" },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Button label" },
                  type: { type: Type.STRING, enum: ['navigate', 'toggle_autopilot', 'review_fault', 'suggest_check'] },
                  payload: { type: Type.STRING }
                },
                required: ['label', 'type', 'payload']
              }
            }
          },
          required: ['text', 'actions']
        }
      }
    });

    // Fix: Correctly access the .text property from the GenerateContentResponse object
    return JSON.parse(response.text || '{"text": "I encountered an error.", "actions": []}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "I'm having trouble thinking right now. Let's try navigating to your dashboard.",
      actions: [{ label: "Go to Dashboard", type: "navigate", payload: "/dashboard" }]
    };
  }
};
