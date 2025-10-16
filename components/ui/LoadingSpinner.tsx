import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = '加载中...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`border-2 border-notion-border border-t-notion-accent rounded-full ${sizeClasses[size]}`}
      />
      {text && (
        <p className="text-sm text-notion-text-secondary">{text}</p>
      )}
    </div>
  )
}