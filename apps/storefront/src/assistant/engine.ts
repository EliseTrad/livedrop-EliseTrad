import groundTruthData from './ground-truth.json'
import { getOrderStatus } from '@/lib/api'

interface GroundTruthEntry {
  id: string
  question: string
  answer: string
  keywords: string[]
}

interface AssistantResponse {
  answer: string
  source: string
  confidence: number
}

const ORDER_ID_REGEX = /[A-Z0-9]{10,}/g

export class SupportEngine {
  private groundTruth: GroundTruthEntry[]

  constructor() {
    this.groundTruth = groundTruthData
  }

  async processQuery(query: string): Promise<AssistantResponse> {
    const normalizedQuery = query.toLowerCase().trim()
    
    // Check for order ID in query
    const orderIds = query.match(ORDER_ID_REGEX)
    if (orderIds && orderIds.length > 0) {
      return this.handleOrderQuery(orderIds[0], normalizedQuery)
    }

    // Find best matching ground truth entry
    return this.findBestMatch(normalizedQuery)
  }

  private async handleOrderQuery(orderId: string, _query: string): Promise<AssistantResponse> {
    try {
      const orderInfo = await getOrderStatus(orderId)
      
      if (!orderInfo) {
        return {
          answer: `I couldn't find an order with ID ...${orderId.slice(-4)}. Please check the order ID and try again, or contact our support team for assistance.`,
          source: 'Order System',
          confidence: 0.9
        }
      }

      const maskedOrderId = `...${orderId.slice(-4)}`
      let response = `Order ${maskedOrderId} status: ${orderInfo.status}`
      
      if (orderInfo.status === 'Shipped' && orderInfo.carrier) {
        response += ` via ${orderInfo.carrier}`
        if (orderInfo.estimatedDelivery) {
          const deliveryDate = new Date(orderInfo.estimatedDelivery).toLocaleDateString()
          response += `. Estimated delivery: ${deliveryDate}`
        }
      }
      
      response += `. Order placed on ${new Date(orderInfo.createdAt).toLocaleDateString()}.`

      return {
        answer: response,
        source: 'Order System',
        confidence: 0.95
      }
    } catch (error) {
      return {
        answer: 'I encountered an error checking your order status. Please try again or contact our support team.',
        source: 'Error',
        confidence: 0.1
      }
    }
  }

  private findBestMatch(query: string): AssistantResponse {
    const scores = this.groundTruth.map(entry => ({
      entry,
      score: this.calculateSimilarity(query, entry)
    }))

    scores.sort((a, b) => b.score - a.score)
    const bestMatch = scores[0]

    // Confidence threshold
    if (bestMatch.score < 0.3) {
      return {
        answer: "I don't have specific information about that topic. Please contact our customer support team who can provide more detailed assistance.",
        source: 'N/A',
        confidence: 0.1
      }
    }

    return {
      answer: bestMatch.entry.answer,
      source: bestMatch.entry.id,
      confidence: bestMatch.score
    }
  }

  private calculateSimilarity(query: string, entry: GroundTruthEntry): number {
    const queryWords = this.tokenize(query)
    const entryKeywords = entry.keywords.map(k => k.toLowerCase())
    const questionWords = this.tokenize(entry.question.toLowerCase())
    
    // Combine keywords and question words for matching
    const allEntryWords = [...entryKeywords, ...questionWords]
    
    let matches = 0
    let totalQueryWords = queryWords.length
    
    for (const word of queryWords) {
      for (const entryWord of allEntryWords) {
        if (word.includes(entryWord) || entryWord.includes(word)) {
          matches++
          break
        }
      }
    }
    
    return totalQueryWords > 0 ? matches / totalQueryWords : 0
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Remove short words
  }
}

// Singleton instance
export const supportEngine = new SupportEngine()