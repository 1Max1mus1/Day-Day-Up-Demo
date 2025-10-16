import { NextRequest, NextResponse } from 'next/server';
import { analyzeConceptsWithAI, ConceptAnalysisRequest } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const body: ConceptAnalysisRequest = await request.json();
    
    // 验证请求参数
    if (!body.text || !body.userBackground) {
      return NextResponse.json(
        { error: '缺少必要参数：text 和 userBackground' },
        { status: 400 }
      );
    }

    // 调用AI分析
    const result = await analyzeConceptsWithAI(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('概念分析API错误:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '概念分析失败',
        details: '请检查API配置或稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: '概念分析API正常运行' },
    { status: 200 }
  );
}