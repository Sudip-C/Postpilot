const MAX_HASHTAGS = 3;
const MIN_LENGTH = 100;
const MAX_LENGTH = 2500;

const forbiddenPatterns = [
  {
    pattern: /here'?s a thinking process/i,
    message: "Contains AI reasoning text.",
  },
  {
    pattern: /analyze the request/i,
    message: "Contains AI analysis text.",
  },
  {
    pattern: /chain[- ]of[- ]thought/i,
    message: "Contains chain-of-thought text.",
  },
  {
    pattern: /reasoning process/i,
    message: "Contains reasoning text.",
  },

  // Fabricated personal context
  {
    pattern: /\bin my career\b/i,
    message: "May contain fabricated career experience.",
  },
  {
    pattern: /\bdevelopers i know\b/i,
    message: "May contain fabricated personal context.",
  },
  {
    pattern: /\bmy clients\b/i,
    message: "May contain fabricated client experience.",
  },
  {
    pattern: /\bmy colleagues\b/i,
    message: "May contain fabricated colleague experience.",
  },

  // Unsupported hiring / market claims
  {
    pattern: /\brecruiters are\b/i,
    message: "Contains unsupported recruiter behavior.",
  },
  {
    pattern: /\bhiring managers are\b/i,
    message: "Contains unsupported hiring behavior.",
  },
  {
    pattern: /\bcandidate filtering\b/i,
    message: "Contains unsupported hiring-market language.",
  },
];

function countHashtags(content) {
  return content.match(/#[A-Za-z0-9_]+/g)?.length || 0;
}

function containsUrl(content) {
  return /(https?:\/\/|www\.)/i.test(content);
}

function findSuspiciousSpacing(content) {
  const patterns = [
    /\bhowto\b/i,
    /\bpromptsand\b/i,
    /\bpatternis\b/i,
    /\bto[a-z]{4,}\b/i,
    /\bgrade[a-z]{5,}\b/i,
  ];

  return patterns.some((pattern) => pattern.test(content));
}

export function validatePost(content) {
  const issues = [];
  let score = 100;

  if (!content || typeof content !== "string" || !content.trim()) {
    return {
      valid: false,
      score: 0,
      issues: ["Post content is empty."],
    };
  }

  const cleanContent = content.trim();

  if (cleanContent.length < MIN_LENGTH) {
    issues.push(
      `Post is too short. Minimum recommended length is ${MIN_LENGTH} characters.`
    );

    score -= 20;
  }

  if (cleanContent.length > MAX_LENGTH) {
    issues.push(
      `Post is too long. Maximum allowed length is ${MAX_LENGTH} characters.`
    );

    score -= 30;
  }

  const hashtagCount = countHashtags(cleanContent);

  if (hashtagCount > MAX_HASHTAGS) {
    issues.push(
      `Post contains ${hashtagCount} hashtags. Maximum allowed is ${MAX_HASHTAGS}.`
    );

    score -= 20;
  }

  if (containsUrl(cleanContent)) {
    issues.push("Post contains a URL.");

    score -= 10;
  }

  if (findSuspiciousSpacing(cleanContent)) {
    issues.push(
      "Post may contain malformed or accidentally joined words."
    );

    score -= 25;
  }

  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(cleanContent)) {
      issues.push(rule.message);
      score -= 25;
    }
  }

  score = Math.max(0, score);

  return {
    valid: issues.length === 0 && score >= 75,
    score,
    issues,
    metadata: {
      characterCount: cleanContent.length,
      hashtagCount,
    },
  };
}