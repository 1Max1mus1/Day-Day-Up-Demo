'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  Clock, 
  Target,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Zap,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import ModelSelector from '@/components/ui/ModelSelector'
import { DEFAULT_MODEL } from '@/lib/models'

interface ConceptNode {
  id: string
  name: string
  level: number
  understood: boolean
  description: string
  prerequisites: string[]
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  result?: string
  error?: string
}

interface ConceptAnalysisResult {
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

export default function ConceptAnalysisPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedContent, setUploadedContent] = useState('')
  const [userBackground, setUserBackground] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)

  // 检查URL参数并自动填充内容
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const topic = urlParams.get('topic')
    const description = urlParams.get('description')
    
    if (topic && description) {
      const autoContent = `学习主题：${topic}\n\n描述：${description}\n\n请帮我深入理解这个概念，包括其核心思想、应用场景和相关的前置知识。`
      setUploadedContent(autoContent)
      // 自动开始分析
      setTimeout(() => {
        analyzeWithAI(autoContent)
      }, 1000)
    }
  }, [])
  const [analysisResult, setAnalysisResult] = useState<ConceptAnalysisResult | null>(null)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    {
      id: 'upload',
      title: '上传文献内容',
      description: '提供需要理解的论文或概念',
      status: 'pending'
    },
    {
      id: 'analyze',
      title: '概念依赖分析',
      description: 'AI分析前置概念和知识依赖',
      status: 'pending'
    },
    {
      id: 'breakdown',
      title: '概念拆解',
      description: '将复杂概念拆解为可理解的层次',
      status: 'pending'
    },
    {
      id: 'explain',
      title: '个性化讲解',
      description: '基于学长大人风格的详细解释',
      status: 'pending'
    }
  ])

  const [conceptTree, setConceptTree] = useState<ConceptNode[]>([])
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null)
  const [explanation, setExplanation] = useState('')

  // 示例内容
  const sampleContent = `
深度学习中的注意力机制（Attention Mechanism）是一种让模型能够动态地关注输入序列中不同部分的技术。
在Transformer架构中，自注意力（Self-Attention）通过计算查询（Query）、键（Key）和值（Value）之间的相似度来实现。
具体来说，注意力权重通过softmax(QK^T/√d_k)V计算得出，其中d_k是键向量的维度。
这种机制解决了传统RNN在处理长序列时的梯度消失问题，并且允许并行计算。
`

  // 更新步骤状态
  const updateStepStatus = (stepId: string, status: AnalysisStep['status'], result?: string, error?: string) => {
    setAnalysisSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, result, error }
        : step
    ))
  }

  // 调用AI分析概念
  const analyzeWithAI = async (content: string) => {
    setIsAnalyzing(true)
    
    try {
      // 步骤1: 开始分析
      updateStepStatus('analyze', 'processing')
      
      const response = await fetch('/api/analyze-concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          userBackground: userBackground || '通用学习者，需要理解概念',
          model: selectedModel
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '分析失败')
      }

      const result: ConceptAnalysisResult = await response.json()
      setAnalysisResult(result)
      
      // 步骤2: 完成分析
      updateStepStatus('analyze', 'completed', '概念依赖关系已识别')
      updateStepStatus('breakdown', 'processing')
      
      // 转换为概念树格式
      const conceptNodes: ConceptNode[] = result.concepts.map((concept, index) => ({
        id: concept.name.toLowerCase().replace(/\s+/g, '-'),
        name: concept.name,
        level: concept.difficulty === 'basic' ? 1 : concept.difficulty === 'intermediate' ? 2 : 3,
        understood: concept.difficulty === 'basic',
        description: concept.definition,
        prerequisites: concept.prerequisites
      }))
      
      setConceptTree(conceptNodes)
      
      // 步骤3: 完成拆解
      updateStepStatus('breakdown', 'completed', `已识别${result.concepts.length}个核心概念`)
      updateStepStatus('explain', 'processing')
      
      // 步骤4: 生成解释
      setTimeout(() => {
        updateStepStatus('explain', 'completed', '个性化解释已生成')
        setCurrentStep(4)
      }, 1000)
      
    } catch (error) {
      console.error('分析失败:', error)
      updateStepStatus('analyze', 'error', undefined, error instanceof Error ? error.message : '分析失败')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 处理内容上传
  const handleContentUpload = () => {
    if (!uploadedContent.trim()) {
      alert('请输入要分析的内容')
      return
    }
    
    if (!userBackground.trim()) {
      alert('请输入您的学习背景，以便提供个性化分析')
      return
    }
    
    updateStepStatus('upload', 'completed', '内容已上传')
    setCurrentStep(1)
    
    // 开始AI分析
    analyzeWithAI(uploadedContent)
  }

  // 使用示例内容
  const useSampleContent = () => {
    setUploadedContent(sampleContent)
  }

  // 选择概念
  const selectConcept = (concept: ConceptNode) => {
    setSelectedConcept(concept)
    if (analysisResult) {
      const conceptData = analysisResult.concepts.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === concept.id
      )
      if (conceptData) {
        setExplanation(conceptData.explanation)
      }
    }
  }

  // 开始巩固测试
  const startConsolidationTest = () => {
    if (selectedConcept) {
      // 跳转到测试生成页面，传递概念信息
      const params = new URLSearchParams({
        topic: selectedConcept.name,
        description: selectedConcept.description,
        difficulty: 'intermediate' // 默认中等难度
      })
      window.location.href = `/test-generator?${params.toString()}`
    }
  }



  return (
    <div className="min-h-screen bg-notion-bg">
      {/* Header */}
      <header className="border-b border-notion-border bg-notion-bg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="notion-button flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>返回</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h1 className="text-lg font-semibold text-notion-text">概念分析</h1>
                  <p className="text-sm text-notion-text-secondary">智能拆解复杂概念 · 构建知识体系</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                supportedFeatures={['concept-analysis']}
              />
              <span className="px-3 py-1 bg-notion-success-light text-notion-success text-sm rounded-full">
                概念拆解引擎
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Process Steps */}
          <div className="lg:col-span-1">
            <div className="notion-card p-6 sticky top-8">
              <h2 className="font-semibold text-notion-text mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-notion-accent" />
                分析流程
              </h2>
              
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-3 p-3 rounded-notion-sm transition-all ${
                      currentStep === index ? 'bg-notion-accent-light' : 'hover:bg-notion-bg-hover'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                       {step.status === 'completed' ? (
                         <CheckCircle className="w-5 h-5 text-notion-success" />
                       ) : step.status === 'processing' ? (
                         <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                         >
                           <Clock className="w-5 h-5 text-notion-accent" />
                         </motion.div>
                       ) : step.status === 'error' ? (
                         <AlertCircle className="w-5 h-5 text-red-500" />
                       ) : (
                         <div className="w-5 h-5 border-2 border-notion-border rounded-full" />
                       )}
                     </div>
                     <div className="flex-1">
                       <h3 className="font-medium text-notion-text text-sm">{step.title}</h3>
                       <p className="text-xs text-notion-text-secondary mt-1">{step.description}</p>
                       {step.status === 'error' && step.error && (
                         <p className="text-xs text-red-500 mt-1">错误: {step.error}</p>
                       )}
                       {step.status === 'completed' && step.result && (
                         <p className="text-xs text-notion-success mt-1">{step.result}</p>
                       )}
                     </div>
                  </motion.div>
                ))}
              </div>

              {/* Upload Section */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="border-2 border-dashed border-notion-border rounded-notion p-6 text-center">
                    <Upload className="w-8 h-8 text-notion-text-light mx-auto mb-3" />
                    <p className="text-sm text-notion-text-secondary mb-4">
                      上传论文或输入复杂概念
                    </p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={userBackground}
                        onChange={(e) => setUserBackground(e.target.value)}
                        placeholder="请输入您的学习背景（如：计算机专业本科生、生物医学硕士研一等）"
                        className="w-full p-3 border border-notion-border rounded-notion text-sm focus:outline-none focus:border-notion-accent"
                      />
                      <textarea
                        value={uploadedContent}
                        onChange={(e) => setUploadedContent(e.target.value)}
                        placeholder="输入要分析的文献内容或复杂概念..."
                        className="w-full h-32 p-3 border border-notion-border rounded-notion text-sm resize-none focus:outline-none focus:border-notion-accent"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleContentUpload}
                          disabled={isAnalyzing || !uploadedContent.trim() || !userBackground.trim()}
                          className="notion-button-primary flex-1 disabled:opacity-50"
                        >
                          {isAnalyzing ? '分析中...' : '开始分析'}
                        </button>
                        <button
                          onClick={useSampleContent}
                          className="notion-button"
                        >
                          示例
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Middle Panel - Content Display */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {uploadedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="notion-card p-6 mb-6"
                >
                  <h3 className="font-semibold text-notion-text mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    原始内容
                  </h3>
                  <div className="text-sm text-notion-text-secondary leading-relaxed whitespace-pre-line">
                    {uploadedContent}
                  </div>
                </motion.div>
              )}

              {conceptTree.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="notion-card p-6"
                >
                  <h3 className="font-semibold text-notion-text mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    概念依赖图
                  </h3>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(level => {
                      const levelConcepts = conceptTree.filter(c => c.level === level)
                      if (levelConcepts.length === 0) return null
                      
                      return (
                        <div key={level} className="space-y-2">
                          <div className="text-xs text-notion-text-light font-medium">
                            Level {level}
                          </div>
                          <div className="space-y-2">
                            {levelConcepts.map(concept => (
                              <motion.button
                                key={concept.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectConcept(concept)}
                                className={`w-full p-3 rounded-notion-sm border text-left transition-all ${
                                  concept.understood
                                    ? 'bg-notion-success-light border-notion-success/30 text-notion-success'
                                    : selectedConcept?.id === concept.id
                                    ? 'bg-notion-accent-light border-notion-accent text-notion-accent'
                                    : 'bg-notion-bg-hover border-notion-border text-notion-text hover:border-notion-accent/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{concept.name}</span>
                                  {concept.understood ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <ArrowRight className="w-4 h-4" />
                                  )}
                                </div>
                                <p className="text-xs opacity-75 mt-1">{concept.description}</p>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Explanation */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {selectedConcept && explanation && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="notion-card p-6 sticky top-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-notion-text flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-notion-accent" />
                      学长大人讲解
                    </h3>
                    <span className="px-2 py-1 bg-notion-accent-light text-notion-accent text-xs rounded-full">
                      AI生成
                    </span>
                  </div>
                  
                  <div className="learning-content text-sm">
                    <div dangerouslySetInnerHTML={{ 
                      __html: explanation.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>')
                    }} />
                  </div>

                  <div className="mt-6 pt-4 border-t border-notion-border">
                    <button 
                      onClick={startConsolidationTest}
                      className="notion-button-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>开始巩固测试</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedConcept && conceptTree.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="notion-card p-6 text-center"
              >
                <BookOpen className="w-12 h-12 text-notion-text-light mx-auto mb-4" />
                <h3 className="font-medium text-notion-text mb-2">选择概念开始学习</h3>
                <p className="text-sm text-notion-text-secondary">
                  点击左侧的概念节点，获取学长大人风格的详细讲解
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}