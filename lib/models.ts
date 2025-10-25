// AI模型配置和管理

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  supportedFeatures: string[];
  pricing?: {
    input: number;  // 每1K tokens价格
    output: number; // 每1K tokens价格
  };
  apiConfig: {
    baseURL: string;
    modelName: string;
    headers?: Record<string, string>;
  };
}

export const SUPPORTED_MODELS: ModelConfig[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: '高性能的中文对话模型，擅长代码和逻辑推理',
    maxTokens: 4096,
    supportedFeatures: ['chat', 'code', 'analysis'],
    pricing: {
      input: 0.14,
      output: 0.28
    },
    apiConfig: {
      baseURL: 'https://api.deepseek.com',
      modelName: 'deepseek-chat'
    }
  },
  {
    id: 'moonshot-v1-8k',
    name: 'Kimi Chat',
    provider: 'Moonshot AI',
    description: 'Kimi智能助手，支持长文本理解和生成',
    maxTokens: 8192,
    supportedFeatures: ['chat', 'long-context', 'analysis'],
    pricing: {
      input: 1.0,
      output: 2.0
    },
    apiConfig: {
      baseURL: 'https://api.moonshot.cn/v1',
      modelName: 'moonshot-v1-8k'
    }
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: '快速响应的Claude模型，适合日常对话',
    maxTokens: 4096,
    supportedFeatures: ['chat', 'analysis', 'creative'],
    pricing: {
      input: 0.25,
      output: 1.25
    },
    apiConfig: {
      baseURL: 'https://api.anthropic.com',
      modelName: 'claude-3-haiku-20240307',
      headers: {
        'anthropic-version': '2023-06-01'
      }
    }
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: '平衡性能和成本的Claude模型',
    maxTokens: 4096,
    supportedFeatures: ['chat', 'analysis', 'creative', 'code'],
    pricing: {
      input: 3.0,
      output: 15.0
    },
    apiConfig: {
      baseURL: 'https://api.anthropic.com',
      modelName: 'claude-3-sonnet-20240229',
      headers: {
        'anthropic-version': '2023-06-01'
      }
    }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: '经典的GPT模型，性价比高',
    maxTokens: 4096,
    supportedFeatures: ['chat', 'analysis', 'code'],
    pricing: {
      input: 0.5,
      output: 1.5
    },
    apiConfig: {
      baseURL: 'https://api.openai.com/v1',
      modelName: 'gpt-3.5-turbo'
    }
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: '最强大的GPT模型，适合复杂任务',
    maxTokens: 8192,
    supportedFeatures: ['chat', 'analysis', 'code', 'creative'],
    pricing: {
      input: 30.0,
      output: 60.0
    },
    apiConfig: {
      baseURL: 'https://api.openai.com/v1',
      modelName: 'gpt-4'
    }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google的多模态AI模型',
    maxTokens: 4096,
    supportedFeatures: ['chat', 'analysis', 'multimodal'],
    pricing: {
      input: 0.5,
      output: 1.5
    },
    apiConfig: {
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      modelName: 'gemini-pro'
    }
  }
];

// 获取模型配置
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return SUPPORTED_MODELS.find(model => model.id === modelId);
}

// 获取支持特定功能的模型
export function getModelsByFeature(feature: string): ModelConfig[] {
  return SUPPORTED_MODELS.filter(model => 
    model.supportedFeatures.includes(feature)
  );
}

// 获取按提供商分组的模型
export function getModelsByProvider(): Record<string, ModelConfig[]> {
  return SUPPORTED_MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelConfig[]>);
}

// 默认模型
export const DEFAULT_MODEL = 'deepseek-chat';

// 模型选择偏好存储键
export const MODEL_PREFERENCE_KEY = 'preferred_ai_model';