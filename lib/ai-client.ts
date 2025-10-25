// 统一的AI客户端，支持多种模型

import OpenAI from 'openai';
import { ModelConfig, getModelConfig, DEFAULT_MODEL } from './models';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AIClient {
  private clients: Map<string, any> = new Map();

  // 获取或创建客户端实例
  private getClient(modelConfig: ModelConfig): any {
    const { provider, apiConfig } = modelConfig;
    const clientKey = `${provider}-${apiConfig.baseURL}`;

    if (!this.clients.has(clientKey)) {
      let client;

      switch (provider) {
        case 'DeepSeek':
          client = new OpenAI({
            apiKey: process.env.DEEPSEEK_API_KEY || '',
            baseURL: apiConfig.baseURL,
          });
          break;

        case 'Moonshot AI':
          client = new OpenAI({
            apiKey: process.env.MOONSHOT_API_KEY || '',
            baseURL: apiConfig.baseURL,
          });
          break;

        case 'OpenAI':
          client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || '',
            baseURL: apiConfig.baseURL,
          });
          break;

        case 'Anthropic':
          // 注意：Claude需要特殊处理，这里先用OpenAI兼容格式
          client = {
            chat: {
              completions: {
                create: async (params: any) => {
                  // 这里需要实现Claude API的特殊调用逻辑
                  throw new Error('Claude API integration pending');
                }
              }
            }
          };
          break;

        case 'Google':
          // 注意：Gemini需要特殊处理
          client = {
            chat: {
              completions: {
                create: async (params: any) => {
                  // 这里需要实现Gemini API的特殊调用逻辑
                  throw new Error('Gemini API integration pending');
                }
              }
            }
          };
          break;

        default:
          throw new Error(`不支持的AI提供商: ${provider}`);
      }

      this.clients.set(clientKey, client);
    }

    return this.clients.get(clientKey);
  }

  // 统一的聊天完成接口
  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const modelId = options.model || DEFAULT_MODEL;
    const modelConfig = getModelConfig(modelId);

    if (!modelConfig) {
      throw new Error(`不支持的模型: ${modelId}`);
    }

    const client = this.getClient(modelConfig);
    const { provider, apiConfig } = modelConfig;

    try {
      let response;

      // 根据不同提供商调用相应的API
      switch (provider) {
        case 'DeepSeek':
        case 'Moonshot AI':
        case 'OpenAI':
          response = await client.chat.completions.create({
            model: apiConfig.modelName,
            messages: options.messages,
            temperature: options.temperature || 0.7,
            max_tokens: Math.min(options.maxTokens || 2000, modelConfig.maxTokens),
            stream: options.stream || false,
          });

          return {
            content: response.choices[0]?.message?.content || '',
            model: modelId,
            usage: response.usage ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            } : undefined,
          };

        case 'Anthropic':
          // Claude API调用逻辑
          throw new Error('Claude API集成开发中...');

        case 'Google':
          // Gemini API调用逻辑
          throw new Error('Gemini API集成开发中...');

        default:
          throw new Error(`不支持的AI提供商: ${provider}`);
      }
    } catch (error) {
      console.error(`${provider} API调用失败:`, error);
      throw new Error(`${modelConfig.name} 服务暂时不可用，请稍后重试`);
    }
  }

  // 检查模型是否可用
  async checkModelAvailability(modelId: string): Promise<boolean> {
    try {
      const modelConfig = getModelConfig(modelId);
      if (!modelConfig) return false;

      // 发送一个简单的测试请求
      await this.chatCompletion({
        model: modelId,
        messages: [{ role: 'user', content: 'test' }],
        maxTokens: 10,
      });

      return true;
    } catch (error) {
      console.warn(`模型 ${modelId} 不可用:`, error);
      return false;
    }
  }

  // 获取可用的模型列表
  async getAvailableModels(): Promise<string[]> {
    const availableModels: string[] = [];
    
    // 检查环境变量中配置的API密钥
    const apiKeys = {
      'deepseek-chat': process.env.DEEPSEEK_API_KEY,
      'moonshot-v1-8k': process.env.MOONSHOT_API_KEY,
      'gpt-3.5-turbo': process.env.OPENAI_API_KEY,
      'gpt-4': process.env.OPENAI_API_KEY,
      'claude-3-haiku': process.env.ANTHROPIC_API_KEY,
      'claude-3-sonnet': process.env.ANTHROPIC_API_KEY,
      'gemini-pro': process.env.GOOGLE_API_KEY,
    };

    for (const [modelId, apiKey] of Object.entries(apiKeys)) {
      if (apiKey) {
        availableModels.push(modelId);
      }
    }

    return availableModels;
  }
}

// 导出单例实例
export const aiClient = new AIClient();

// 便捷函数
export async function callAI(
  messages: ChatMessage[],
  model?: string,
  options?: Partial<ChatCompletionOptions>
): Promise<ChatCompletionResponse> {
  return aiClient.chatCompletion({
    messages,
    model,
    ...options,
  });
}