# 个性化学习智能体 (Day Day Up)

基于Multi-Agent的个性化学习助手，为不同学习需求提供定制化解决方案。

## 🌟 项目特色

- **🧠 概念拆解引擎**：智能识别前置知识，将复杂概念拆解为易理解的小块
- **🗺️ 个性化路径**：根据个人基础生成定制化学习路径和材料推荐
- **📝 自适应测试**：智能生成测试题目，根据答题情况调整难度

## 🚀 核心功能

### 1. 概念分析
- 智能拆解复杂概念，建立知识依赖关系
- 生成概念依赖图，可视化学习路径
- 提供详细的概念讲解和巩固测试

### 2. 学习路径生成
- 个性化学习路径规划，从基础到进阶
- 根据用户背景和目标定制学习计划
- 提供学习资源推荐和时间安排

### 3. 测试题目生成
- 自适应测试题目，巩固学习效果
- 支持多种题型：选择题、多选题、判断题、简答题
- 智能评分和答案解析

## 🛠️ 技术栈

- **前端框架**：Next.js 14 + React 18
- **样式方案**：Tailwind CSS
- **动画库**：Framer Motion
- **图标库**：Lucide React
- **AI服务**：DeepSeek API
- **开发语言**：TypeScript

## 📦 安装与运行

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/1Max1mus1/Day-Day-Up-Demo.git
cd Day-Day-Up-Demo
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
创建 `.env.local` 文件并添加以下配置：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🎯 使用场景

### 张同学 - 计算机专业大三学生
- **需求**：准备秋招，系统学习算法
- **痛点**：网上资料碎片化，不知道学习路径对不对
- **解决方案**：使用学习路径生成功能，获得个性化的算法学习计划

### 李同学 - 生物医学硕士研一
- **需求**：阅读大量英文文献，理解复杂概念
- **痛点**：论文术语多，跨学科知识难以串联
- **解决方案**：使用概念分析功能，拆解复杂概念并建立知识体系

## 📁 项目结构

```
day-day-up/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── analyze-concepts/
│   │   ├── generate-path/
│   │   └── generate-test/
│   ├── concept-analysis/  # 概念分析页面
│   ├── learning-path/     # 学习路径页面
│   ├── test-generator/    # 测试生成页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 首页
├── components/            # 可复用组件
│   ├── TestInterface.tsx  # 测试界面组件
│   └── ui/               # UI 组件库
├── lib/                  # 工具库
│   └── deepseek.ts       # DeepSeek API 配置
├── public/               # 静态资源
└── README.md            # 项目说明
```

## 🔧 API 配置

项目使用 DeepSeek API 提供 AI 能力。请确保：

1. 获取 DeepSeek API Key
2. 在 `.env.local` 中正确配置
3. 确保网络可以访问 DeepSeek API

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [DeepSeek](https://www.deepseek.com/) - AI 服务提供商

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/1Max1mus1/Day-Day-Up-Demo/issues)
- 发送邮件至项目维护者

---

**让学习变得更智能，让进步每天都看得见！** 🚀