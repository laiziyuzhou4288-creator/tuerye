/* ========================================
   兔儿爷导览系统 - App Logic
   ======================================== */

let currentPage = 'login';
let map = null;
let mapInitialized = false;
let archiveTimers = [];
let archiveChoiceMade = false;
let archivePhotoObjectUrl = null;

let locationCardOverlay = null;
let archiveDialogueViewport = null;
let archiveDialogueTrack = null;
let archiveMessageIntro = null;
let archiveMessageChoice = null;
let archiveMessageDetail = null;
let archiveModalOverlay = null;
let archiveAskModal = null;
let archiveFeedbackModal = null;
let archiveCameraInput = null;
let archiveFeedbackPhoto = null;
let sharedBottomNav = null;
let visualModalOverlay = null;
let visualFeedbackModal = null;
let visualCameraInput = null;
let visualFeedbackPhoto = null;
let visualPhotoObjectUrl = null;
let visualUploadPreview = null;
let visualUploadIcon = null;
let visualUploadText = null;

/* --- 听觉页面变量 --- */
let hearWaveformCanvas = null;
let hearWaveformCtx = null;
let hearFeedbackWaveformCanvas = null;
let hearFeedbackWaveformCtx = null;
let hearTimer = null;
let hearRecordBtn = null;
let hearStopBtn = null;
let hearSubmitBtn = null;
let hearModalOverlay = null;
let hearFeedbackModal = null;
let hearContinueBtn = null;

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let isPlaying = false;
let audioUrl = null;
let audioElement = null;
let lastAudioBlob = null;
let waveformAnimationId = null;
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;

/* --- 触觉页面变量 --- */
let touchTextarea = null;
let touchSubmitBtn = null;
let touchModalOverlay = null;
let touchFeedbackModal = null;
let touchFeedbackTextDisplay = null;
let touchContinueBtn = null;
let touchShareBtn = null;

/* --- 我的页面变量 --- */
let profileMemoryCard = null;
let profileNoteCard = null;
let memoryGrid = null;
let memoryDetailOverlay = null;
let memoryDetailModal = null;
let memoryDetailPhoto = null;
let memoryDetailTitle = null;
let memoryDetailSubtag = null;
let memoryDetailCloseBtn = null;

/* --- 笔记页面变量 --- */
let noteGrid = null;
let noteDetailOverlay = null;
let noteDetailModal = null;
let noteDetailTitle = null;
let noteDetailSubtag = null;
let noteDetailTag = null;
let noteDetailText = null;
let noteDetailContent = null;
let noteDetailCloseBtn = null;

/* --- 笔记数据 --- */
let exploreNotes = [];
let noteDeleteTargetIndex = null;

/* --- 打卡数据 --- */
let visitedPlaces = [];
let routePlan = { presetId: null, locationIds: [] };
let activeLocationId = null;
let activePresetRouteId = null;
let currentArchiveLocationId = null;
let guideMarkers = new Map();
let guideMascot = null;
let routePlannerPanel = null;
let routeSummaryChip = null;
let routePolylineOuter = null;
let routePolylineInner = null;
let routeSyncToken = 0;
let suppressMapClickUntil = 0;
let activeMarkerNode = null;
let archiveContext = null;

const MAP_FALLBACK_IMAGE = '地点详情.png';
const GUIDE_STORAGE_KEYS = {
    routePlan: 'guideRoutePlan',
    activeLocationId: 'guideActiveLocationId',
    activePresetRouteId: 'guideActivePresetRouteId'
};

const guideLocations = [
    {
        id: 'gongwangfu',
        name: '恭王府',
        type: 'landmark',
        lngLat: [116.3872, 39.9355],
        shortDesc: '清代规模最大、保存最完整的王府建筑群，适合作为什刹海历史线的起点。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['王府', '园林', '历史'],
        archive: {
            hero: '这恭王府来头可不小，今儿咱们可得好好说道说道！',
            intro: '咸丰元年，清廷将此宅邸赐予恭亲王奕訢，自此得名“恭王府”。',
            choiceTitle: '您注意到这里的建筑细节了吗？',
            choicePrimary: '注意到了，很精美',
            choiceSecondary: '再仔细看看',
            detail: '对喽！梁枋、窗棂、砖雕、石栏都透着清代王府的规制，走在里面像是把半部清史踩在了脚下。',
            ask: '关于恭王府的故事咱就讲到这儿，来都来了，要不要顺手拍张照，把这趟王府记下来？',
            feedback: '这张拍得有分量，王府那股庄重劲儿一下就出来了。'
        }
    },
    // ... 其他地点数据保持不变 ...
    {
        id: 'huguosi',
        name: '护国寺小吃',
        type: 'food',
        lngLat: [116.3769, 39.9337],
        shortDesc: '更偏本地口味的一站，适合放进美食路线里做收尾或补给。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['小吃', '本地味', '补给'],
        archive: {
            hero: '护国寺这口吃食，一到点儿就勾人，特别适合给这趟路添点香气。',
            intro: '护国寺小吃承接了北京传统小吃脉络，是许多人逛西城时必停的一站。',
            choiceTitle: '您更偏甜口，还是更想试点咸香的？',
            choicePrimary: '先试甜口',
            choiceSecondary: '先试咸香',
            detail: '美食线走到这儿，重点已经不只是“吃什么”，而是通过一口味道把地方记住。老北京的日常感，往往就藏在这一步里。',
            ask: '要不要拍一张今天的“好味道”，给这条路线留个收尾？',
            feedback: '这张一看就有馋劲儿，路线收得很圆满。'
        }
    }
];

const presetRoutes = [
    {
        id: 'history',
        name: '历史体验',
        description: '从王府、故居到钟鼓楼，适合第一次系统认识什刹海。',
        locationIds: ['gongwangfu', 'songqingling', 'guomoruo', 'yindingqiao', 'belltower']
    },
    {
        id: 'food',
        name: '美食之旅',
        description: '边走边吃，串起老街烟火、临水热闹和本地小吃。',
        locationIds: ['yandaixiejie', 'hehuashichang', 'houhai', 'huguosi']
    },
    {
        id: 'relax',
        name: '放松感受',
        description: '走得慢一些，看水、看街景，也给自己留出发呆的空档。',
        locationIds: ['songqingling', 'houhai', 'yindingqiao', 'yandaixiejie', 'nanluo']
    }
];

/* ========================================
   Toast
   ======================================== */
function showToast(message, duration = 2000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getGuideLocationById(locationId) {
    return guideLocations.find((location) => location.id === locationId) || null;
}

function getPresetRouteById(routeId) {
    return presetRoutes.find((route) => route.id === routeId) || null;
}

function formatRouteType(type) {
    const labelMap = {
        landmark: '景点',
        hutong: '胡同',
        food: '美食',
        relax: '休闲'
    };
    return labelMap[type] || '地点';
}

function formatMemoryDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDistanceScore(pointA, pointB) {
    if (!pointA || !pointB) {
        return 0;
    }
    const dx = pointA[0] - pointB[0];
    const dy = pointA[1] - pointB[1];
    return (dx * dx) + (dy * dy);
}

function getRoutePathScore(locationIds) {
    let total = 0;
    for (let i = 1; i < locationIds.length; i += 1) {
        const prev = getGuideLocationById(locationIds[i - 1]);
        const next = getGuideLocationById(locationIds[i]);
        if (prev && next) {
            total += getDistanceScore(prev.lngLat, next.lngLat);
        }
    }
    return total;
}

function sortRouteLocationsByDirection(locationIds) {
    const uniqueIds = Array.from(new Set(locationIds.filter((locationId) => !!getGuideLocationById(locationId))));
    if (uniqueIds.length <= 2) {
        return uniqueIds;
    }

    const locations = uniqueIds.map((locationId) => getGuideLocationById(locationId)).filter(Boolean);
    const lngValues = locations.map((location) => location.lngLat[0]);
    const latValues = locations.map((location) => location.lngLat[1]);
    const lngRange = Math.max(...lngValues) - Math.min(...lngValues);
    const latRange = Math.max(...latValues) - Math.min(...latValues);
    const sortKeyIndex = lngRange >= latRange ? 0 : 1;
    const secondaryIndex = sortKeyIndex === 0 ? 1 : 0;

    const forward = [...locations]
        .sort((left, right) => {
            const primaryDiff = left.lngLat[sortKeyIndex] - right.lngLat[sortKeyIndex];
            if (Math.abs(primaryDiff) > 0.00001) {
                return primaryDiff;
            }
            return left.lngLat[secondaryIndex] - right.lngLat[secondaryIndex];
        })
        .map((location) => location.id);

    const backward = [...forward].reverse();
    return getRoutePathScore(forward) <= getRoutePathScore(backward) ? forward : backward;
}

function insertLocationWithLeastDetour(routeLocationIds, locationId) {
    const nextRoute = routeLocationIds.filter((id) => id !== locationId);
    if (!nextRoute.length) {
        return [locationId];
    }
    if (nextRoute.length === 1) {
        const first = nextRoute[0];
        const forward = [first, locationId];
        const backward = [locationId, first];
        return getRoutePathScore(forward) <= getRoutePathScore(backward) ? forward : backward;
    }

    let bestRoute = [...nextRoute, locationId];
    let bestScore = Number.POSITIVE_INFINITY;

    for (let insertIndex = 0; insertIndex <= nextRoute.length; insertIndex += 1) {
        const candidate = [...nextRoute];
        candidate.splice(insertIndex, 0, locationId);
        const candidateScore = getRoutePathScore(candidate);
        if (candidateScore < bestScore) {
            bestScore = candidateScore;
            bestRoute = candidate;
        }
    }

    return bestRoute;
}

function saveRoutePlan() {
    try {
        localStorage.setItem(GUIDE_STORAGE_KEYS.routePlan, JSON.stringify(routePlan));
        localStorage.setItem(GUIDE_STORAGE_KEYS.activeLocationId, activeLocationId || '');
        localStorage.setItem(GUIDE_STORAGE_KEYS.activePresetRouteId, activePresetRouteId || '');
    } catch (e) {}
}

function initRoutePlan() {
    try {
        const storedPlan = localStorage.getItem(GUIDE_STORAGE_KEYS.routePlan);
        if (storedPlan) {
            const parsed = JSON.parse(storedPlan);
            if (parsed && Array.isArray(parsed.locationIds)) {
                routePlan = {
                    presetId: parsed.presetId || null,
                    locationIds: parsed.locationIds.filter((id) => !!getGuideLocationById(id))
                };
            }
        }
    } catch (e) {}

    try {
        const storedLocationId = localStorage.getItem(GUIDE_STORAGE_KEYS.activeLocationId);
        activeLocationId = getGuideLocationById(storedLocationId) ? storedLocationId : null;
        const storedPresetRouteId = localStorage.getItem(GUIDE_STORAGE_KEYS.activePresetRouteId);
        activePresetRouteId = getPresetRouteById(storedPresetRouteId) ? storedPresetRouteId : routePlan.presetId;
    } catch (e) {}
}

function isValidPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
}

let countdownTimer = null;

function sendVerificationCode() {
    const phoneInput = document.getElementById('phoneInput');
    const sendBtn = document.getElementById('sendCodeBtn');
    const phone = phoneInput.value.trim();

    if (!phone) {
        showToast('请输入手机号');
        phoneInput.focus();
        return;
    }

    if (!isValidPhone(phone)) {
        showToast('请输入正确的手机号');
        phoneInput.focus();
        return;
    }

    sendBtn.classList.add('disabled');
    let seconds = 60;
    sendBtn.textContent = `${seconds}s`;
    showToast('验证码已发送');

    countdownTimer = setInterval(() => {
        seconds -= 1;
        sendBtn.textContent = `${seconds}s`;

        if (seconds <= 0) {
            clearInterval(countdownTimer);
            sendBtn.textContent = '发送';
            sendBtn.classList.remove('disabled');
        }
    }, 1000);
}

function wechatLogin() {
    showToast('正在跳转微信授权登录...');
    setTimeout(() => {
        showToast('微信登录成功');
        setTimeout(() => navigateToGuide(), 400);
    }, 1000);
}

function handleNext() {
    const phoneInput = document.getElementById('phoneInput');
    const codeInput = document.getElementById('codeInput');
    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();

    if (!phone) {
        showToast('请输入手机号');
        phoneInput.focus();
        return;
    }

    if (!isValidPhone(phone)) {
        showToast('请输入正确的手机号');
        phoneInput.focus();
        return;
    }

    if (!code) {
        showToast('请输入验证码');
        codeInput.focus();
        return;
    }

    if (code.length < 4) {
        showToast('验证码格式不正确');
        codeInput.focus();
        return;
    }

    showToast('登录成功');
    setTimeout(() => navigateToGuide(), 400);
}

function getPage(pageName) {
    if (pageName === 'visual') {
        return document.getElementById('visualPage');
    }
    if (pageName === 'hear') {
        return document.getElementById('hearPage');
    }
    if (pageName === 'touch') {
        return document.getElementById('touchPage');
    }
    if (pageName === 'profile') {
        return document.getElementById('profilePage');
    }
    if (pageName === 'memory') {
        return document.getElementById('memoryPage');
    }
    return document.getElementById(`${pageName}Page`);
}

function updateSharedNav(pageName = currentPage) {
    if (!sharedBottomNav) {
        return;
    }

    const showNav = pageName === 'guide' || pageName === 'sense' || pageName === 'profile';
    sharedBottomNav.classList.toggle('hidden', !showNav);

    const states = {
        sharedTabSense: pageName === 'sense',
        sharedTabGuide: pageName === 'guide',
        sharedTabProfile: pageName === 'profile'
    };

    Object.entries(states).forEach(([id, isActive]) => {
        const tab = document.getElementById(id);
        if (!tab) {
            return;
        }
        const circle = tab.querySelector('.nav-circle');
        tab.classList.toggle('active', isActive);
        circle.classList.toggle('nav-circle-active', isActive);
    });
}

function crossfadePages(fromPage, toPage, nextPageName, onAfterEnter) {
    if (!toPage) {
        return;
    }

    if (!fromPage || fromPage === toPage) {
        document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
        toPage.classList.add('active');
        currentPage = nextPageName;
        updateSharedNav(nextPageName);
        if (typeof onAfterEnter === 'function') {
            onAfterEnter();
        }
        return;
    }

    updateSharedNav(nextPageName);

    toPage.classList.add('crossfade-enter');
    toPage.classList.remove('hidden');
    toPage.style.opacity = '0';

    fromPage.classList.add('crossfade-leave');
    fromPage.style.opacity = '1';

    requestAnimationFrame(() => {
        fromPage.classList.add('is-fading-out');
        toPage.classList.add('is-fading-in');
        toPage.style.opacity = '1';
        fromPage.style.opacity = '0';
    });

    setTimeout(() => {
        fromPage.classList.remove('active', 'crossfade-leave', 'is-fading-out');
        toPage.classList.remove('crossfade-enter', 'is-fading-in');
        fromPage.style.opacity = '';
        toPage.style.opacity = '';
        toPage.classList.add('active');
        currentPage = nextPageName;
        updateSharedNav(nextPageName);

        if (typeof onAfterEnter === 'function') {
            onAfterEnter();
        }
    }, 260);
}

function goToPage(pageName, onAfterEnter) {
    const currentActivePage = document.querySelector('.page.active');
    const nextPage = getPage(pageName);
    crossfadePages(currentActivePage, nextPage, pageName, onAfterEnter);
}

function navigateToGuide() {
    goToPage('guide', () => {
        initMap();
        if (map) {
            setTimeout(() => map && map.resize && map.resize(), 30);
        }
    });
}

function navigateToSense() {
    if (currentPage === 'archive') {
        stopArchiveDialogueSequence();
        hideArchiveModal();
        revokeArchivePhotoUrl();
    }
    if (currentPage === 'hear') {
        cleanupHearRecording();
        hideHearModal();
    }
    if (currentPage === 'touch') {
        hideTouchModal();
    }
    if (currentPage === 'memory') {
        hideMemoryDetail();
    }
    hideVisualModal();
    revokeVisualPhotoUrl();
    goToPage('sense');
}

function navigateToVisual() {
    goToPage('visual');
}

/* --- 听觉导航 --- */
function navigateToHear() {
    goToPage('hear', () => {
        initHearPage();
    });
}

/* --- 触觉导航 --- */
function navigateToTouch() {
    goToPage('touch', () => {
        initTouchPage();
    });
}

/* --- 我的导航 --- */
function navigateToProfile() {
    if (currentPage === 'memory') {
        hideMemoryDetail();
    }
    goToPage('profile', () => {
        updateProfileStats();
    });
}

/* --- 游览回忆导航 --- */
function navigateToMemory() {
    goToPage('memory', () => {
        renderMemoryGrid();
    });
}

function navigateToArchive(locationId = activeLocationId) {
    const targetLocation = getGuideLocationById(locationId) || getGuideLocationById(routePlan.locationIds[0]) || guideLocations[0];
    if (!targetLocation) {
        showToast('暂时还没有可查看的档案');
        return;
    }

    activeLocationId = targetLocation.id;
    currentArchiveLocationId = targetLocation.id;
    archiveContext = targetLocation;
    saveRoutePlan();
    updateArchiveContent(targetLocation);
    hideLocationCard();
    goToPage('archive', startArchiveDialogueSequence);
}

function legacyNavigateToGuideFromArchive() {
    // 如果用户已经拍了照（archivePhotoObjectUrl 不为空），则保存打卡记录
    if (archivePhotoObjectUrl) {
        // 1. 将 Object URL 转换为 base64
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = archivePhotoObjectUrl;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64Image = canvas.toDataURL('image/jpeg'); // 转换为 base64

            // 2. 创建新的打卡记录
            const newMemory = {
                id: Date.now(),
                name: '恭王府', // 可以动态获取地点名称
                image: base64Image, // 使用 base64 图片
                date: '二零二六·腊月', // 可以动态生成当前日期
                desc: '一座恭王府，半部清代史。保存最完整的清代王府建筑群。'
            };

            // 3. 保存到 visitedPlaces
            visitedPlaces.push(newMemory);
            saveVisitedPlaces();
        };
    }

    stopArchiveDialogueSequence();
    hideArchiveModal();
    revokeArchivePhotoUrl();
    navigateToGuide();
}

function switchTab(tabName) {
    switch (tabName) {
        case 'sense':
            if (currentPage !== 'sense') {
                navigateToSense();
            }
            break;
        case 'guide':
            if (currentPage !== 'guide') {
                navigateToGuide();
            }
            break;
        case 'profile':
            if (currentPage !== 'profile') {
                navigateToProfile();
            }
            break;
        default:
            break;
    }
}

function legacyShowLocationCard() {
    if (!locationCardOverlay) {
        return;
    }

    locationCardOverlay.classList.add('visible');
    locationCardOverlay.setAttribute('aria-hidden', 'false');
    const markerPin = document.querySelector('.marker-pin');
    if (markerPin) {
        markerPin.classList.add('is-active');
    }
}

function legacyHideLocationCard() {
    if (!locationCardOverlay) {
        return;
    }

    locationCardOverlay.classList.remove('visible');
    locationCardOverlay.setAttribute('aria-hidden', 'true');
    const markerPin = document.querySelector('.marker-pin');
    if (markerPin) {
        markerPin.classList.remove('is-active');
    }
}

function legacyInitMap() {
    // 已由 initMap 接管，此函数保留仅为兼容旧调用点，不执行任何逻辑
    return;
}

function persistArchiveMemory(base64Image) {
    const targetLocation = getGuideLocationById(currentArchiveLocationId) || archiveContext;
    if (!targetLocation) {
        return;
    }

    visitedPlaces.push({
        id: Date.now(),
        locationId: targetLocation.id,
        name: targetLocation.name,
        image: base64Image || targetLocation.image || MAP_FALLBACK_IMAGE,
        date: formatMemoryDate(),
        desc: targetLocation.shortDesc
    });
    saveVisitedPlaces();
}

function navigateToGuideFromArchive() {
    if (archivePhotoObjectUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = archivePhotoObjectUrl;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            persistArchiveMemory(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = function() {
            persistArchiveMemory(getGuideLocationById(currentArchiveLocationId)?.image || MAP_FALLBACK_IMAGE);
        };
    }

    stopArchiveDialogueSequence();
    hideArchiveModal();
    revokeArchivePhotoUrl();
    navigateToGuide();
}

function setActiveMarker(markerNode) {
    if (activeMarkerNode) {
        activeMarkerNode.classList.remove('is-active');
    }
    activeMarkerNode = markerNode || null;
    if (activeMarkerNode) {
        activeMarkerNode.classList.add('is-active');
    }
}

function updateLocationCard(location) {
    const titleEl = document.querySelector('.location-card-title');
    const descEl = document.querySelector('.location-card-desc');
    const tagsEl = document.getElementById('locationCardTags');
    const imageEl = document.getElementById('locationCardImage');
    const addRouteBtn = document.getElementById('addRouteBtn');
    const viewArchiveBtn = document.getElementById('viewArchiveBtn');
    const inRoute = !!location && routePlan.locationIds.includes(location.id);

    if (titleEl) titleEl.textContent = location ? location.name : '';
    if (descEl) descEl.textContent = location ? location.shortDesc : '';
    if (imageEl && location) {
        imageEl.style.backgroundImage =
            `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.18)), url('${location.image || MAP_FALLBACK_IMAGE}')`;
    }
    if (tagsEl) {
        tagsEl.innerHTML = '';
        if (location) {
            [formatRouteType(location.type), ...(location.tags || [])].forEach((tag) => {
                const chip = document.createElement('span');
                chip.className = 'location-card-tag';
                chip.textContent = tag;
                tagsEl.appendChild(chip);
            });
        }
    }
    if (addRouteBtn) {
        addRouteBtn.textContent = inRoute ? '移出路线' : '加入路线';
        addRouteBtn.classList.toggle('is-added', inRoute);
    }
    // 每次更新弹窗时把当前景点 id 锁进 onclick，彻底不依赖 activeLocationId
    if (viewArchiveBtn && location) {
        viewArchiveBtn.onclick = () => navigateToArchive(location.id);
    }
}

function getMarkerNodeByLocationId(locationId) {
    const markerEntry = guideMarkers.get(locationId);
    return markerEntry && markerEntry.markerNode ? markerEntry.markerNode : null;
}

function showLocationCard(location, markerNode) {
    if (!locationCardOverlay || !location) {
        return;
    }

    activeLocationId = location.id;
    updateLocationCard(location);
    saveRoutePlan();
    locationCardOverlay.classList.add('visible');
    locationCardOverlay.setAttribute('aria-hidden', 'false');
    setActiveMarker(markerNode);
}

function hideLocationCard() {
    if (!locationCardOverlay) {
        return;
    }

    locationCardOverlay.classList.remove('visible');
    locationCardOverlay.setAttribute('aria-hidden', 'true');
    setActiveMarker(null);
}

function updateMarkerStates() {
    guideMarkers.forEach(({ marker, label }, locationId) => {
        const isInRoute = routePlan.locationIds.includes(locationId);
        const isActive = activeLocationId === locationId;
        const isStart = routePlan.locationIds[0] === locationId;
        const isEnd = routePlan.locationIds[routePlan.locationIds.length - 1] === locationId;
        const noRoute = routePlan.locationIds.length === 0;

        if (marker) {
            const opacity = (noRoute || isInRoute || isActive) ? 1 : 0.4;
            const zIndex = isActive ? 200 : isInRoute ? 160 : 150;
            try { marker.setOptions({ opacity, zIndex }); } catch (e) {}
            try { marker.setzIndex(zIndex); } catch (e) {}
        }

        if (label) {
            if (isStart || isEnd) {
                label.setStyle({
                    'background-color': 'rgba(181,200,51,0.25)',
                    'border': '1.5px solid rgba(143,168,37,0.9)',
                    'color': '#3a4a10',
                    'font-weight': '700',
                    'padding': '3px 9px',
                    'border-radius': '999px',
                    'font-size': '12px',
                    'white-space': 'nowrap',
                    'pointer-events': 'none',
                    'opacity': '1'
                });
            } else if (isInRoute) {
                label.setStyle({
                    'background-color': 'rgba(255,248,236,0.97)',
                    'border': '1.5px solid rgba(143,168,37,0.7)',
                    'color': '#4a3121',
                    'font-weight': '600',
                    'padding': '3px 9px',
                    'border-radius': '999px',
                    'font-size': '12px',
                    'white-space': 'nowrap',
                    'pointer-events': 'none',
                    'opacity': '1'
                });
            } else {
                label.setStyle({
                    'background-color': 'rgba(255,248,236,0.97)',
                    'border': '1.5px solid rgba(78,52,39,0.25)',
                    'color': '#4a3121',
                    'font-weight': '400',
                    'padding': '3px 9px',
                    'border-radius': '999px',
                    'font-size': '12px',
                    'white-space': 'nowrap',
                    'pointer-events': 'none',
                    'opacity': '1'
                });
            }
        }
    });
}

function updateRouteSummary() {
    const summaryName = document.getElementById('routeSummaryName');
    const summaryCount = document.getElementById('routeSummaryCount');
    const currentTitle = document.getElementById('routeCurrentTitle');
    const currentDesc = document.getElementById('routeCurrentDesc');
    const currentList = document.getElementById('routeCurrentList');
    const routeThemeButtons = document.querySelectorAll('.route-theme-btn');
    const presetRoute = getPresetRouteById(activePresetRouteId);
    const routeLocations = routePlan.locationIds.map(getGuideLocationById).filter(Boolean);

    if (summaryName) summaryName.textContent = presetRoute ? presetRoute.name : (routeLocations.length ?
        '自定义路线' : '未选择路线');
    if (summaryCount) summaryCount.textContent = `${routeLocations.length} 站`;
    if (currentTitle) currentTitle.textContent = routeLocations.length ? (presetRoute ? presetRoute.name :
        '自定义路线') : '还没选路线';
    if (currentDesc) {
        currentDesc.textContent = routeLocations.length ?
            (presetRoute ? presetRoute.description : '您已经手动安排了一条自己的游览顺序。') :
            '点一个主题，我就把推荐的游览顺序铺在地图上。';
    }
    if (currentList) {
        currentList.innerHTML = '';
        routeLocations.forEach((location, index) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'route-current-item';
            item.textContent = `${index + 1}. ${location.name}`;
            item.addEventListener('click', () => {
                // 收起路线规划面板
                closeRoutePlannerPanel();
                // 隐藏地点详情弹窗（若有）
                hideLocationCard();
                // 更新 activeLocationId 并居中地图，不弹详情弹窗
                activeLocationId = location.id;
                saveRoutePlan();
                focusLocation(location.id, { silent: true });
            });
            currentList.appendChild(item);
        });
    }
    routeThemeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.routeTheme === activePresetRouteId);
    });
}

async function syncRoutePolyline() {
    if (!map || typeof AMap === 'undefined') {
        return [];
    }

    const currentSyncToken = ++routeSyncToken;
    const normalizedIds = normalizeRouteLocationIds(routePlan.locationIds);
    routePlan.locationIds = normalizedIds;
    clearRoutePolylines();

    updateMarkerStates();
    updateRouteSummary();
    saveRoutePlan();

    if (normalizedIds.length < 2) {
        return normalizedIds
            .map((locationId) => getGuideLocationById(locationId))
            .filter(Boolean)
            .map((location) => location.lngLat);
    }

    const path = await buildWalkingRoutePath(normalizedIds);
    if (currentSyncToken !== routeSyncToken) {
        return path;
    }

    if (path.length >= 2) {
        createRoutePolylines(path);
    }
    return path;
}

function setRoutePlan(locationIds, presetId = null) {
    const normalizedIds = presetId
        ? normalizeRouteLocationIds(locationIds)
        : sortRouteLocationsByDirection(normalizeRouteLocationIds(locationIds));
    routePlan = {
        presetId,
        locationIds: normalizedIds
    };
    activePresetRouteId = presetId;
    void syncRoutePolyline();
}

function closeRoutePlannerPanel() {
    if (!routePlannerPanel) {
        return;
    }
    routePlannerPanel.classList.remove('is-open');
    routePlannerPanel.setAttribute('aria-hidden', 'true');
}

async function previewRouteOnMap() {
    if (!map || !routePlan.locationIds.length) {
        return;
    }

    closeRoutePlannerPanel();
    hideLocationCard();
    const path = await syncRoutePolyline();
    if (path.length >= 2) {
        const routeMarkers = routePlan.locationIds
            .map((locationId) => guideMarkers.get(locationId))
            .filter((entry) => entry && entry.marker)
            .map((entry) => entry.marker);
        const overlays = [routePolylineOuter, routePolylineInner, ...routeMarkers].filter(Boolean);
        if (overlays.length) {
            map.setFitView(overlays, false, [54, 54, 180, 54]);
        }
    } else if (path.length === 1) {
        map.setCenter(path[0]);
        map.setZoom(15.8);
    }
}

function clearRoutePlan() {
    routePlan = { presetId: null, locationIds: [] };
    activePresetRouteId = null;
    void syncRoutePolyline();
    updateLocationCard(getGuideLocationById(activeLocationId));
    showToast('路线已清空');
}

function toggleLocationInRoute(locationId) {
    const targetLocation = getGuideLocationById(locationId);
    if (!targetLocation) {
        return;
    }

    if (routePlan.locationIds.includes(locationId)) {
        setRoutePlan(routePlan.locationIds.filter((id) => id !== locationId), null);
        showToast(`已将${targetLocation.name}移出路线`);
    } else {
        setRoutePlan(insertLocationWithLeastDetour(routePlan.locationIds, locationId), null);
        showToast(`已将${targetLocation.name}加入路线`);
    }
    updateLocationCard(targetLocation);
}

function focusLocationLegacy(locationId, options = {}) {
    const targetLocation = getGuideLocationById(locationId);
    if (!map || !targetLocation) {
        return;
    }

    // 更新活动地点ID，使标记状态正确更新
    activeLocationId = locationId;
    saveRoutePlan();

    // 平滑移动地图使地点居中
    map.setCenter(targetLocation.lngLat, true);
    map.setZoom(options.zoom || 16.3);
    updateMarkerStates();

    // silent 模式：只居中地图，不弹地点详情弹窗（供路线面板内点击使用）
    if (options.silent) {
        return;
    }
    showLocationCard(targetLocation, null);
}

function updateArchiveContent(location) {
    const context = location || guideLocations[0];
    const archiveData = context.archive || {};

    // 每次都直接从 DOM 拿节点，不依赖可能为 null 的模块级变量
    const heroText = document.getElementById('archiveHeroText');
    const introText = document.getElementById('archiveIntroText');
    const choiceTitle = document.getElementById('archiveChoiceTitle');
    const choicePrimary = document.getElementById('archiveChoicePrimary');
    const choiceSecondary = document.getElementById('archiveChoiceSecondary');
    const detailNode = document.getElementById('archiveMessageDetail');
    const detailText = detailNode ? detailNode.querySelector('p') : null;
    const askModal = document.getElementById('archiveAskModal');
    const askText = askModal ? askModal.querySelector('.archive-ask-bubble p') : null;
    const feedbackTitle = document.getElementById('archiveFeedbackTitle');
    const feedbackDesc = document.getElementById('archiveFeedbackDesc');
    const feedbackBubble = document.getElementById('archiveFeedbackBubbleText');

    if (heroText) heroText.textContent = archiveData.hero || `${context.name}这地方很有讲头，咱慢慢看。`;
    if (introText) introText.textContent = archiveData.intro || context.shortDesc;
    if (choiceTitle) choiceTitle.textContent = archiveData.choiceTitle || '您更想从哪一面看看这里？';
    if (choicePrimary) choicePrimary.textContent = archiveData.choicePrimary || '先看细节';
    if (choiceSecondary) choiceSecondary.textContent = archiveData.choiceSecondary || '先看看周边';
    if (detailText) detailText.textContent = archiveData.detail || context.shortDesc;
    if (askText) askText.textContent = archiveData.ask || `关于${context.name}的故事先说到这儿，要不要顺手拍张照留念？`;
    if (feedbackTitle) feedbackTitle.textContent = context.name;
    if (feedbackDesc) feedbackDesc.textContent = `已存入游览回忆 · ${context.shortDesc}`;
    if (feedbackBubble) feedbackBubble.textContent = `"${archiveData.feedback || '这张留得好，今天这趟走得值。'}"`;
}

function focusLocation(locationId, options = {}) {
    const targetLocation = getGuideLocationById(locationId);
    if (!map || !targetLocation) return;
    activeLocationId = locationId;
    saveRoutePlan();
    const targetZoom = options.zoom || 16.3;
    const targetLngLat = targetLocation.lngLat;
    // 先设 zoom，等 zoomend 后再 panTo，确保缩放完成后景点精准居中
    if (Math.abs(map.getZoom() - targetZoom) > 0.5) {
        map.setZoom(targetZoom, true);
        map.once('zoomend', () => {
            map.panTo(targetLngLat);
        });
    } else {
        map.panTo(targetLngLat);
    }
    updateMarkerStates();
    if (options.silent) return;
    showLocationCard(targetLocation, null);
}

function buildMarkerContent(location) {
    return `
        <button type="button" class="custom-map-marker" data-location-id="${location.id}" data-type="${location.type}">
            <span class="marker-pin">
                <img src="地点.png" alt="" class="marker-icon" aria-hidden="true">
            </span>
            <span class="marker-label">${location.name}</span>
        </button>
    `;
}

function buildMarkerIcon() {
    return new AMap.Icon({
        size: new AMap.Size(56, 56),
        image: '地点.png',
        imageSize: new AMap.Size(56, 56)
    });
}

function buildMarkerSvgContent(location) {
    return `
        <button type="button" class="custom-map-marker" data-location-id="${location.id}" data-type="${location.type}">
            <span class="marker-pin">
                <svg width="36" height="48" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="#C0392B"/>
                    <circle cx="15" cy="14" r="6" fill="white"/>
                </svg>
            </span>
            <span class="marker-label">${location.name}</span>
        </button>
    `;
}

function handleGuideSearch(keyword) {
    const normalizedKeyword = (keyword || '').trim().toLowerCase();
    if (!normalizedKeyword) {
        showToast('请输入想去的地点');
        return;
    }

    const localMatch = guideLocations.find((location) => {
        const haystack = [location.name, ...(location.tags || [])].join(' ').toLowerCase();
        return haystack.includes(normalizedKeyword);
    });

    if (localMatch) {
        focusLocation(localMatch.id);
        showToast(`已为您定位到${localMatch.name}`);
        return;
    }

    if (typeof AMap !== 'undefined') {
        const placeSearch = new AMap.PlaceSearch({ city: '北京', map });
        placeSearch.search(keyword);
        showToast(`正在搜索 ${keyword}`);
    }
}

function initMap() {
    if (mapInitialized) {
        syncRoutePolyline();
        if (activeLocationId) {
            updateLocationCard(getGuideLocationById(activeLocationId));
        }
        return;
    }

    if (typeof AMap === 'undefined' || !window._amapReady) {
        setTimeout(initMap, 100);
        return;
    }

    const container = document.getElementById('mapContainer');
    if (!container) return;

    map = new AMap.Map(container, {
        center: [116.3892, 39.9405],
        zoom: 15.6,
        zooms: [14, 18],
        mapStyle: 'amap://styles/fresh',
        resizeEnable: true,
        pitchEnable: false,
        rotateEnable: false,
        viewMode: '2D'
    });

    map.setLimitBounds(new AMap.Bounds([116.3735, 39.9318], [116.4098, 39.9498]));
    map.addControl(new AMap.ToolBar({
        position: { right: '14px', top: '72px' }
    }));

    guideLocations.forEach((location) => {
        const marker = new AMap.Marker({
            position: location.lngLat,
            icon: new AMap.Icon({
                size: new AMap.Size(30, 40),
                image: PIN_NORMAL,
                imageSize: new AMap.Size(30, 40)
            }),
            offset: new AMap.Pixel(-15, -40),
            clickable: true,
            zIndex: 150,
            title: location.name
        });
        marker.setMap(map);

        const label = new AMap.Text({
            text: location.name,
            position: location.lngLat,
            offset: new AMap.Pixel(0, -52),
            style: {
                'padding': '3px 9px',
                'border-radius': '999px',
                'background-color': 'rgba(255,248,236,0.97)',
                'border': '1.5px solid rgba(78,52,39,0.25)',
                'color': '#4a3121',
                'font-size': '12px',
                'font-family': 'PingFang SC, Microsoft YaHei, sans-serif',
                'white-space': 'nowrap',
                'box-shadow': '0 2px 6px rgba(74,49,33,0.2)',
                'text-align': 'center',
                'pointer-events': 'none',
                'cursor': 'default'
            },
            zIndex: 155
        });
        label.setMap(map);

        marker.on('click', () => {
            suppressMapClickUntil = Date.now() + 500;
            focusLocation(location.id);
        });

        guideMarkers.set(location.id, { marker, label, markerNode: null });
    });

    map.on('complete', () => {
        updateMarkerStates();
    });

    map.on('click', () => {
        if (Date.now() < suppressMapClickUntil) {
            return;
        }
        hideLocationCard();
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const autoComplete = new AMap.AutoComplete({
            input: 'searchInput',
            city: '北京',
            citylimit: false
        });

        autoComplete.on('select', (event) => {
            const keyword = event.poi && event.poi.name ? event.poi.name : searchInput.value.trim();
            handleGuideSearch(keyword);
        });
    }

    mapInitialized = true;
    syncRoutePolyline();

    if (routePlan.locationIds.length) {
        previewRouteOnMap();
    } else if (activeLocationId) {
        focusLocation(activeLocationId, { zoom: 15.8 });
    }
}

function getRandomDelay() {
    return 1000 + Math.floor(Math.random() * 2001);
}

function queueArchiveTask(callback, delay) {
    const timerId = setTimeout(() => {
        archiveTimers = archiveTimers.filter((id) => id !== timerId);
        callback();
    }, delay);
    archiveTimers.push(timerId);
}

function stopArchiveDialogueSequence() {
    archiveTimers.forEach((timerId) => clearTimeout(timerId));
    archiveTimers = [];
}

function revokeArchivePhotoUrl() {
    if (archivePhotoObjectUrl) {
        URL.revokeObjectURL(archivePhotoObjectUrl);
        archivePhotoObjectUrl = null;
    }
}

function resetArchiveDialogueSequence() {
    stopArchiveDialogueSequence();
    archiveChoiceMade = false;

    [archiveMessageIntro, archiveMessageChoice, archiveMessageDetail].forEach((node) => {
        if (!node) {
            return;
        }
        node.classList.remove('dialogue-visible');
        node.classList.add('hidden');
    });

    if (archiveDialogueTrack) {
        archiveDialogueTrack.style.transform = 'translateY(0)';
    }

    document.querySelectorAll('.dialogue-choice-btn').forEach((button) => {
        button.disabled = false;
        button.style.opacity = '1';
    });
}

function hideArchiveModal() {
    const archivePage = document.getElementById('archivePage');

    if (archiveModalOverlay) {
        archiveModalOverlay.classList.add('hidden');
        archiveModalOverlay.classList.remove('active');
        archiveModalOverlay.setAttribute('aria-hidden', 'true');
    }

    [archiveAskModal, archiveFeedbackModal].forEach((modal) => {
        if (!modal) {
            return;
        }
        modal.classList.add('hidden');
        modal.classList.remove('archive-modal-visible');
    });

    if (archivePage) {
        archivePage.classList.remove('dimmed');
    }
}

function showArchiveModal(targetModal) {
    const archivePage = document.getElementById('archivePage');
    if (!archiveModalOverlay || !targetModal) {
        return;
    }

    [archiveAskModal, archiveFeedbackModal].forEach((modal) => {
        if (!modal) {
            return;
        }
        modal.classList.add('hidden');
        modal.classList.remove('archive-modal-visible');
    });

    archiveModalOverlay.classList.remove('hidden');
    archiveModalOverlay.classList.add('active');
    archiveModalOverlay.setAttribute('aria-hidden', 'false');
    targetModal.classList.remove('hidden');
    targetModal.classList.add('archive-modal-visible');

    if (archivePage) {
        archivePage.classList.add('dimmed');
    }
}

function updateArchiveDialoguePosition() {
    if (!archiveDialogueViewport || !archiveDialogueTrack) {
        return;
    }

    requestAnimationFrame(() => {
        const overflow = archiveDialogueTrack.scrollHeight - archiveDialogueViewport.clientHeight;
        archiveDialogueTrack.style.transform = `translateY(${overflow > 0 ? -overflow : 0}px)`;
    });
}

function revealArchiveDialogue(node) {
    if (!node || node.classList.contains('dialogue-visible')) {
        return;
    }

    node.classList.remove('hidden');
    requestAnimationFrame(() => {
        node.classList.add('dialogue-visible');
        updateArchiveDialoguePosition();
    });
}

function handleArchiveChoice() {
    if (archiveChoiceMade) {
        return;
    }

    archiveChoiceMade = true;
    document.querySelectorAll('.dialogue-choice-btn').forEach((button) => {
        button.disabled = true;
        button.style.opacity = '0.78';
    });

    queueArchiveTask(() => {
        revealArchiveDialogue(archiveMessageDetail);
    }, getRandomDelay());
}

function startArchiveDialogueSequence() {
    // 再次确保档案内容与当前景点一致（防止 DOM 未 ready 时首次调用遗漏）
    if (archiveContext) updateArchiveContent(archiveContext);
    resetArchiveDialogueSequence();
    hideArchiveModal();
    queueArchiveTask(() => {
        revealArchiveDialogue(archiveMessageIntro);
        queueArchiveTask(() => revealArchiveDialogue(archiveMessageChoice), getRandomDelay());
    }, 3000);
}

function handleArchiveFinish() {
    stopArchiveDialogueSequence();   // 立即清掉所有待执行的讲解任务
    showArchiveModal(archiveAskModal);
}

function openArchiveCamera() {
    if (archiveCameraInput) {
        archiveCameraInput.value = '';
        archiveCameraInput.click();
    }
}

function handleArchivePhotoSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    revokeArchivePhotoUrl();
    archivePhotoObjectUrl = URL.createObjectURL(file);
    if (archiveFeedbackPhoto) {
        archiveFeedbackPhoto.src = archivePhotoObjectUrl;
    }
    showArchiveModal(archiveFeedbackModal);
}

function revokeVisualPhotoUrl() {
    if (visualPhotoObjectUrl) {
        URL.revokeObjectURL(visualPhotoObjectUrl);
        visualPhotoObjectUrl = null;
    }
}

function hideVisualModal() {
    const visualPage = document.getElementById('visualPage');
    if (visualModalOverlay) {
        visualModalOverlay.classList.add('hidden');
        visualModalOverlay.classList.remove('active');
        visualModalOverlay.setAttribute('aria-hidden', 'true');
    }
    if (visualFeedbackModal) {
        visualFeedbackModal.classList.add('hidden');
        visualFeedbackModal.classList.remove('archive-modal-visible');
    }
    if (visualPage) {
        visualPage.classList.remove('dimmed');
    }
}

function showVisualModal() {
    const visualPage = document.getElementById('visualPage');
    if (!visualModalOverlay || !visualFeedbackModal) {
        return;
    }

    // 确保反馈弹窗中的图片是最新的
    const visualFeedbackPhoto = document.getElementById('visualFeedbackPhoto');
    if (visualFeedbackPhoto && visualPhotoObjectUrl) {
        visualFeedbackPhoto.src = visualPhotoObjectUrl;
        visualFeedbackPhoto.style.display = 'block';
    }

    visualModalOverlay.classList.remove('hidden');
    visualModalOverlay.classList.add('active');
    visualModalOverlay.setAttribute('aria-hidden', 'false');
    visualFeedbackModal.classList.remove('hidden');
    visualFeedbackModal.classList.add('archive-modal-visible');

    if (visualPage) {
        visualPage.classList.add('dimmed');
    }
}

function openVisualCamera() {
    if (visualCameraInput) {
        visualCameraInput.value = '';
        visualCameraInput.click();
    }
}

function handleVisualPhotoSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    revokeVisualPhotoUrl();
    visualPhotoObjectUrl = URL.createObjectURL(file);
    if (visualUploadPreview) {
        visualUploadPreview.src = visualPhotoObjectUrl;
        visualUploadPreview.classList.remove('hidden');
    }
    if (visualUploadIcon) {
        visualUploadIcon.classList.add('hidden');
    }
    if (visualUploadText) {
        visualUploadText.textContent = '重新拍摄';
    }
    if (visualFeedbackPhoto) {
        visualFeedbackPhoto.src = visualPhotoObjectUrl;
    }
}

function submitVisualTask() {
    if (!visualPhotoObjectUrl) {
        showToast('请先拍照或上传图片');
        return;
    }

    // 将 Object URL 转换为 base64 存储
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = visualPhotoObjectUrl;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);

        // 保存到探索笔记
        const visualNote = {
            id: Date.now(),
            type: 'visual',
            title: '观·景 记录',
            image: base64Image,
            date: '二零二六·腊月'
        };
        exploreNotes.push(visualNote);
        saveExploreNotes();

        // 更新视觉反馈弹窗中的图片
        const visualFeedbackPhoto = document.getElementById('visualFeedbackPhoto');
        if (visualFeedbackPhoto) {
            visualFeedbackPhoto.src = base64Image;
        }

        // 注入任务标题和反馈语
        if (currentVisualTask) {
            const titleEl = document.getElementById('visualFeedbackTitle');
            const bubbleEl = document.getElementById('visualFeedbackBubbleText');
            if (titleEl) titleEl.textContent = currentVisualTask.title;
            if (bubbleEl) bubbleEl.textContent = '"' + currentVisualTask.feedback + '"';
        }

        showVisualModal();
    };
    img.onerror = function() {
        // 如果转换失败，仍然保存 Object URL（页面刷新后会失效，但当前会话可用）
        const visualNote = {
            id: Date.now(),
            type: 'visual',
            title: '观·景 记录',
            image: visualPhotoObjectUrl,
            date: '二零二六·腊月'
        };
        exploreNotes.push(visualNote);
        saveExploreNotes();
        if (currentVisualTask) {
            const titleEl = document.getElementById('visualFeedbackTitle');
            const bubbleEl = document.getElementById('visualFeedbackBubbleText');
            if (titleEl) titleEl.textContent = currentVisualTask.title;
            if (bubbleEl) bubbleEl.textContent = '"' + currentVisualTask.feedback + '"';
        }
        showVisualModal();
    };
}

/* ========================================
   听觉页面功能（Android + iOS 全兼容版）
   ======================================== */

// 强制设置 canvas 尺寸，不依赖 getBoundingClientRect（hidden 时返回0）
function forceResizeCanvas(canvas, fallbackW, fallbackH) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    let w = 0, h = 0;
    if (parent) {
        const rect = parent.getBoundingClientRect();
        w = rect.width || parent.offsetWidth || parent.clientWidth;
        h = rect.height || parent.offsetHeight || parent.clientHeight;
    }
    if (w <= 0) w = fallbackW || 300;
    if (h <= 0) h = fallbackH || 120;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initHearPage() {
    cleanupHearRecording();
    audioChunks = [];
    isRecording = false;
    isPlaying = false;
    elapsedTime = 0;
    audioUrl = null;
    lastAudioBlob = null;
    if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement = null;
    }

    if (hearTimer) hearTimer.textContent = '00:00:00';
    if (hearRecordBtn) hearRecordBtn.classList.remove('is-recording', 'is-playing');
    if (hearSubmitBtn) hearSubmitBtn.disabled = true;
    if (hearStopBtn) {
        hearStopBtn.style.opacity = '0.5';
        hearStopBtn.style.pointerEvents = 'none';
    }

    function doInit() {
        const screenW = window.innerWidth || 375;
        forceResizeCanvas(hearWaveformCanvas, screenW - 32, 140);
        forceResizeCanvas(hearFeedbackWaveformCanvas, screenW - 60, 120);
        if (hearWaveformCanvas) {
            hearWaveformCtx = hearWaveformCanvas.getContext('2d');
            drawEmptyWaveform();
        }
        if (hearFeedbackWaveformCanvas) {
            hearFeedbackWaveformCtx = hearFeedbackWaveformCanvas.getContext('2d');
            drawEmptyFeedbackWaveform();
        }
    }

    doInit();
    setTimeout(doInit, 100);
    setTimeout(doInit, 450);
}

function drawEmptyWaveform() {
    if (!hearWaveformCanvas || !hearWaveformCtx) return;
    const w = hearWaveformCanvas.width;
    const h = hearWaveformCanvas.height;
    const barCount = 48;
    const barWidth = 4;
    const gap = 6;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearWaveformCtx.clearRect(0, 0, w, h);

    for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barWidth + gap);
        const height = 4 + Math.random() * 16;
        const y = centerY - height / 2;
        hearWaveformCtx.fillStyle = 'rgba(166, 92, 72, 0.35)';
        hearWaveformCtx.fillRect(x, y, barWidth, height);
    }
}

function drawEmptyFeedbackWaveform() {
    if (!hearFeedbackWaveformCanvas || !hearFeedbackWaveformCtx) return;
    const w = hearFeedbackWaveformCanvas.width;
    const h = hearFeedbackWaveformCanvas.height;
    const barCount = 40;
    const barWidth = 4;
    const gap = 4;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearFeedbackWaveformCtx.clearRect(0, 0, w, h);

    for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barWidth + gap);
        const height = 4 + Math.random() * 20;
        const y = centerY - height / 2;
        hearFeedbackWaveformCtx.fillStyle = 'rgba(166, 92, 72, 0.30)';
        hearFeedbackWaveformCtx.fillRect(x, y, barWidth, height);
    }
}

function drawWaveformFromData(dataArray) {
    if (!hearWaveformCanvas || !hearWaveformCtx) return;
    const w = hearWaveformCanvas.width;
    const h = hearWaveformCanvas.height;
    if (w === 0 || h === 0) return;
    const barCount = 32;
    const barWidth = 6;
    const gap = 8;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearWaveformCtx.clearRect(0, 0, w, h);

    const step = Math.max(1, Math.floor(dataArray.length / barCount));
    for (let i = 0; i < barCount; i++) {
        const idx = i * step;
        const val = dataArray[idx] || 128;
        const deviation = Math.abs(val - 128) / 128.0;
        const height = Math.max(4, deviation * (h * 0.75));
        const x = startX + i * (barWidth + gap);
        const y = centerY - height / 2;
        const alpha = 0.45 + deviation * 0.55;
        hearWaveformCtx.fillStyle = `rgba(166, 92, 72, ${alpha})`;
        roundRect(hearWaveformCtx, x, y, barWidth, height, 3);
        hearWaveformCtx.fill();
    }
}

// 时域波形绘制：专为 getByteTimeDomainData 设计，1024点高精度版本
function drawWaveformFromTimeDomain(dataArray) {
    if (!hearWaveformCanvas || !hearWaveformCtx) return;
    const w = hearWaveformCanvas.width;
    const h = hearWaveformCanvas.height;
    if (w === 0 || h === 0) return;
    const barCount = 40;
    const barWidth = 5;
    const gap = 6;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearWaveformCtx.clearRect(0, 0, w, h);

    const step = Math.max(1, Math.floor(dataArray.length / barCount));
    for (let i = 0; i < barCount; i++) {
        // 取一段采样的RMS（均方根），比单点更平滑
        let sum = 0;
        const segLen = Math.min(step, 8);
        for (let j = 0; j < segLen; j++) {
            const v = dataArray[i * step + j] || 128;
            const d = (v - 128) / 128.0;
            sum += d * d;
        }
        const rms = Math.sqrt(sum / segLen);
        const height = Math.max(3, rms * h * 0.85);
        const x = startX + i * (barWidth + gap);
        const y = centerY - height / 2;
        const alpha = 0.4 + rms * 0.6;
        hearWaveformCtx.fillStyle = `rgba(166, 92, 72, ${Math.min(1, alpha)})`;
        roundRect(hearWaveformCtx, x, y, barWidth, height, 3);
        hearWaveformCtx.fill();
    }
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawFeedbackWaveformFromData(dataArray) {
    if (!hearFeedbackWaveformCanvas || !hearFeedbackWaveformCtx) return;
    const w = hearFeedbackWaveformCanvas.width;
    const h = hearFeedbackWaveformCanvas.height;
    const barCount = 24;
    const barWidth = 6;
    const gap = 10;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearFeedbackWaveformCtx.clearRect(0, 0, w, h);

    const step = Math.floor(dataArray.length / barCount);
    for (let i = 0; i < barCount; i++) {
        const idx = i * step;
        const val = dataArray[idx] || 0;
        const normalized = val / 128.0;
        const height = Math.max(4, normalized * 70);
        const x = startX + i * (barWidth + gap);
        const y = centerY - height / 2;
        const alpha = 0.5 + normalized * 0.5;
        hearFeedbackWaveformCtx.fillStyle = `rgba(166, 92, 72, ${alpha})`;
        roundRect(hearFeedbackWaveformCtx, x, y, barWidth, height, 3);
        hearFeedbackWaveformCtx.fill();
    }
}

// ✅ 新增：从 Blob 直接绘制波形（取代 fetch）
function drawWaveformFromBlob(blob) {
    if (!blob) {
        drawEmptyWaveform();
        drawEmptyFeedbackWaveform();
        return;
    }
    const reader = new FileReader();
    reader.onloadend = function() {
        const arrayBuffer = reader.result;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(arrayBuffer)
            .then(decoded => {
                const channelData = decoded.getChannelData(0);
                const sampleStep = Math.floor(channelData.length / 48) || 1;
                const dataArray = new Uint8Array(48);
                for (let i = 0; i < 48; i++) {
                    const val = Math.abs(channelData[i * sampleStep] || 0);
                    dataArray[i] = Math.min(255, Math.floor(val * 255));
                }
                drawWaveformFromData(dataArray);
                drawFeedbackWaveformFromData(dataArray);
            })
            .catch(err => {
                console.warn('音频解码失败:', err);
                drawEmptyWaveform();
                drawEmptyFeedbackWaveform();
            });
    };
    reader.readAsArrayBuffer(blob);
}

function drawFeedbackWaveformFromAudio(url) {
    // 改用 drawWaveformFromBlob，不再使用 fetch
    if (lastAudioBlob) {
        drawWaveformFromBlob(lastAudioBlob);
    } else {
        drawEmptyFeedbackWaveform();
    }
}

// ✅ Android + iOS 全兼容版：startRecording
let _sharedAudioContext = null;

function getOrCreateAudioContext() {
    if (!_sharedAudioContext || _sharedAudioContext.state === 'closed') {
        _sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return _sharedAudioContext;
}

function startRecording() {
    if (isRecording) return;

    // AudioContext 必须在用户手势同步栈中创建（iOS 要求）
    const audioContext = getOrCreateAudioContext();
    const resumePromise = audioContext.state === 'suspended'
        ? audioContext.resume()
        : Promise.resolve();

    resumePromise.then(() => {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }).then((stream) => {

        // MIME 类型：安卓优先 webm/opus，iOS 只支持 mp4
        let mimeType = '';
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus'
        ];
        for (const t of types) {
            if (MediaRecorder.isTypeSupported(t)) { mimeType = t; break; }
        }

        mediaRecorder = mimeType
            ? new MediaRecorder(stream, { mimeType })
            : new MediaRecorder(stream);

        audioChunks = [];
        isRecording = true;
        isPlaying = false;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            isRecording = false;
            if (waveformAnimationId) { cancelAnimationFrame(waveformAnimationId); waveformAnimationId = null; }
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            stream.getTracks().forEach(t => t.stop());

            const finalMime = mediaRecorder.mimeType || mimeType || 'audio/webm';
            const blob = new Blob(audioChunks, { type: finalMime });
            lastAudioBlob = blob;

            if (audioUrl) URL.revokeObjectURL(audioUrl);
            audioUrl = URL.createObjectURL(blob);

            if (audioElement) { audioElement.pause(); audioElement.src = ''; }
            audioElement = new Audio();
            audioElement.preload = 'auto';
            audioElement.onended = () => {
                isPlaying = false;
                if (hearRecordBtn) hearRecordBtn.classList.remove('is-playing');
                if (hearStopBtn) hearStopBtn.classList.remove('is-playing');
            };
            audioElement.src = audioUrl;
            audioElement.load();

            if (hearSubmitBtn) hearSubmitBtn.disabled = false;
            if (hearStopBtn) { hearStopBtn.style.opacity = '1'; hearStopBtn.style.pointerEvents = 'auto'; }
            if (hearRecordBtn) hearRecordBtn.classList.remove('is-recording');

            // 录音完成后绘制静态波形快照
            drawWaveformFromBlob(lastAudioBlob);
        };

        mediaRecorder.start(100);
        startTime = Date.now() - elapsedTime;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 100);

        if (hearRecordBtn) hearRecordBtn.classList.add('is-recording');
        if (hearStopBtn) { hearStopBtn.style.opacity = '0.5'; hearStopBtn.style.pointerEvents = 'none'; }
        if (hearSubmitBtn) hearSubmitBtn.disabled = true;

        // 尝试建立实时波形分析
        // 用 try/catch 兜底，任何一步失败都降级为动画波形
        let analyserSetupOk = false;
        try {
            if (audioContext.state === 'running') {
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                // fftSize 2048 采样点更多，安卓上灵敏度更高
                analyser.fftSize = 2048;
                analyser.smoothingTimeConstant = 0.4;
                source.connect(analyser);

                const bufLen = analyser.frequencyBinCount; // 1024
                const dataArray = new Uint8Array(bufLen);

                // 检测安卓上 analyser 是否真正有数据（等100ms后采样）
                let checkCount = 0;
                function checkAndAnimate() {
                    if (!isRecording) { waveformAnimationId = null; return; }
                    waveformAnimationId = requestAnimationFrame(checkAndAnimate);
                    analyser.getByteTimeDomainData(dataArray);

                    // 计算信号偏离中心值128的最大幅度
                    let maxDev = 0;
                    for (let i = 0; i < bufLen; i++) {
                        const dev = Math.abs(dataArray[i] - 128);
                        if (dev > maxDev) maxDev = dev;
                    }

                    checkCount++;
                    // 前20帧如果信号一直为0，说明 analyser 没数据，切换到降级动画
                    if (checkCount < 20 && maxDev === 0) {
                        return; // 继续等
                    }
                    if (checkCount >= 20 && maxDev === 0) {
                        // analyser 无数据，启动降级动画
                        cancelAnimationFrame(waveformAnimationId);
                        waveformAnimationId = null;
                        startFallbackWaveformAnimation();
                        return;
                    }

                    // 有真实数据，正常绘制
                    drawWaveformFromTimeDomain(dataArray);
                }
                checkAndAnimate();
                analyserSetupOk = true;
            }
        } catch (e) {
            console.warn('Analyser 初始化失败:', e);
        }

        if (!analyserSetupOk) {
            startFallbackWaveformAnimation();
        }

        mediaRecorder._audioContext = audioContext;
    }).catch((err) => {
        showToast('无法访问麦克风，请检查权限设置');
        console.error('录音启动失败:', err.name, err.message);
    });
}

// 降级波形动画（analyser 无数据时的模拟声波）
function startFallbackWaveformAnimation() {
    if (waveformAnimationId) cancelAnimationFrame(waveformAnimationId);

    function animateFallback() {
        if (!isRecording) { waveformAnimationId = null; return; }
        waveformAnimationId = requestAnimationFrame(animateFallback);
        if (!hearWaveformCanvas || !hearWaveformCtx) return;

        // 用 CSS 逻辑尺寸绘制，不用 canvas.width（已乘 dpr）
        const dpr = window.devicePixelRatio || 1;
        const w = hearWaveformCanvas.width / dpr;
        const h = hearWaveformCanvas.height / dpr;
        if (w === 0 || h === 0) return;

        const barCount = 32;
        const barWidth = 6;
        const gap = 8;
        const totalWidth = barCount * (barWidth + gap) - gap;
        const startX = (w - totalWidth) / 2;
        const centerY = h / 2;

        hearWaveformCtx.clearRect(0, 0, w, h);
        const t = Date.now() / 280;
        for (let i = 0; i < barCount; i++) {
            const ht = 5 + Math.abs(Math.sin(t + i * 0.45)) * (h * 0.55) + Math.random() * 6;
            const x = startX + i * (barWidth + gap);
            const y = centerY - ht / 2;
            hearWaveformCtx.fillStyle = 'rgba(166, 92, 72, 0.72)';
            roundRect(hearWaveformCtx, x, y, barWidth, ht, 3);
            hearWaveformCtx.fill();
        }
    }
    animateFallback();
}

function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    mediaRecorder.stop();
}

// ✅ 修复版：playRecording（安卓 + iOS 兼容）
// 无论 readyState 是什么，统一走 canplaythrough 路径，最稳定
function playRecording() {
    if (!audioUrl || isPlaying) return;

    // 如果已经在播放，先停
    if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    if (!audioElement) {
        audioElement = new Audio();
        audioElement.preload = 'auto';
        audioElement.onended = () => {
            isPlaying = false;
            if (hearStopBtn) hearStopBtn.classList.remove('is-playing');
            if (hearRecordBtn) hearRecordBtn.classList.remove('is-playing');
        };
    }

    let didPlay = false;

    const tryPlay = () => {
        if (didPlay) return;
        didPlay = true;
        audioElement.oncanplaythrough = null;
        audioElement.oncanplay = null;
        audioElement.play().then(() => {
            isPlaying = true;
            if (hearStopBtn) hearStopBtn.classList.add('is-playing');
        }).catch(err => {
            if (err.name !== 'AbortError') {
                showToast('播放失败，请重试');
                console.warn('播放失败:', err);
            }
        });
    };

    audioElement.onerror = () => {
        showToast('音频加载失败，请重新录制');
        isPlaying = false;
    };

    // 同时监听 canplay 和 canplaythrough，哪个先来用哪个（安卓有时只触发 canplay）
    audioElement.oncanplay = tryPlay;
    audioElement.oncanplaythrough = tryPlay;

    audioElement.src = audioUrl;
    audioElement.load();
}

function stopPlayback() {
    if (audioElement && isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        isPlaying = false;
        if (hearStopBtn) {
            hearStopBtn.classList.remove('is-playing');
        }
    }
}

function toggleRecordPlay() {
    // 左键：开始录音 / 停止录音
    if (isRecording) {
        stopRecording();
        return;
    }
    startRecording();
}

function togglePlayPlayback() {
    // 右键：播放录音 / 停止播放
    if (isPlaying) {
        stopPlayback();
        return;
    }
    if (audioUrl) {
        playRecording();
    }
}

function updateTimer() {
    if (!isRecording) return;
    elapsedTime = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hearTimer) {
        hearTimer.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function drawWaveformFromAudio(url) {
    // 已由 drawWaveformFromBlob 替代，保留此函数仅兼容调用
    if (lastAudioBlob) {
        drawWaveformFromBlob(lastAudioBlob);
    } else {
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.decodeAudioData(buf)
                    .then(decoded => {
                        const channelData = decoded.getChannelData(0);
                        const sampleStep = Math.floor(channelData.length / 48) || 1;
                        const dataArray = new Uint8Array(48);
                        for (let i = 0; i < 48; i++) {
                            const val = Math.abs(channelData[i * sampleStep] || 0);
                            dataArray[i] = Math.min(255, Math.floor(val * 255));
                        }
                        drawWaveformFromData(dataArray);
                        drawFeedbackWaveformFromData(dataArray);
                    })
                    .catch(() => {
                        drawEmptyWaveform();
                        drawEmptyFeedbackWaveform();
                    });
            })
            .catch(() => {
                drawEmptyWaveform();
                drawEmptyFeedbackWaveform();
            });
    }
}

function submitHearTask() {
    if (!audioUrl && !lastAudioBlob) {
        showToast('请先录制一段声音');
        return;
    }

    // ✅ iOS 修复：直接用 lastAudioBlob（FileReader 读取），
    // 避免 fetch(blob:url) 在 iOS Safari 上静默失败
    const blob = lastAudioBlob;
    if (!blob) {
        showToast('请先录制一段声音');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Audio = reader.result;

        const hearNote = {
            id: Date.now(),
            type: 'hear',
            title: '听·音 记录',
            duration: hearTimer ? hearTimer.textContent : '00:00',
            audio: base64Audio,
            date: '二零二六·腊月'
        };
        exploreNotes.push(hearNote);
        saveExploreNotes();

        // 注入任务标题和反馈语
        if (currentHearTask) {
            const titleEl = document.getElementById('hearFeedbackTitle');
            const bubbleEl = document.getElementById('hearFeedbackBubbleText');
            if (titleEl) titleEl.textContent = currentHearTask.title;
            if (bubbleEl) bubbleEl.textContent = '"' + currentHearTask.feedback + '"';
        }

        showHearModal();
    };
    reader.onerror = function() {
        console.error('音频读取失败，保存无音频版本');
        const hearNote = {
            id: Date.now(),
            type: 'hear',
            title: '听·音 记录',
            duration: hearTimer ? hearTimer.textContent : '00:00',
            date: '二零二六·腊月'
        };
        exploreNotes.push(hearNote);
        saveExploreNotes();
        showHearModal();
    };
    reader.readAsDataURL(blob);
}

function showHearModal() {
    const hearPage = document.getElementById('hearPage');
    if (!hearModalOverlay || !hearFeedbackModal) {
        return;
    }

    // 使用用户录音数据绘制反馈弹窗波形
    if (audioUrl) {
        drawFeedbackWaveformFromAudio(audioUrl);
    }

    hearModalOverlay.classList.remove('hidden');
    hearModalOverlay.classList.add('active');
    hearModalOverlay.setAttribute('aria-hidden', 'false');
    hearFeedbackModal.classList.remove('hidden');
    hearFeedbackModal.classList.add('archive-modal-visible');

    if (hearPage) {
        hearPage.classList.add('dimmed');
    }
}

function hideHearModal() {
    const hearPage = document.getElementById('hearPage');
    if (hearModalOverlay) {
        hearModalOverlay.classList.add('hidden');
        hearModalOverlay.classList.remove('active');
        hearModalOverlay.setAttribute('aria-hidden', 'true');
    }
    if (hearFeedbackModal) {
        hearFeedbackModal.classList.add('hidden');
        hearFeedbackModal.classList.remove('archive-modal-visible');
    }
    if (hearPage) {
        hearPage.classList.remove('dimmed');
    }
}

function cleanupHearRecording() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (waveformAnimationId) {
        cancelAnimationFrame(waveformAnimationId);
        waveformAnimationId = null;
    }
    if (mediaRecorder) {
        try {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        } catch (e) {}
        mediaRecorder = null;
    }
    if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement = null;
    }
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        audioUrl = null;
    }
    lastAudioBlob = null;
    isRecording = false;
    isPlaying = false;
    elapsedTime = 0;
    if (hearTimer) {
        hearTimer.textContent = '00:00:00';
    }
    if (hearRecordBtn) {
        hearRecordBtn.classList.remove('is-recording', 'is-playing');
    }
    if (hearSubmitBtn) {
        hearSubmitBtn.disabled = true;
    }
    if (hearStopBtn) {
        hearStopBtn.style.opacity = '0.5';
        hearStopBtn.style.pointerEvents = 'none';
    }
}

function continueExploreFromHear() {
    hideHearModal();
    cleanupHearRecording();
    if (hearWaveformCanvas && hearWaveformCtx) {
        drawEmptyWaveform();
    }
    if (hearFeedbackWaveformCanvas && hearFeedbackWaveformCtx) {
        drawEmptyFeedbackWaveform();
    }
    navigateToSense();
}

/* ========================================
   触觉页面功能
   ======================================== */
function initTouchPage() {
    if (touchTextarea) {
        touchTextarea.value = '';
    }
    if (touchSubmitBtn) {
        touchSubmitBtn.disabled = false;
    }
    hideTouchModal();
}

function submitTouchTask() {
    const text = touchTextarea ? touchTextarea.value.trim() : '';
    if (!text) {
        showToast('请写下您的感受');
        touchTextarea && touchTextarea.focus();
        return;
    }
    // 保存到探索笔记
    const touchNote = {
        id: Date.now(),
        type: 'touch',
        title: '抚·物 记录',
        text: touchTextarea ? touchTextarea.value.trim() : '',
        date: '二零二六·腊月'
    };
    exploreNotes.push(touchNote);
    saveExploreNotes();

    // 注入任务标题和反馈语
    if (currentTouchTask) {
        const titleEl = document.getElementById('touchFeedbackTitle');
        const bubbleEl = document.getElementById('touchFeedbackBubbleText');
        if (titleEl) titleEl.textContent = currentTouchTask.title;
        if (bubbleEl) bubbleEl.textContent = '"' + currentTouchTask.feedback + '"';
    }

    showTouchModal(text);
}

function showTouchModal(userText) {
    const touchPage = document.getElementById('touchPage');
    if (!touchModalOverlay || !touchFeedbackModal) {
        return;
    }

    const textDisplay = document.getElementById('touchFeedbackTextDisplay');
    if (textDisplay) {
        textDisplay.textContent = userText || '（您未写下内容）';
    }

    touchModalOverlay.classList.remove('hidden');
    touchModalOverlay.classList.add('active');
    touchModalOverlay.setAttribute('aria-hidden', 'false');
    touchFeedbackModal.classList.remove('hidden');
    touchFeedbackModal.classList.add('archive-modal-visible');

    if (touchPage) {
        touchPage.classList.add('dimmed');
    }
}

function hideTouchModal() {
    const touchPage = document.getElementById('touchPage');
    if (touchModalOverlay) {
        touchModalOverlay.classList.add('hidden');
        touchModalOverlay.classList.remove('active');
        touchModalOverlay.setAttribute('aria-hidden', 'true');
    }
    if (touchFeedbackModal) {
        touchFeedbackModal.classList.add('hidden');
        touchFeedbackModal.classList.remove('archive-modal-visible');
    }
    if (touchPage) {
        touchPage.classList.remove('dimmed');
    }
}

function continueExploreFromTouch() {
    hideTouchModal();
    if (touchTextarea) {
        touchTextarea.value = '';
    }
    navigateToSense();
}

/* ========================================
   我的 & 游览回忆功能
   ======================================== */

/* 初始化打卡数据 */
function initVisitedPlaces() {
    // 尝试从 localStorage 读取
    const stored = localStorage.getItem('visitedPlaces');
    if (stored) {
        try {
            visitedPlaces = JSON.parse(stored);
            return;
        } catch (e) {}
    }
    // 初始状态为空，没有默认卡片
    visitedPlaces = [];
    saveVisitedPlaces();
}

function saveVisitedPlaces() {
    try {
        localStorage.setItem('visitedPlaces', JSON.stringify(visitedPlaces));
    } catch (e) {}
}

/* 更新我的页面统计 */
function updateProfileStats() {
    const memoryCount = document.getElementById('memoryCount');
    const noteCount = document.getElementById('noteCount');
    const memoryDesc = document.getElementById('profileMemoryDesc');
    const noteDesc = document.getElementById('profileNoteDesc');

    if (memoryCount) {
        memoryCount.textContent = visitedPlaces.length;
    }
    if (noteCount) {
        noteCount.textContent = exploreNotes.length;
    }
    if (memoryDesc) {
        memoryDesc.textContent = `已点亮 ${visitedPlaces.length} 个地点`;
    }
    if (noteDesc) {
        noteDesc.textContent = `已收集 ${exploreNotes.length} 个胡同碎片`;
    }
}

/* 渲染游览回忆网格 */
function renderMemoryGrid() {
    if (!memoryGrid) return;
    memoryGrid.innerHTML = '';

    // 渲染已打卡地点
    visitedPlaces.forEach((place, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = place.id;
        card.innerHTML = `
            <div class="memory-card-image-wrap">
                <img class="memory-card-image" src="${place.image}" alt="${place.name || '打卡地点'}" style="width:100%;height:100%;object-fit:cover;">
                <button class="memory-card-delete-btn" data-index="${index}" aria-label="删除打卡">×</button>
            </div>
            <div class="memory-card-name">${place.name || '未知地点'}</div>
            <div class="memory-card-date">${place.date || ''}</div>
        `;
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('memory-card-delete-btn')) {
                e.stopPropagation();
                showDeleteConfirm(index);
                return;
            }
            showMemoryDetail(place);
        });
        memoryGrid.appendChild(card);
    });

    // 添加新打卡卡片
    const addCard = document.createElement('div');
    addCard.className = 'memory-card';
    addCard.innerHTML = `
        <div class="memory-card-image-wrap" style="border: 2px dashed #B5C833; background: rgba(255,255,255,0.3);">
            <span style="font-size: 56px; color: #B5C833; font-weight: 300; line-height: 1;">+</span>
        </div>
        <div class="memory-card-name" style="color:#b7cb2e;">添加新打卡</div>
        <div class="memory-card-date" style="color:#b7cb2e;">点击前往导览</div>
    `;
    addCard.addEventListener('click', () => {
        navigateToGuide();
    });
    memoryGrid.appendChild(addCard);
}

let deleteTargetIndex = null;

function showDeleteConfirm(index) {
    deleteTargetIndex = index;
    const overlay = document.getElementById('memoryDeleteOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideDeleteConfirm() {
    deleteTargetIndex = null;
    const overlay = document.getElementById('memoryDeleteOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function confirmDeleteCard() {
    if (deleteTargetIndex !== null && deleteTargetIndex >= 0 && deleteTargetIndex < visitedPlaces.length) {
        visitedPlaces.splice(deleteTargetIndex, 1);
        saveVisitedPlaces();
        renderMemoryGrid();
        updateProfileStats();
        showToast('已删除打卡卡片');
    }
    hideDeleteConfirm();
}

/* 显示打卡详情 */
function showMemoryDetail(place) {
    if (!memoryDetailOverlay || !memoryDetailModal) return;

    const photoEl = document.getElementById('memoryDetailPhoto');
    if (photoEl) {
        photoEl.src = place.image || '地点详情.png';
    }

    const titleEl = document.getElementById('memoryDetailTitle');
    if (titleEl) {
        titleEl.textContent = place.name || '未知地点';
    }

    const subtagEl = document.getElementById('memoryDetailSubtag');
    if (subtagEl) {
        subtagEl.textContent = place.date || '二零二六·腊月';
    }

    const textEl = document.getElementById('memoryDetailText');
    if (textEl) {
        textEl.textContent = place.desc || '已打卡地点';
    }

    memoryDetailOverlay.classList.remove('hidden');
    memoryDetailOverlay.classList.add('active');
    memoryDetailOverlay.setAttribute('aria-hidden', 'false');
    memoryDetailModal.classList.remove('hidden');
    memoryDetailModal.classList.add('archive-modal-visible');

    const memoryPage = document.getElementById('memoryPage');
    if (memoryPage) {
        memoryPage.classList.add('dimmed');
    }
}

function hideMemoryDetail() {
    const memoryPage = document.getElementById('memoryPage');
    if (memoryDetailOverlay) {
        memoryDetailOverlay.classList.add('hidden');
        memoryDetailOverlay.classList.remove('active');
        memoryDetailOverlay.setAttribute('aria-hidden', 'true');
    }
    if (memoryDetailModal) {
        memoryDetailModal.classList.add('hidden');
        memoryDetailModal.classList.remove('archive-modal-visible');
    }
    if (memoryPage) {
        memoryPage.classList.remove('dimmed');
    }
}

/* ========================================
   DOMContentLoaded
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phoneInput');
    const codeInput = document.getElementById('codeInput');
    const searchInput = document.getElementById('searchInput');
    const searchIconBtn = document.getElementById('searchIconBtn');

    locationCardOverlay = document.getElementById('locationCardOverlay');
    archiveDialogueViewport = document.getElementById('archiveDialogueViewport');
    archiveDialogueTrack = document.getElementById('archiveDialogueTrack');
    archiveMessageIntro = document.getElementById('archiveMessageIntro');
    archiveMessageChoice = document.getElementById('archiveMessageChoice');
    archiveMessageDetail = document.getElementById('archiveMessageDetail');
    archiveModalOverlay = document.getElementById('archiveModalOverlay');
    archiveAskModal = document.getElementById('archiveAskModal');
    archiveFeedbackModal = document.getElementById('archiveFeedbackModal');
    archiveCameraInput = document.getElementById('archiveCameraInput');
    archiveFeedbackPhoto = document.getElementById('archiveFeedbackPhoto');
    sharedBottomNav = document.getElementById('sharedBottomNav');
    guideMascot = document.getElementById('guideMascot');
    routePlannerPanel = document.getElementById('routePlannerPanel');
    routeSummaryChip = document.getElementById('routeSummaryChip');
    visualModalOverlay = document.getElementById('visualModalOverlay');
    visualFeedbackModal = document.getElementById('visualFeedbackModal');
    visualCameraInput = document.getElementById('visualCameraInput');
    visualFeedbackPhoto = document.getElementById('visualFeedbackPhoto');
    visualUploadPreview = document.getElementById('visualUploadPreview');
    visualUploadIcon = document.getElementById('visualUploadIcon');
    visualUploadText = document.getElementById('visualUploadText');

    /* --- 听觉元素 --- */
    hearWaveformCanvas = document.getElementById('hearWaveformCanvas');
    if (hearWaveformCanvas) {
        hearWaveformCtx = hearWaveformCanvas.getContext('2d');
        resizeWaveformCanvas(hearWaveformCanvas);
    }
    hearFeedbackWaveformCanvas = document.getElementById('hearFeedbackWaveformCanvas');
    if (hearFeedbackWaveformCanvas) {
        hearFeedbackWaveformCtx = hearFeedbackWaveformCanvas.getContext('2d');
        resizeWaveformCanvas(hearFeedbackWaveformCanvas);
    }
    hearTimer = document.getElementById('hearTimer');
    hearRecordBtn = document.getElementById('hearRecordBtn');
    hearStopBtn = document.getElementById('hearStopBtn');
    hearSubmitBtn = document.getElementById('hearSubmitBtn');
    hearModalOverlay = document.getElementById('hearModalOverlay');
    hearFeedbackModal = document.getElementById('hearFeedbackModal');
    hearContinueBtn = document.getElementById('hearContinueBtn');

    /* --- 触觉元素 --- */
    touchTextarea = document.getElementById('touchTextarea');
    touchSubmitBtn = document.getElementById('touchSubmitBtn');
    touchModalOverlay = document.getElementById('touchModalOverlay');
    touchFeedbackModal = document.getElementById('touchFeedbackModal');
    touchFeedbackTextDisplay = document.getElementById('touchFeedbackTextDisplay');
    touchContinueBtn = document.getElementById('touchContinueBtn');
    touchShareBtn = document.getElementById('touchShareBtn');

    /* --- 我的元素 --- */
    profileMemoryCard = document.getElementById('profileMemoryCard');
    profileNoteCard = document.getElementById('profileNoteCard');
    memoryGrid = document.getElementById('memoryGrid');
    memoryDetailOverlay = document.getElementById('memoryDetailOverlay');
    memoryDetailModal = document.getElementById('memoryDetailModal');
    memoryDetailPhoto = document.getElementById('memoryDetailPhoto');
    memoryDetailTitle = document.getElementById('memoryDetailTitle');
    memoryDetailSubtag = document.getElementById('memoryDetailSubtag');
    memoryDetailCloseBtn = document.getElementById('memoryDetailCloseBtn');

    /* --- 笔记元素 --- */
    noteGrid = document.getElementById('noteGrid');
    noteDetailOverlay = document.getElementById('noteDetailOverlay');
    noteDetailModal = document.getElementById('noteDetailModal');
    noteDetailTitle = document.getElementById('noteDetailTitle');
    noteDetailSubtag = document.getElementById('noteDetailSubtag');
    noteDetailTag = document.getElementById('noteDetailTag');
    noteDetailText = document.getElementById('noteDetailText');
    noteDetailContent = document.getElementById('noteDetailContent');
    noteDetailCloseBtn = document.getElementById('noteDetailCloseBtn');

    // 笔记删除弹窗按钮
    const _noteDeleteCancelBtn = document.getElementById('noteDeleteCancelBtn');
    const _noteDeleteConfirmBtn = document.getElementById('noteDeleteConfirmBtn');
    const _noteDeleteOverlay = document.getElementById('noteDeleteOverlay');
    if (_noteDeleteCancelBtn) _noteDeleteCancelBtn.addEventListener('click', hideNoteDeleteConfirm);
    if (_noteDeleteConfirmBtn) _noteDeleteConfirmBtn.addEventListener('click', confirmNoteDelete);
    if (_noteDeleteOverlay) _noteDeleteOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) hideNoteDeleteConfirm();
    });

    // 笔记详情关闭
    if (noteDetailCloseBtn) {
        noteDetailCloseBtn.addEventListener('click', hideNoteDetail);
    }
    if (noteDetailOverlay) {
        noteDetailOverlay.addEventListener('click', (e) => {
            if (e.target === noteDetailOverlay) hideNoteDetail();
        });
    }
    const noteDetailShareBtn = document.getElementById('noteDetailShareBtn');
    if (noteDetailShareBtn) {
        noteDetailShareBtn.addEventListener('click', () => showToast('分享功能暂未开放'));
    }

    const noteBackBtn = document.getElementById('noteBackBtn');
    if (noteBackBtn) {
        noteBackBtn.addEventListener('click', () => {
            hideNoteDetail();
            navigateToProfile();
        });
    }

    // 初始化打卡数据
    initVisitedPlaces();
    initRoutePlan();
    updateRouteSummary();

    phoneInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11);
    });

    codeInput.addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
    });

    phoneInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            codeInput.focus();
        }
    });

    codeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleNext();
        }
    });

    function handleSearch() {
        return handleGuideSearch(searchInput ? searchInput.value.trim() : '');
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
            }
        });
    }
    if (searchIconBtn) searchIconBtn.addEventListener('click', handleSearch);

    const _addRouteBtn = document.getElementById('addRouteBtn');
    const _viewArchiveBtn = document.getElementById('viewArchiveBtn');
    const _archiveFinishBtn = document.getElementById('archiveFinishBtn');
    const _archiveSkipPhotoBtn = document.getElementById('archiveSkipPhotoBtn');
    const _archiveTakePhotoBtn = document.getElementById('archiveTakePhotoBtn');
    const _archiveContinueBtn = document.getElementById('archiveContinueBtn');
    const _archiveShareBtn = document.getElementById('archiveShareBtn');
    if (_archiveFinishBtn) _archiveFinishBtn.addEventListener('click', handleArchiveFinish);
    if (_archiveSkipPhotoBtn) _archiveSkipPhotoBtn.addEventListener('click', navigateToGuideFromArchive);
    if (_archiveTakePhotoBtn) _archiveTakePhotoBtn.addEventListener('click', openArchiveCamera);
    if (_archiveContinueBtn) _archiveContinueBtn.addEventListener('click', navigateToGuideFromArchive);
    if (_archiveShareBtn) _archiveShareBtn.addEventListener('click', () => showToast('分享功能暂未开放'));

    if (_addRouteBtn) {
        _addRouteBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (!activeLocationId) {
                showToast('先点一个地点再安排行程');
                return;
            }
            toggleLocationInRoute(activeLocationId);
        }, true);
    }

    if (guideMascot) {
        guideMascot.addEventListener('click', () => {
            if (!routePlannerPanel) return;
            const willOpen = !routePlannerPanel.classList.contains('is-open');
            routePlannerPanel.classList.toggle('is-open', willOpen);
            routePlannerPanel.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
        });
    }

    const routePreviewBtn = document.getElementById('routePreviewBtn');
    const routeClearBtn = document.getElementById('routeClearBtn');
    const routeCollapseBtn = document.getElementById('routeCollapseBtn');
    const locationCardCloseBtn = document.getElementById('locationCardCloseBtn');
    if (routePreviewBtn) {
        routePreviewBtn.addEventListener('click', () => {
            if (!routePlan.locationIds.length) {
                showToast('先挑一条路线吧');
                return;
            }
            previewRouteOnMap();
        });
    }
    if (routeClearBtn) {
        routeClearBtn.addEventListener('click', clearRoutePlan);
    }
    if (routeCollapseBtn) {
        routeCollapseBtn.addEventListener('click', closeRoutePlannerPanel);
    }
    if (locationCardCloseBtn) {
        locationCardCloseBtn.addEventListener('click', hideLocationCard);
    }
    document.querySelectorAll('.route-theme-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const presetRoute = getPresetRouteById(button.dataset.routeTheme);
            if (!presetRoute) {
                return;
            }
            setRoutePlan(presetRoute.locationIds, presetRoute.id);
            closeRoutePlannerPanel();
            previewRouteOnMap();
        });
    });

    if (archiveCameraInput) {
        archiveCameraInput.addEventListener('change', handleArchivePhotoSelected);
    }

    if (locationCardOverlay) {
        locationCardOverlay.addEventListener('click', (event) => {
            if (event.target === locationCardOverlay) {
                hideLocationCard();
            }
        });
    }

    const locationCard = document.getElementById('locationCard');
    if (locationCard) {
        locationCard.addEventListener('click', (event) => event.stopPropagation());
    }

    document.querySelectorAll('.dialogue-choice-btn').forEach((button) => {
        button.addEventListener('click', handleArchiveChoice);
    });

    /* --- 感知卡片点击 --- */
    document.querySelectorAll('.sense-card').forEach((card) => {
        if (card.id === 'senseVisualCard' ||
            card.id === 'senseHearCard' ||
            card.id === 'senseTouchCard' ||
            card.id === 'senseRandomCard') {
            return;
        }
        card.addEventListener('click', () => showToast('该感知路线暂未开放'));
    });

    const senseVisualCard = document.getElementById('senseVisualCard');
    if (senseVisualCard) {
        senseVisualCard.addEventListener('click', navigateToVisual);
    }

    const senseHearCard = document.getElementById('senseHearCard');
    if (senseHearCard) {
        senseHearCard.addEventListener('click', navigateToHear);
    }

    const senseTouchCard = document.getElementById('senseTouchCard');
    if (senseTouchCard) {
        senseTouchCard.addEventListener('click', navigateToTouch);
    }

    const senseRandomCard = document.getElementById('senseRandomCard');
    if (senseRandomCard) {
        senseRandomCard.addEventListener('click', openFortuneModal);
    }

    /* ---- 机遇弹窗逻辑 ---- */
    const FORTUNE_SENSES = [
        {
            key: 'visual',
            name: '观·景',
            desc: '用双眼，捕捉胡同独有的光影',
            icon: '视觉.png',
            navigate: navigateToVisual,
            dotIndex: 0
        },
        {
            key: 'hear',
            name: '听·音',
            desc: '用双耳，聆听胡同的声声故事',
            icon: '听觉.png',
            navigate: navigateToHear,
            dotIndex: 1
        },
        {
            key: 'touch',
            name: '抚·物',
            desc: '用双手，感受岁月留下的温度',
            icon: '触觉.png',
            navigate: navigateToTouch,
            dotIndex: 2
        }
    ];

    let fortuneChosen = null;
    let fortuneRevealTimer = null;

    function openFortuneModal() {
        fortuneChosen = FORTUNE_SENSES[Math.floor(Math.random() * FORTUNE_SENSES.length)];

        // reset state
        const overlay = document.getElementById('fortuneOverlay');
        const iconWrap = document.getElementById('fortuneIconWrap');
        const iconImg = document.getElementById('fortuneIconImg');
        const senseName = document.getElementById('fortuneSenseName');
        const senseDesc = document.getElementById('fortuneSenseDesc');
        const goBtn = document.getElementById('fortuneGoBtn');
        [0, 1, 2].forEach(i => {
            const d = document.getElementById('fortuneDot' + i);
            if (d) d.classList.remove('active-dot');
        });
        iconImg.src = '随机.png';
        iconWrap.style.background = '';
        iconWrap.classList.remove('revealed');
        senseName.textContent = '···';
        senseName.classList.remove('show');
        senseDesc.textContent = '正在感应中…';
        senseDesc.classList.remove('show');
        goBtn.classList.remove('show');
        goBtn.onclick = null;

        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('active');

        // spinning dot animation 0→1→2
        let dotStep = 0;
        const dotTimer = setInterval(() => {
            const prev = document.getElementById('fortuneDot' + ((dotStep - 1 + 3) % 3));
            const curr = document.getElementById('fortuneDot' + dotStep);
            if (prev) prev.classList.remove('active-dot');
            if (curr) curr.classList.add('active-dot');
            dotStep = (dotStep + 1) % 3;
        }, 200);

        // after 1.4s reveal the chosen sense
        fortuneRevealTimer = setTimeout(() => {
            clearInterval(dotTimer);
            // light all dots off then light chosen
            [0, 1, 2].forEach(i => {
                const d = document.getElementById('fortuneDot' + i);
                if (d) d.classList.remove('active-dot');
            });
            const chosenDot = document.getElementById('fortuneDot' + fortuneChosen.dotIndex);
            if (chosenDot) chosenDot.classList.add('active-dot');

            iconImg.src = fortuneChosen.icon;
            iconWrap.style.background = fortuneChosen.key === 'visual' ? '#FFFFFF' : '#B6C532';
            iconWrap.classList.add('revealed');
            burstParticles(iconWrap);

            senseName.textContent = fortuneChosen.name;
            senseName.classList.add('show');
            senseDesc.textContent = fortuneChosen.desc;
            senseDesc.classList.add('show');
            goBtn.classList.add('show');
            goBtn.onclick = () => {
                closeFortuneModal();
                setTimeout(() => { fortuneChosen.navigate(); }, 300);
            };
        }, 1400);
    }

    function closeFortuneModal() {
        clearTimeout(fortuneRevealTimer);
        const overlay = document.getElementById('fortuneOverlay');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function burstParticles(container) {
        const colors = ['#B5C833', '#F0DEB8', '#C0392B', '#4A2C1E', '#E8D5A3'];
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'fortune-particle';
            const angle = (i / 10) * 2 * Math.PI;
            const dist = 55 + Math.random() * 35;
            const tx = Math.cos(angle) * dist + 'px';
            const ty = Math.sin(angle) * dist + 'px';
            p.style.cssText = `
                        background:${colors[i % colors.length]};
                        left:50%; top:50%;
                        --tx:${tx}; --ty:${ty};
                        animation: fortune-burst 0.6s ease-out ${i * 40}ms forwards;
                    `;
            container.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    }

    const fortuneCloseX = document.getElementById('fortuneCloseX');
    if (fortuneCloseX) fortuneCloseX.addEventListener('click', closeFortuneModal);

    const fortuneOverlay = document.getElementById('fortuneOverlay');
    if (fortuneOverlay) {
        fortuneOverlay.addEventListener('click', (e) => {
            if (e.target === fortuneOverlay) closeFortuneModal();
        });
    }

    const visualUploadBox = document.getElementById('visualUploadBox');
    if (visualUploadBox) {
        visualUploadBox.addEventListener('click', openVisualCamera);
    }

    const visualSubmitBtn = document.getElementById('visualSubmitBtn');
    if (visualSubmitBtn) {
        visualSubmitBtn.addEventListener('click', submitVisualTask);
    }

    if (visualCameraInput) {
        visualCameraInput.addEventListener('change', handleVisualPhotoSelected);
    }

    const visualContinueBtn = document.getElementById('visualContinueBtn');
    if (visualContinueBtn) {
        visualContinueBtn.addEventListener('click', () => {
            hideVisualModal();
            revokeVisualPhotoUrl();
            if (visualUploadPreview) {
                visualUploadPreview.src = '';
                visualUploadPreview.classList.add('hidden');
            }
            if (visualUploadIcon) {
                visualUploadIcon.classList.remove('hidden');
            }
            if (visualUploadText) {
                visualUploadText.textContent = '拍照/上传';
            }
            navigateToSense();
        });
    }
    // 视觉弹窗点击遮罩关闭
    if (visualModalOverlay) {
        visualModalOverlay.addEventListener('click', (event) => {
            if (event.target === visualModalOverlay) {
                hideVisualModal();
            }
        });
    }

    const visualShareBtn = document.getElementById('visualShareBtn');
    if (visualShareBtn) {
        visualShareBtn.addEventListener('click', () => {
            showToast('分享功能暂未开放');
        });
    }

    /* --- 听觉事件绑定 --- */
    if (hearRecordBtn) {
        hearRecordBtn.addEventListener('click', toggleRecordPlay);
    }
    if (hearStopBtn) {
        hearStopBtn.addEventListener('click', togglePlayPlayback);
    }
    if (hearSubmitBtn) {
        hearSubmitBtn.addEventListener('click', submitHearTask);
    }
    if (hearContinueBtn) {
        hearContinueBtn.addEventListener('click', continueExploreFromHear);
    }
    const hearShareBtn = document.getElementById('hearShareBtn');
    if (hearShareBtn) {
        hearShareBtn.addEventListener('click', () => showToast('分享功能暂未开放'));
    }

    const hearBackBtn = document.getElementById('hearBackBtn');
    if (hearBackBtn) {
        hearBackBtn.addEventListener('click', () => {
            cleanupHearRecording();
            hideHearModal();
            navigateToSense();
        });
    }

    if (hearModalOverlay) {
        hearModalOverlay.addEventListener('click', (event) => {
            if (event.target === hearModalOverlay) {
                // 不关闭
            }
        });
    }

    /* --- 触觉事件绑定 --- */
    if (touchSubmitBtn) {
        touchSubmitBtn.addEventListener('click', submitTouchTask);
    }
    if (touchContinueBtn) {
        touchContinueBtn.addEventListener('click', continueExploreFromTouch);
    }
    if (touchShareBtn) {
        touchShareBtn.addEventListener('click', () => showToast('分享功能暂未开放'));
    }

    const touchBackBtn = document.getElementById('touchBackBtn');
    if (touchBackBtn) {
        touchBackBtn.addEventListener('click', () => {
            hideTouchModal();
            if (touchTextarea) {
                touchTextarea.value = '';
            }
            navigateToSense();
        });
    }

    if (touchModalOverlay) {
        touchModalOverlay.addEventListener('click', (event) => {
            if (event.target === touchModalOverlay) {
                // 不关闭
            }
        });
    }

    /* --- 我的事件绑定 --- */
    if (profileMemoryCard) {
        profileMemoryCard.addEventListener('click', navigateToMemory);
    }
    if (profileNoteCard) {
        profileNoteCard.addEventListener('click', navigateToNote);
    }

    /* --- 游览回忆事件绑定 --- */
    if (memoryDetailCloseBtn) {
        memoryDetailCloseBtn.addEventListener('click', hideMemoryDetail);
    }
    if (memoryDetailOverlay) {
        memoryDetailOverlay.addEventListener('click', (event) => {
            if (event.target === memoryDetailOverlay) {
                hideMemoryDetail();
            }
        });
    }
    const memoryDetailShareBtn = document.getElementById('memoryDetailShareBtn');
    if (memoryDetailShareBtn) {
        memoryDetailShareBtn.addEventListener('click', () => showToast('分享功能暂未开放'));
    }

    const memoryBackBtn = document.getElementById('memoryBackBtn');
    if (memoryBackBtn) {
        memoryBackBtn.addEventListener('click', () => {
            hideMemoryDetail();
            navigateToProfile();
        });
    }

    /* --- 衣橱装扮：就地覆盖式横向展开（clip-path 动画） --- */
    const wardrobeSkins = {
        hat: ['帽饰1.png', '帽饰2.png', '帽饰3.png'],
        expression: ['表情1.png', '表情2.png', '表情3.png'],
        outfit: ['服饰1.png', '服饰2.png', '服饰3.png']
    };
    const selectedSkin = { hat: 0, expression: 0, outfit: 0 };

    const layerMap = {
        hat: document.getElementById('profileLayerHat'),
        expression: document.getElementById('profileLayerFace'),
        outfit: document.getElementById('profileLayerCostume')
    };

    let openWardrobeType = null;
    let openWardrobeItem = null;
    let openWardrobeClip = { l: 0, r: 0 };
    const wardrobeGrid = document.getElementById('wardrobeGrid');
    const wardrobeItems = Array.from(document.querySelectorAll('.profile-wardrobe-item'));

    function closeWardrobe() {
        const item = openWardrobeItem;
        if (!item) return;
        const { l: clipLeft, r: clipRight } = openWardrobeClip;
        const DURATION = 320;

        // 两帧拆分：先让 transition 就位，再设目标 clip-path
        item.classList.remove('wardrobe-open-done');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.style.clipPath = `inset(0 ${clipRight}px 0 ${clipLeft}px round 16px)`;
            });
        });

        setTimeout(() => {
            wardrobeGrid.style.height = '';
            wardrobeItems.forEach(el => { el.style.visibility = ''; });
            item.classList.remove('wardrobe-open', 'wardrobe-open-done');
            item.style.top = '';
            item.style.height = '';
            item.style.clipPath = '';
            openWardrobeType = null;
            openWardrobeItem = null;
        }, DURATION + 32);
    }

    function openWardrobe(item) {
        const type = item.dataset.type;

        if (openWardrobeItem) {
            wardrobeGrid.style.height = '';
            wardrobeItems.forEach(el => { el.style.visibility = ''; });
            openWardrobeItem.classList.remove('wardrobe-open', 'wardrobe-open-done');
            openWardrobeItem.style.top = '';
            openWardrobeItem.style.height = '';
            openWardrobeItem.style.clipPath = '';
        }

        const gridRect = wardrobeGrid.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const relTop = itemRect.top - gridRect.top;
        const relLeft = itemRect.left - gridRect.left;
        const gridW = gridRect.width;
        const itemW = itemRect.width;
        const clipLeft = relLeft;
        const clipRight = gridW - relLeft - itemW;

        openWardrobeClip = { l: clipLeft, r: clipRight };
        openWardrobeItem = item;
        openWardrobeType = type;

        // 锁住 grid 高度，隐藏其他格子
        wardrobeGrid.style.height = gridRect.height + 'px';
        wardrobeItems.forEach(el => {
            if (el !== item) el.style.visibility = 'hidden';
        });

        item.style.top = relTop + 'px';
        item.style.height = itemRect.height + 'px';
        item.classList.add('wardrobe-open');
        item.style.clipPath = `inset(0 ${clipRight}px 0 ${clipLeft}px round 16px)`;

        item.querySelectorAll('.wardrobe-skin-item').forEach((s, i) => {
            s.classList.toggle('selected', i === selectedSkin[type]);
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.style.clipPath = 'inset(0 0px 0 0px round 16px)';
                item.classList.add('wardrobe-open-done');
            });
        });
    }

    wardrobeItems.forEach(item => {
        item.addEventListener('click', e => {
            if (e.target.closest('.wardrobe-skin-item')) return;
            if (e.target.closest('.wardrobe-close-btn')) return;
            const type = item.dataset.type;
            if (openWardrobeType === type) {
                closeWardrobe();
            } else {
                openWardrobe(item);
            }
        });

        const closeBtn = item.querySelector('.wardrobe-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', e => {
                e.stopPropagation();
                closeWardrobe();
            });
        }

        item.querySelectorAll('.wardrobe-skin-item').forEach((skinEl, i) => {
            skinEl.addEventListener('click', e => {
                e.stopPropagation();
                const type = item.dataset.type;
                selectedSkin[type] = i;
                item.querySelectorAll('.wardrobe-skin-item').forEach((s, si) => {
                    s.classList.toggle('selected', si === i);
                });
                const layer = layerMap[type];
                if (layer) layer.src = wardrobeSkins[type][i];
            });
        });
    });

    // 删除弹窗事件绑定
    const _deleteCancelBtn = document.getElementById('deleteCancelBtn');
    const _deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
    const _memoryDeleteOverlay = document.getElementById('memoryDeleteOverlay');
    if (_deleteCancelBtn) _deleteCancelBtn.addEventListener('click', hideDeleteConfirm);
    if (_deleteConfirmBtn) _deleteConfirmBtn.addEventListener('click', confirmDeleteCard);
    if (_memoryDeleteOverlay) _memoryDeleteOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) hideDeleteConfirm();
    });

    // 初始化探索笔记数据
    initExploreNotes();

    updateSharedNav();

    window.addEventListener('resize', () => {
        if (currentPage === 'archive') {
            updateArchiveDialoguePosition();
        }
        if (map && currentPage === 'guide') {
            map.resize && map.resize();
        }
        if (currentPage === 'hear') {
            if (hearWaveformCanvas) resizeWaveformCanvas(hearWaveformCanvas);
            if (hearFeedbackWaveformCanvas) resizeWaveformCanvas(hearFeedbackWaveformCanvas);
        }
    });
});

function resizeWaveformCanvas(canvas) {
    // 统一走 forceResizeCanvas，保证 hidden 时也能拿到合理尺寸
    const screenW = window.innerWidth || 375;
    forceResizeCanvas(canvas, screenW - 32, 140);
}

/* ========================================
   探索笔记功能
   ======================================== */

function initExploreNotes() {
    const stored = localStorage.getItem('exploreNotes');
    if (stored) {
        try {
            exploreNotes = JSON.parse(stored);
            return;
        } catch (e) {}
    }
    exploreNotes = [];
    saveExploreNotes();
}

function saveExploreNotes() {
    try {
        localStorage.setItem('exploreNotes', JSON.stringify(exploreNotes));
    } catch (e) {}
}

function navigateToNote() {
    goToPage('note', () => {
        renderNoteGrid();
    });
}

function renderNoteGrid() {
    if (!noteGrid) return;

    noteGrid.innerHTML = '';

    // ---------- 1. 普通笔记卡片 ----------
    exploreNotes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.dataset.id = note.id;

        // 根据任务类型决定中间显示内容
        let innerContent = '';
        if (note.type === 'visual' && note.image) {
            // 视觉: 显示图片，填满虚线框
            innerContent =
                `<img src="${note.image}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\'color:#B5C833;font-size:14px;\'>图片加载中...</span>';">`;
        } else if (note.type === 'hear') {
            // 听觉: 显示播放按钮 + 时长
            const hasAudio = note.audio && note.audio.startsWith('data:audio');
            innerContent = `
                        <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;" 
                             onclick="event.stopPropagation(); playNoteAudio(${note.id})">
                            <div class="note-audio-play-btn" data-note-id="${note.id}" style="width:56px;height:56px;border-radius:50%;background:${hasAudio ? '#C0392B' : '#999'};display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(192,57,43,0.3);">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-left:3px;">
                                    <path d="M8 5v14l11-7z" fill="white"/>
                                </svg>
                            </div>
                            <span style="font-family:'AiDianQuYaYuan',sans-serif;font-size:13px;color:${hasAudio ? '#C0392B' : '#999'};">${note.duration || '00:00'}</span>
                        </div>
                    `;
        } else if (note.type === 'touch' && note.text) {
            // 触觉: 显示文字前几个字 + 省略号，横线背景
            const previewText = note.text.slice(0, 20) + (note.text.length > 20 ? '...' : '');
            innerContent =
                `<div style="width:100%;height:100%;padding:10px 12px;font-size:14px;color:#4A2C1E;line-height:2;background-image:linear-gradient(rgba(180,160,140,0.25) 1px, transparent 1px);background-size:100% 2em;background-position:0 0.6em;overflow:hidden;">${previewText}</div>`;
        }

        card.innerHTML = `
                    <div class="note-card-content-area">
                        ${innerContent}
                        <button class="note-card-delete-btn" data-index="${index}" aria-label="删除笔记">×</button>
                    </div>
                    <div class="note-card-name">${note.title || '探索笔记'}</div>
                    <div class="note-card-date">${note.date || ''}</div>
                `;

        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('note-card-delete-btn')) {
                e.stopPropagation();
                showNoteDeleteConfirm(index);
                return;
            }
            showNoteDetail(note);
        });

        noteGrid.appendChild(card);
    });

    // ---------- 2. 添加新笔记卡片 ----------
    const addCard = document.createElement('div');
    addCard.className = 'note-card';
    addCard.innerHTML = `
                <div class="note-card-content-area" style="border: 2px dashed #B5C833; background: rgba(255,255,255,0.4);">
                    <span style="font-size: 56px; color: #B5C833; font-weight: 300; line-height: 1;">+</span>
                </div>
                <div class="note-card-name" style="color:#b7cb2e;">添加新笔记</div>
                <div class="note-card-date" style="color:#b7cb2e;">点击前往感知</div>
            `;
    addCard.addEventListener('click', () => {
        navigateToSense();
    });

    noteGrid.appendChild(addCard);
}

function showNoteDetail(note) {
    if (!noteDetailOverlay || !noteDetailModal) return;

    // 设置标题、标签、日期等基本信息
    if (noteDetailTitle) noteDetailTitle.textContent = note.title || '感知记录';
    if (noteDetailSubtag) noteDetailSubtag.textContent = note.date || '二零二六·腊月';
    if (noteDetailTag) {
        const tagMap = { 'visual': '观·景', 'hear': '听·音', 'touch': '抚·物' };
        noteDetailTag.textContent = tagMap[note.type] || '感知';
    }
    if (noteDetailText) {
        let desc = '';
        if (note.type === 'visual') desc = '📷 拍摄的照片记录';
        else if (note.type === 'hear') desc = '🎧 录制的声音记录';
        else if (note.type === 'touch') desc = note.text || '📝 触摸感受记录';
        noteDetailText.textContent = desc;
    }

    // 设置气泡文字
    const bubbleText = document.getElementById('noteDetailBubbleText');
    if (bubbleText) {
        if (note.type === 'visual') {
            bubbleText.textContent =
                '"哎哟喂，这画面抓拍得倍儿地道！老北京那股子精气神儿全在里头了，我给您竖个大拇哥！"';
        } else if (note.type === 'hear') {
            bubbleText.textContent =
                '"得嘞！这动静真亲切，听得我心里头热乎乎的，简直就跟回了小时候的胡同口一样！"';
        } else if (note.type === 'touch') {
            bubbleText.textContent =
                '"讲究！您这感受写得也太细腻了，这砖瓦里的老故事全让您给盘活了，佩服佩服！"';
        }
    }

    // 设置内容区域 - 根据笔记类型分别渲染
    const noteDetailPhoto = document.getElementById('noteDetailPhoto');
    const noteDetailContent = document.getElementById('noteDetailContent');
    if (noteDetailPhoto && noteDetailContent) {
        if (note.type === 'visual') {
            // 视觉类型：显示照片
            if (note.image) {
                noteDetailPhoto.src = note.image;
                noteDetailPhoto.style.display = 'block';
                noteDetailContent.style.background = 'transparent';
            } else {
                noteDetailPhoto.src = '';
                noteDetailPhoto.style.display = 'none';
                noteDetailContent.style.background = 'transparent';
                noteDetailContent.innerHTML =
                    `<div style="width:85%;height:85%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:10px;gap:12px;"><span style="font-size:40px;">📷</span><span style="font-size:15px;color:#4A2C1E;">照片未保存</span></div>`;
            }
        } else if (note.type === 'hear') {
            // 听觉类型：显示播放控件
            noteDetailPhoto.src = '';
            noteDetailPhoto.style.display = 'none';
            const hasAudio = !!(note.audio && note.audio.startsWith('data:audio'));
            const playBtnBg = hasAudio ? '#C0392B' : '#999';
            noteDetailContent.style.background = 'rgba(230,210,190,0.3)';
            noteDetailContent.innerHTML = `
                        <div style="width:85%;height:85%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:10px;gap:16px;">
                            <div id="noteAudioPlayBtn" style="width:80px;height:80px;border-radius:50%;background:${playBtnBg};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 20px rgba(192,57,43,0.3);transition:transform 0.15s;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="margin-left:4px;">
                                    <path d="M8 5v14l11-7z" fill="white"/>
                                </svg>
                            </div>
                            <span style="font-family:'AiDianQuYaYuan',sans-serif;font-size:16px;color:#4A2C1E;">${note.duration || '录音记录'}</span>
                            ${!hasAudio ? '<span style="font-size:12px;color:#999;">音频未保存</span>' : ''}
                        </div>
                    `;
            // 绑定播放按钮事件
            setTimeout(() => {
                const playBtn = document.getElementById('noteAudioPlayBtn');
                if (playBtn) {
                    playBtn.addEventListener('pointerdown', () => { playBtn.style.transform = 'scale(0.92)'; });
                    playBtn.addEventListener('pointerup', () => { playBtn.style.transform = 'scale(1)'; });
                    playBtn.addEventListener('pointerleave', () => { playBtn.style.transform = 'scale(1)'; });
                    if (hasAudio) {
                        playBtn.addEventListener('click', () => playNoteAudio(note.id));
                    }
                }
            }, 100);
        } else if (note.type === 'touch') {
            // 触觉类型：显示文字内容
            noteDetailPhoto.src = '';
            noteDetailPhoto.style.display = 'none';
            noteDetailContent.style.background = 'rgba(255,248,235,0.55)';
            if (note.text) {
                noteDetailContent.innerHTML =
                    `<div style="width:85%;height:85%;padding:16px;overflow-y:auto;background-image:linear-gradient(rgba(180,160,140,0.2) 1px, transparent 1px);background-size:100% 2em;background-position:0 0.6em;border:1px solid rgba(200,180,160,0.2);border-radius:12px;margin-right:10px;display:flex;align-items:flex-start;"><div style="font-family:'AiDianQuYaYuan','PingFang SC',sans-serif;font-size:15px;line-height:2;color:#3b2a1c;white-space:pre-wrap;word-break:break-word;width:100%;">${note.text}</div></div>`;
            } else {
                noteDetailContent.innerHTML =
                    `<div style="width:85%;height:85%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:10px;gap:12px;"><span style="font-size:40px;">📝</span><span style="font-size:15px;color:#4A2C1E;">文字未保存</span></div>`;
            }
        } else {
            noteDetailPhoto.src = '';
            noteDetailPhoto.style.display = 'none';
            noteDetailContent.style.background = 'transparent';
            noteDetailContent.innerHTML =
                `<div style="width:85%;height:85%;display:flex;align-items:center;justify-content:center;margin-right:10px;"><span style="font-size:18px;color:#4A2C1E;">✨ 感知记录</span></div>`;
        }
    }

    noteDetailOverlay.classList.remove('hidden');
    noteDetailOverlay.classList.add('active');
    noteDetailModal.classList.remove('hidden');
    noteDetailModal.classList.add('archive-modal-visible');

    const notePage = document.getElementById('notePage');
    if (notePage) {
        notePage.classList.add('dimmed');
    }
}

function hideNoteDetail() {
    const notePage = document.getElementById('notePage');
    if (noteDetailOverlay) {
        noteDetailOverlay.classList.add('hidden');
        noteDetailOverlay.classList.remove('active');
    }
    if (noteDetailModal) {
        noteDetailModal.classList.add('hidden');
        noteDetailModal.classList.remove('archive-modal-visible');
    }
    if (notePage) {
        notePage.classList.remove('dimmed');
    }
    // 清理 content 区域，恢复为静态 img 结构
    const noteDetailContent = document.getElementById('noteDetailContent');
    const noteDetailPhoto = document.getElementById('noteDetailPhoto');
    if (noteDetailContent && noteDetailPhoto) {
        noteDetailContent.style.background = '';
        noteDetailContent.innerHTML = '';
        noteDetailContent.appendChild(noteDetailPhoto);
        noteDetailPhoto.src = '';
        noteDetailPhoto.style.display = 'block';
    }
}

function showNoteDeleteConfirm(index) {
    noteDeleteTargetIndex = index;
    const overlay = document.getElementById('noteDeleteOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideNoteDeleteConfirm() {
    noteDeleteTargetIndex = null;
    const overlay = document.getElementById('noteDeleteOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function confirmNoteDelete() {
    if (noteDeleteTargetIndex !== null && noteDeleteTargetIndex >= 0 && noteDeleteTargetIndex < exploreNotes
    .length) {
        exploreNotes.splice(noteDeleteTargetIndex, 1);
        saveExploreNotes();
        renderNoteGrid();
        updateProfileStats();
        showToast('已删除探索笔记');
    }
    hideNoteDeleteConfirm();
}

/* ========================================
   探索笔记音频播放功能
   ======================================== */
let noteAudioPlayer = null;
let currentlyPlayingNoteId = null;

function playNoteAudio(noteId) {
    const note = exploreNotes.find(n => n.id === noteId);
    if (!note || !note.audio) {
        showToast('音频未找到');
        return;
    }

    // 如果正在播放同一个，则停止
    if (currentlyPlayingNoteId === noteId && noteAudioPlayer && !noteAudioPlayer.paused) {
        noteAudioPlayer.pause();
        noteAudioPlayer.currentTime = 0;
        currentlyPlayingNoteId = null;
        updatePlayButtonUI(noteId, false);
        return;
    }

    // 停止之前的播放
    if (noteAudioPlayer) {
        noteAudioPlayer.pause();
        noteAudioPlayer.src = '';
        noteAudioPlayer = null;
    }
    if (currentlyPlayingNoteId && currentlyPlayingNoteId !== noteId) {
        updatePlayButtonUI(currentlyPlayingNoteId, false);
    }

    // 创建新播放器
    noteAudioPlayer = new Audio();
    let hasError = false;
    let hasStarted = false;

    // 先设置 src，再绑定事件
    noteAudioPlayer.src = note.audio;

    // 音频可以播放时触发（比 onloadeddata 更可靠）
    noteAudioPlayer.oncanplaythrough = function() {
        if (hasError) return;
        noteAudioPlayer.play().then(() => {
            hasStarted = true;
            currentlyPlayingNoteId = noteId;
            updatePlayButtonUI(noteId, true);
        }).catch(err => {
            // 用户主动中断或浏览器策略阻止，不显示错误
            if (err.name === 'AbortError' || err.name === 'NotAllowedError') {
                return;
            }
            if (!hasError) {
                hasError = true;
                currentlyPlayingNoteId = null;
                updatePlayButtonUI(noteId, false);
            }
        });
    };

    noteAudioPlayer.onended = function() {
        currentlyPlayingNoteId = null;
        updatePlayButtonUI(noteId, false);
    };

    // 只捕获真正的加载错误（如格式不支持、网络错误）
    noteAudioPlayer.onerror = function() {
        if (hasStarted || hasError) return;
        hasError = true;
        const errorCode = noteAudioPlayer.error ? noteAudioPlayer.error.code : 0;
        // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED, 2 = MEDIA_ERR_NETWORK
        if (errorCode === 4 || errorCode === 2) {
            showToast('音频格式不支持');
        }
        currentlyPlayingNoteId = null;
        updatePlayButtonUI(noteId, false);
    };

    // 加载音频（触发 canplaythrough）
    noteAudioPlayer.load();
}

function updatePlayButtonUI(noteId, isPlaying) {
    // 更新卡片上的按钮
    const cards = document.querySelectorAll('.note-card');
    cards.forEach(card => {
        if (parseInt(card.dataset.id) === noteId) {
            const btnDiv = card.querySelector('.note-audio-play-btn');
            if (btnDiv) {
                btnDiv.style.background = isPlaying ? '#9C503F' : '#C0392B';
                btnDiv.innerHTML = isPlaying ?
                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="4" height="16" rx="1" fill="white"/><rect x="14" y="4" width="4" height="16" rx="1" fill="white"/></svg>` :
                    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-left:3px;"><path d="M8 5v14l11-7z" fill="white"/></svg>`;
            }
        }
    });

    // 更新详情弹窗中的按钮
    const detailBtn = document.getElementById('noteAudioPlayBtn');
    if (detailBtn && currentlyPlayingNoteId === noteId) {
        detailBtn.style.background = isPlaying ? '#9C503F' : '#C0392B';
        detailBtn.innerHTML = isPlaying ?
            `<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="7" y="4" width="4" height="16" rx="1" fill="white"/><rect x="15" y="4" width="4" height="16" rx="1" fill="white"/></svg>` :
            `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="margin-left:4px;"><path d="M8 5v14l11-7z" fill="white"/></svg>`;
    }
}