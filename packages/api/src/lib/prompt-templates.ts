/**
 * Standardized prompts for Writelyy tools based on CLAUDE.md framework
 * Ensures outputs are consistently human-like, natural, and robust against AI detection
 */

export const CORE_RULES = `Preserve meaning and facts precisely. Vary sentence length, rhythm, and structure (short, medium, long). Prefer active voice; allow passive only if natural. Use contractions naturally (don't, won't, can't). Avoid robotic transitions: moreover, furthermore, in conclusion, overall, indeed, thus, consequently, therefore. Avoid academic boilerplate: "It is important to note that", "In today's society", "The purpose of this paper is", "As previously mentioned". Avoid AI overused vocabulary: significant, crucial, essential, vital, demonstrates, showcases, undoubtedly, unquestionably, pivotal, innovative, groundbreaking. Avoid exaggerated buzzwords / hyphenated compounds: cutting-edge, edge-cutting, ever-evolving, world-class, game-changing, state-of-the-art, next-level. Replace vague adjectives/adverbs with specific details. No hashtags, notes, emojis, markdown symbols, semicolons, or bullet points in output. Write in plain, natural English that feels authored by a real person. Do not explain your changes — return only the final text.`;

export const buildHumanizerPrompt = (inputText: string, tone: string): string => {
  return `${CORE_RULES}

Task: Rewrite the following text so it is indistinguishable from human writing while preserving meaning.

Guidelines:
- Break predictable AI patterns (syntax and vocabulary)
- Add light imperfections (natural repetition, informal phrasing)
- Preserve original tone when possible (requested tone: ${tone})

Text to rewrite:
${inputText}

Output: Only the rewritten text.`;
};

export const buildDetectorPrompt = (inputText: string): string => {
  return `Task: Analyze text and estimate if it was written by a human, AI, or mixed.

Evaluation Criteria:
- Sentence length distribution (AI = uniform, Human = varied)
- Word choice (AI = generic vocabulary)
- Style markers (AI avoids contractions, overuses transitions)
- Flow & rhythm (AI = mechanical, balanced)

Text to analyze:
${inputText}

Output Format:
Likelihood: [Human / AI / Mixed]
Confidence: [Low / Medium / High]
Reasoning: [Plain-English explanation, max 3 sentences]`;
};

export const buildSummariserPrompt = (inputText: string, summaryType: string): string => {
  const basePrompt = `${CORE_RULES}

Task: Summarize text into concise, natural language.

Guidelines:
- Keep summaries factual and faithful
- Use natural phrasing, avoid robotic markers
- Write as if a colleague explained key points
- Avoid generic platitudes or overcompression

`;

  let taskSpecific = '';
  switch (summaryType) {
    case 'brief':
      taskSpecific = `Create a brief summary (2-3 sentences) capturing the main points:\n\n${inputText}`;
      break;
    case 'detailed':
      taskSpecific = `Create a detailed summary covering all important points while maintaining context:\n\n${inputText}`;
      break;
    case 'key-points':
      taskSpecific = `Extract and present the key points in natural, flowing sentences:\n\n${inputText}`;
      break;
    default:
      taskSpecific = `Create a brief summary (2-3 sentences) capturing the main points:\n\n${inputText}`;
  }

  return `${basePrompt}${taskSpecific}

Output: Only the summary text.`;
};

export const buildParaphraserPrompt = (inputText: string, style: string): string => {
  return `${CORE_RULES}

Task: Rephrase text so it retains the same meaning but reads differently, like a human rewrite.

Guidelines:
- Vary sentence structure and rhythm
- Replace repeated patterns with alternatives
- Preserve tone, shift vocabulary naturally
- Avoid banned words/phrases and clichés
- Ensure fluent, natural, human-like prose

Style: ${style}

Text to paraphrase:
${inputText}

Output: Only the paraphrased text.`;
};