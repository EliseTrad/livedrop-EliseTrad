// Assistant engine logic
const { classifyIntent } = require('./intent-classifier');
const functionRegistry = require('./function-registry');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load prompts.yaml for identity, tone, etc.
const promptsPath = path.resolve(__dirname, '../../../../docs/prompts.yaml');
let prompts = {};
try {
  prompts = yaml.load(fs.readFileSync(promptsPath, 'utf8'));
} catch (e) {
  prompts = {};
}

// Load ground-truth.json for policy grounding
const kbPath = path.resolve(__dirname, '../../../../docs/ground-truth.json');
let knowledgeBase = [];
try {
  const kbRaw = fs.readFileSync(kbPath, 'utf8');
  const kbJson = JSON.parse(kbRaw);
  knowledgeBase = kbJson.documents || kbJson.knowledge_base?.documents || [];
} catch (e) {
  knowledgeBase = [];
}

// Simple grounding: match user query to policy category
function findRelevantPolicies(userQuery) {
  const query = userQuery.toLowerCase();
  const categoryKeywords = {
    returns: ['return', 'refund', 'exchange', 'money back'],
    shipping: ['shipping', 'delivery', 'ship', 'carrier', 'arrive', 'track'],
    warranty: ['warranty', 'guarantee', 'repair', 'replace'],
    privacy: ['privacy', 'data', 'information', 'secure', 'security'],
    complaint: [
      'complaint',
      'problem',
      'issue',
      'bad',
      'broken',
      'late',
      'missing',
    ],
    order: ['order', 'status', 'pending', 'processing', 'shipped', 'delivered'],
  };
  let matchedCategory = null;
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => query.includes(kw))) {
      matchedCategory = category;
      break;
    }
  }
  return matchedCategory
    ? knowledgeBase.filter((p) => p.category === matchedCategory)
    : [];
}

// Citation validation
function validateCitations(responseText) {
  const citationRegex = /\[(\w+\.?\d*)\]/g;
  const found = [];
  let match;
  while ((match = citationRegex.exec(responseText)) !== null) {
    found.push(match[1]);
  }
  const validCitations = found.filter((cid) =>
    knowledgeBase.some((doc) => doc.id === cid)
  );
  const invalidCitations = found.filter(
    (cid) => !knowledgeBase.some((doc) => doc.id === cid)
  );
  return {
    isValid: invalidCitations.length === 0,
    validCitations,
    invalidCitations,
  };
}

// Get assistant personality from prompts
function getAssistantResponse(intent, userInput, context = {}) {
  const assistantName = prompts.assistant_identity?.name || 'Alex';
  const assistantRole =
    prompts.assistant_identity?.role || 'Customer Support Specialist';

  // Get intent-specific behavior from prompts
  const intentBehavior = prompts.intent_behaviors?.[intent] || {};
  const examplePhrases = intentBehavior.example_phrases || [];

  // Base responses with personality - use actual phrases from YAML or fallbacks
  const responses = {
    policy_question: {
      greeting: (
        examplePhrases[0] || "I'd be happy to explain our policy for you!"
      ).replace(/\[policy\]/g, 'policy'),
      fallback: "I'm here to help with any policy questions you might have.",
    },
    order_status: {
      greeting: examplePhrases[0] || 'Let me check on your order right away!',
      fallback: "I'd be happy to help you track your order.",
    },
    product_search: {
      greeting:
        examplePhrases[0] || "I'd love to help you find the perfect product!",
      fallback: 'Let me search our catalog for you.',
    },
    complaint: {
      greeting:
        examplePhrases[0] ||
        'I understand how frustrating this must be. Let me help resolve this for you.',
      fallback:
        "I sincerely apologize for this experience. I'm here to make it right.",
    },
    chitchat: {
      greeting: `Hi there! I'm ${assistantName}, your ${assistantRole} at LiveDrops. How can I help you today?`,
      fallback:
        "Thank you! I'm here to help with any questions you might have.",
    },
    off_topic: {
      greeting:
        examplePhrases[0] ||
        "While I'd love to chat about that, I'm here specifically to help with your LiveDrops needs.",
      fallback:
        "I'm focused on helping with LiveDrops-related questions today.",
    },
    violation: {
      greeting:
        examplePhrases[0] ||
        "I'm here to help with LiveDrops-related questions and support.",
      fallback: "Let's keep our conversation focused on how I can assist you.",
    },
  };

  const response = responses[intent] || responses.chitchat;
  return response.greeting || response.fallback;
}

// Main assistant handler
async function handleAssistantQuery(userInput, context = {}) {
  const intent = classifyIntent(userInput);
  let text = '';
  let citations = [];
  let functionsCalled = [];

  try {
    if (intent === 'policy_question') {
      const policies = findRelevantPolicies(userInput);
      if (policies.length > 0) {
        const policyText = policies
          .map((p) => `${p.content} [${p.id}]`)
          .join('\n\n');
        text = `${getAssistantResponse(
          intent,
          userInput,
          context
        )}\n\n${policyText}`;
        citations = policies.map((p) => p.id);
      } else {
        text = `${getAssistantResponse(
          intent,
          userInput,
          context
        )} I don't have specific information about that topic. Please contact our customer support team who can provide more detailed assistance.`;
      }
    } else if (intent === 'order_status') {
      if (context.orderId) {
        try {
          const status = await functionRegistry.execute(
            'getOrderStatus',
            context.orderId
          );
          text = `${getAssistantResponse(
            intent,
            userInput,
            context
          )}\n\nYour order ${context.orderId} is currently ${status.status}.`;
          if (status.carrier && status.carrier !== 'TBD') {
            text += ` It's being shipped via ${status.carrier}.`;
          }
          if (status.estimatedDelivery && status.estimatedDelivery !== 'TBD') {
            text += ` Expected delivery: ${status.estimatedDelivery}.`;
          }
          functionsCalled.push('getOrderStatus');
        } catch (error) {
          text = `${getAssistantResponse(
            intent,
            userInput,
            context
          )} I'm having trouble accessing your order information right now. Please try again in a moment or contact our support team.`;
        }
      } else {
        text = `${getAssistantResponse(
          intent,
          userInput,
          context
        )} To check your order status, please provide your order number.`;
      }
    } else if (intent === 'product_search') {
      const query = context.query || userInput;
      try {
        const results = await functionRegistry.execute(
          'searchProducts',
          query,
          5
        );
        if (results.length > 0) {
          const productList = results
            .map((p) => `• ${p.name} - $${p.price} (${p.category})`)
            .join('\n');
          text = `${getAssistantResponse(
            intent,
            userInput,
            context
          )}\n\nHere are some products that match your search:\n${productList}`;
        } else {
          text = `${getAssistantResponse(
            intent,
            userInput,
            context
          )} I couldn't find any products matching "${query}". Try searching with different keywords or browse our categories.`;
        }
        functionsCalled.push('searchProducts');
      } catch (error) {
        text = `${getAssistantResponse(
          intent,
          userInput,
          context
        )} I'm having trouble searching our catalog right now. Please try again in a moment.`;
      }
    } else if (intent === 'complaint') {
      text = `${getAssistantResponse(
        intent,
        userInput,
        context
      )} Please tell me more about what happened so I can help resolve this issue for you.`;
    } else if (intent === 'chitchat') {
      text = getAssistantResponse(intent, userInput, context);
    } else if (intent === 'off_topic') {
      text = `${getAssistantResponse(
        intent,
        userInput,
        context
      )} What can I help you with regarding your LiveDrops experience?`;
    } else if (intent === 'violation') {
      text = `${getAssistantResponse(
        intent,
        userInput,
        context
      )} What can I help you with regarding your LiveDrops experience?`;
    } else {
      text = `${getAssistantResponse(
        'chitchat',
        userInput,
        context
      )} I'm not sure how to help with that. Can you tell me more about what you're looking for?`;
    }
  } catch (error) {
    console.error('Assistant error:', error);
    text =
      "I'm sorry, I'm having some technical difficulties right now. Please try again in a moment or contact our support team directly.";
  }

  // Validate citations if any
  const citationValidation = validateCitations(text);

  return {
    text,
    intent,
    citations: citationValidation.validCitations,
    invalidCitations: citationValidation.invalidCitations,
    functionsCalled,
  };
}

module.exports = {
  handleAssistantQuery,
  validateCitations,
  findRelevantPolicies,
};
