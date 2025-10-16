import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '个性化学习智能体 - Demo',
  description: '基于Multi-Agent的个性化学习助手，帮助学生高效掌握复杂概念',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}