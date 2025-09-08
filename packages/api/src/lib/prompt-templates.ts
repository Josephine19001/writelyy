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
  return `Task: Provide comprehensive AI detection analysis with specific indicators and actionable feedback.

Analyze the text across these four dimensions and provide scores (0-100) and specific issues:

**VOCABULARY ANALYSIS:**
- AI markers: overuse of words like "significant," "crucial," "essential," "demonstrate," "showcase," "innovative," "cutting-edge"
- Human markers: natural word variety, colloquialisms, contractions, informal expressions
- Score: 0 (definitely AI) to 100 (definitely human)

**SYNTAX ANALYSIS:**
- AI markers: uniform sentence length, repetitive structures, overuse of transitions like "furthermore," "moreover," "consequently"
- Human markers: varied sentence length, natural flow, occasional fragments, conversational tone
- Score: 0 (definitely AI) to 100 (definitely human)

**COHERENCE ANALYSIS:**
- AI markers: overly perfect logical flow, lack of tangents, mechanical organization
- Human markers: natural digressions, personal anecdotes, imperfect but authentic structure
- Score: 0 (definitely AI) to 100 (definitely human)

**CREATIVITY ANALYSIS:**
- AI markers: predictable phrasing, generic examples, lack of personality
- Human markers: unique perspectives, personal voice, creative analogies, unexpected insights
- Score: 0 (definitely AI) to 100 (definitely human)

Text to analyze:
${inputText}

Output as JSON:
{
  "likelihood": "Human|AI|Mixed",
  "confidence": "Low|Medium|High",
  "reasoning": "2-3 sentence summary of key findings",
  "vocabulary": {
    "score": number,
    "issues": ["specific AI words/phrases found"],
    "explanation": "brief analysis of vocabulary patterns"
  },
  "syntax": {
    "score": number,
    "issues": ["specific structural problems"],
    "explanation": "brief analysis of sentence structure"
  },
  "coherence": {
    "score": number,
    "issues": ["specific flow/organization issues"],
    "explanation": "brief analysis of text organization"
  },
  "creativity": {
    "score": number,
    "issues": ["specific creativity deficiencies"],
    "explanation": "brief analysis of originality and voice"
  },
  "suggestions": ["specific recommendations to make text more human-like"]
}`;
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