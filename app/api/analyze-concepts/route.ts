import { NextRequest, NextResponse } from 'next/server';
import { analyzeConceptsWithAI, ConceptAnalysisRequest } from '@/lib/deepseek';
import { callAI } from '@/lib/ai-client';
import { DEFAULT_MODEL } from '@/lib/models';
import { cacheManager } from '@/lib/cache';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: ConceptAnalysisRequest & { model?: string } = await request.json();
    const selectedModel = body.model || DEFAULT_MODEL;
    
    logger.info('API', 'Concept analysis request received', {
      textLength: body.text?.length || 0,
      userBackground: body.userBackground,
      model: selectedModel
    });
    
    // 验证请求参数
    if (!body.text || !body.userBackground) {
      logger.warn('API', 'Invalid request parameters for concept analysis', body);
      return NextResponse.json(
        { error: '缺少必要参数：text 和 userBackground' },
        { status: 400 }
      );
    }

    // 检查缓存
    const cachedResult = cacheManager.get('concept-analysis', body);
    if (cachedResult) {
      const duration = Date.now() - startTime;
      logger.cache('hit', 'concept-analysis');
      logger.apiCall('/api/analyze-concepts', 'POST', duration, true, { cached: true });
      
      // 记录历史（来自缓存）
      cacheManager.addHistory('concept-analysis', body, cachedResult, duration, true);
      
      return NextResponse.json(cachedResult);
    }

    logger.cache('miss', 'concept-analysis');

    // 调用AI分析
    const aiStartTime = Date.now();
    const result = await analyzeConceptsWithAI(body, selectedModel);
    const aiDuration = Date.now() - aiStartTime;
    
    // 缓存结果
    cacheManager.set('concept-analysis', body, result);
    logger.cache('set', 'concept-analysis');
    
    // 记录AI调用日志
    logger.aiCall(
      'concept-analysis',
      JSON.stringify(body).length,
      JSON.stringify(result).length,
      aiDuration
    );
    
    const totalDuration = Date.now() - startTime;
    logger.apiCall('/api/analyze-concepts', 'POST', totalDuration, true);
    
    // 记录历史（AI调用）
    cacheManager.addHistory('concept-analysis', body, result, totalDuration, false);
    
    return NextResponse.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('API', 'Concept analysis failed', error);
    logger.apiCall('/api/analyze-concepts', 'POST', duration, false, { error: error instanceof Error ? error.message : 'Unknown error' });
    
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