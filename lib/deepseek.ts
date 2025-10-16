import OpenAI from 'openai';

// DeepSeek API 客户端配置
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

export interface ConceptAnalysisRequest {
  text: string;
  userBackground: string;
}

export interface ConceptAnalysisResponse {
  concepts: Array<{
    name: string;
    definition: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    prerequisites: string[];
    explanation: string;
  }>;
  dependencies: Array<{
    from: string;
    to: string;
    relationship: string;
  }>;
  summary: string;
}

export interface LearningPathRequest {
  goal: string;
  currentLevel: string;
  timeframe: string;
  preferences?: string[];
}

export interface LearningPathResponse {
  path: Array<{
    id: string;
    title: string;
    description: string;
    type: 'concept' | 'practice' | 'test';
    estimatedTime: string;
    resources: Array<{
      type: 'article' | 'video' | 'exercise';
      title: string;
      url?: string;
      description: string;
    }>;
  }>;
  totalTime: string;
  difficulty: string;
}

export interface TestGenerationRequest {
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questionCount: number;
  questionTypes: Array<'multiple_choice' | 'coding' | 'explanation'>;
}

export interface TestQuestion {
  id: string;
  type: 'multiple_choice' | 'coding' | 'explanation';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface TestGenerationResponse {
  questions: TestQuestion[];
  totalPoints: number;
  timeLimit: number;
}

// 概念分析功能
export async function analyzeConceptsWithAI(request: ConceptAnalysisRequest): Promise<ConceptAnalysisResponse> {
  const prompt = `
作为一个专业的教育AI助手，请分析以下文本中的核心概念。

用户背景：${request.userBackground}
待分析文本：${request.text}

请按照以下JSON格式返回分析结果：
{
  "concepts": [
    {
      "name": "概念名称",
      "definition": "概念定义",
      "difficulty": "basic|intermediate|advanced",
      "prerequisites": ["前置知识1", "前置知识2"],
      "explanation": "针对用户背景的详细解释"
    }
  ],
  "dependencies": [
    {
      "from": "概念A",
      "to": "概念B", 
      "relationship": "依赖关系描述"
    }
  ],
  "summary": "整体概念总结"
}

要求：
1. 识别3-5个核心概念
2. 根据用户背景调整解释深度
3. 建立概念间的依赖关系
4. 提供清晰的学习建议
`;

  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的教育AI助手，擅长概念分析和知识拆解。请始终返回有效的JSON格式。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应为空');
    }

    // 尝试解析JSON响应
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应为JSON格式');
    }
  } catch (error) {
    console.error('概念分析失败:', error);
    throw new Error('概念分析服务暂时不可用，请稍后重试');
  }
}

// 学习路径生成功能
export async function generateLearningPathWithAI(request: LearningPathRequest): Promise<any> {
  const prompt = `
作为一个专业的学习规划师，请为用户生成个性化学习路径。

学习目标：${request.goal}
当前水平：${request.currentLevel}
时间框架：${request.timeframe}
学习偏好：${request.preferences?.join(', ') || '无特殊偏好'}

请按照以下JSON格式返回学习路径：
{
  "title": "学习路径标题",
  "description": "学习路径描述",
  "estimatedDuration": "总预估时间",
  "phases": [
    {
      "title": "阶段标题",
      "description": "阶段描述",
      "duration": "阶段时长",
      "topics": [
        {
          "name": "主题名称",
          "description": "主题描述",
          "difficulty": "basic|intermediate|advanced",
          "estimatedTime": "预估时间",
          "resources": [
            {
              "type": "video|article|practice|project",
              "title": "资源标题",
              "description": "资源描述"
            }
          ]
        }
      ]
    }
  ],
  "milestones": [
    {
      "title": "里程碑标题",
      "description": "里程碑描述",
      "criteria": ["标准1", "标准2"]
    }
  ]
}

要求：
1. 生成2-3个学习阶段
2. 每个阶段包含3-5个学习主题
3. 包含概念学习、实践练习、项目实战
4. 根据用户偏好推荐合适的学习资源
5. 时间安排要合理可行
6. 设置合理的里程碑检查点
`;

  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的学习规划师，擅长制定个性化学习计划。请始终返回有效的JSON格式。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应为空');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应为JSON格式');
    }
  } catch (error) {
    console.error('学习路径生成失败:', error);
    throw new Error('学习路径生成服务暂时不可用，请稍后重试');
  }
}

// 测试题目生成功能
export async function generateTestWithAI(request: TestGenerationRequest): Promise<TestGenerationResponse> {
  const prompt = `
作为一个专业的测试题目生成专家，请为指定主题生成测试题目。

主题：${request.topic}
难度：${request.difficulty}
题目数量：${request.questionCount}
题目类型：${request.questionTypes.join(', ')}

请按照以下JSON格式返回测试题目：
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice|coding|explanation",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": "正确答案或选项索引",
      "explanation": "答案解释",
      "difficulty": "basic|intermediate|advanced"
    }
  ],
  "totalPoints": 100,
  "timeLimit": 30
}

要求：
1. 题目要有层次性和区分度
2. 选择题提供4个选项
3. 编程题给出清晰的要求
4. 解释题要求深度思考
5. 每题都要有详细的答案解释
`;

  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的测试题目生成专家，擅长创建高质量的评估题目。请始终返回有效的JSON格式。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应为空');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应为JSON格式');
    }
  } catch (error) {
    console.error('测试生成失败:', error);
    throw new Error('测试生成服务暂时不可用，请稍后重试');
  }
}

export default deepseek;