'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Code, ArrowRight, Brain, Target, Zap, History, Settings } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  // 功能入口
  const features = [
    {
      id: 'concept-analysis',
      title: '概念分析',
      description: '智能拆解复杂概念，建立知识依赖关系',
      icon: '🧠',
      route: '/concept-analysis',
      color: 'blue'
    },
    {
      id: 'learning-path',
      title: '学习路径生成',
      description: '个性化学习路径规划，从基础到进阶',
      icon: '🗺️',
      route: '/learning-path',
      color: 'green'
    },
    {
      id: 'test-generator',
      title: '测试题目生成',
      description: '自适应测试题目，巩固学习效果',
      icon: '📝',
      route: '/test-generator',
      color: 'purple'
    }
  ]

  // 用户案例（仅展示）
  const userCases = [
    {
      id: 'zhang',
      name: '张同学',
      age: '21岁',
      major: '计算机专业大三',
      avatar: '👨‍🎓',
      description: '自学能力强，正在准备秋招，需要系统学习算法',
      painPoints: ['网上资料碎片化', '不知道学习路径对不对', '需要节约精力和时间'],
      learningStyle: '喜欢深度理解原理而非死记硬背',
      expectation: '有人能像导师一样引导思考，而不是直接给答案',
      usedFeature: '学习路径生成'
    },
    {
      id: 'li',
      name: '李同学', 
      age: '24岁',
      major: '生物医学硕士研一',
      avatar: '👩‍🔬',
      description: '需要阅读大量英文文献，理解复杂概念',
      painPoints: ['论文术语多', '跨学科知识难以串联', '概念理解困难'],
      learningStyle: '做笔记、画思维导图、反复推敲',
      expectation: '能帮助拆解复杂概念，建立知识体系',
      usedFeature: '概念分析'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-notion-bg via-notion-bg-secondary to-notion-bg">
      {/* Header */}
      <header className="border-b border-notion-border bg-notion-bg/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-notion-accent rounded-notion flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-notion-text">个性化学习智能体</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-notion-text-secondary hover:text-notion-text hover:bg-notion-bg-secondary rounded-notion transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>历史记录</span>
                </motion.button>
              </Link>
              
              <Link href="/dev">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-notion-text-secondary hover:text-notion-text hover:bg-notion-bg-secondary rounded-notion transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>开发者</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-notion-text mb-4">
            个性化学习智能体
          </h2>
          <p className="text-lg text-notion-text-secondary max-w-2xl mx-auto">
            基于Multi-Agent的个性化学习助手，为不同学习需求提供定制化解决方案
          </p>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="notion-card p-6 text-center">
            <Target className="w-8 h-8 text-notion-accent mx-auto mb-3" />
            <h3 className="font-semibold text-notion-text mb-2">概念拆解引擎</h3>
            <p className="text-sm text-notion-text-secondary">智能识别前置知识，将复杂概念拆解为易理解的小块</p>
          </div>
          <div className="notion-card p-6 text-center">
            <BookOpen className="w-8 h-8 text-notion-accent mx-auto mb-3" />
            <h3 className="font-semibold text-notion-text mb-2">个性化路径</h3>
            <p className="text-sm text-notion-text-secondary">根据个人基础生成定制化学习路径和材料推荐</p>
          </div>
          <div className="notion-card p-6 text-center">
            <Zap className="w-8 h-8 text-notion-accent mx-auto mb-3" />
            <h3 className="font-semibold text-notion-text mb-2">自适应测试</h3>
            <p className="text-sm text-notion-text-secondary">智能生成测试题目，根据答题情况调整难度</p>
          </div>
        </motion.div>

        {/* Feature Entries */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold text-notion-text mb-8 text-center">
            选择学习功能
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.id} href={feature.route}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="notion-card p-8 cursor-pointer transition-all duration-300 hover:shadow-notion-hover group"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold text-notion-text mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-notion-text-secondary text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <motion.button
                      className="notion-button-primary w-full flex items-center justify-center space-x-2 group-hover:bg-notion-accent-hover"
                    >
                      <span>立即体验</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* User Cases */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold text-notion-text mb-8 text-center">
            用户案例
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userCases.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="notion-card p-8"
              >
                {/* User Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="text-4xl">{user.avatar}</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-notion-text mb-1">
                      {user.name}
                    </h4>
                    <p className="text-notion-text-secondary text-sm mb-2">
                      {user.age} · {user.major}
                    </p>
                    <p className="text-notion-text text-sm leading-relaxed">
                      {user.description}
                    </p>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="mb-6">
                  <h5 className="font-medium text-notion-text mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    核心痛点
                  </h5>
                  <ul className="space-y-2">
                    {user.painPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-notion-text-secondary flex items-start">
                        <span className="w-1 h-1 bg-notion-text-light rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learning Style & Expectation */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h5 className="font-medium text-notion-text mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      学习习惯
                    </h5>
                    <p className="text-sm text-notion-text-secondary">{user.learningStyle}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-notion-text mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      期望效果
                    </h5>
                    <p className="text-sm text-notion-text-secondary">{user.expectation}</p>
                  </div>
                </div>

                {/* Used Feature */}
                <div className="pt-4 border-t border-notion-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-notion-text-secondary">使用功能</span>
                    <span className="px-3 py-1 bg-notion-accent-light text-notion-accent text-sm rounded-full">
                      {user.usedFeature}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </main>
    </div>
  )
}