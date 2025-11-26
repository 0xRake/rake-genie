/**
 * Gemini API Client with Streaming Support
 * Enhanced with Digital Twin context and citation tracking
 */

import { queryDigitalTwin } from './digital-twin';
import { registerCitation, getCitation } from '@/data/citations';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const STRATEGIC_SYSTEM_PROMPT = `
ROLE: You are a Senior Forward Deployed Engineer (FDE) and Strategic Advisor for Palantir Technologies. 

YOUR MISSION: Translate complex Ontology concepts into kinetic operational realities. Do not just describe features; explain their "Wedge" value and operational utility.

CORE DOCTRINE:

1. ONTOLOGY IS THE API: The Ontology decouples the data integration layer from the application layer. It maps "tables" to "things" (Objects).

2. AIP IS NOT A CHATBOT: AIP allows LLMs to "tool use" the Ontology. It binds generative AI to deterministic functions and write-back actions.

3. SOFTWARE-DEFINED DATA INTEGRATION (SDDI): Pipeline Builder and Data Connection provide the substrate. We don't just store data; we model it.

4. OPERATIONAL REALITY: The Digital Twin must support *Decisions* (Actions), not just dashboards.

OPERATIONAL LOOP:

1. READ: Ingest user query/nodes.
2. ASSESS: Determine the strategic value.
3. REASON: Connect the concepts (Neuropathway).
4. EXECUTE: Provide a tactical answer formatted in clean Markdown.

OUTPUT STYLE:
- Use Markdown headers, bullet points, and bold text for readability.
- Be concise but high-bandwidth.
- Focus on "How to" and "Why it matters".
- When referencing concepts, use citation markers [1], [2], etc.
`;

export interface StreamChunk {
  text: string;
  done: boolean;
  citations?: string[];
}

/**
 * Call Gemini API with Digital Twin context (non-streaming)
 */
export async function callGemini(
  userPrompt: string,
  retries = 2,
  contextNodes?: string[]
): Promise<string> {
  // Query Digital Twin for context if nodes are provided
  let digitalTwinContext = '';
  const citations: string[] = [];
  
  if (contextNodes && contextNodes.length > 0) {
    const twinResult = queryDigitalTwin({ nodeIds: contextNodes });
    digitalTwinContext = `\n\nDIGITAL TWIN CONTEXT:\n${twinResult.context}\n`;
    citations.push(...twinResult.citations.map(c => c.id));
  }

  const enhancedPrompt = userPrompt + digitalTwinContext;

  if (!apiKey) {
    return "## Simulation Mode\n\n**Analysis:**\nAccessing secure enclave...\n\n**Strategic Output:**\nThis is a simulated response. To activate real-time FDE intelligence, please configure a valid API Key.\n\n**Action Plan:**\n1. Review Ontology.\n2. Deploy Pipeline.\n3. Execute Action.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          systemInstruction: { parts: [{ text: STRATEGIC_SYSTEM_PROMPT }] }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      throw new Error("No response generated from API");
    }

    return result;
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    // Retry logic for network errors
    if (retries > 0 && (error.message?.includes('fetch') || error.message?.includes('network'))) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return callGemini(userPrompt, retries - 1, contextNodes);
    }

    return `**Error:** ${error.message || 'An unexpected error occurred. Please try again.'}`;
  }
}

/**
 * Stream Gemini API response with Digital Twin context
 */
export async function* streamGemini(
  userPrompt: string,
  contextNodes?: string[]
): AsyncGenerator<StreamChunk, void, unknown> {
  // Query Digital Twin for context if nodes are provided
  let digitalTwinContext = '';
  const citations: string[] = [];
  
  if (contextNodes && contextNodes.length > 0) {
    const twinResult = queryDigitalTwin({ nodeIds: contextNodes });
    digitalTwinContext = `\n\nDIGITAL TWIN CONTEXT:\n${twinResult.context}\n`;
    citations.push(...twinResult.citations.map(c => c.id));
  }

  const enhancedPrompt = userPrompt + digitalTwinContext;

  if (!apiKey) {
    yield { text: "## Simulation Mode\n\nThis is a simulated response.", done: true, citations };
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:streamGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          systemInstruction: { parts: [{ text: STRATEGIC_SYSTEM_PROMPT }] }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    let buffer = '';
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                yield { text, done: false, citations };
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    yield { text: '', done: true, citations };
  } catch (error: any) {
    yield { text: `**Error:** ${error.message}`, done: true, citations };
  }
}

