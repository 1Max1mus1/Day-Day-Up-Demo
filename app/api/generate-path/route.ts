import { NextRequest, NextResponse } from 'next/server';
import { generateLearningPathWithAI, LearningPathRequest } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const body: LearningPathRequest = await request.json();
    
    // 验证请求参数
    if (!body.goal || !body.currentLevel || !body.timeframe) {
      return NextResponse.json(
        { error: '缺少必要参数：goal, currentLevel, timeframe' },
        { status: 400 }
      );
    }

    // 调用AI生成学习路径
    const result = await generateLearningPathWithAI(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('学习路径生成API错误:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '学习路径生成失败',
        details: '请检查API配置或稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: '学习路径生成API正常运行' },
    { status: 200 }
  );
}