'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Target, 
  CheckCircle, 
  Clock, 
  Play,
  BookOpen,
  Code,
  Brain,
  Zap,
  ArrowRight,
  Trophy,
  Star,
  Timer,
  Lock,
  Lightbulb,
  FileText,
  PenTool,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import ModelSelector from '@/components/ui/ModelSelector'
import { DEFAULT_MODEL } from '@/lib/models'

interface LearningNode {
  id: string
  title: string
  description: string
  type: 'concept' | 'practice' | 'test'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  prerequisites: string[]
  materials: {
    type: 'video' | 'article' | 'code' | 'exercise'
    title: string
    source: string
    duration?: string
  }[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalNodes: number
  completedNodes: number
  estimatedDuration: string
  nodes: LearningNode[]
}

interface LearningPathResult {
  title: string;
  description: string;
  estimatedDuration: string;
  phases: Array<{
    title: string;
    description: string;
    duration: string;
    topics: Array<{
      name: string;
      description: string;
      difficulty: 'basic' | 'intermediate' | 'advanced';
      estimatedTime: string;
      resources: Array<{
        type: 'video' | 'article' | 'practice' | 'project';
        title: string;
        description: string;
      }>;
    }>;
  }>;
  milestones: Array<{
    title: string;
    description: string;
    criteria: string[];
  }>;
}

// 模拟学习路径数据
const mockLearningPath: LearningPath = {
  id: 'dynamic-programming',
  title: '动态规划系统学习',
  description: '从基础概念到高级应用的完整学习路径',
  totalNodes: 8,
  completedNodes: 0,
  estimatedDuration: '3-4周',
  nodes: [
    {
      id: 'dp-intro',
      title: '动态规划基础概念',
      description: '理解动态规划的核心思想和基本原理',
      type: 'concept',
      difficulty: 'beginner',
      estimatedTime: '2小时',
      status: 'available',
      prerequisites: [],
      materials: [
        { type: 'video', title: '动态规划入门讲解', source: 'YouTube', duration: '45分钟' },
        { type: 'article', title: '什么是动态规划？', source: 'LeetCode', duration: '15分钟' }
      ]
    },
    {
      id: 'recursion-review',
      title: '递归基础回顾',
      description: '巩固递归概念，为动态规划打基础',
      type: 'concept',
      difficulty: 'beginner',
      estimatedTime: '1.5小时',
      status: 'locked',
      prerequisites: ['dp-intro'],
      materials: [
        { type: 'video', title: '递归思维训练', source: 'Bilibili', duration: '30分钟' },
        { type: 'code', title: '递归经典例题', source: 'GitHub', duration: '60分钟' }
      ]
    },
    {
      id: 'memoization',
      title: '记忆化搜索',
      description: '从递归到动态规划的桥梁',
      type: 'concept',
      difficulty: 'intermediate',
      estimatedTime: '3小时',
      status: 'locked',
      prerequisites: ['dp-intro', 'recursion-review'],
      materials: [
        { type: 'video', title: '记忆化搜索详解', source: 'YouTube', duration: '60分钟' },
        { type: 'code', title: '斐波那契数列优化', source: 'LeetCode', duration: '30分钟' },
        { type: 'exercise', title: '记忆化练习题', source: 'LeetCode', duration: '90分钟' }
      ]
    },
    {
      id: 'dp-patterns',
      title: '经典DP模式',
      description: '掌握线性DP、区间DP等常见模式',
      type: 'practice',
      difficulty: 'intermediate',
      estimatedTime: '4小时',
      status: 'available',
      prerequisites: ['memoization'],
      materials: [
        { type: 'article', title: 'DP模式总结', source: '代码随想录', duration: '45分钟' },
        { type: 'code', title: '最长递增子序列', source: 'LeetCode', duration: '60分钟' },
        { type: 'exercise', title: 'DP模式练习', source: 'LeetCode', duration: '150分钟' }
      ]
    },
    {
      id: 'dp-optimization',
      title: 'DP优化技巧',
      description: '空间优化、滚动数组等高级技巧',
      type: 'concept',
      difficulty: 'advanced',
      estimatedTime: '3小时',
      status: 'locked',
      prerequisites: ['dp-patterns'],
      materials: [
        { type: 'video', title: 'DP空间优化', source: 'YouTube', duration: '40分钟' },
        { type: 'code', title: '滚动数组实现', source: 'GitHub', duration: '45分钟' }
      ]
    },
    {
      id: 'tree-dp',
      title: '树形DP',
      description: '在树结构上的动态规划应用',
      type: 'practice',
      difficulty: 'advanced',
      estimatedTime: '4小时',
      status: 'locked',
      prerequisites: ['dp-optimization'],
      materials: [
        { type: 'video', title: '树形DP入门', source: 'Bilibili', duration: '50分钟' },
        { type: 'exercise', title: '树形DP练习', source: 'LeetCode', duration: '180分钟' }
      ]
    },
    {
      id: 'dp-test-1',
      title: '阶段性测试',
      description: '检验前面学习的掌握程度',
      type: 'test',
      difficulty: 'intermediate',
      estimatedTime: '1小时',
      status: 'locked',
      prerequisites: ['dp-patterns'],
      materials: [
        { type: 'exercise', title: '综合测试题', source: '系统生成', duration: '60分钟' }
      ]
    },
    {
      id: 'advanced-dp',
      title: '高级DP应用',
      description: '状态压缩DP、概率DP等高级主题',
      type: 'practice',
      difficulty: 'advanced',
      estimatedTime: '5小时',
      status: 'locked',
      prerequisites: ['tree-dp', 'dp-test-1'],
      materials: [
        { type: 'video', title: '状态压缩DP', source: 'YouTube', duration: '60分钟' },
        { type: 'code', title: '旅行商问题', source: 'GitHub', duration: '90分钟' },
        { type: 'exercise', title: '高级DP练习', source: 'LeetCode', duration: '150分钟' }
      ]
    }
  ]
}

export default function LearningPathPage() {
  const [goal, setGoal] = useState('')
  const [currentLevel, setCurrentLevel] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [aiResult, setAiResult] = useState<LearningPathResult | null>(null)
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null)
  const [showTest, setShowTest] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLearningModal, setShowLearningModal] = useState(false)
  const [currentLearningNode, setCurrentLearningNode] = useState<LearningNode | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)

  // 保存学习路径状态到localStorage
  const saveLearningPathState = (path: LearningPath) => {
    try {
      localStorage.setItem(`learning-path-${path.id}`, JSON.stringify(path))
    } catch (error) {
      console.error('保存学习路径状态失败:', error)
    }
  }

  // 从localStorage加载学习路径状态
  const loadLearningPathState = (pathId: string): LearningPath | null => {
    try {
      const saved = localStorage.getItem(`learning-path-${pathId}`)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('加载学习路径状态失败:', error)
      return null
    }
  }

  // 在组件加载时恢复学习路径状态
  useEffect(() => {
    // 尝试从localStorage恢复状态
    const savedPath = loadLearningPathState('dynamic-programming')
    if (savedPath) {
      setLearningPath(savedPath)
    } else {
      // 如果没有保存的状态，使用默认的模拟数据
      setLearningPath(mockLearningPath)
    }
  }, [])

  // 检查节点是否可以解锁（前置条件是否满足）
  const canUnlockNode = (node: LearningNode, allNodes: LearningNode[]): boolean => {
    if (node.prerequisites.length === 0) return true
    
    return node.prerequisites.every(prereqId => {
      const prereqNode = allNodes.find(n => n.id === prereqId)
      return prereqNode && prereqNode.status === 'completed'
    })
  }

  // 更新所有节点的解锁状态
  const updateNodeAvailability = (nodes: LearningNode[]): LearningNode[] => {
    return nodes.map(node => {
      if (node.status === 'completed' || node.status === 'in-progress') {
        return node // 已完成或进行中的节点保持状态
      }
      
      if (canUnlockNode(node, nodes)) {
        return { ...node, status: 'available' as const }
      } else {
        return { ...node, status: 'locked' as const }
      }
    })
  }



  // 初始化学习路径
  useEffect(() => {
    // 尝试从localStorage恢复状态
    const savedPath = loadLearningPathState()
    
    if (savedPath) {
      // 如果有保存的状态，使用保存的状态并更新节点可用性
      const updatedPath = {
        ...savedPath,
        nodes: updateNodeAvailability(savedPath.nodes)
      }
      setLearningPath(updatedPath)
    } else {
      // 如果没有保存的状态，使用模拟数据
      const updatedMockPath = {
        ...mockLearningPath,
        nodes: updateNodeAvailability(mockLearningPath.nodes)
      }
      setLearningPath(updatedMockPath)
    }
  }, [])

  const handleGeneratePath = async () => {
    if (!goal.trim() || !currentLevel.trim() || !timeframe.trim()) {
      setError('请填写所有必需字段')
      return
    }

    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal.trim(),
          currentLevel: currentLevel.trim(),
          timeframe: timeframe.trim(),
          model: selectedModel
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '生成学习路径失败')
      }

      const result: LearningPathResult = await response.json()
      setAiResult(result)
      
      // 转换AI结果为内部格式
      const convertedPath = convertAIResultToLearningPath(result)
      
      // 如果AI结果为空或转换失败，使用模拟数据
      if (!convertedPath || convertedPath.nodes.length === 0) {
        const updatedMockPath = {
          ...mockLearningPath,
          nodes: updateNodeAvailability(mockLearningPath.nodes)
        }
        setLearningPath(updatedMockPath)
      } else {
        // 应用正确的节点可用性状态
        const updatedPath = {
          ...convertedPath,
          nodes: updateNodeAvailability(convertedPath.nodes)
        }
        setLearningPath(updatedPath)
        
        // 保存到localStorage
        saveLearningPathState(updatedPath)
      }
      
    } catch (error) {
      console.error('生成学习路径失败:', error)
      setError(error instanceof Error ? error.message : '生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  // 转换AI结果为内部数据格式
  const convertAIResultToLearningPath = (result: LearningPathResult): LearningPath => {
    const nodes: LearningNode[] = []
    let nodeIndex = 0

    // 安全访问phases数组
    const phases = result.phases || []
    phases.forEach((phase, phaseIndex) => {
      // 安全访问topics数组
      const topics = phase.topics || []
      topics.forEach((topic, topicIndex) => {
        const nodeId = `node-${phaseIndex}-${topicIndex}`
        const isFirst = phaseIndex === 0 && topicIndex === 0
        
        // 简化前置条件逻辑：每个节点依赖前一个节点（线性依赖）
        let prerequisites: string[] = []
        if (nodeIndex > 0) {
          // 找到前一个节点的ID
          let prevNodeId = ''
          let tempIndex = 0
          phases.forEach((p, pIdx) => {
            p.topics?.forEach((t, tIdx) => {
              if (tempIndex === nodeIndex - 1) {
                prevNodeId = `node-${pIdx}-${tIdx}`
              }
              tempIndex++
            })
          })
          if (prevNodeId) {
            prerequisites = [prevNodeId]
          }
        }
        
        // 安全访问resources数组
        const resources = topic.resources || []
        
        nodes.push({
          id: nodeId,
          title: topic.name || '未命名主题',
          description: topic.description || '暂无描述',
          type: resources.some(r => r.type === 'practice') ? 'practice' : 'concept',
          difficulty: topic.difficulty === 'basic' ? 'beginner' : topic.difficulty === 'intermediate' ? 'intermediate' : 'advanced',
          estimatedTime: topic.estimatedTime || '未知',
          status: isFirst ? 'available' : 'locked',
          prerequisites,
          materials: resources.map(resource => ({
            type: resource.type as any,
            title: resource.title || '未命名资源',
            source: resource.description || '暂无描述',
            duration: topic.estimatedTime || '未知'
          }))
        })
        nodeIndex++
      })
    })

    return {
      id: 'ai-generated-path',
      title: result.title,
      description: result.description,
      totalNodes: nodes.length,
      completedNodes: 0,
      estimatedDuration: result.estimatedDuration,
      nodes
    }
  }

  const handleNodeClick = (node: LearningNode) => {
    if (node.status === 'locked') return
    setSelectedNode(node)
    if (node.type === 'test') {
      setShowTest(true)
    }
  }

  const handleStartLearning = (node: LearningNode) => {
    if (node.status === 'locked' || node.status === 'completed') return
    
    // 更新节点状态为进行中
    if (learningPath) {
      const updatedNodes = learningPath.nodes.map(n => 
        n.id === node.id ? { ...n, status: 'in-progress' as const } : n
      )
      
      const updatedPath = {
        ...learningPath,
        nodes: updatedNodes
      }
      
      setLearningPath(updatedPath)
      
      // 同时更新selectedNode状态
      const updatedNode = updatedNodes.find(n => n.id === node.id)
      if (updatedNode) {
        setSelectedNode(updatedNode)
      }
      
      // 保存状态到localStorage
      saveLearningPathState(updatedPath)
    }
    
    // 显示学习建议模态框
    setCurrentLearningNode(node)
    setShowLearningModal(true)
  }

  const handleCompleteNode = (node: LearningNode) => {
    if (!learningPath) return
    
    // 更新当前节点为已完成
    let updatedNodes = learningPath.nodes.map(n => {
      if (n.id === node.id) {
        return { ...n, status: 'completed' as const }
      }
      return n
    })
    
    // 重新计算所有节点的可用性
    updatedNodes = updateNodeAvailability(updatedNodes)
    
    // 更新完成节点数
    const completedCount = updatedNodes.filter(n => n.status === 'completed').length
    
    const updatedPath = {
      ...learningPath,
      nodes: updatedNodes,
      completedNodes: completedCount
    }
    
    setLearningPath(updatedPath)
    
    // 保存状态到localStorage
    saveLearningPathState(updatedPath)
    
    // 显示完成祝贺
    setShowCompletionModal(true)
    setCurrentLearningNode(node)
  }

  const navigateToLearningTool = (node: LearningNode) => {
    // 先更新节点状态为进行中
    if (learningPath && node.status !== 'in-progress') {
      const updatedNodes = learningPath.nodes.map(n => 
        n.id === node.id ? { ...n, status: 'in-progress' as const } : n
      )
      
      const updatedPath = {
        ...learningPath,
        nodes: updatedNodes
      }
      
      setLearningPath(updatedPath)
      
      // 同时更新selectedNode状态
      const updatedNode = updatedNodes.find(n => n.id === node.id)
      if (updatedNode) {
        setSelectedNode(updatedNode)
      }
      
      saveLearningPathState(updatedPath)
    }
    
    // 根据节点类型跳转到不同页面
    switch (node.type) {
      case 'concept':
        window.location.href = `/concept-analysis?topic=${encodeURIComponent(node.title)}&description=${encodeURIComponent(node.description)}`
        break
      case 'practice':
        // 这里可以扩展为专门的练习页面
        window.open(`https://leetcode.com/tag/${encodeURIComponent(node.title.toLowerCase())}`, '_blank')
        break
      case 'test':
        window.location.href = `/test-generator?topic=${encodeURIComponent(node.title)}&difficulty=${node.difficulty}`
        break
    }
    setShowLearningModal(false)
  }

  const getNodeIcon = (node: LearningNode) => {
    switch (node.type) {
      case 'concept': return <BookOpen className="w-4 h-4" />
      case 'practice': return <Code className="w-4 h-4" />
      case 'test': return <Zap className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: LearningNode['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-notion-success" />
      case 'in-progress': return <Clock className="w-5 h-5 text-notion-accent" />
      case 'available': return <Play className="w-5 h-5 text-notion-text-secondary" />
      case 'locked': return <div className="w-5 h-5 border-2 border-notion-border rounded-full opacity-50" />
    }
  }

  const getDifficultyColor = (difficulty: LearningNode['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50'
      case 'intermediate': return 'text-yellow-600 bg-yellow-50'
      case 'advanced': return 'text-red-600 bg-red-50'
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
                <div className="text-2xl">🎯</div>
                <div>
                  <h1 className="text-lg font-semibold text-notion-text">学习路径生成</h1>
                  <p className="text-sm text-notion-text-secondary">个性化路径规划 · 智能进度跟踪</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                supportedFeatures={['learning-path']}
              />
              <span className="px-3 py-1 bg-notion-accent-light text-notion-accent text-sm rounded-full">
                路径生成器
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!learningPath ? (
          /* Input Section */
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-notion-text mb-4">
                告诉我你想学什么
              </h2>
              <p className="text-notion-text-secondary">
                AI会根据你的基础和目标，生成个性化的学习路径
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="notion-card p-8 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  学习目标
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="例如：我想系统学习动态规划"
                  className="notion-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  现有基础
                </label>
                <textarea
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  placeholder="例如：有一定递归基础，刷过50道LeetCode简单题"
                  rows={3}
                  className="notion-input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-notion-text mb-2">
                  期望时间
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="notion-input"
                >
                  <option value="">选择学习时间框架</option>
                  <option value="1-2周">1-2周（快速入门）</option>
                  <option value="1个月">1个月（系统学习）</option>
                  <option value="2-3个月">2-3个月（深度掌握）</option>
                  <option value="半年以上">半年以上（专业级别）</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-notion text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGeneratePath}
                disabled={!goal.trim() || !currentLevel.trim() || !timeframe || isGenerating}
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
                    <span>AI正在生成学习路径...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>生成学习路径</span>
                  </>
                )}
              </button>

              {/* Quick Start Options */}
              <div className="pt-4 border-t border-notion-border">
                <p className="text-sm text-notion-text-secondary mb-3">快速开始：</p>
                <div className="flex flex-wrap gap-2">
                  {['动态规划', '图算法', '系统设计', '机器学习基础'].map(topic => (
                    <button
                      key={topic}
                      onClick={() => setGoal(`我想系统学习${topic}`)}
                      className="px-3 py-1 text-sm bg-notion-bg-hover border border-notion-border rounded-full hover:border-notion-accent transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Learning Path Display */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Path Overview */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="notion-card p-6 sticky top-8"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-6 h-6 text-notion-accent" />
                  <h2 className="font-semibold text-notion-text">{learningPath.title}</h2>
                </div>
                
                <p className="text-sm text-notion-text-secondary mb-6">
                  {learningPath.description}
                </p>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-notion-text">学习进度</span>
                    <span className="text-notion-text-secondary">
                      {learningPath.completedNodes}/{learningPath.totalNodes}
                    </span>
                  </div>
                  <div className="w-full bg-notion-border rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(learningPath.completedNodes / learningPath.totalNodes) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-notion-accent h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-notion-bg-hover rounded-notion-sm">
                    <div className="text-lg font-semibold text-notion-text">{learningPath.estimatedDuration}</div>
                    <div className="text-xs text-notion-text-secondary">预计时长</div>
                  </div>
                  <div className="text-center p-3 bg-notion-bg-hover rounded-notion-sm">
                    <div className="text-lg font-semibold text-notion-text">{learningPath.totalNodes}</div>
                    <div className="text-xs text-notion-text-secondary">学习节点</div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-notion-text">图例</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-3 h-3 text-notion-text-secondary" />
                      <span className="text-notion-text-secondary">概念学习</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-3 h-3 text-notion-text-secondary" />
                      <span className="text-notion-text-secondary">实践练习</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-notion-text-secondary" />
                      <span className="text-notion-text-secondary">测试检验</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Middle Panel - Learning Path */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {learningPath.nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleNodeClick(node)}
                    className={`notion-card p-4 cursor-pointer transition-all ${
                      node.status === 'locked' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-notion-hover'
                    } ${
                      selectedNode?.id === node.id ? 'ring-2 ring-notion-accent' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(node.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getNodeIcon(node)}
                          <h3 className="font-medium text-notion-text text-sm">{node.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(node.difficulty)}`}>
                            {node.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-xs text-notion-text-secondary mb-3 leading-relaxed">
                          {node.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-notion-text-light">
                            <Timer className="w-3 h-3" />
                            <span>{node.estimatedTime}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {node.materials.map((material, idx) => (
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full bg-notion-text-light"
                                title={material.title}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Panel - Node Details */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="notion-card p-6 sticky top-8"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      {getNodeIcon(selectedNode)}
                      <h3 className="font-semibold text-notion-text">{selectedNode.title}</h3>
                    </div>
                    
                    <p className="text-sm text-notion-text-secondary mb-6">
                      {selectedNode.description}
                    </p>

                    {/* Materials */}
                    <div className="mb-6">
                      <h4 className="font-medium text-notion-text mb-3">学习材料</h4>
                      <div className="space-y-2">
                        {selectedNode.materials.map((material, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-notion-bg-hover rounded-notion-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-notion-accent rounded-full" />
                              <span className="text-sm text-notion-text">{material.title}</span>
                            </div>
                            {material.duration && (
                              <span className="text-xs text-notion-text-light">{material.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleStartLearning(selectedNode)}
                      className={`w-full flex items-center justify-center space-x-2 ${
                        selectedNode.status === 'available' || selectedNode.status === 'in-progress'
                          ? 'notion-button-primary'
                          : 'notion-button opacity-50 cursor-not-allowed'
                      }`}
                      disabled={selectedNode.status === 'locked' || selectedNode.status === 'completed'}
                    >
                      {selectedNode.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>已完成</span>
                        </>
                      ) : selectedNode.status === 'in-progress' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>继续学习</span>
                        </>
                      ) : selectedNode.status === 'available' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>开始学习</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 border border-current rounded-full opacity-50" />
                          <span>未解锁</span>
                        </>
                      )}
                    </button>

                    {/* Mark as Complete Button */}
                    {selectedNode.status === 'in-progress' && (
                      <button
                        onClick={() => handleCompleteNode(selectedNode)}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-notion font-medium transition-colors bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 mt-2"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>标记完成</span>
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="notion-card p-6 text-center"
                  >
                    <Target className="w-12 h-12 text-notion-text-light mx-auto mb-4" />
                    <h3 className="font-medium text-notion-text mb-2">选择学习节点</h3>
                    <p className="text-sm text-notion-text-secondary">
                      点击左侧的学习节点查看详细内容和学习材料
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Learning Guidance Modal */}
      <AnimatePresence>
        {showLearningModal && currentLearningNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLearningModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="notion-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  {getNodeIcon(currentLearningNode)}
                  <div>
                    <h2 className="text-xl font-semibold text-notion-text">{currentLearningNode.title}</h2>
                    <p className="text-sm text-notion-text-secondary">学习指导与建议</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 学习目标 */}
                  <div>
                    <h3 className="font-medium text-notion-text mb-3 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-notion-accent" />
                      <span>学习目标</span>
                    </h3>
                    <p className="text-sm text-notion-text-secondary bg-notion-bg-hover p-3 rounded-notion">
                      {currentLearningNode.description}
                    </p>
                  </div>

                  {/* 推荐学习路径 */}
                  <div>
                    <h3 className="font-medium text-notion-text mb-3 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-notion-accent" />
                      <span>推荐学习步骤</span>
                    </h3>
                    <div className="space-y-2">
                      {currentLearningNode.type === 'concept' && (
                        <>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">理论学习</p>
                              <p className="text-xs text-notion-text-secondary">先通过概念分析工具深入理解核心概念</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">查看学习材料</p>
                              <p className="text-xs text-notion-text-secondary">阅读推荐的文章和视频，加深理解</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">实践应用</p>
                              <p className="text-xs text-notion-text-secondary">通过简单例子验证理解程度</p>
                            </div>
                          </div>
                        </>
                      )}
                      {currentLearningNode.type === 'practice' && (
                        <>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">复习理论</p>
                              <p className="text-xs text-notion-text-secondary">回顾相关概念，确保理论基础扎实</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">从简单开始</p>
                              <p className="text-xs text-notion-text-secondary">先做基础题目，逐步提升难度</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">总结规律</p>
                              <p className="text-xs text-notion-text-secondary">记录解题思路和常见模式</p>
                            </div>
                          </div>
                        </>
                      )}
                      {currentLearningNode.type === 'test' && (
                        <>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">知识回顾</p>
                              <p className="text-xs text-notion-text-secondary">快速回顾本阶段学习的重点内容</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">模拟测试</p>
                              <p className="text-xs text-notion-text-secondary">通过AI生成的测试题检验学习效果</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-notion-bg-hover rounded-notion">
                            <div className="w-6 h-6 bg-notion-accent text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                            <div>
                              <p className="text-sm font-medium text-notion-text">查漏补缺</p>
                              <p className="text-xs text-notion-text-secondary">根据测试结果针对性复习薄弱环节</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 学习材料 */}
                  <div>
                    <h3 className="font-medium text-notion-text mb-3 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-notion-accent" />
                      <span>推荐学习材料</span>
                    </h3>
                    <div className="space-y-2">
                      {currentLearningNode.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-notion-bg-hover rounded-notion">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-notion-accent rounded-full" />
                            <div>
                              <p className="text-sm font-medium text-notion-text">{material.title}</p>
                              <p className="text-xs text-notion-text-secondary">{material.source}</p>
                            </div>
                          </div>
                          {material.duration && (
                            <span className="text-xs text-notion-text-light bg-notion-bg px-2 py-1 rounded">
                              {material.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 预计时间 */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-notion">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">预计学习时间</span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{currentLearningNode.estimatedTime}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6 pt-6 border-t border-notion-border">
                  <button
                    onClick={() => setShowLearningModal(false)}
                    className="flex-1 notion-button"
                  >
                    稍后学习
                  </button>
                  <button
                    onClick={() => navigateToLearningTool(currentLearningNode)}
                    className="flex-1 notion-button-primary flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>开始学习</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration Modal */}
      <AnimatePresence>
        {showCompletionModal && currentLearningNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompletionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="notion-card max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trophy className="w-8 h-8 text-green-600" />
                </motion.div>
                
                <h2 className="text-xl font-semibold text-notion-text mb-2">🎉 恭喜完成！</h2>
                <p className="text-notion-text-secondary mb-4">
                  你已经成功完成了「{currentLearningNode.title}」的学习
                </p>
                
                {learningPath && (
                  <div className="bg-notion-bg-hover p-3 rounded-notion mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-notion-text-secondary">学习进度</span>
                      <span className="font-medium text-notion-text">
                        {learningPath.completedNodes}/{learningPath.totalNodes}
                      </span>
                    </div>
                    <div className="w-full bg-notion-bg rounded-full h-2 mt-2">
                      <div 
                        className="bg-notion-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(learningPath.completedNodes / learningPath.totalNodes) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {learningPath && learningPath.completedNodes < learningPath.totalNodes && (
                    <button
                      onClick={() => {
                        setShowCompletionModal(false)
                        // 自动选择下一个可用节点
                        const nextNode = learningPath.nodes.find(n => n.status === 'available')
                        if (nextNode) {
                          setSelectedNode(nextNode)
                        }
                      }}
                      className="w-full notion-button-primary flex items-center justify-center space-x-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>继续下一个</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className="w-full notion-button"
                  >
                    返回路径
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}