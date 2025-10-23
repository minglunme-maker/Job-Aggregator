import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface JobCategorizationResult {
  category: string;
  confidence: number;
}

// Pre-defined categories (matching database schema)
export const JOB_CATEGORIES = [
  'Software Development',
  'Data Science & Analytics',
  'Design & UX',
  'Marketing & Sales',
  'Finance & Accounting',
  'Human Resources',
  'Operations & Logistics',
  'Customer Service',
  'Healthcare',
  'Education & Training',
  'Engineering (Non-Software)',
  'Legal & Compliance',
  'Administration',
  'Hospitality & Tourism',
  'Other'
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];

/**
 * AI-based job categorization using OpenAI
 */
export class JobCategorizer {
  private openai: OpenAI;

  constructor() {
    this.openai = openai;
  }

  /**
   * Categorize a job based on title and description using AI
   */
  async categorizeJob(jobTitle: string, jobDescription?: string): Promise<JobCategorizationResult> {
    try {
      const prompt = this.buildCategorizationPrompt(jobTitle, jobDescription);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a job categorization expert. You must categorize jobs into one of these categories: ${JOB_CATEGORIES.join(', ')}. Always return a valid JSON object with "category" and "confidence" fields.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const result = JSON.parse(content);

      // Validate the category
      if (!JOB_CATEGORIES.includes(result.category)) {
        return { category: 'Other', confidence: 0.5 };
      }

      return {
        category: result.category,
        confidence: result.confidence || 0.8
      };
    } catch (error: any) {
      console.error('Error categorizing job:', error.message);
      // Fallback to simple keyword matching
      return this.fallbackCategorization(jobTitle, jobDescription);
    }
  }

  /**
   * Batch categorize multiple jobs
   */
  async batchCategorize(jobs: Array<{ jobTitle: string; jobDescription?: string }>): Promise<JobCategorizationResult[]> {
    const results: JobCategorizationResult[] = [];

    for (const job of jobs) {
      const result = await this.categorizeJob(job.jobTitle, job.jobDescription);
      results.push(result);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Build the categorization prompt
   */
  private buildCategorizationPrompt(jobTitle: string, jobDescription?: string): string {
    let prompt = `Categorize this job into one of the predefined categories.\n\nJob Title: ${jobTitle}`;

    if (jobDescription) {
      // Truncate description to avoid token limits
      const truncatedDesc = jobDescription.substring(0, 500);
      prompt += `\n\nJob Description: ${truncatedDesc}`;
    }

    prompt += `\n\nCategories: ${JOB_CATEGORIES.join(', ')}\n\nReturn your response as a JSON object with two fields:\n- "category": the most appropriate category from the list above\n- "confidence": a number between 0 and 1 indicating your confidence level\n\nExample: {"category": "Software Development", "confidence": 0.95}`;

    return prompt;
  }

  /**
   * Fallback categorization using keyword matching
   */
  private fallbackCategorization(jobTitle: string, jobDescription?: string): JobCategorizationResult {
    const text = `${jobTitle} ${jobDescription || ''}`.toLowerCase();

    const categoryKeywords: Record<string, string[]> = {
      'Software Development': ['software', 'developer', 'engineer', 'programmer', 'coding', 'full stack', 'backend', 'frontend', 'react', 'python', 'java'],
      'Data Science & Analytics': ['data', 'analyst', 'scientist', 'analytics', 'machine learning', 'ai', 'ml', 'data engineer'],
      'Design & UX': ['designer', 'ux', 'ui', 'graphic', 'product design', 'visual', 'figma'],
      'Marketing & Sales': ['marketing', 'sales', 'business development', 'account manager', 'digital marketing', 'seo', 'social media'],
      'Finance & Accounting': ['finance', 'accounting', 'accountant', 'financial', 'audit', 'tax', 'cpa'],
      'Human Resources': ['hr', 'human resources', 'recruiter', 'talent', 'people operations', 'recruitment'],
      'Operations & Logistics': ['operations', 'logistics', 'supply chain', 'warehouse', 'coordinator', 'procurement'],
      'Customer Service': ['customer service', 'support', 'customer success', 'helpdesk', 'client relations'],
      'Healthcare': ['healthcare', 'medical', 'nurse', 'doctor', 'clinical', 'health', 'physician'],
      'Education & Training': ['education', 'teacher', 'trainer', 'tutor', 'instructor', 'professor'],
      'Engineering (Non-Software)': ['mechanical', 'electrical', 'civil', 'chemical engineer', 'manufacturing', 'structural'],
      'Legal & Compliance': ['legal', 'lawyer', 'compliance', 'attorney', 'counsel', 'paralegal'],
      'Administration': ['admin', 'administrative', 'office', 'secretary', 'assistant', 'receptionist'],
      'Hospitality & Tourism': ['hospitality', 'hotel', 'restaurant', 'tourism', 'chef', 'culinary'],
    };

    let bestMatch = 'Other';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = category;
      }
    }

    return {
      category: bestMatch,
      confidence: maxMatches > 0 ? Math.min(0.7, maxMatches * 0.2) : 0.3
    };
  }
}

export const jobCategorizer = new JobCategorizer();
