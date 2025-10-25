'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HistoryEntry {
  id: string;
  type: 'concept-analysis' | 'learning-path' | 'test-generation';
  input: any;
  output: any;
  timestamp: number;
  duration?: number;
  fromCache: boolean;
}

interface HistoryStats {
  totalEntries: number;
  byType: Record<string, number>;
  cacheHitRate: number;
  averageDuration: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

const typeLabels = {
  'concept-analysis': '概念分析',
  'learning-path': '学习路径',
  'test-generation': '测试生成'
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    fromCache: '',
    limit: 50
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.fromCache) params.append('fromCache', filters.fromCache);
      params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/history?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('获取历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/history/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('获取历史统计失败:', error);
    }
  };

  const clearHistory = async () => {
    if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch('/api/history', { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        setHistory([]);
        setStats(null);
        alert('历史记录已清空');
        fetchStats();
      }
    } catch (error) {
      console.error('清空历史记录失败:', error);
      alert('清空失败，请重试');
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [filters]);

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getInputSummary = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'concept-analysis':
        return entry.input.text?.substring(0, 50) + '...';
      case 'learning-path':
        return `${entry.input.goal} (${entry.input.currentLevel} → ${entry.input.timeframe})`;
      case 'test-generation':
        return `${entry.input.topic} - ${entry.input.difficulty} (${entry.input.questionCount}题)`;
      default:
        return JSON.stringify(entry.input).substring(0, 50) + '...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">历史记录</h1>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              清空历史
            </button>
          </div>

          {/* 统计信息 */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">总记录数</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalEntries}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">缓存命中率</h3>
                <p className="text-2xl font-bold text-green-600">{stats.cacheHitRate.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">平均响应时间</h3>
                <p className="text-2xl font-bold text-purple-600">{formatDuration(stats.averageDuration)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">类型分布</h3>
                <div className="text-sm text-gray-600">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type}>{typeLabels[type as keyof typeof typeLabels]}: {count}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 过滤器 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有类型</option>
              <option value="concept-analysis">概念分析</option>
              <option value="learning-path">学习路径</option>
              <option value="test-generation">测试生成</option>
            </select>

            <input
              type="text"
              placeholder="搜索内容..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={filters.fromCache}
              onChange={(e) => setFilters(prev => ({ ...prev, fromCache: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">缓存状态</option>
              <option value="true">来自缓存</option>
              <option value="false">AI调用</option>
            </select>

            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={20}>显示 20 条</option>
              <option value={50}>显示 50 条</option>
              <option value={100}>显示 100 条</option>
              <option value={200}>显示 200 条</option>
            </select>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无历史记录
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {typeLabels[entry.type]}
                        </span>
                        {entry.fromCache && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            缓存
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">{getInputSummary(entry)}</p>
                      <div className="text-xs text-gray-500">
                        响应时间: {formatDuration(entry.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 详情模态框 */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">历史记录详情</h2>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">基本信息</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p><strong>类型:</strong> {typeLabels[selectedEntry.type]}</p>
                      <p><strong>时间:</strong> {formatTimestamp(selectedEntry.timestamp)}</p>
                      <p><strong>响应时间:</strong> {formatDuration(selectedEntry.duration)}</p>
                      <p><strong>来源:</strong> {selectedEntry.fromCache ? '缓存' : 'AI调用'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">输入内容</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(selectedEntry.input, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">输出结果</h3>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(selectedEntry.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}