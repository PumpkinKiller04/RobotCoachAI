# 登录页重设计 — 设计文档

## 概述

将登录页从纯 CSS 插画风格改为「像素乐高机器人跑步视频背景 + 漂浮立体书 + 磨砂玻璃」的高互动感设计。登录页和课程页通过「书本打开」动画形成连贯叙事。

## 设计方向

**风格关键词**：乐高像素、活泼灵动、磨砂玻璃、立体书、颗粒质感
**色彩基调**：蓝白机器人 + 暖棕色书本 + 自然过渡背景
**核心记忆点**：左下角永远在跑步的蓝白小机器人

---

## 一、画面构图

```
┌──────────────────────────────────────────┐
│  ☁️                              ☁️      │
│                                          │
│  机器人总教练请就位                        │
│  从「醉汉走路」到跑赢人类                   │
│                                          │
│                              ┌──────┐    │
│                              │ 登录  │    │
│  🤖 → → →                    │ 姓名  │    │
│  [机器人跑步区域]              │ 密码  │    │
│                              │[登录] │    │
│                              │[注册] │    │
│                              └──────┘    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
└──────────────────────────────────────────┘
```

- **左上区域**：标题 + 副标题
- **左下区域**：蓝白机器人跑步（占画面约 1/4，不遮挡中间和右侧）
- **右侧中部**：漂浮的 3D 闭合立体书，封面嵌磨砂玻璃登录面板
- **整体背景**：全屏循环视频（操场→城市→操场）

## 二、背景视频规格

### 视频技术要求

| 项目 | 规格 |
|------|------|
| 分辨率 | 1920×1080（16:9） |
| 帧率 | 24fps 或 30fps |
| 时长 | 12-20 秒（一个完整循环） |
| 循环 | 首尾无缝衔接 |
| 格式 | MP4 (H.264) 或 WebM |
| 风格 | 像素艺术 / 乐高积木风格 2D 横版卷轴 |

### 核心动画描述

画面是一个横向卷轴场景，镜头跟随一个蓝白配色的乐高/像素风机器人从左向右匀速跑步。背景持续向左滚动，机器人保持在画面**左下角 1/4 区域**（大约画面左侧 25%-30% 的位置，底部偏上一点）。

机器人跑步姿态：
- 双腿交替摆动，双臂前后摆臂
- 身体微微前倾，有弹跳感
- 蓝色头盔/帽子，白色身体主色，蓝色四肢或装饰
- 脸部是像素风格的简单五官

障碍物跳跃：
- 跑道上随机出现低矮障碍物（跨栏、小石块、路障锥）
- 机器人接近障碍物时跳起越过
- 跳跃高度约为机器人身高的 1.5 倍
- 落地时地面有微小像素碎片迸溅

### 背景过渡（完整循环）

整个背景从左向右（或从右向左）平滑滚动，形成三段连续过渡：

**阶段 1 — 学校操场（约 40% 时长）**
- 画面元素：红色塑胶跑道、绿色草坪、操场围栏、远处教学楼（米白色+红砖）、旗杆和国旗、篮球架、几棵绿树
- 色彩基调：蓝天 + 绿色草坪 + 红色跑道 + 米色教学楼
- 机器人脚下是红色跑道纹理

**阶段 2 — 过渡带（约 10-15% 时长）**
- 操场元素逐渐减少，道路变宽，路灯出现
- 树木从绿色变为行道树
- 远处出现低矮建筑，逐渐变高
- 地面从跑道→人行道→柏油马路

**阶段 3 — 城市高楼（约 40% 时长）**
- 画面元素：玻璃幕墙高楼（蓝色/灰色调）、霓虹招牌（像素风发光）、天桥、路灯、行道树、远处有更多高楼剪影
- 色彩基调：深蓝天空 + 灰色/蓝色建筑 + 霓虹点缀（暖黄/品红小像素块）
- 机器人脚下是灰色柏油马路，有白色虚线车道线

**阶段 4 — 过渡回操场（约 10-15% 时长）**
- 城市元素退去，建筑变矮，绿色逐渐回归
- 过渡方式与阶段 2 对称但反向

**循环衔接**：视频最后一帧 = 第一帧（操场场景完全相同），实现无限循环。

## 三、视频生成提示词

### 推荐工具

按效果排序：**Runway Gen-4** > **Kling 2.0** > **Luma Dream Machine** > **Pika 2.0**

Runway 和 Kling 在对镜头控制、循环衔接和风格一致性上表现最好。

---

### 提示词 A（用于 Runway Gen-4 / Kling 2.0 — 完整视频）

```
[Shot type: side-scrolling 2D pixel art animation, continuous smooth horizontal pan, seamless looping]

A blue-and-white LEGO-style pixel art robot with a blue helmet, white body, blue limbs, and simple pixel-art face is running from left to right across the screen. The robot stays positioned in the lower-left quarter of the frame. The robot's legs and arms swing in a running cycle, body slightly leaning forward with a bouncy gait.

The background is a continuous horizontal scrolling scene that seamlessly loops:

[SCENE 1 - SCHOOL PLAYGROUND]
Red running track under the robot's feet, green grass field, white school buildings with red brick accents in the distance, a flagpole with a small flag, basketball courts, green trees. Sky is light blue with pixel-art clouds. Bright daytime lighting.

[TRANSITION ZONE]
The track gradually fades into gray pavement, trees shift to street trees, low buildings appear and grow taller, street lamps emerge.

[SCENE 2 - CITY SKYSCRAPERS]
Tall glass skyscrapers in blue-gray tones, pixel-art neon signs glowing in warm yellow and magenta, overhead pedestrian bridge, street lamps, road with white dashed lane lines under the robot. Sky shifts to deeper blue. Buildings have lit windows (small yellow pixel blocks).

[TRANSITION BACK]
Buildings shrink back down, greenery returns, gray pavement transitions back to red running track, school buildings reappear.

The robot occasionally jumps over small obstacles (hurdles, small rocks, traffic cones) with a smooth arc jump. When landing, tiny pixel particles burst from the ground.

Style: 16-bit pixel art aesthetics, LEGO blocky character design, vibrant but slightly muted color palette, subtle film grain texture. Clean pixel edges. Japanese RPG overworld animation style.

Technical: 1920x1080, 16:9 aspect ratio, smooth 30fps scrolling, first frame exactly matches last frame for perfect infinite loop.
```

---

### 提示词 B（简化版，用于 Pika / Luma — 如果 A 太复杂就拆成这个）

```
Side-scrolling pixel art animation, seamless loop. A cute blue-and-white LEGO robot with a blue helmet runs from left to right in the bottom-left of the frame. The background scrolls horizontally: starting with a school playground (red track, green field, school buildings, blue sky), transitioning smoothly into a city with tall glass skyscrapers and pixel neon signs, then looping back to the playground. The robot occasionally jumps over small hurdles. 16-bit game aesthetic, vibrant colors, clean pixel edges, 1920x1080, 16:9.
```

---

### 提示词 C（分段生成 + 后期拼接 — 最终兜底方案）

如果单段生成效果不好，分成 4 段分别生成再剪辑拼接：

**C1 — 操场段（5-6 秒）**
```
Pixel art side-scrolling animation. A blue-and-white LEGO robot runs on a red running track. Background: school playground with green grass, white school buildings, flagpole, basketball court, trees. Blue sky with pixel clouds. The robot stays in the lower-left. 16-bit game style, vibrant. 1920x1080.
```

**C2 — 过渡段（2-3 秒）**
```
Pixel art transition sequence. The background scrolls from a school playground into a city. Red track fades to gray road. Green trees become street trees. Buildings grow from low to tall. The blue-and-white robot continues running in the lower-left. Smooth morphing transition. 16-bit style. 1920x1080.
```

**C3 — 城市段（5-6 秒）**
```
Pixel art side-scrolling animation. A blue-and-white LEGO robot runs on a gray asphalt road with white lane dashes. Background: city skyline with tall glass skyscrapers, pixel neon signs (yellow, magenta), street lamps, overpass. Deeper blue sky. The robot stays in the lower-left. 16-bit game style. 1920x1080.
```

**C4 — 过渡回操场（2-3 秒）**
```
Pixel art transition sequence. The background scrolls from a city back into a school playground. Skyscrapers shrink. Gray road becomes red track. Cityscape fades to school buildings and green trees. The blue-and-white robot continues running. Smooth morphing. 16-bit style. 1920x1080.
```

---

### 视频生成注意事项

1. **分辨率一致性**：所有片段必须使用相同的分辨率和帧率生成
2. **色彩一致性**：确保机器人的蓝白配色在所有片段中保持一致——这在 AI 视频生成中是个难点，可能需要多轮调整
3. **循环衔接**：如果用分段方案，C4 的最后一帧必须和 C1 的第一帧视觉上匹配。建议在剪辑软件中做交叉淡化（crossfade）来掩盖衔接
4. **机器人位置稳定性**：多次强调「机器人在左下角」，因为 AI 倾向于把主体放中间
5. **风格锚定**：在提示词中重复「16-bit pixel art」「LEGO blocky character」等关键词来保持风格一致

## 四、前景 UI 层

### 4.1 标题区域

- 位置：画面左上区域（top: 8-12%, left: 6-10%）
- 主标题：「机器人总教练请就位」
- 副标题：「从"醉汉走路"到跑赢人类」
- 字体：像素风格中文字体（如 ZCOOL KuaiLe 或手写像素体）
- 颜色：白色 + 深色阴影，确保在背景视频上可读
- 动画：入场时逐字弹出（像素打字机效果）

### 4.2 漂浮立体书（登录区域）

- 位置：画面右侧中部（top: 20-25%, right: 8-12%）
- 状态：闭合的 3D 立体书，45° 微倾斜
- 尺寸：约 280×340px（桌面端），移动端等比缩小

**书本外观：**
- 封面：暖棕色皮质/布纹质感（#f5e6c8 → #e8d5a3 → #dcc894）
- 书脊：深棕色木纹（#5c3a1e → #8B5A2B），在左侧
- 封面装饰：细金色边框线 + 四角小花纹
- 封面中央：磨砂玻璃面板（frosted glass）

**磨砂玻璃面板：**
- `background: rgba(255,255,255,0.25)` + `backdrop-filter: blur(16px)` + `border: 1.5px solid rgba(255,255,255,0.5)`
- 内含：姓名输入框、密码输入框、登录按钮、注册按钮
- 输入框和按钮风格：圆角、简洁、与书本暖色调协调

**动画：**
- 书本持续轻微上下浮动（±8px, 3s ease-in-out 循环）
- 鼠标 hover：书本微开一条缝（3D transform 模拟封面掀起 5-8°）
- 书本周围有细小金色粒子漂浮（CSS animation 随机延迟）
- 书本投影随浮动动态变化（box-shadow 动画或 JS 动态调整）

**登录成功后过渡：**
- 书本从闭合 → 完全打开（scale + rotateX 动画，约 1.2s）
- 打开后画面放大/淡出，过渡到 course.html

### 4.3 整体氛围层

- 画面覆盖一层极淡的噪点纹理（CSS `background-image` 用 SVG noise filter 或 base64 噪点图）
- 左上角有一道柔和的暖光模拟窗户光（CSS 渐变叠加）
- 书本周围的粒子漂浮（多个小圆点，随机位置 + 随机 animation-delay）

## 五、课程页（course.html）同步改造

与登录页形成连贯叙事——登录页的书「打开」后进入课程页。

### 改造方向

- 当前是简单的棕色 header + 米色 content 的圆角矩形，过于平淡
- 改为：全屏展开的书本，左右两页（左页导航/目录，右页内容）
- 书页有真实的纸张纹理、微卷边效果、中缝阴影
- 整体色调保持暖棕+米色纸张，与登录页的立体书呼应
- 翻页动画：章节切换时书页翻动（CSS 3D page flip）

### 技术要点

- 保持现有功能逻辑不变（课程切换、导学单内容、多模态体验站等）
- 只改 UI 层（CSS + 少量 DOM 结构调整）
- 移动端：书本改为单栏布局，书脊在顶部

## 六、技术实现方案

### 视频加载策略

- 视频文件放在 `resource/video/` 目录
- 使用 `<video>` 标签，属性：`autoplay muted loop playsinline`
- 预加载 `preload="auto"`
- 视频加载前显示纯色渐变背景作为 fallback
- 视频加载完成后淡入（opacity 过渡）

### CSS 架构

- 书本 3D 效果：CSS `perspective` + `transform: rotateY() rotateX()`
- 磨砂玻璃：`backdrop-filter: blur()` （注意 Safari 需要 `-webkit-` 前缀）
- 浮动动画：CSS `@keyframes`
- 粒子：多个绝对定位的 `<span>` 或伪元素，各自动画延迟不同
- 噪点纹理：`::after` 伪元素覆盖全屏

### 浏览器兼容

- `backdrop-filter` 在 Firefox 需要确保支持
- 视频自动播放需要 `muted` 属性
- 移动端 `playsinline` 必须
- fallback：不支持 backdrop-filter 时降级为半透明纯色背景

## 七、文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `index.html` | 重写 | 新登录页 HTML + CSS + JS |
| `resource/video/robot-running.mp4` | 新增 | 背景循环视频 |
| `course.html` | 修改 | 书本 UI 改造（保留功能逻辑） |
| `styles/main.css` | 修改 | 如需抽离公共样式 |

---

## 八、待确认事项

1. 视频用哪个 AI 工具生成？（推荐 Runway Gen-4 或 Kling 2.0）
2. 如果单段视频效果不好，是否接受分段生成 + 后期拼接的方案？
3. 课程页的书本改造要和登录页一起做还是分两期？
