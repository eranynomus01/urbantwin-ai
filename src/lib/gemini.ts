import { AIAnalysisResult } from '@/types';

export async function analyzeSOSReport(
  disaster_type: string,
  description: string,
  people_affected: number,
  urgency: string
): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI Emergency Triage System for a National Disaster Portal.
Analyze this emergency report:
Disaster Type: ${disaster_type}
Description: ${description}
People Affected: ${people_affected}
Urgency: ${urgency}

Return ONLY valid JSON with keys:
"severity" (number 1-10),
"category" (string),
"recommended_team" (string),
"priority_level" ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW"),
"summary" (1-2 sentence string),
"duplicate_risk" ("Low" | "Moderate" | "High")`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.warn("Gemini API call error, applying triage engine fallback:", e);
    }
  }

  // Intelligent Triage Fallback Engine
  let sev = 5;
  if (urgency === 'Critical' || people_affected > 10) sev = 9;
  else if (urgency === 'High' || people_affected > 4) sev = 7;
  else if (urgency === 'Medium') sev = 5;
  else sev = 3;

  const teams: Record<string, string> = {
    Flood: 'NDRF Water Rescue & Amphibious Force',
    Fire: 'Fire & Rescue Disaster Squad',
    Earthquake: 'NDRF Heavy Debris Search & Rescue',
    Cyclone: 'Civil Defense Fast Action Brigade',
    Heatwave: 'District Mobile Heat-Stroke Paramedics',
    Landslide: 'Geological Emergency Response Unit',
    'Medical Emergency': 'Rapid Ambulance & Field Doctors Team'
  };

  const pLevel = sev >= 8 ? 'CRITICAL' : sev >= 6 ? 'HIGH' : sev >= 4 ? 'MEDIUM' : 'LOW';

  return {
    severity: sev,
    category: `AI Triage - ${disaster_type} Sector`,
    recommended_team: teams[disaster_type] || 'National Emergency Response Unit',
    priority_level: pLevel,
    summary: `Emergency (${disaster_type}) affecting approx ${people_affected} individuals requiring immediate response.`,
    duplicate_risk: 'Low'
  };
}

export async function chatWithAIDA(message: string, context: string = 'Disaster Relief'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are AIDA (Artificial Intelligence Disaster Assistant) for a National Emergency Management Portal.
Context: ${context}
User Query: ${message}

Provide urgent, concise, bulleted survival instructions, helpline numbers (112, 1070), and shelter guidance.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("AIDA Chat Gemini API fallback:", e);
    }
  }

  const msgLower = message.toLowerCase();
  if (msgLower.includes('flood') || msgLower.includes('water')) {
    return `🌊 **FLOOD SURVIVAL INSTRUCTIONS (AIDA Response):**
1. Move immediately to higher ground or upper floors of sturdy structures.
2. DO NOT walk or drive through moving floodwaters.
3. Turn off electricity mains and gas valves if safe to do so.
4. Keep emergency kit ready: bottled water, flashlight, power bank, first-aid.
📞 Helplines: NDRF: 1070 | National Emergency: 112`;
  } else if (msgLower.includes('fire')) {
    return `🔥 **FIRE EMERGENCY INSTRUCTIONS (AIDA Response):**
1. Stay low to the ground below smoke. Cover mouth with a damp cloth.
2. Test doors for heat before opening.
3. If clothes catch fire: Stop, Drop, and Roll.
4. Evacuate via stairs — NEVER use elevators.
📞 Fire Services: 101 | National Emergency: 112`;
  } else if (msgLower.includes('earthquake')) {
    return `🌋 **EARTHQUAKE SAFETY INSTRUCTIONS (AIDA Response):**
1. **DROP, COVER, HOLD ON**: Get under a sturdy desk or table.
2. Stay away from glass windows and unanchored walls.
3. If outdoors: move to open spaces away from power lines and buildings.
📞 National Helpline: 112 | Red Cross: 1077`;
  }

  return `🚨 **AIDA EMERGENCY ASSISTANT:**
Stay calm! If you are in immediate danger:
1. Tap **"REPORT SOS"** on this portal to trigger GPS dispatch.
2. Dial **112** for direct National Emergency Response.
3. Share your live location with family. How else can I assist with safety or shelter?`;
}
