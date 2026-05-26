"""Update carousel HTML and JS in course.html"""
import re

with open('c:/Users/13241/Desktop/导学单网站/course.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===== 1. Replace carousel HTML =====
old_html_start = '<h4>活动二：前沿应用观察</h4><div id="appCarousel"'
old_html_end = 'id="appModalImg" src="" style="max-width: 90%; max-height: 90%; border-radius: 8px;"></div>'

new_html = """<h4>活动二：前沿应用观察</h4>
<div id="appCarousel" class="app-carousel-wrapper" onclick="openAppModal()" onmouseenter="pauseAppCarousel()" onmouseleave="resumeAppCarousel()">
  <div class="app-carousel-track" id="appCarouselTrack"></div>
  <div class="app-carousel-overlay"></div>
  <div class="app-carousel-caption" id="appCarouselCaption"></div>
  <div class="app-carousel-progress"><div class="app-carousel-progress-bar" id="appCarouselProgressBar"></div></div>
  <div class="app-carousel-dots" id="appCarouselDots"></div>
  <div class="app-carousel-arrow prev" onclick="event.stopPropagation();prevAppSlide()">&#10094;</div>
  <div class="app-carousel-arrow next" onclick="event.stopPropagation();nextAppSlide()">&#10095;</div>
</div>
<div id="appModal" class="app-carousel-modal" onclick="closeAppModal()">
  <img id="appModalImg" src="">
</div>"""

# Find and replace the carousel HTML block in content
idx_start = content.find(old_html_start)
if idx_start == -1:
    print("ERROR: old_html_start not found")
    exit(1)

idx_end = content.find(old_html_end, idx_start)
if idx_end == -1:
    print("ERROR: old_html_end not found")
    exit(1)
idx_end += len(old_html_end)

old_block = content[idx_start:idx_end]
content = content.replace(old_block, new_html, 1)
print(f"HTML replacement OK (old length={len(old_block)}, new length={len(new_html)})")

# ===== 2. Replace carousel JS =====
old_js_start = "        // 前沿应用轮播相关变量"
old_js_end = """        // 关闭应用模态框
        function closeAppModal() {
            const modal = document.getElementById('appModal');
            modal.style.display = 'none';
        }"""

new_js = """        // ========== 前沿应用轮播 ==========
        const appCarouselData = [
            { img: 'resource/多模态问答.png', caption: '多模态问答：看图提问智能解答' },
            { img: 'resource/多模态生成.png', caption: '多模态生成：文字秒变创意图画' },
            { img: 'resource/多模态融合.PNG', caption: '多模态融合：人脸语音手势控制家居' }
        ];
        let currentAppIndex = 0;
        let appCarouselInterval = null;
        let appCarouselPaused = false;

        function initAppCarousel() {
            const track = document.getElementById('appCarouselTrack');
            const caption = document.getElementById('appCarouselCaption');
            const dots = document.getElementById('appCarouselDots');
            if (!track || !caption || !dots) {
                setTimeout(initAppCarousel, 200);
                return;
            }

            track.innerHTML = appCarouselData.map((item, i) => `
                <div class="app-carousel-slide${i === 0 ? ' active' : ''}" data-index="${i}">
                    <img class="app-carousel-slide-img" src="${item.img}" alt="${item.caption}">
                </div>
            `).join('');

            caption.textContent = appCarouselData[0].caption;

            dots.innerHTML = appCarouselData.map((_, i) => `
                <span class="app-carousel-dot${i === 0 ? ' active' : ''}" onclick="event.stopPropagation();goToAppSlide(${i})"></span>
            `).join('');

            startAppCarouselAuto();
        }

        function startAppCarouselAuto() {
            stopAppCarouselAuto();
            const bar = document.getElementById('appCarouselProgressBar');
            if (bar) {
                bar.classList.remove('running');
                void bar.offsetWidth;
                bar.classList.add('running');
            }
            appCarouselInterval = setInterval(() => {
                currentAppIndex = (currentAppIndex + 1) % appCarouselData.length;
                goToAppSlide(currentAppIndex);
            }, 4000);
        }

        function stopAppCarouselAuto() {
            if (appCarouselInterval) { clearInterval(appCarouselInterval); appCarouselInterval = null; }
        }

        function resetProgressBar() {
            const bar = document.getElementById('appCarouselProgressBar');
            if (!bar) return;
            bar.classList.remove('running');
            void bar.offsetWidth;
            bar.classList.add('running');
        }

        function goToAppSlide(index) {
            const track = document.getElementById('appCarouselTrack');
            const caption = document.getElementById('appCarouselCaption');
            if (!track) return;

            const slides = track.querySelectorAll('.app-carousel-slide');
            const dots = document.querySelectorAll('#appCarouselDots .app-carousel-dot');

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            caption.textContent = appCarouselData[index].caption;
            currentAppIndex = index;
            resetProgressBar();
        }

        function prevAppSlide() {
            currentAppIndex = (currentAppIndex - 1 + appCarouselData.length) % appCarouselData.length;
            goToAppSlide(currentAppIndex);
        }

        function nextAppSlide() {
            currentAppIndex = (currentAppIndex + 1) % appCarouselData.length;
            goToAppSlide(currentAppIndex);
        }

        function pauseAppCarousel() {
            appCarouselPaused = true;
            stopAppCarouselAuto();
            const bar = document.getElementById('appCarouselProgressBar');
            if (bar) bar.classList.remove('running');
        }

        function resumeAppCarousel() {
            appCarouselPaused = false;
            startAppCarouselAuto();
        }

        function openAppModal() {
            const modal = document.getElementById('appModal');
            const modalImg = document.getElementById('appModalImg');
            modalImg.src = appCarouselData[currentAppIndex].img;
            modal.classList.add('show');
        }

        function closeAppModal() {
            const modal = document.getElementById('appModal');
            modal.classList.remove('show');
        }"""

# Find and replace the JS block
idx_js_start = content.find(old_js_start)
if idx_js_start == -1:
    print("ERROR: old_js_start not found")
    # Try alternative start patterns
    alt = "// 前沿应用轮播相关变量"
    idx_js_start = content.find(alt)
    if idx_js_start >= 0:
        print("Found with alt pattern at", idx_js_start)
    else:
        exit(1)

# Find the exact old_js_start with whitespace
# The pattern starts at a line beginning, so find the beginning of that line
line_start = content.rfind('\n', 0, idx_js_start) + 1
print(f"JS block line start: {line_start}")

idx_js_end = content.find(old_js_end, idx_js_start)
if idx_js_end == -1:
    print("ERROR: old_js_end not found in file (may already be replaced)")
    exit(1)
idx_js_end += len(old_js_end)

old_js_block = content[idx_js_start:idx_js_end]
content = content.replace(old_js_block, new_js, 1)
print(f"JS replacement OK (old length={len(old_js_block)}, new length={len(new_js)})")

# Write back
with open('c:/Users/13241/Desktop/导学单网站/course.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("DONE - course.html updated successfully")
