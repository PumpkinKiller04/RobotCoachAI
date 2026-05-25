#!/bin/bash
# 自动监控文件变化，一旦有修改就自动 commit 并 push 到 GitHub
# 使用方法：双击 开始自动同步.bat

export PATH="/usr/bin:$PATH"
cd "$(dirname "$0")"

echo "[auto-push] 开始监控文件变化..."

while true; do
  if [[ -n $(git status --porcelain) ]]; then
    sleep 3  # 等3秒防止频繁提交
    git add -A
    git commit -m "auto: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null
    if [ $? -eq 0 ]; then
      git push origin main 2>&1 && echo "[auto-push] 已推送 - $(date '+%H:%M:%S')"
    fi
  fi
  sleep 5
done
