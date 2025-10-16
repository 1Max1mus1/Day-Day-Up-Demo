'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  Brain,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Trophy
} from 'lucide-react'

interface Question {
  id: string
  type: 'multiple-choice' | 'coding' | 'explanation'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  concept: string
}

interface TestInterfaceProps {
  questions: Question[]
  onComplete: (score: number, results: any[]) => void
  timeLimit?: number
}

export default function TestInterface({ questions, onComplete, timeLimit = 30 }: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  // 将分钟转换为秒
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const currentQuestion = questions[currentQuestionIndex]

  // 计时器
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    
    // 计算结果
    const testResults = questions.map(question => {
      const userAnswer = answers[question.id]
      let isCorrect = false
      let displayUserAnswer = userAnswer
      let displayCorrectAnswer = question.correctAnswer
      
      if (question.type === 'multiple-choice') {
        // 用户答案是数字索引 (0, 1, 2, 3)
        // AI返回的正确答案可能是：数字、字符串数字、ABCD字母、或选项内容
        let correctIndex: number = -1
        
        if (typeof question.correctAnswer === 'number') {
          // 正确答案是数字索引
          correctIndex = question.correctAnswer
        } else if (typeof question.correctAnswer === 'string') {
          // 正确答案是字符串，需要解析
          const trimmed = question.correctAnswer.trim()
          
          // 尝试解析为数字
          const numericAnswer = parseInt(trimmed)
          if (!isNaN(numericAnswer)) {
            correctIndex = numericAnswer
          } 
          // 尝试解析为ABCD字母
          else if (trimmed.length === 1 && /[A-Da-d]/.test(trimmed)) {
            correctIndex = trimmed.toUpperCase().charCodeAt(0) - 65
          }
          // 尝试在选项中查找匹配的内容
          else if (question.options) {
            correctIndex = question.options.findIndex(option => 
              option.trim().toLowerCase() === trimmed.toLowerCase()
            )
          }
        }
        
        // 判断答案是否正确
        isCorrect = userAnswer === correctIndex && correctIndex >= 0
        
        // 显示格式转换
        displayUserAnswer = userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : '未作答'
        displayCorrectAnswer = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : String(question.correctAnswer)
      } else {
        // 其他类型题目直接比较
        isCorrect = userAnswer === question.correctAnswer
        displayUserAnswer = userAnswer || '未作答'
      }
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer: displayUserAnswer,
        correctAnswer: displayCorrectAnswer,
        isCorrect,
        explanation: question.explanation,
        concept: question.concept,
        difficulty: question.difficulty
      }
    })

    const score = Math.round((testResults.filter(r => r.isCorrect).length / questions.length) * 100)
    
    setResults(testResults)
    setShowResults(true)
    onComplete(score, testResults)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (showResults) {
    const correctCount = results.filter(r => r.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        {/* Results Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 mx-auto mb-4 bg-notion-accent-light rounded-full flex items-center justify-center"
          >
            <Trophy className="w-10 h-10 text-notion-accent" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-notion-text mb-2">测试完成！</h2>
          <div className="text-3xl font-bold text-notion-accent mb-2">{score}分</div>
          <p className="text-notion-text-secondary">
            答对 {correctCount} / {questions.length} 题
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.questionId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="notion-card p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-notion-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-notion-error" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-notion-text">
                      第 {index + 1} 题
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(result.difficulty)}`}>
                      {result.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-notion-bg-hover text-notion-text-secondary rounded-full">
                      {result.concept}
                    </span>
                  </div>
                  
                  <p className="text-notion-text mb-3">{result.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-notion-text-secondary">你的答案：</span>
                      <p className={`text-sm ${result.isCorrect ? 'text-notion-success' : 'text-notion-error'}`}>
                        {result.userAnswer || '未作答'}
                      </p>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <span className="text-sm font-medium text-notion-text-secondary">正确答案：</span>
                        <p className="text-sm text-notion-success">{result.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-notion-bg-hover rounded-notion-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-notion-accent" />
                      <span className="text-sm font-medium text-notion-text">解析</span>
                    </div>
                    <p className="text-sm text-notion-text-secondary">{result.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => window.location.reload()}
            className="notion-button flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新测试</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="notion-button-primary flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>继续学习</span>
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Test Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-notion-text">巩固测试</h2>
          <p className="text-notion-text-secondary">
            第 {currentQuestionIndex + 1} / {questions.length} 题
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-notion-text-secondary">
            <Clock className="w-4 h-4" />
            <span className={timeLeft < 300 ? 'text-notion-error' : ''}>{formatTime(timeLeft)}</span>
          </div>
          
          <div className="w-32 bg-notion-border rounded-full h-2">
            <div 
              className="bg-notion-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="notion-card p-8 mb-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-notion-accent" />
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-2 py-1 text-xs bg-notion-bg-hover text-notion-text-secondary rounded-full">
              {currentQuestion.concept}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-notion-text mb-6">
            {currentQuestion.question}
          </h3>

          {/* Multiple Choice Options */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index
                return (
                  <label
                    key={index}
                    className={`block p-4 border-2 rounded-notion-sm cursor-pointer transition-all transform hover:scale-[1.02] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                        : 'border-notion-border hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={index}
                      checked={isSelected}
                      onChange={() => handleAnswer(index)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className={`${isSelected ? 'text-blue-700 font-medium' : 'text-notion-text'}`}>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-blue-500 text-sm font-medium">已选择</span>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Coding Question */}
          {currentQuestion.type === 'coding' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="请输入你的代码..."
                rows={10}
                className="notion-input font-mono text-sm resize-none"
              />
            </div>
          )}

          {/* Explanation Question */}
          {currentQuestion.type === 'explanation' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="请详细解释你的思路..."
                rows={6}
                className="notion-input resize-none"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="notion-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一题
        </button>
        
        <div className="flex space-x-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answers[currentQuestion.id] === undefined}
              className="notion-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>提交测试</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="notion-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>下一题</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}