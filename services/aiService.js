const https = require('https');

// AI Service for documentation improvement
class AIService {
  constructor() {
    this.enabled = process.env.AI_ENABLED === 'true';
    this.endpoint = process.env.AI_ENDPOINT;
    this.model = process.env.AI_MODEL || 'gemma-4-26b';
    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 20000;
  }

  async improveContent(htmlContent) {
    if (!this.enabled) {
      throw new Error('AI service is not enabled');
    }

    // Strip HTML to get plain text
    const plainText = this.stripHtml(htmlContent);

    const prompt = `You are a technical documentation expert. Improve the following documentation content by:
1. Fixing grammar and spelling errors
2. Improving clarity and readability
3. Making the language more professional yet accessible
4. Ensuring proper technical terminology
5. Adding structure if needed (headings, lists, etc.)

IMPORTANT: Return ONLY the improved HTML content, no explanations or meta-commentary.

Original content:
${plainText}

Improved HTML content:`;

    try {
      const response = await this.callAPI(prompt);
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to improve content with AI: ' + error.message);
    }
  }

  async summarizeContent(htmlContent) {
    if (!this.enabled) {
      throw new Error('AI service is not enabled');
    }

    const plainText = this.stripHtml(htmlContent);

    const prompt = `Summarize the following documentation in 2-3 concise sentences:

${plainText}

Summary:`;

    try {
      const response = await this.callAPI(prompt);
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to summarize content: ' + error.message);
    }
  }

  async callAPI(prompt) {
    const url = new URL(this.endpoint);

    const postData = JSON.stringify({
      model: this.model,
      max_tokens: this.maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false // For self-signed certificates
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonResponse = JSON.parse(data);

            if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message) {
              resolve(jsonResponse.choices[0].message.content);
            } else {
              reject(new Error('Invalid response format from AI API'));
            }
          } catch (error) {
            reject(new Error('Failed to parse AI API response: ' + error.message));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  stripHtml(html) {
    // Basic HTML stripping for sending to AI
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = new AIService();
