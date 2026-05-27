# 登录页重设计 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将登录页从纯 CSS 插画风格改为「视频背景 + 漂浮 3D 立体书 + 磨砂玻璃登录面板 + 粒子特效」的交互设计。

**Architecture:** 单文件 `index.html`，内嵌 CSS + JS。HTML 分为背景视频层、标题层、书本登录层、粒子特效层、弹窗层。JS 保留现有登录/注册/弹窗逻辑，新增书本交互动画（浮动、hover、登录成功打开）。

**Tech Stack:** HTML5 / CSS3 (3D transforms, backdrop-filter, @keyframes) / Vanilla JS (ES6+)

---

## 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `index.html` | 重写 | 新登录页完整代码 |
| `resource/video/robot-running.mp4` | 新增（用户提供） | 背景循环视频 |

---

### Task 1: 搭建 HTML 骨架

**Files:**
- Rewrite: `index.html`（完整重写）

- [ ] **Step 1: 写新的 HTML 结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>机器人总教练请就位</title>
    <link rel="preconnect" href="https://fonts.googleapis.cn">
    <link rel="preconnect" href="https://fonts.gstatic.cn" crossorigin>
    <link href="https://fonts.googleapis.cn/css2?family=Noto+Sans+SC:wght@400;500;700&family=ZCOOL+KuaiLe&display=swap" rel="stylesheet">
    <style>
        /* CSS 在 Task 2-5 中逐步填充 */
    </style>
</head>
<body>
    <!-- 层1: 背景视频 -->
    <div class="bg-layer">
        <video class="bg-video" autoplay muted loop playsinline preload="auto">
            <!-- 视频就绪后取消注释: <source src="resource/video/robot-running.mp4" type="video/mp4"> -->
        </video>
        <!-- 视频加载前的 fallback 渐变背景 -->
        <div class="bg-fallback"></div>
        <!-- 全屏噪点纹理叠加 -->
        <div class="noise-overlay"></div>
        <!-- 左上角暖光模拟 -->
        <div class="warm-light"></div>
    </div>

    <!-- 层2: 标题区域 -->
    <div class="title-layer">
        <h1 class="main-title">
            <span class="title-char">机</span>
            <span class="title-char">器</span>
            <span class="title-char">人</span>
            <span class="title-char">总</span>
            <span class="title-char">教</span>
            <span class="title-char">练</span>
            <span class="title-char">请</span>
            <span class="title-char">就</span>
            <span class="title-char">位</span>
        </h1>
        <p class="sub-title">从「醉汉走路」到跑赢人类</p>
    </div>

    <!-- 层3: 漂浮立体书 + 登录面板 -->
    <div class="book-layer">
        <div class="book-wrapper" id="bookWrapper">
            <!-- 书本投影（独立于浮动动画） -->
            <div class="book-shadow"></div>
            <!-- 书本主体 -->
            <div class="book-body">
                <!-- 书脊 -->
                <div class="book-spine"></div>
                <!-- 封面 -->
                <div class="book-cover">
                    <div class="book-cover-border"></div>
                    <div class="book-cover-title">✦ 登录 ✦</div>
                    <!-- 磨砂玻璃面板 -->
                    <div class="frosted-panel">
                        <div class="login-row">
                            <label class="login-label">姓名</label>
                            <input type="text" class="login-input" id="username" placeholder="请输入你的姓名">
                        </div>
                        <div class="login-row">
                            <label class="login-label">密码</label>
                            <input type="password" class="login-input" id="password" placeholder="请输入密码">
                        </div>
                        <div class="login-buttons">
                            <button class="login-btn primary" id="btnLogin">登 录</button>
                            <button class="login-btn secondary" id="btnRegister">注 册</button>
                        </div>
                    </div>
                </div>
                <!-- 侧面书页（3D 厚度） -->
                <div class="book-pages-edge"></div>
            </div>
        </div>
    </div>

    <!-- 层4: 粒子漂浮层 -->
    <div class="particles-layer" id="particlesLayer"></div>

    <!-- 层5: 弹窗 -->
    <div class="modal" id="modal">
        <div class="modal-content">
            <h2 class="modal-title" id="modalTitle">提示</h2>
            <p class="modal-message" id="modalMessage"></p>
            <button class="modal-btn" id="modalClose">确定</button>
        </div>
    </div>

    <script>
        // JS 在 Task 6 中填充
    </script>
</body>
</html>
```

- [ ] **Step 2: 验证 HTML 结构**

在浏览器打开 `index.html`，确认无 JS 报错，页面显示空白（CSS 尚未添加）。

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite login page HTML skeleton with layered structure"
```

---

### Task 2: 背景层 CSS — 视频、fallback、噪点、暖光

**Files:**
- Edit: `index.html` — 填充 `<style>` 中背景层 CSS

- [ ] **Step 1: 写背景层 CSS**

在 `<style>` 标签内添加以下 CSS（放在 `* { margin:0; padding:0; box-sizing:border-box; }` 之后）：

```css
html, body {
    height: 100vh;
    overflow: hidden;
    font-family: 'Noto Sans SC', sans-serif;
}

/* ===== 背景视频层 ===== */
.bg-layer {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: #1a1a2e;
}

.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.5s ease;
}
.bg-video.loaded {
    opacity: 1;
}

/* 视频加载前的 fallback 渐变（操场→城市→操场色调） */
.bg-fallback {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
        #87CEEB 0%,
        #A8D5A2 25%,
        #7CB342 40%,
        #9E9E9E 55%,
        #607D8B 70%,
        #455A64 85%,
        #263238 100%
    );
    transition: opacity 1.5s ease;
}
.bg-video.loaded + .bg-fallback {
    opacity: 0;
}

/* 全屏噪点纹理 */
.noise-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    opacity: 0.035;
    /* SVG noise filter via data URI */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
}

/* 左上角暖光 */
.warm-light {
    position: absolute;
    top: -20%;
    left: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(
        ellipse at 30% 30%,
        rgba(255, 220, 150, 0.12) 0%,
        rgba(255, 200, 100, 0.05) 40%,
        transparent 70%
    );
    pointer-events: none;
    z-index: 1;
}
```

- [ ] **Step 2: 验证背景层效果**

在浏览器打开 `index.html`，确认：
- 显示渐变 fallback 背景
- 噪点纹理覆盖全屏（非常淡）
- 左上角有微弱暖光

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add background layer CSS with fallback gradient, noise texture, and warm light"
```

---

### Task 3: 标题层 CSS — 像素打字机动画

**Files:**
- Edit: `index.html` — 在 `<style>` 中添加标题层 CSS

- [ ] **Step 1: 写标题层 CSS**

```css
/* ===== 标题层 ===== */
.title-layer {
    position: fixed;
    top: 8%;
    left: 6%;
    z-index: 10;
    pointer-events: none;
}

.main-title {
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 52px;
    color: #fff;
    text-shadow:
        3px 3px 0 rgba(0, 0, 0, 0.4),
        0 0 40px rgba(255, 255, 255, 0.15);
    letter-spacing: 6px;
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
}

.title-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    animation: charPopIn 0.5s ease forwards;
}
/* 逐字 stagger */
.title-char:nth-child(1) { animation-delay: 0.1s; }
.title-char:nth-child(2) { animation-delay: 0.2s; }
.title-char:nth-child(3) { animation-delay: 0.3s; }
.title-char:nth-child(4) { animation-delay: 0.4s; }
.title-char:nth-child(5) { animation-delay: 0.5s; }
.title-char:nth-child(6) { animation-delay: 0.6s; }
.title-char:nth-child(7) { animation-delay: 0.7s; }
.title-char:nth-child(8) { animation-delay: 0.8s; }
.title-char:nth-child(9) { animation-delay: 0.9s; }

@keyframes charPopIn {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.8);
    }
    60% {
        opacity: 1;
        transform: translateY(-3px) scale(1.05);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.sub-title {
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35);
    margin-top: 12px;
    opacity: 0;
    animation: fadeSlideIn 0.6s ease 1.2s forwards;
}

@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(-15px); }
    to   { opacity: 1; transform: translateX(0); }
}
```

- [ ] **Step 2: 验证标题动画**

在浏览器打开 `index.html`，确认：
- 标题逐字弹出（每个字约 0.1s 间隔）
- 副标题在标题完成后淡入
- 字体 ZCOOL KuaiLe 正确加载

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add title layer with staggered character pop-in animation"
```

---

### Task 4: 漂浮立体书 CSS — 3D 变换 + 磨砂玻璃 + 浮动动画

**Files:**
- Edit: `index.html` — 在 `<style>` 中添加书本 CSS

- [ ] **Step 1: 写书本 CSS**

```css
/* ===== 漂浮立体书 ===== */
.book-layer {
    position: fixed;
    top: 50%;
    right: 8%;
    transform: translateY(-50%);
    z-index: 10;
    perspective: 800px;
}

.book-wrapper {
    position: relative;
    width: 300px;
    height: 360px;
    animation: bookFloat 3.5s ease-in-out infinite;
}

@keyframes bookFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
}

/* 书本动态投影 */
.book-shadow {
    position: absolute;
    bottom: -15px;
    left: 10%;
    width: 80%;
    height: 20px;
    background: radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0.35) 0%,
        transparent 70%
    );
    border-radius: 50%;
    animation: shadowPulse 3.5s ease-in-out infinite;
}

@keyframes shadowPulse {
    0%, 100% { transform: scale(1); opacity: 0.35; }
    50%      { transform: scale(0.85); opacity: 0.2; }
}

/* 书本主体 */
.book-body {
    position: relative;
    width: 100%;
    height: 100%;
    transform: rotateY(-8deg) rotateX(3deg);
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

/* hover: 封面微开 */
.book-wrapper:hover .book-body {
    transform: rotateY(-15deg) rotateX(3deg);
}

/* 书脊 */
.book-spine {
    position: absolute;
    left: 0;
    top: 0;
    width: 28px;
    height: 100%;
    background: linear-gradient(90deg,
        #4a2a10 0%,
        #6B4226 15%,
        #8B5A2B 30%,
        #A0522D 45%,
        #8B5A2B 55%,
        #6B4226 70%,
        #5c3a1e 85%,
        #4a2a10 100%
    );
    border-radius: 6px 0 0 6px;
    box-shadow: inset -3px 0 8px rgba(0, 0, 0, 0.3);
    z-index: 2;
}

/* 书脊装饰横纹 */
.book-spine::after {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    top: 15%;
    bottom: 15%;
    background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 12px,
        rgba(255, 255, 255, 0.08) 12px,
        rgba(255, 255, 255, 0.08) 14px
    );
}

/* 书本侧面厚度（书页边缘） */
.book-pages-edge {
    position: absolute;
    right: 0;
    top: 4px;
    width: 10px;
    height: calc(100% - 8px);
    background: linear-gradient(90deg,
        #f0e4c8 0%,
        #e8d8b0 40%,
        #ddd0a0 100%
    );
    border-radius: 0 3px 3px 0;
    border-left: 1px solid rgba(139, 90, 43, 0.2);
}

/* 封面底色 */
.book-cover {
    position: absolute;
    left: 28px;
    top: 0;
    right: 10px;
    height: 100%;
    background: linear-gradient(145deg,
        #f5e6c8 0%,
        #eedcb0 25%,
        #e8d5a3 50%,
        #f0e0b8 75%,
        #f5e6c8 100%
    );
    border-radius: 0 12px 12px 0;
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

/* 封面金色装饰边框 */
.book-cover-border {
    position: absolute;
    inset: 10px;
    border: 2px solid rgba(180, 140, 80, 0.35);
    border-radius: 0 8px 8px 0;
    pointer-events: none;
}

/* 封面标题 */
.book-cover-title {
    position: absolute;
    top: 16px;
    left: 0;
    right: 0;
    text-align: center;
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 20px;
    color: #8B5A2B;
    letter-spacing: 4px;
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    z-index: 1;
}

/* ===== 磨砂玻璃面板 ===== */
.frosted-panel {
    position: absolute;
    top: 55px;
    left: 22px;
    right: 22px;
    bottom: 30px;
    background: rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(255, 255, 255, 0.45);
    border-radius: 10px;
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.login-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.login-label {
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #5d3a1a;
    width: 42px;
    flex-shrink: 0;
}

.login-input {
    flex: 1;
    padding: 12px 14px;
    border: 1.5px solid rgba(180, 140, 100, 0.4);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.65);
    font-size: 15px;
    font-family: 'Noto Sans SC', sans-serif;
    color: #3d2a10;
    transition: border-color 0.3s, box-shadow 0.3s;
    outline: none;
}

.login-input:focus {
    border-color: #A0522D;
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.15);
}

.login-input::placeholder {
    color: #c4a882;
}

.login-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
}

.login-btn {
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 18px;
    letter-spacing: 4px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
    transform: translateY(-2px);
}

.login-btn.primary {
    background: linear-gradient(135deg, #8B5A2B 0%, #A0522D 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(139, 90, 43, 0.3);
}

.login-btn.primary:hover {
    box-shadow: 0 6px 20px rgba(139, 90, 43, 0.4);
}

.login-btn.secondary {
    background: linear-gradient(135deg, #e8d5a3 0%, #dcc894 100%);
    color: #5d3a1a;
    border: 1.5px solid rgba(139, 90, 43, 0.3);
}

.login-btn.secondary:hover {
    box-shadow: 0 4px 12px rgba(139, 90, 43, 0.2);
}
```

- [ ] **Step 2: 验证书本 CSS**

在浏览器打开 `index.html`，确认：
- 立体书在右侧居中位置
- 书本缓慢上下浮动
- 投影同步变化
- 鼠标 hover 时书本微转（模拟翻开一条缝）
- 磨砂玻璃面板有模糊效果
- 输入框 focus 发光

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add floating 3D book with frosted glass login panel"
```

---

### Task 5: 粒子漂浮层 CSS + 响应式适配

**Files:**
- Edit: `index.html` — 在 `<style>` 中添加粒子 CSS，JS 中生成粒子 DOM

- [ ] **Step 1: 写粒子 CSS**

```css
/* ===== 粒子漂浮层 ===== */
.particles-layer {
    position: fixed;
    inset: 0;
    z-index: 5;
    pointer-events: none;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 215, 0, 0.5);
    border-radius: 50%;
    animation: particleDrift linear infinite;
    opacity: 0;
}

@keyframes particleDrift {
    0% {
        opacity: 0;
        transform: translateY(0) translateX(0) scale(0);
    }
    10% {
        opacity: 0.8;
    }
    90% {
        opacity: 0.3;
    }
    100% {
        opacity: 0;
        transform: translateY(-120px) translateX(30px) scale(1.2);
    }
}
```

- [ ] **Step 2: 写粒子生成 JS**

在 `<script>` 标签中添加粒子初始化代码（放在保留的登录逻辑之前）：

```javascript
// ===== 粒子漂浮初始化 =====
(function initParticles() {
    const container = document.getElementById('particlesLayer');
    const PARTICLE_COUNT = 20;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // 粒子主要分布在书本区域周围（画面右半部分）
        const isBookParticle = i < 16;
        if (isBookParticle) {
            // 书本附近：right 5%-25%, top 20%-70%
            particle.style.right = (5 + Math.random() * 20) + '%';
            particle.style.top = (20 + Math.random() * 50) + '%';
        } else {
            // 散落全局
            particle.style.left = (10 + Math.random() * 80) + '%';
            particle.style.top = (15 + Math.random() * 70) + '%';
        }

        // 随机大小
        const size = 2 + Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // 随机颜色（金色系）
        const colors = [
            'rgba(255, 215, 0, 0.5)',
            'rgba(255, 200, 50, 0.4)',
            'rgba(255, 230, 150, 0.35)',
            'rgba(200, 170, 80, 0.45)',
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // 随机动画参数
        particle.style.animationDuration = (3 + Math.random() * 6) + 's';
        particle.style.animationDelay = Math.random() * 8 + 's';

        container.appendChild(particle);
    }
})();
```

- [ ] **Step 3: 写响应式适配 CSS**

在 `</style>` 前添加：

```css
/* ===== 响应式适配 ===== */
@media (max-width: 768px) {
    .title-layer {
        top: 4%;
        left: 4%;
    }
    .main-title {
        font-size: 28px;
        letter-spacing: 3px;
    }
    .sub-title {
        font-size: 14px;
    }

    .book-layer {
        right: 4%;
    }
    .book-wrapper {
        width: 240px;
        height: 300px;
    }
    .frosted-panel {
        top: 45px;
        left: 16px;
        right: 16px;
        bottom: 20px;
        padding: 16px 12px;
        gap: 12px;
    }
    .login-label {
        font-size: 14px;
        width: 36px;
    }
    .login-input {
        padding: 10px 10px;
        font-size: 14px;
    }
    .login-btn {
        font-size: 15px;
        padding: 10px;
    }
}

@media (max-width: 480px) {
    .book-layer {
        right: 50%;
        transform: translate(50%, -50%);
    }
    .book-wrapper {
        width: 220px;
        height: 280px;
    }
    .title-layer {
        text-align: center;
        left: 4%;
        right: 4%;
    }
    .main-title {
        font-size: 24px;
        justify-content: center;
    }
}
```

- [ ] **Step 4: 验证粒子和响应式**

在浏览器打开 `index.html`，确认：
- 金色小粒子在书本周围漂浮
- 调整浏览器宽度到 768px 以下，书本和标题等比缩小
- 调整到 480px 以下，书本居中

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add floating particles and responsive layout"
```

---

### Task 6: 迁移 JS 逻辑 + 新增书本交互

**Files:**
- Edit: `index.html` — 在 `<script>` 中迁移现有登录/注册 JS，新增交互

- [ ] **Step 1: 迁移弹窗逻辑（保持不变）**

将以下代码追加到 `<script>` 中（放在粒子初始化代码之后）：

```javascript
// ===== 弹窗功能 =====
function showModal(title, message, onClose) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modal').classList.add('show');
    if (onClose) {
        document.getElementById('modal').onCloseCallback = onClose;
    }
}

document.getElementById('modalClose').addEventListener('click', function() {
    const modal = document.getElementById('modal');
    if (modal.onCloseCallback) {
        modal.onCloseCallback();
    }
    modal.classList.remove('show');
    modal.onCloseCallback = null;
});
```

- [ ] **Step 2: 迁移输入校验和页面跳转逻辑（保持不变）**

```javascript
// ===== 登录功能配置 =====
const LOGIN_API_URL = "https://quickform.cn/api/xx6gg2k4hf";
const USER_DATA_URL = "https://quickform.cn/api/xx6gg2k4hf/all";

function getInputValues() {
    return {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value.trim()
    };
}

function validateInput(username, password) {
    if (!username) { showModal('提示', '请输入姓名'); return false; }
    if (!password) { showModal('提示', '请输入密码'); return false; }
    return true;
}

function showBookOpenPage(username) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('currentCourse', '0');
    localStorage.setItem('currentPage', '0');
    localStorage.removeItem('multimodalNews');
    localStorage.removeItem('multimodalNewsTime');
    window.location.href = 'home.html';
}

window.addEventListener('DOMContentLoaded', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        const username = localStorage.getItem('username');
        if (username) {
            window.location.href = 'home.html';
        }
    }
});

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('currentCourse');
    localStorage.removeItem('currentPage');
    window.location.href = 'index.html';
}
```

- [ ] **Step 3: 迁移登录按钮事件（保持不变）**

```javascript
// ===== 登录按钮 =====
document.getElementById('btnLogin').addEventListener('click', async function() {
    const { username, password } = getInputValues();
    const loginBtn = document.getElementById('btnLogin');

    if (!validateInput(username, password)) return;

    const originalText = loginBtn.textContent;
    loginBtn.textContent = '请稍候...';
    loginBtn.style.pointerEvents = 'none';

    try {
        const usersResponse = await fetch(USER_DATA_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (usersResponse.ok) {
            const data = await usersResponse.json();
            let users = [];
            if (data && Array.isArray(data)) {
                users = data;
            } else if (data && Array.isArray(data.submissions)) {
                users = data.submissions;
            } else if (data && data.submissions) {
                users = Array.isArray(data.submissions) ? data.submissions : [data.submissions];
            }

            if (users.length > 0) {
                const existingUser = users.find(u =>
                    u['姓名'] === username || u['name'] === username
                );

                if (existingUser) {
                    const storedPassword = existingUser['密码'] || existingUser['password'];
                    if (storedPassword === password) {
                        // 登录成功 → 书本打开动画 → 跳转
                        triggerBookOpenAnimation(function() {
                            showBookOpenPage(username);
                        });
                    } else {
                        showModal('登录失败', '密码错误，请重新输入');
                    }
                } else {
                    showModal('登录失败', '该用户未注册，请先注册');
                }
            } else {
                showModal('登录失败', '暂无注册用户，请先注册');
            }
        } else {
            showModal('登录失败', '无法连接服务器，请稍后重试');
        }
    } catch (error) {
        console.error('登录错误:', error);
        showModal('网络错误', '连接服务器失败，请检查网络后重试');
    } finally {
        loginBtn.textContent = originalText;
        loginBtn.style.pointerEvents = 'auto';
    }
});
```

- [ ] **Step 4: 迁移注册按钮事件（保持不变）**

```javascript
// ===== 注册按钮 =====
document.getElementById('btnRegister').addEventListener('click', async function() {
    const { username, password } = getInputValues();
    const registerBtn = document.getElementById('btnRegister');

    if (!validateInput(username, password)) return;

    const originalText = registerBtn.textContent;
    registerBtn.textContent = '请稍候...';
    registerBtn.style.pointerEvents = 'none';

    try {
        const checkResponse = await fetch(USER_DATA_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (checkResponse.ok) {
            const data = await checkResponse.json();
            let users = [];
            if (data && Array.isArray(data)) {
                users = data;
            } else if (data && Array.isArray(data.submissions)) {
                users = data.submissions;
            }

            const existingUser = users.find(u =>
                u['姓名'] === username || u['name'] === username
            );

            if (existingUser) {
                showModal('注册失败', '该姓名已注册，请使用该账号登录或更改姓名重新注册');
                registerBtn.textContent = originalText;
                registerBtn.style.pointerEvents = 'auto';
                return;
            }
        }

        const submitResponse = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                姓名: username,
                密码: password,
                注册时间: new Date().toLocaleString('zh-CN')
            })
        });

        if (submitResponse.ok || submitResponse.status === 200 || submitResponse.status === 201) {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            showModal('注册成功', username + '，欢迎加入！请使用注册的账号登录。');
        } else {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            showModal('注册成功', username + '，欢迎加入！请使用注册的账号登录。');
        }
    } catch (error) {
        console.error('注册错误:', error);
        showModal('网络错误', '连接服务器失败，请检查网络后重试');
    } finally {
        registerBtn.textContent = originalText;
        registerBtn.style.pointerEvents = 'auto';
    }
});
```

- [ ] **Step 5: 新增书本打开动画函数 + 视频加载逻辑**

```javascript
// ===== 书本打开动画（登录成功后触发） =====
function triggerBookOpenAnimation(onComplete) {
    const bookBody = document.querySelector('.book-body');
    const bookWrapper = document.getElementById('bookWrapper');

    // 停止浮动动画
    bookWrapper.style.animation = 'none';

    // 书本打开：增大 rotateY + 微缩放
    bookBody.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
    bookBody.style.transform = 'rotateY(-55deg) rotateX(3deg) scale(1.05)';

    // 磨砂玻璃面板淡出
    const frostedPanel = document.querySelector('.frosted-panel');
    frostedPanel.style.transition = 'opacity 0.4s ease';
    frostedPanel.style.opacity = '0';

    // 动画完成后回调
    setTimeout(function() {
        if (onComplete) onComplete();
    }, 1000);
}

// ===== 视频加载逻辑 =====
(function initVideoBackground() {
    const video = document.querySelector('.bg-video');
    const fallback = document.querySelector('.bg-fallback');

    // 检查 video 是否有 source（视频文件是否就绪）
    if (!video.querySelector('source')) {
        // 视频未就绪，保持 fallback 显示
        return;
    }

    video.addEventListener('loadeddata', function() {
        video.classList.add('loaded');
    });

    // 如果视频已经缓存就绪
    if (video.readyState >= 2) {
        video.classList.add('loaded');
    }
})();
```

- [ ] **Step 6: 验证 JS 功能**

在浏览器打开 `index.html`，确认：
- 标题逐字动画播放
- 粒子漂浮
- 输入姓名密码，点登录 → 弹窗提示"暂无注册用户"（因为还没注册）
- 点注册 → 注册成功
- 注册后用相同账号登录 → 书本打开动画 → 跳转到 home.html
- 已登录状态再次打开 index.html → 自动跳转到 home.html

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: migrate login/register JS logic, add book open animation, video load handler"
```

---

### Task 7: 弹窗样式 + 最终整合验证

**Files:**
- Edit: `index.html` — 弹窗 CSS

- [ ] **Step 1: 写弹窗 CSS**

```css
/* ===== 弹窗 ===== */
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal.show {
    display: flex;
}

.modal-content {
    background: linear-gradient(135deg, #fff8e7, #ffefd5);
    padding: 30px 40px;
    border-radius: 16px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(180, 140, 80, 0.2);
    text-align: center;
    max-width: 380px;
    animation: modalPopIn 0.3s ease;
}

@keyframes modalPopIn {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
}

.modal-title {
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 24px;
    color: #8B5A2B;
    margin-bottom: 15px;
}

.modal-message {
    font-size: 16px;
    color: #5d4e37;
    line-height: 1.7;
    margin-bottom: 20px;
}

.modal-btn {
    padding: 12px 36px;
    background: linear-gradient(135deg, #8B5A2B, #6B4226);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'ZCOOL KuaiLe', cursive;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}
.modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 90, 43, 0.35);
}
```

- [ ] **Step 2: 整体功能验证 checklist**

- [ ] 页面加载：标题逐字弹出 ✓
- [ ] 页面加载：书本浮动动画 ✓
- [ ] 页面加载：粒子漂浮 ✓
- [ ] 页面加载：噪点纹理 + 暖光 ✓
- [ ] 页面加载：fallback 渐变背景显示 ✓
- [ ] 鼠标 hover 书本：书本微转 ✓
- [ ] 输入框 focus：边框发光 ✓
- [ ] 空输入点登录：弹窗"请输入姓名" ✓
- [ ] 注册新用户：弹窗"注册成功" ✓
- [ ] 正确密码登录：书本打开动画 → 跳转 home.html ✓
- [ ] 错误密码登录：弹窗"密码错误" ✓
- [ ] 已登录回 index.html：自动跳转 ✓
- [ ] 移动端 (< 768px)：布局缩小不溢出 ✓
- [ ] 移动端 (< 480px)：书本居中 ✓

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add modal styles, complete login page redesign"
```

---

### Task 8: 视频接入（用户生成视频后再做）

**Files:**
- Edit: `index.html:15` — 取消注释 `<source>` 标签
- Place: `resource/video/robot-running.mp4`

- [ ] **Step 1: 放置视频文件**

用户将生成的视频文件放到 `resource/video/robot-running.mp4`

- [ ] **Step 2: 启用视频标签**

将 index.html 中的：
```html
<!-- 视频就绪后取消注释: <source src="resource/video/robot-running.mp4" type="video/mp4"> -->
```
替换为：
```html
<source src="resource/video/robot-running.mp4" type="video/mp4">
```

- [ ] **Step 3: 验证视频循环播放**

打开 index.html，确认：
- 视频加载完成后淡入（fallback 渐变淡出）
- 视频循环播放，无卡顿
- 噪点纹理和暖光叠加在视频之上

- [ ] **Step 4: Commit**

```bash
git add index.html resource/video/robot-running.mp4
git commit -m "feat: enable background video with seamless loop"
```

---

## 备注

- 所有登录/注册 API 调用逻辑与旧版完全一致，仅改动登录成功后增加了一个书本打开动画（`triggerBookOpenAnimation`）再跳转
- 旧版 index.html 中的 canvas 跑酷小游戏已移除（被全屏视频替代）
- 旧版中的倒立城市、跑道、跨栏等纯 CSS 插画元素已全部移除
- `backdrop-filter` 在不支持的浏览器上会降级为无模糊效果（半透明背景仍然可用）
