interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
  duration?: number;
  userAgent?: string;
  ip?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000; // 最多保存1000条日志

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private addLog(level: LogEntry['level'], category: string, message: string, data?: any, duration?: number): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      duration
    };

    this.logs.unshift(entry); // 新日志添加到开头

    // 保持日志数量在限制内
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // 在开发环境下也输出到控制台
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date(entry.timestamp).toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;
      
      switch (level) {
        case 'error':
          console.error(logMessage, data);
          break;
        case 'warn':
          console.warn(logMessage, data);
          break;
        case 'debug':
          console.debug(logMessage, data);
          break;
        default:
          console.log(logMessage, data);
      }
    }
  }

  // API调用日志
  apiCall(endpoint: string, method: string, duration: number, success: boolean, data?: any): void {
    this.addLog(
      success ? 'info' : 'error',
      'API',
      `${method} ${endpoint} - ${success ? 'Success' : 'Failed'}`,
      data,
      duration
    );
  }

  // AI调用日志
  aiCall(type: string, inputSize: number, outputSize: number, duration: number, cached: boolean = false): void {
    this.addLog(
      'info',
      'AI',
      `${type} - Input: ${inputSize}chars, Output: ${outputSize}chars${cached ? ' (Cached)' : ''}`,
      { type, inputSize, outputSize, cached },
      duration
    );
  }

  // 缓存操作日志
  cache(operation: 'hit' | 'miss' | 'set' | 'clear', type: string, key?: string): void {
    this.addLog(
      'debug',
      'CACHE',
      `${operation.toUpperCase()} - ${type}${key ? ` (${key})` : ''}`,
      { operation, type, key }
    );
  }

  // 错误日志
  error(category: string, message: string, error?: Error | any): void {
    this.addLog(
      'error',
      category,
      message,
      error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    );
  }

  // 警告日志
  warn(category: string, message: string, data?: any): void {
    this.addLog('warn', category, message, data);
  }

  // 信息日志
  info(category: string, message: string, data?: any): void {
    this.addLog('info', category, message, data);
  }

  // 调试日志
  debug(category: string, message: string, data?: any): void {
    this.addLog('debug', category, message, data);
  }

  // 获取所有日志
  getLogs(filter?: {
    level?: LogEntry['level'];
    category?: string;
    limit?: number;
    since?: number;
  }): LogEntry[] {
    let filteredLogs = this.logs;

    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      if (filter.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filter.category);
      }
      if (filter.since) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.since);
      }
      if (filter.limit) {
        filteredLogs = filteredLogs.slice(0, filter.limit);
      }
    }

    return filteredLogs;
  }

  // 获取日志统计
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      recentErrors: this.logs.filter(log => 
        log.level === 'error' && 
        Date.now() - log.timestamp < 60 * 60 * 1000 // 最近1小时
      ).length,
      avgDuration: 0
    };

    let totalDuration = 0;
    let durationCount = 0;

    for (const log of this.logs) {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
      
      if (log.duration) {
        totalDuration += log.duration;
        durationCount++;
      }
    }

    if (durationCount > 0) {
      stats.avgDuration = Math.round(totalDuration / durationCount);
    }

    return stats;
  }

  // 清空日志
  clear(): void {
    this.logs = [];
    this.info('SYSTEM', 'Logs cleared');
  }

  // 性能监控装饰器
  performance<T extends (...args: any[]) => Promise<any>>(
    category: string,
    operation: string,
    fn: T
  ): T {
    return (async (...args: any[]) => {
      const startTime = Date.now();
      try {
        const result = await fn(...args);
        const duration = Date.now() - startTime;
        this.info(category, `${operation} completed`, { duration });
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.error(category, `${operation} failed`, { error, duration });
        throw error;
      }
    }) as T;
  }
}

// 单例模式
export const logger = new Logger();