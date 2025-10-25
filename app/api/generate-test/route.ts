import { NextRequest, NextResponse } from 'next/server';
import { generateTestWithAI, TestGenerationRequest } from '@/lib/deepseek';
import { DEFAULT_MODEL } from '@/lib/models';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: TestGenerationRequest & { model?: string } = await request.json();
    const selectedModel = body.model || DEFAULT_MODEL;
    
    logger.info('API', 'Test generation request received', {
      topic: body.topic,
      difficulty: body.difficulty,
      questionCount: body.questionCount,
      questionTypes: body.questionTypes,
      model: selectedModel
    });
    
    // 验证请求参数
    if (!body.topic || !body.difficulty || !body.questionCount || !body.questionTypes?.length) {
      logger.warn('API', 'Invalid request parameters for test generation', body);
      return NextResponse.json(
        { error: '缺少必要参数：topic, difficulty, questionCount, questionTypes' },
        { status: 400 }
      );
    }

    // 检查缓存
    const cachedResult = cacheManager.get('test-generation', body);
    if (cachedResult) {
      const duration = Date.now() - startTime;
      logger.cache('hit', 'test-generation');
      logger.apiCall('/api/generate-test', 'POST', duration, true, { cached: true });
      
      // 记录历史（来自缓存）
      cacheManager.addHistory('test-generation', body, cachedResult, duration, true);
      
      return NextResponse.json(cachedResult);
    }

    logger.cache('miss', 'test-generation');

    // 调用AI生成测试题目
    const aiStartTime = Date.now();
    const result = await generateTestWithAI(body, selectedModel);
    const aiDuration = Date.now() - aiStartTime;
    
    // 缓存结果
    cacheManager.set('test-generation', body, result);
    logger.cache('set', 'test-generation');
    
    // 记录AI调用日志
    logger.aiCall(
      'test-generation',
      JSON.stringify(body).length,
      JSON.stringify(result).length,
      aiDuration
    );
    
    const totalDuration = Date.now() - startTime;
    logger.apiCall('/api/generate-test', 'POST', totalDuration, true);
    
    // 记录历史（AI调用）
    cacheManager.addHistory('test-generation', body, result, totalDuration, false);
    
    return NextResponse.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('API', 'Test generation failed', error);
    logger.apiCall('/api/generate-test', 'POST', duration, false, { error: error instanceof Error ? error.message : 'Unknown error' });
    
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