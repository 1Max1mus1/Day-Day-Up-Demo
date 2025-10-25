'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Cpu } from 'lucide-react';
import { SUPPORTED_MODELS, ModelConfig, getModelsByProvider, DEFAULT_MODEL, MODEL_PREFERENCE_KEY } from '@/lib/models';

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (modelId: string) => void;
  availableModels?: string[];
  className?: string;
  showDescription?: boolean;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  availableModels,
  className = '',
  showDescription = true
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(selectedModel || DEFAULT_MODEL);

  // 从localStorage加载用户偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(MODEL_PREFERENCE_KEY);
      if (saved && (!selectedModel || selectedModel === DEFAULT_MODEL)) {
        setCurrentModel(saved);
        onModelChange(saved);
      }
    }
  }, [selectedModel, onModelChange]);

  // 过滤可用模型
  const getFilteredModels = (): ModelConfig[] => {
    if (availableModels) {
      return SUPPORTED_MODELS.filter(model => availableModels.includes(model.id));
    }
    return SUPPORTED_MODELS;
  };

  const filteredModels = getFilteredModels();
  const modelsByProvider = getModelsByProvider();
  const selectedModelConfig = SUPPORTED_MODELS.find(m => m.id === currentModel);

  const handleModelSelect = (modelId: string) => {
    setCurrentModel(modelId);
    onModelChange(modelId);
    setIsOpen(false);
    
    // 保存用户偏好
    if (typeof window !== 'undefined') {
      localStorage.setItem(MODEL_PREFERENCE_KEY, modelId);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 选择器按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Cpu className="h-5 w-5 text-gray-400" />
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">
              {selectedModelConfig?.name || '选择模型'}
            </div>
            {showDescription && selectedModelConfig && (
              <div className="text-xs text-gray-500 truncate max-w-48">
                {selectedModelConfig.description}
              </div>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {Object.entries(modelsByProvider).map(([provider, models]) => {
            const providerModels = models.filter(model => 
              !availableModels || availableModels.includes(model.id)
            );
            
            if (providerModels.length === 0) return null;

            return (
              <div key={provider} className="py-2">
                {/* 提供商标题 */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {provider}
                </div>
                
                {/* 模型列表 */}
                {providerModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {model.name}
                          </span>
                          {model.pricing && (
                            <span className="text-xs text-gray-500">
                              ¥{model.pricing.input}/1K
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {model.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            最大: {model.maxTokens} tokens
                          </span>
                          <div className="flex space-x-1">
                            {model.supportedFeatures.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {currentModel === model.id && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
          
          {filteredModels.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无可用模型</p>
              <p className="text-xs mt-1">请检查API密钥配置</p>
            </div>
          )}
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}