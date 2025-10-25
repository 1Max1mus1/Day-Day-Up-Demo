'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Filter, Download, Eye, AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
  duration?: number;
}

interface CacheStats {
  totalEntries: number;
  byType: Record<string, number>;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  recentErrors: number;
  avgDuration: number;
}

interface HistoryStats {
  totalEntries: number;
  byType: Record<string, number>;
  cacheHitRate: number;
  averageDuration: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

export default function DevPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [logStats, setLogStats] = useState<LogStats | null>(null);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);
  const [filter, setFilter] = useState({
    level: '',
    category: '',
    limit: 100
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const fetchData = async () => {
    try {
      const [logsRes, cacheRes, statsRes, historyRes] = await Promise.all([
        fetch('/api/dev/logs?' + new URLSearchParams({
          level: filter.level,
          category: filter.category,
          limit: filter.limit.toString()
        })),
        fetch('/api/dev/cache-stats'),
        fetch('/api/dev/log-stats'),
        fetch('/api/history/stats')
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }

      if (cacheRes.ok) {
        const cacheData = await cacheRes.json();
        setCacheStats(cacheData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setLogStats(statsData);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.success) {
          setHistoryStats(historyData.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dev data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, filter]);

  const clearLogs = async () => {
    try {
      await fetch('/api/dev/clear-logs', { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('/api/dev/clear-cache', { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'debug': return <Bug className="w-4 h-4 text-purple-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'debug': return 'text-purple-600 bg-purple-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">开发者控制台</h1>
          <p className="text-gray-600">系统运行状态监控和日志查看</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* 日志统计 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">日志统计</h3>
            {logStats && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">总数:</span>
                  <span className="font-medium">{logStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">错误:</span>
                  <span className="font-medium text-red-600">{logStats.byLevel.error || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">警告:</span>
                  <span className="font-medium text-yellow-600">{logStats.byLevel.warn || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均耗时:</span>
                  <span className="font-medium">{logStats.avgDuration}ms</span>
                </div>
              </div>
            )}
          </div>

          {/* 缓存统计 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">缓存统计</h3>
            {cacheStats && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">总条目:</span>
                  <span className="font-medium">{cacheStats.totalEntries}</span>
                </div>
                {Object.entries(cacheStats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-600">{type}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 历史记录统计 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">历史记录</h3>
            {historyStats && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">总记录:</span>
                  <span className="font-medium">{historyStats.totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">缓存命中率:</span>
                  <span className="font-medium text-green-600">{historyStats.cacheHitRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均耗时:</span>
                  <span className="font-medium">{historyStats.averageDuration.toFixed(0)}ms</span>
                </div>
                {Object.entries(historyStats.byType).slice(0, 2).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-600 text-xs">{type}:</span>
                    <span className="font-medium text-xs">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 系统状态 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">运行状态:</span>
                <span className="font-medium text-green-600">正常</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最近错误:</span>
                <span className="font-medium">{logStats?.recentErrors || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">自动刷新:</span>
                <span className={`font-medium ${autoRefresh ? 'text-green-600' : 'text-gray-600'}`}>
                  {autoRefresh ? '开启' : '关闭'}
                </span>
              </div>
            </div>
          </div>

          {/* 操作面板 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
              </button>
              <button
                onClick={exportLogs}
                className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出日志
              </button>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter.level}
                  onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="">所有级别</option>
                  <option value="error">错误</option>
                  <option value="warn">警告</option>
                  <option value="info">信息</option>
                  <option value="debug">调试</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="">所有分类</option>
                  <option value="API">API</option>
                  <option value="AI">AI</option>
                  <option value="CACHE">缓存</option>
                  <option value="SYSTEM">系统</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filter.limit}
                  onChange={(e) => setFilter({ ...filter, limit: parseInt(e.target.value) || 100 })}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm w-20"
                  placeholder="条数"
                />
              </div>

              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>

              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清空日志
              </button>

              <button
                onClick={clearCache}
                className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清空缓存
              </button>
            </div>
          </div>

          {/* 日志列表 */}
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-start gap-3">
                  {getLevelIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{log.category}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.duration && (
                        <span className="text-xs text-gray-500">
                          {log.duration}ms
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{log.message}</p>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 日志详情模态框 */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">日志详情</h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                    <p className="text-sm text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">级别</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedLog.level)}`}>
                      {selectedLog.level.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <p className="text-sm text-gray-900">{selectedLog.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">消息</label>
                    <p className="text-sm text-gray-900">{selectedLog.message}</p>
                  </div>
                  {selectedLog.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">耗时</label>
                      <p className="text-sm text-gray-900">{selectedLog.duration}ms</p>
                    </div>
                  )}
                  {selectedLog.data && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">详细数据</label>
                      <pre className="text-xs text-gray-900 bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(selectedLog.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}