import { NextRequest, NextResponse } from 'next/server';
import { generateTestWithAI, TestGenerationRequest } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const body: TestGenerationRequest = await request.json();
    
    // 验证请求参数
    if (!body.topic || !body.difficulty || !body.questionCount || !body.questionTypes?.length) {
      return NextResponse.json(
        { error: '缺少必要参数：topic, difficulty, questionCount, questionTypes' },
        { status: 400 }
      );
    }

    // 调用AI生成测试题目
    const result = await generateTestWithAI(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('测试生成API错误:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '测试生成失败',
        details: '请检查API配置或稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: '测试生成API正常运行' },
    { status: 200 }
  );
}