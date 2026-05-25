# 🤖 机器人总教练请就位

一个面向初中生的 AI 教育互动学习平台，通过导学单形式引导学生探索多模态 AI、强化学习等前沿技术。

## ✨ 功能特点

- **交互式导学单**：三个章节，涵盖多模态感知、强化学习、AI闭环等核心概念
- **多模态体验站**：支持图文问答，上传图片进行智能分析
- **智能学习报告**：自动生成个性化学习分析报告
- **轮播新闻大屏**：AI实时获取多模态应用案例
- **游戏化学习**：机器人训练小游戏，增强学习趣味性

## 🛠️ 技术栈

- **前端**: HTML5 / CSS3 / JavaScript (ES6+)
- **AI服务**: 硅基流动 API (DeepSeek-V4-Flash / Kimi-K2.6)
- **数据收集**: QuickForm（自主研发的表单服务）
- **数据存储**: LocalStorage
- **字体**: Google Fonts (Noto Sans SC)

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/robot-coach.git

# 进入项目目录
cd robot-coach

# 启动本地服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

## 📁 项目结构

```
├── index.html          # 首页（登录入口）
├── course.html         # 导学单主页面
├── resource/           # 静态资源
└── segment task/       # 子任务页面
    └── selection/
        ├── multimodal.html   # 多模态体验站
        └── profile.html      # 诊断报告
```

## 📊 数据管理

项目使用 **QuickForm** 进行数据收集和读取。QuickForm 是我参与开发的表单服务平台，提供简单易用的表单创建和数据管理功能。

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

*让 AI 学习更有趣 🎓*

**作者**: [你的名字] | QuickForm 开发者
