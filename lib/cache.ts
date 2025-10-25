import crypto from 'crypto';

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  type: 'concept-analysis' | 'learning-path' | 'test-generation';
  inputHash: string;
}

interface HistoryEntry {
  id: string;
  type: 'concept-analysis' | 'learning-path' | 'test-generation';
  input: any;
  output: any;
  timestamp: number;
  duration?: number;
  fromCache: boolean;
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private history: HistoryEntry[] = [];
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时
  private readonly HISTORY_LIMIT = 1000; // 最多保存1000条历史记录

  // 生成输入的哈希值
  private generateHash(input: any): string {
    const inputString = JSON.stringify(input);
    return crypto.createHash('md5').update(inputString).digest('hex');
  }

  // 生成缓存键
  private generateKey(type: string, inputHash: string): string {
    return `${type}:${inputHash}`;
  }

  // 设置缓存
  set(type: CacheEntry['type'], input: any, data: any): void {
    const inputHash = this.generateHash(input);
    const key = this.generateKey(type, inputHash);
    
    const entry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      type,
      inputHash
    };

    this.cache.set(key, entry);
    
    // 清理过期缓存
    this.cleanExpiredCache();
  }

  // 获取缓存
  get(type: CacheEntry['type'], input: any): any | null {
    const inputHash = this.generateHash(input);
    const key = this.generateKey(type, inputHash);
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // 清理过期缓存
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计信息
  getStats() {
    const stats = {
      totalEntries: this.cache.size,
      byType: {} as Record<string, number>,
      oldestEntry: null as Date | null,
      newestEntry: null as Date | null
    };

    let oldest = Infinity;
    let newest = 0;

    for (const entry of this.cache.values()) {
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
      
      if (entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }

    if (oldest !== Infinity) {
      stats.oldestEntry = new Date(oldest);
    }
    if (newest !== 0) {
      stats.newestEntry = new Date(newest);
    }

    return stats;
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
  }

  // 获取所有缓存条目（用于调试）
  getAllEntries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  // 添加历史记录
  addHistory(type: HistoryEntry['type'], input: any, output: any, duration?: number, fromCache: boolean = false): void {
    const historyEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      type,
      input,
      output,
      timestamp: Date.now(),
      duration,
      fromCache
    };

    this.history.unshift(historyEntry); // 最新的在前面

    // 限制历史记录数量
    if (this.history.length > this.HISTORY_LIMIT) {
      this.history = this.history.slice(0, this.HISTORY_LIMIT);
    }
  }

  // 获取历史记录
  getHistory(options?: {
    type?: HistoryEntry['type'];
    limit?: number;
    search?: string;
    fromCache?: boolean;
  }): HistoryEntry[] {
    let filtered = [...this.history];

    if (options?.type) {
      filtered = filtered.filter(entry => entry.type === options.type);
    }

    if (options?.fromCache !== undefined) {
      filtered = filtered.filter(entry => entry.fromCache === options.fromCache);
    }

    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(entry => {
        const inputStr = JSON.stringify(entry.input).toLowerCase();
        const outputStr = JSON.stringify(entry.output).toLowerCase();
        return inputStr.includes(searchLower) || outputStr.includes(searchLower);
      });
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  // 根据ID获取历史记录
  getHistoryById(id: string): HistoryEntry | null {
    return this.history.find(entry => entry.id === id) || null;
  }

  // 清空历史记录
  clearHistory(): void {
    this.history = [];
  }

  // 获取历史记录统计
  getHistoryStats() {
    const stats = {
      totalEntries: this.history.length,
      byType: {} as Record<string, number>,
      cacheHitRate: 0,
      averageDuration: 0,
      oldestEntry: null as Date | null,
      newestEntry: null as Date | null
    };

    if (this.history.length === 0) {
      return stats;
    }

    let totalDuration = 0;
    let cacheHits = 0;
    let durationsCount = 0;

    for (const entry of this.history) {
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
      
      if (entry.fromCache) {
        cacheHits++;
      }

      if (entry.duration) {
        totalDuration += entry.duration;
        durationsCount++;
      }
    }

    stats.cacheHitRate = (cacheHits / this.history.length) * 100;
    stats.averageDuration = durationsCount > 0 ? totalDuration / durationsCount : 0;
    stats.oldestEntry = new Date(this.history[this.history.length - 1].timestamp);
    stats.newestEntry = new Date(this.history[0].timestamp);

    return stats;
  }
}

// 单例模式
export const cacheManager = new CacheManager();