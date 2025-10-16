'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Zap,
  FileText,
  Code,
  MessageSquare
} from 'lucide-react'
import TestInterface from '@/components/TestInterface'

// 定义AI返回的测试结果接口
interface TestGenerationResult {
  questions: Array<{
    id: string
    type: 'multiple_choice' | 'coding' | 'explanation'
    question: string
    options?: string[]
    correctAnswer: string | number
    explanation: string
    difficulty: 'basic' | 'intermediate' | 'advanced'
  }>
  totalPoints: number
  timeLimit: number
}

// 转换为TestInterface组件需要的格式
interface TestQuestion {
  id: string
  type: 'multiple-choice' | 'coding' | 'explanation'
  question: string
  options?: string[]
  correctAnswer: any
  explanation: string
  concept: string
  difficulty: string
}

export default function TestGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple_choice'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [aiResult, setAiResult] = useState<TestGenerationResult | null>(null)
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [showTest, setShowTest] = useState(false)

  // 检查URL参数并自动填充
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlTopic = urlParams.get('topic')
    const urlDescription = urlParams.get('description')
    const urlDifficulty = urlParams.get('difficulty')
    
    if (urlTopic) {
      setTopic(urlDescription ? `${urlTopic}: ${urlDescription}` : urlTopic)
    }
    if (urlDifficulty) {
      setDifficulty(urlDifficulty)
    }
  }, [])

  const handleGenerateTest = async () => {
    if (!topic.trim() || !difficulty || questionTypes.length === 0) {
      setError('请填写所有必要信息')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          questionCount,
          questionTypes
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '生成测试失败')
      }

      const result: TestGenerationResult = await response.json()
      setAiResult(result)
      
      // 转换为TestInterface需要的格式
      const convertedQuestions: TestQuestion[] = result.questions.map(q => ({
        ...q,
        type: q.type === 'multiple_choice' ? 'multiple-choice' : q.type as any,
        concept: topic,
        difficulty: q.difficulty === 'basic' ? '基础' : 
                   q.difficulty === 'intermediate' ? '中等' : '高级'
      }))
      
      setTestQuestions(convertedQuestions)
      
    } catch (error) {
      console.error('测试生成错误:', error)
      setError(error instanceof Error ? error.message : '生成测试失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setQuestionTypes(prev => [...prev, type])
    } else {
      setQuestionTypes(prev => prev.filter(t => t !== type))
    }
  }

  const handleTestComplete = (score: number, results: any[]) => {
    console.log('测试完成:', { score, results })
    // 可以在这里处理测试结果，比如保存到数据库或显示详细分析
  }

  const startTest = () => {
    setShowTest(true)
  }

  const backToGenerator = () => {
    setShowTest(false)
    setAiResult(null)
    setTestQuestions([])
  }

  if (showTest && testQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-notion-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-notion-border">
            <button
              onClick={backToGenerator}
              className="flex items-center space-x-2 text-notion-text-secondary hover:text-notion-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回生成器</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-notion-text">{topic} - 测试</h1>
              <p className="text-sm text-notion-text-secondary">
                {testQuestions.length}题 · {aiResult?.timeLimit}分钟
              </p>
            </div>
            <div></div>
          </div>
          
          <TestInterface 
            questions={testQuestions}
            timeLimit={aiResult?.timeLimit || 30}
            onComplete={handleTestComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notion-bg">
      {/* Header */}
      <header className="border-b border-notion-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-notion-accent rounded-notion flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-notion-text">智能测试生成器</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!aiResult ? (
          /* Test Generation Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="notion-card p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-notion-accent-light rounded-notion flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-notion-accent" />
              </div>
              <h2 className="text-2xl font-bold text-notion-text mb-2">AI智能测试生成</h2>
              <p className="text-notion-text-secondary">
                输入主题和要求，AI将为你生成个性化的测试题目
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  测试主题 *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：动态规划、React Hooks、机器学习基础"
                  className="notion-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  难度级别 *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="notion-input"
                >
                  <option value="">选择难度级别</option>
                  <option value="basic">基础级别</option>
                  <option value="intermediate">中等级别</option>
                  <option value="advanced">高级级别</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  题目数量
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="notion-input"
                >
                  <option value={3}>3题（快速测试）</option>
                  <option value={5}>5题（标准测试）</option>
                  <option value={8}>8题（深度测试）</option>
                  <option value={10}>10题（全面测试）</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-notion-text mb-3">
                  题目类型 *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes('multiple_choice')}
                      onChange={(e) => handleQuestionTypeChange('multiple_choice', e.target.checked)}
                      className="notion-checkbox"
                    />
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-notion-accent" />
                      <span className="text-notion-text">选择题</span>
                    </div>
                    <span className="text-sm text-notion-text-secondary">快速检验概念理解</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes('coding')}
                      onChange={(e) => handleQuestionTypeChange('coding', e.target.checked)}
                      className="notion-checkbox"
                    />
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-notion-accent" />
                      <span className="text-notion-text">编程题</span>
                    </div>
                    <span className="text-sm text-notion-text-secondary">实际编码能力测试</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes('explanation')}
                      onChange={(e) => handleQuestionTypeChange('explanation', e.target.checked)}
                      className="notion-checkbox"
                    />
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-notion-accent" />
                      <span className="text-notion-text">解释题</span>
                    </div>
                    <span className="text-sm text-notion-text-secondary">深度理解和表达能力</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-notion text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateTest}
                disabled={!topic.trim() || !difficulty || questionTypes.length === 0 || isGenerating}
                className="notion-button-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-4 h-4" />
                    </motion.div>
                    <span>AI正在生成测试题目...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>生成测试</span>
                  </>
                )}
              </button>

              {/* Quick Start Options */}
              <div className="pt-4 border-t border-notion-border">
                <p className="text-sm text-notion-text-secondary mb-3">快速开始：</p>
                <div className="flex flex-wrap gap-2">
                  {['动态规划', 'React Hooks', '数据结构', '算法分析'].map(quickTopic => (
                    <button
                      key={quickTopic}
                      onClick={() => setTopic(quickTopic)}
                      className="px-3 py-1 text-sm bg-notion-bg-hover border border-notion-border rounded-full hover:border-notion-accent transition-colors"
                    >
                      {quickTopic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Test Preview */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="notion-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-notion-text">测试预览</h3>
                <div className="flex items-center space-x-4 text-sm text-notion-text-secondary">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{aiResult.questions.length}题</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{aiResult.timeLimit}分钟</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{aiResult.totalPoints}分</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {aiResult.questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-notion-bg-hover rounded-notion-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-notion-text">第{index + 1}题</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        question.difficulty === 'basic' ? 'bg-green-100 text-green-600' :
                        question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {question.difficulty === 'basic' ? '基础' : 
                         question.difficulty === 'intermediate' ? '中等' : '高级'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-notion-accent-light text-notion-accent rounded-full">
                        {question.type === 'multiple_choice' ? '选择题' :
                         question.type === 'coding' ? '编程题' : '解释题'}
                      </span>
                    </div>
                    <p className="text-sm text-notion-text line-clamp-2">{question.question}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={backToGenerator}
                  className="notion-button flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>重新生成</span>
                </button>
                <button
                  onClick={startTest}
                  className="notion-button-primary flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>开始测试</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}