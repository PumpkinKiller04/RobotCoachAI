// 游戏常量
const GAME_CONSTANTS = {
    WIDTH: 800,
    HEIGHT: 300,
    GRAVITY: 0.6,
    JUMP_FORCE: -12,
    GROUND_Y: 200,
    BASE_SPEED: 5,
    MAX_SPEED: 12,
    SPEED_INCREMENT: 0.01
};

// 游戏模式
const GAME_MODES = {
    PLAYER: 1,
    AI_TRAINING: 2,
    AI_DISPLAY: 3
};

let currentMode = GAME_MODES.PLAYER;

// 游戏状态
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

let gameState = GAME_STATES.START;
let score = 0;
let highScore = 0;
let currentSpeed = GAME_CONSTANTS.BASE_SPEED;
let scoreTimer = 0;
let scoreInterval = 100; // 每100ms增加1分，即每秒10分
let speedTimer = 0;
let speedInterval = 3000; // 每3秒增加一次速度

// Q-learning算法参数
const Q_LEARNING = {
    LEARNING_RATE: 0.1,
    DISCOUNT_FACTOR: 0.95,
    EXPLORATION_RATE: 0.1,
    EXPLORATION_DECAY: 0.999,
    MIN_EXPLORATION: 0.01
};

// Q表
let qTable = {};

// AI训练相关变量
let aiAttempts = 0;
let aiHighScore = 0;
let aiScore = 0;

// 状态空间参数
const STATE_PARAMS = {
    DISTANCE_BUCKETS: 10, // 距离分桶数
    SPEED_BUCKETS: 5, // 速度分桶数
    MAX_DISTANCE: 300 // 最大检测距离
};

// 游戏对象
let robot = {
    x: 50,
    y: GAME_CONSTANTS.GROUND_Y,
    width: 50,
    height: 50,
    velocity: 0,
    isJumping: false,
    frame: 0
};

let obstacles = [];
let obstaclesTimer = 0;
let obstaclesInterval = 1500;

// 画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM 元素
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startScreenElement = document.getElementById('startScreen');
const restartButton = document.getElementById('restartButton');

// 事件监听
restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// 触摸事件支持
canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });

// 处理画布触摸开始
function handleTouchStart(event) {
    event.preventDefault();
    if (gameState === GAME_STATES.PLAYING && !robot.isJumping) {
        jump();
    }
}

// 处理全局触摸开始（用于开始游戏和重新开始）
function handleGlobalTouchStart(event) {
    if (gameState === GAME_STATES.START) {
        gameState = GAME_STATES.PLAYING;
        startScreenElement.style.display = 'none';
    } else if (gameState === GAME_STATES.GAME_OVER) {
        restartGame();
    }
}

// 模式切换按钮事件
document.getElementById('mode1Button').addEventListener('click', () => switchMode(GAME_MODES.PLAYER));
document.getElementById('mode2Button').addEventListener('click', () => switchMode(GAME_MODES.AI_TRAINING));
document.getElementById('mode3Button').addEventListener('click', () => switchMode(GAME_MODES.AI_DISPLAY));

// 切换游戏模式
function switchMode(mode) {
    currentMode = mode;
    
    // 更新按钮状态
    document.getElementById('mode1Button').classList.remove('active');
    document.getElementById('mode2Button').classList.remove('active');
    document.getElementById('mode3Button').classList.remove('active');
    
    if (mode === GAME_MODES.PLAYER) {
        document.getElementById('mode1Button').classList.add('active');
        document.getElementById('aiStats').style.display = 'none';
        document.querySelector('.instructions').textContent = '按空格键或↑键跳跃';
    } else if (mode === GAME_MODES.AI_TRAINING) {
        document.getElementById('mode2Button').classList.add('active');
        document.getElementById('aiStats').style.display = 'flex';
        document.querySelector('.instructions').textContent = 'AI正在自动训练...';
        resetAiTraining();
    } else if (mode === GAME_MODES.AI_DISPLAY) {
        document.getElementById('mode3Button').classList.add('active');
        document.getElementById('aiStats').style.display = 'none';
        document.querySelector('.instructions').textContent = 'AI正在展示学习成果...';
    }
    
    // 重置游戏
    restartGame();
}

// 键盘状态
let keys = {};

// 处理键盘按下
function handleKeyDown(event) {
    keys[event.code] = true;
    
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (gameState === GAME_STATES.START) {
            gameState = GAME_STATES.PLAYING;
            startScreenElement.style.display = 'none';
        } else if (gameState === GAME_STATES.PLAYING && !robot.isJumping) {
            jump();
        } else if (gameState === GAME_STATES.GAME_OVER) {
            restartGame();
        }
    }
}

// 处理键盘释放
function handleKeyUp(event) {
    keys[event.code] = false;
}

// 游戏循环
function gameLoop(timestamp) {
    // 清除画布
    ctx.clearRect(0, 0, GAME_CONSTANTS.WIDTH, GAME_CONSTANTS.HEIGHT);
    
    // 绘制背景
    drawBackground();
    
    // 处理AI模式
    let previousState = null;
    let action = null;
    
    if (currentMode === GAME_MODES.AI_TRAINING || currentMode === GAME_MODES.AI_DISPLAY) {
        previousState = getState();
        action = aiTakeAction();
    }
    
    // 根据游戏状态执行不同操作
    switch (gameState) {
        case GAME_STATES.START:
            drawRobot();
            break;
        case GAME_STATES.PLAYING:
            // 定时增加速度
            speedTimer += 16;
            if (speedTimer >= speedInterval && currentSpeed < GAME_CONSTANTS.MAX_SPEED) {
                currentSpeed += GAME_CONSTANTS.SPEED_INCREMENT * 10;
                speedTimer = 0;
            }
            
            updateRobot();
            drawRobot();
            updateObstacles();
            drawObstacles();
            checkCollision();
            updateScore();
            
            // AI训练逻辑
            if (currentMode === GAME_MODES.AI_TRAINING && previousState && action) {
                const nextState = getState();
                const reward = calculateReward();
                updateQTable(previousState, action, reward, nextState);
                
                // 衰减探索率
                if (Q_LEARNING.EXPLORATION_RATE > Q_LEARNING.MIN_EXPLORATION) {
                    Q_LEARNING.EXPLORATION_RATE *= Q_LEARNING.EXPLORATION_DECAY;
                }
            }
            break;
        case GAME_STATES.GAME_OVER:
            drawRobot();
            drawObstacles();
            
            // AI训练模式：自动重置
            if (currentMode === GAME_MODES.AI_TRAINING) {
                // 更新训练数据
                aiAttempts++;
                if (score > aiHighScore) {
                    aiHighScore = score;
                }
                
                // 更新显示
                document.getElementById('attempts').textContent = aiAttempts;
                document.getElementById('aiHighScore').textContent = aiHighScore;
                
                // 重置游戏
                restartGame();
            } else {
                showGameOver();
            }
            break;
    }
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 绘制背景
function drawBackground() {
    // 绘制天空
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, GAME_CONSTANTS.WIDTH, GAME_CONSTANTS.GROUND_Y);
    
    // 绘制地面
    ctx.fillStyle = '#333';
    ctx.fillRect(0, GAME_CONSTANTS.GROUND_Y, GAME_CONSTANTS.WIDTH, GAME_CONSTANTS.HEIGHT - GAME_CONSTANTS.GROUND_Y);
    
    // 绘制网格线
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_CONSTANTS.WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_CONSTANTS.GROUND_Y);
        ctx.stroke();
    }
    for (let y = 0; y < GAME_CONSTANTS.GROUND_Y; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_CONSTANTS.WIDTH, y);
        ctx.stroke();
    }
}

// 绘制机器人
function drawRobot() {
    // 机器人身体
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(robot.x, robot.y - robot.height, robot.width, robot.height);
    
    // 机器人头部
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(robot.x + 15, robot.y - robot.height - 15, 20, 15);
    
    // 机器人眼睛
    ctx.fillStyle = '#000';
    ctx.fillRect(robot.x + 20, robot.y - robot.height - 10, 5, 5);
    ctx.fillRect(robot.x + 25, robot.y - robot.height - 10, 5, 5);
    
    // 机器人手臂
    if (robot.isJumping) {
        // 跳跃时的手臂姿势
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(robot.x - 5, robot.y - robot.height + 10, 5, 15);
        ctx.fillRect(robot.x + robot.width, robot.y - robot.height + 10, 5, 15);
    } else {
        // 跑步时的手臂姿势
        ctx.fillStyle = '#00ff00';
        if (robot.frame % 2 === 0) {
            ctx.fillRect(robot.x - 5, robot.y - robot.height + 5, 5, 15);
            ctx.fillRect(robot.x + robot.width, robot.y - robot.height + 15, 5, 15);
        } else {
            ctx.fillRect(robot.x - 5, robot.y - robot.height + 15, 5, 15);
            ctx.fillRect(robot.x + robot.width, robot.y - robot.height + 5, 5, 15);
        }
    }
    
    // 机器人腿部
    if (!robot.isJumping) {
        if (robot.frame % 2 === 0) {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(robot.x + 10, robot.y, 10, 15);
            ctx.fillRect(robot.x + 30, robot.y - 5, 10, 15);
        } else {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(robot.x + 10, robot.y - 5, 10, 15);
            ctx.fillRect(robot.x + 30, robot.y, 10, 15);
        }
    }
    
    // 更新帧计数器
    robot.frame++;
}

// 更新机器人
function updateRobot() {
    // 应用重力
    robot.velocity += GAME_CONSTANTS.GRAVITY;
    robot.y += robot.velocity;
    
    // 确保机器人不会掉出屏幕
    if (robot.y > GAME_CONSTANTS.GROUND_Y) {
        robot.y = GAME_CONSTANTS.GROUND_Y;
        robot.velocity = 0;
        robot.isJumping = false;
    }
}

// 跳跃
function jump() {
    robot.velocity = GAME_CONSTANTS.JUMP_FORCE;
    robot.isJumping = true;
}

// 创建障碍物
function createObstacle() {
    const obstacleTypes = [
        { width: 30, height: 40, color: '#ff0000', type: 'ground' },  // 红色地面障碍物
        { width: 40, height: 30, color: '#ffaa00', type: 'ground' },  // 黄色地面障碍物
        { width: 25, height: 50, color: '#0000ff', type: 'ground' },  // 蓝色地面障碍物
        { width: 100, height: 20, color: '#ff00ff', type: 'beam', y: GAME_CONSTANTS.GROUND_Y - 100 }  // 紫色横梁障碍物，提高位置
    ];
    
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    obstacles.push({
        x: GAME_CONSTANTS.WIDTH,
        y: type.type === 'beam' ? type.y : GAME_CONSTANTS.GROUND_Y - type.height,
        width: type.width,
        height: type.height,
        color: type.color,
        type: type.type,
        speed: currentSpeed
    });
}

// 更新障碍物
function updateObstacles() {
    obstaclesTimer += 16; // 假设每帧16ms
    
    if (obstaclesTimer >= obstaclesInterval) {
        createObstacle();
        obstaclesTimer = 0;
        
        // 根据速度调整障碍物间隔
        if (currentSpeed < GAME_CONSTANTS.BASE_SPEED + 2) {
            // 前期速度慢时，间隔较小且固定
            obstaclesInterval = 1000;
        } else {
            // 后期速度快时，间隔随机
            obstaclesInterval = 800 + Math.random() * 600; // 800-1400ms之间随机
        }
    }
    
    // 更新障碍物位置
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;
        
        // 移除屏幕外的障碍物
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// 绘制障碍物
function drawObstacles() {
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // 为障碍物添加细节
        ctx.fillStyle = '#000';
        ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
    }
}

// 检查碰撞
function checkCollision() {
    for (let obstacle of obstacles) {
        if (obstacle.type === 'beam') {
            // 横梁障碍物：跳跃时碰到会死亡
            if (
                robot.x < obstacle.x + obstacle.width &&
                robot.x + robot.width > obstacle.x &&
                robot.y - robot.height < obstacle.y + obstacle.height &&
                robot.isJumping
            ) {
                gameState = GAME_STATES.GAME_OVER;
                break;
            }
        } else {
            // 地面障碍物：正常碰撞检测
            if (
                robot.x < obstacle.x + obstacle.width &&
                robot.x + robot.width > obstacle.x &&
                robot.y - robot.height < obstacle.y + obstacle.height &&
                robot.y > obstacle.y
            ) {
                gameState = GAME_STATES.GAME_OVER;
                break;
            }
        }
    }
}

// 更新得分
function updateScore() {
    scoreTimer += 16;
    if (scoreTimer >= scoreInterval) {
        score++;
        scoreElement.textContent = score;
        scoreTimer = 0;
    }
}

// 显示游戏结束画面
function showGameOver() {
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
    
    // 更新最高分
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
}

// 重新开始游戏
function restartGame() {
    gameState = GAME_STATES.PLAYING;
    score = 0;
    scoreElement.textContent = score;
    currentSpeed = GAME_CONSTANTS.BASE_SPEED;
    robot.y = GAME_CONSTANTS.GROUND_Y;
    robot.velocity = 0;
    robot.isJumping = false;
    obstacles = [];
    obstaclesTimer = 0;
    obstaclesInterval = 1500;
    gameOverElement.style.display = 'none';
    startScreenElement.style.display = 'none';
}

// 获取当前状态
function getState() {
    // 找到最近的障碍物
    let closestObstacle = null;
    let minDistance = Infinity;
    
    for (let obstacle of obstacles) {
        if (obstacle.x > robot.x && obstacle.x - robot.x < minDistance) {
            minDistance = obstacle.x - robot.x;
            closestObstacle = obstacle;
        }
    }
    
    // 计算状态特征
    let distanceBucket = 0;
    if (closestObstacle) {
        // 将距离分桶
        distanceBucket = Math.min(
            STATE_PARAMS.DISTANCE_BUCKETS - 1,
            Math.floor(minDistance / (STATE_PARAMS.MAX_DISTANCE / STATE_PARAMS.DISTANCE_BUCKETS))
        );
    }
    
    // 将速度分桶
    let speedBucket = Math.min(
        STATE_PARAMS.SPEED_BUCKETS - 1,
        Math.floor((currentSpeed - GAME_CONSTANTS.BASE_SPEED) / ((GAME_CONSTANTS.MAX_SPEED - GAME_CONSTANTS.BASE_SPEED) / STATE_PARAMS.SPEED_BUCKETS))
    );
    
    // 跳跃状态
    let jumpState = robot.isJumping ? 1 : 0;
    
    // 返回状态字符串
    return `${distanceBucket},${speedBucket},${jumpState}`;
}

// 选择动作
function selectAction(state) {
    // 探索与利用
    if (Math.random() < Q_LEARNING.EXPLORATION_RATE && currentMode === GAME_MODES.AI_TRAINING) {
        // 探索：随机选择动作
        return Math.random() > 0.5 ? 'jump' : 'wait';
    } else {
        // 利用：选择Q值最大的动作
        if (!qTable[state]) {
            qTable[state] = { jump: 0, wait: 0 };
        }
        return qTable[state].jump > qTable[state].wait ? 'jump' : 'wait';
    }
}

// 更新Q表
function updateQTable(state, action, reward, nextState) {
    if (!qTable[state]) {
        qTable[state] = { jump: 0, wait: 0 };
    }
    
    if (!qTable[nextState]) {
        qTable[nextState] = { jump: 0, wait: 0 };
    }
    
    // Q-learning更新公式
    const bestNextAction = qTable[nextState].jump > qTable[nextState].wait ? 'jump' : 'wait';
    const tdTarget = reward + Q_LEARNING.DISCOUNT_FACTOR * qTable[nextState][bestNextAction];
    const tdError = tdTarget - qTable[state][action];
    qTable[state][action] += Q_LEARNING.LEARNING_RATE * tdError;
}

// 计算奖励
function calculateReward() {
    let reward = 0;
    
    // 存活奖励
    reward += 0.1;
    
    // 得分奖励
    reward += score * 0.01;
    
    // 碰撞惩罚
    if (gameState === GAME_STATES.GAME_OVER) {
        reward -= 10;
    }
    
    return reward;
}

// AI执行动作
function aiTakeAction() {
    if (currentMode === GAME_MODES.AI_TRAINING || currentMode === GAME_MODES.AI_DISPLAY) {
        const state = getState();
        const action = selectAction(state);
        
        if (action === 'jump' && !robot.isJumping) {
            jump();
        }
        
        return action;
    }
    return null;
}

// 重置AI训练
function resetAiTraining() {
    aiAttempts = 0;
    aiHighScore = 0;
    document.getElementById('attempts').textContent = aiAttempts;
    document.getElementById('aiHighScore').textContent = aiHighScore;
}

// 开始游戏循环
requestAnimationFrame(gameLoop);