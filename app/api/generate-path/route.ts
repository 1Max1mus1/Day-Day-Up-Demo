import { NextRequest, NextResponse } from 'next/server';
import { generateLearningPathWithAI, LearningPathRequest } from '@/lib/deepseek';
import { DEFAULT_MODEL } from '@/lib/models';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: LearningPathRequest & { model?: string } = await request.json();
    const selectedModel = body.model || DEFAULT_MODEL;
    
    logger.info('API', 'Learning path generation request received', {
      goal: body.goal,
      currentLevel: body.currentLevel,
      timeframe: body.timeframe,
      model: selectedModel
    });
    
    // 验证请求参数
    if (!body.goal || !body.currentLevel || !body.timeframe) {
      logger.warn('API', 'Invalid request parameters for learning path generation', body);
      return NextResponse.json(
        { error: '缺少必要参数：goal, currentLevel, timeframe' },
        { status: 400 }
      );
    }

    // 检查缓存
    const cachedResult = cacheManager.get('learning-path', body);
    if (cachedResult) {
      const duration = Date.now() - startTime;
      logger.cache('hit', 'learning-path');
      logger.apiCall('/api/generate-path', 'POST', duration, true, { cached: true });
      
      // 记录历史（来自缓存）
      cacheManager.addHistory('learning-path', body, cachedResult, duration, true);
      
      return NextResponse.json(cachedResult);
    }

    logger.cache('miss', 'learning-path');

    // 调用AI生成学习路径
    const aiStartTime = Date.now();
    const result = await generateLearningPathWithAI(body, selectedModel);
    const aiDuration = Date.now() - aiStartTime;
    
    // 缓存结果
    cacheManager.set('learning-path', body, result);
    logger.cache('set', 'learning-path');
    
    // 记录AI调用日志
    logger.aiCall(
      'learning-path',
      JSON.stringify(body).length,
      JSON.stringify(result).length,
      aiDuration
    );
    
    const totalDuration = Date.now() - startTime;
    logger.apiCall('/api/generate-path', 'POST', totalDuration, true);
    
    // 记录历史（AI调用）
    cacheManager.addHistory('learning-path', body, result, totalDuration, false);
    
    return NextResponse.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('API', 'Learning path generation failed', error);
    logger.apiCall('/api/generate-path', 'POST', duration, false, { error: error instanceof Error ? error.message : 'Unknown error' });
    
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