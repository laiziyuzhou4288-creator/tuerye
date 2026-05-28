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
let activeMarkerNode = null;
let archiveContext = null;

const MAP_FALLBACK_IMAGE = '地点详情.png';
const GUIDE_MARKER_ICON_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAABCdJREFUeAHdms1uE1cUx/9nHJQgtZJ3RGLRYdtFcZ6gk12lSi08Qe0VpFFF+wQ4T0CiCiFWCUtWCAnWhB3LSXgAZoOwxQIjRYr5uodzHEdEMB/33rljW/wkS/HMtWd+c+7HOdcBvnMIDXKnsxobIIkMfpIrxQxuE6g9PZ2BkXFkDuR4tpm+TtEAwQVFKiHDfxqKuiRCDh/N5LX/kXDvn3Swj0AEExSxLphuANxBfbKI0L+WDu6hJrUFNWLS1XblzxjhyeQO1zfSQQZPvAV3O+32Mc73ifkGGsYQtjbTQR8eeAnq5AHmB/LxEN3REk5BdNU1ms6CJ3J4gma6ZBXOXdZJcM5ypzhJRrBEx9wCyGFyfRkek/uxwFpQJxTMX24KdY7N8k2rljaNTta4yVKwUEhSsF6VFNhFkGH1tGbNkjz0qq5aKSjR62NhuuY3xGOzUroOV0eQ8RdqwKCRJAPbZKIr595TrC/zobXWMkjk9B5OclD/7yf+t+x86RisM/ZOxVai8U4vHY3K2t79ZfWmZCt9eELEV66nw4d556KKu/SNXsYUrW8cDraq5JRr0s5Qaw2e0WSmwigWRnC3E7fHPH4D14tp5IjXfBLk252LHWLzxLHMkmvy6Dy9u5T3MAsjeIx3CTyI2PR9s//N9GUqd7sFR7SIPsJKbl5cKChV+K9wJ7t+ONxBDf4+fLUNj656zvDlvOOFgjI7OVcKzP4TxVkinsyubtcmcosgvuydWEMRniIAJoJPJR/nHSwRdB/odSrvs3h+T5x30DrZrkIGeuVy4EiGAAQTbIAYAQgpGNvWaFVMCmt3sryDhYLS5Zw3YovWIg8SBKJ4mZBJA44shSqrPFJEyXtzA1IcQXaPoJD8r/ukNZh2zwSOfGTs5x0vjmDED+HBEvMt37F4Zt/HmVaLDvKOFwpO16IMzlBnzCu34IjKjXnZa1NLhlNatHaWzqI+KdOU7p3Lqy9sZ0NtdyLnuZHMtF10qrTg9S2ZvmLP0KedvJ/Hpr9r6ITSRR0Il4oiWLmrJpHQbpOgJpM6EaczHbcZUexa9xWwt3Ew6BWdXEIVhJ7c3QvUZCqTnL6T9wgCldePlZmMhp5K+vhckfKsKjG3StWWo2V9ShkWi0z3fKoaWQn20mwkm0JXOXzF4MXkPmRX26atdbKt+yWymfQfFgHzqWdbM7bgwOPBUfr7hR/fEuE3zAlZm7sbz4f3bds7CSqPh0fP/rjwg6yt4TJ+W1RO9lCdtjOcBZVHw6Ons5b0kVO8BJVZSvrKKd6Cyiwk68gptQSVJiXryim1BZUmJEPIKUEElZCSoeSUYIJKCMmQckpQQaWOZGg5Jbig4iPZhJzSiKDiItmUnNKYoGIj2aSc0qigUibZtJzSuKCSJzkLOWUmgspZyVnJzYXbP1+c4T/RAp8BRlvuoLXFtUcAAAAASUVORK5CYII=';
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
    {
        id: 'yindingqiao',
        name: '银锭桥',
        type: 'landmark',
        lngLat: [116.3864, 39.9408],
        shortDesc: '桥身不长，却把前海、后海和烟火气都串在一块，是什刹海最有代表性的视角之一。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['桥', '湖景', '视角'],
        archive: {
            hero: '站在银锭桥上，前海后海一下都收进眼里，这地方最会讲什刹海的气韵。',
            intro: '银锭桥因桥形似银锭得名，自明清以来就是眺望西山和湖面的经典节点。',
            choiceTitle: '您更想看桥，还是看桥下这片水？',
            choicePrimary: '看桥上的来往人群',
            choiceSecondary: '先看水面的光',
            detail: '别看桥不大，它像个针脚，把水、街、胡同和人情味都缝在一起。清晨和傍晚，桥边的风最有老北京的松弛感。',
            ask: '银锭桥这一眼很值当，要不要拍张带水面的照片，留住这会儿的风景？',
            feedback: '好家伙，这水光和桥影一收，什刹海的味儿就全在画面里了。'
        }
    },
    {
        id: 'yandaixiejie',
        name: '烟袋斜街',
        type: 'hutong',
        lngLat: [116.3944, 39.9407],
        shortDesc: '一条斜斜穿过去的老街，店铺、牌匾和胡同转角都很适合慢慢看。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['胡同', '老街', '逛街'],
        archive: {
            hero: '烟袋斜街最妙的就是这股斜劲儿，一拐一拐，把老街味道都拐出来了。',
            intro: '烟袋斜街成形于元代，清末民初时因经营烟具、杂货而闻名。',
            choiceTitle: '您会先看招牌，还是先钻进小店？',
            choicePrimary: '先看老招牌',
            choiceSecondary: '先进店里逛逛',
            detail: '这条街的趣味不在“快走完”，而在慢慢看牌匾、窗格、门脸和拐角的层次。越是放慢脚步，越能看出旧街的节奏。',
            ask: '这条斜街的烟火气挺上镜，要不要拍一张，把今天的步子也留住？',
            feedback: '拍得好，街口那股热闹和松快劲儿都被你抓住了。'
        }
    },
    {
        id: 'guomoruo',
        name: '郭沫若故居',
        type: 'landmark',
        lngLat: [116.3871, 39.9388],
        shortDesc: '临着前海的一处静院，院子不喧闹，适合接上文化脉络慢慢逛。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['故居', '文学', '院落'],
        archive: {
            hero: '这院子一静下来，文人的气口也跟着安稳下来。',
            intro: '郭沫若故居位于前海西街，院落与湖景相映，是什刹海文化地标之一。',
            choiceTitle: '您更在意故居里的故事，还是院落的气质？',
            choicePrimary: '先听故事',
            choiceSecondary: '先看院落',
            detail: '这里的魅力在于“静”。走近一点，会发现院墙、树影和水岸一起，把人从热闹街口慢慢拽回到书卷气里。',
            ask: '这地方适合留一张安静点的照片，您要不要试试？',
            feedback: '这张有气口，安静、稳当，还挺有书卷味。'
        }
    },
    {
        id: 'songqingling',
        name: '宋庆龄故居',
        type: 'landmark',
        lngLat: [116.3810, 39.9451],
        shortDesc: '园林尺度舒展，适合与历史线或放松路线衔接，节奏会明显慢下来。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['故居', '园林', '休憩'],
        archive: {
            hero: '宋庆龄故居这边宽宽缓缓的，特别适合把脚步慢下来。',
            intro: '这处院落原为清代王府花园的一部分，后来成为宋庆龄长期生活和工作的地方。',
            choiceTitle: '您会先看园子，还是先找故居里的旧痕迹？',
            choicePrimary: '先看园子',
            choiceSecondary: '先找旧痕迹',
            detail: '园子里层次很舒展，树、亭、水和院墙之间留着很多余白。走到这里，什刹海就不只是热闹，更有一种沉静和温度。',
            ask: '这片园子适合拍得松一点，要不要留张轻轻的照片？',
            feedback: '这张拍得挺松弛，园子的呼吸感出来了。'
        }
    },
    {
        id: 'nanluo',
        name: '南锣鼓巷',
        type: 'hutong',
        lngLat: [116.4038, 39.9365],
        shortDesc: '胡同肌理密、分叉多，适合串联周边巷子做延展游览。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['胡同', '街巷', '热闹'],
        archive: {
            hero: '南锣鼓巷这片最适合边走边看，巷子里的节奏跟主街完全不一样。',
            intro: '南锣鼓巷形成于元大都时期，是北京保存较完整的棋盘式胡同街区之一。',
            choiceTitle: '您想继续沿主街走，还是往旁边胡同里拐？',
            choicePrimary: '沿主街走',
            choiceSecondary: '拐进侧巷',
            detail: '真正有意思的，不只是主街上的热闹，更是从主街拐进侧巷后那种尺度变化。声音、门脸和步速都会突然收下来。',
            ask: '要不要拍一张带门脸或巷口的照片，把胡同尺度留住？',
            feedback: '这张带着点转角感，看着就知道是在老街区里走出来的。'
        }
    },
    {
        id: 'belltower',
        name: '钟鼓楼',
        type: 'landmark',
        lngLat: [116.3951, 39.9461],
        shortDesc: '高点望向周边胡同，适合作为历史路线的收束节点。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['鼓楼', '钟楼', '制高点'],
        archive: {
            hero: '钟鼓楼一抬头，老北京的城市秩序感就出来了。',
            intro: '钟鼓楼自元代起就是都城报时中心，也是观察周边胡同格局的重要地标。',
            choiceTitle: '您更在意建筑本身，还是它统领街巷的感觉？',
            choicePrimary: '建筑本身',
            choiceSecondary: '统领街巷的感觉',
            detail: '从这里回望，会更容易明白什刹海和周边胡同为什么既亲切又有秩序。它不只是高，而是把城市的节拍立住了。',
            ask: '这里适合来一张有仰视感的照片，要不要试试？',
            feedback: '这张有精神，楼的劲头和老城的骨架都撑住了。'
        }
    },
    {
        id: 'houhai',
        name: '后海北沿',
        type: 'relax',
        lngLat: [116.3858, 39.9436],
        shortDesc: '看水、吹风、慢走都合适，是放松线里最稳的一段。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['湖边', '散步', '发呆'],
        archive: {
            hero: '后海边最不缺的就是风，一站住，人就容易慢下来。',
            intro: '后海是什刹海水域中最适合散步与停留的一段，四季景色都很耐看。',
            choiceTitle: '您会继续走，还是想在这儿先停一会儿？',
            choicePrimary: '继续沿湖走',
            choiceSecondary: '先停一会儿',
            detail: '后海最动人的不是某一个点，而是连续的岸线、树影和水面。走得越慢，越能感受到它把人从“赶路”拽成“游逛”。',
            ask: '这会儿的湖边挺适合留影，要不要来一张带水面的打卡？',
            feedback: '好，这张一看就有风，后海的闲适感出来了。'
        }
    },
    {
        id: 'hehuashichang',
        name: '荷花市场',
        type: 'food',
        lngLat: [116.3921, 39.9368],
        shortDesc: '临水又热闹，适合把美食线和湖边散步接在一起。',
        image: MAP_FALLBACK_IMAGE,
        tags: ['美食', '临水', '热闹'],
        archive: {
            hero: '荷花市场这块儿就是热闹，水边一坐，吃喝逛全齐了。',
            intro: '荷花市场一直是什刹海沿岸颇具人气的休闲与餐饮聚集地。',
            choiceTitle: '您更想找口吃的，还是先沿着水边溜达？',
            choicePrimary: '先找吃的',
            choiceSecondary: '先沿水边走',
            detail: '这里最妙的是“边吃边逛”。前一秒还在街边挑味道，下一秒就能挪到水边，把节奏放松下来。',
            ask: '这儿烟火气足，要不要留一张带人气的照片？',
            feedback: '拍得有热闹劲儿，看到这张就知道这站没白来。'
        }
    },
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
    if (mapInitialized) return;

    // 高德 SDK 还未加载完，等待后重试
    if (typeof AMap === 'undefined' || !window._amapReady) {
        setTimeout(legacyInitMap, 100);
        return;
    }

    const container = document.getElementById('mapContainer');
    if (!container) return;

    // ---- 高德地图初始化 ----
    map = new AMap.Map(container, {
        center: [116.383, 39.9388],   // 注意高德是 [经度, 纬度]
        zoom: 15,
        zooms: [10, 20],
        mapStyle: 'amap://styles/whitesmoke',
        resizeEnable: true
    });

    // 右上角缩放控件
    map.addControl(new AMap.ToolBar({
        position: { right: '12px', top: '60px' }
    }));

    // ---- 地点数据（后续在这里扩充） ----
    const locations = [
        {
            name: '恭王府',
            position: [116.3835, 39.9365],
            desc: '一座恭王府，半部清代史。保存最完整的清代王府建筑群。'
        }
    ];

    // ---- 自定义标记点 ----
    locations.forEach(loc => {
        const markerContent = `
            <div class="custom-map-marker">
                <div class="marker-pin">
                    <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="#C0392B"/>
                        <circle cx="15" cy="14" r="6" fill="white"/>
                    </svg>
                </div>
            </div>`;

        const marker = new AMap.Marker({
            position: loc.position,
            content: markerContent,
            anchor: 'bottom-center',
            offset: new AMap.Pixel(0, 0)
        });

        marker.setMap(map);

        // 点击标记显示地点卡片
        marker.on('click', () => {
            // 更新卡片内容
            const titleEl = document.querySelector('.location-card-title');
            const descEl  = document.querySelector('.location-card-desc');
            if (titleEl) titleEl.textContent = loc.name;
            if (descEl)  descEl.textContent  = loc.desc;
            legacyShowLocationCard();
        });
    });

    // 点击地图空白处收起卡片
    map.on('click', legacyHideLocationCard);

    // ---- 搜索框：高德自动补全 ----
    const searchInput = document.getElementById('searchInput');
    const searchBtn   = document.getElementById('searchIconBtn');

    if (searchInput) {
        // 自动补全
        const autoComplete = new AMap.AutoComplete({
            input: 'searchInput',
            city: '北京',
            citylimit: false
        });

        autoComplete.on('select', e => {
            const place = e.poi;
            if (place && place.location) {
                map.setCenter(place.location);
                map.setZoom(16);
            }
        });

        // 搜索按钮点击
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const keyword = searchInput.value.trim();
                if (!keyword) return;
                const placeSearch = new AMap.PlaceSearch({ city: '北京', map });
                placeSearch.search(keyword);
            });
        }

        // 回车搜索
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                searchBtn && searchBtn.click();
            }
        });
    }

    mapInitialized = true;
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
    const inRoute = !!location && routePlan.locationIds.includes(location.id);

    if (titleEl) titleEl.textContent = location ? location.name : '';
    if (descEl) descEl.textContent = location ? location.shortDesc : '';
    if (imageEl && location) {
        imageEl.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.18)), url('${location.image || MAP_FALLBACK_IMAGE}')`;
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
    guideMarkers.forEach(({ marker, label, markerNode }, locationId) => {
        const location = getGuideLocationById(locationId);
        if (!location) {
            return;
        }
        const isInRoute = routePlan.locationIds.includes(locationId);
        const isActive = activeLocationId === locationId;
        const shouldEmphasize = isInRoute || isActive || !routePlan.locationIds.length;
        const isStart = routePlan.locationIds[0] === locationId;
        const isEnd = routePlan.locationIds[routePlan.locationIds.length - 1] === locationId;

        if (marker) {
            marker.setOpacity(shouldEmphasize ? 1 : 0.45);
            marker.setZIndex(isActive ? 200 : (isInRoute ? 160 : 150));
        }

        // 同步 CSS 类到 DOM 节点，使图标样式随状态正确更新
        if (markerNode) {
            markerNode.classList.toggle('is-active', isActive);
            markerNode.classList.toggle('is-in-route', isInRoute);
            markerNode.classList.toggle('is-start', isStart);
            markerNode.classList.toggle('is-end', isEnd);
        }

        if (label) {
            // 始终显示标签，路线内/激活时高亮，无路线时全部显示
            label.setOpacity(1);
            const isStart = routePlan.locationIds[0] === locationId;
            const isEnd = routePlan.locationIds[routePlan.locationIds.length - 1] === locationId;

            if (isStart || isEnd) {
                label.setStyle({
                    'background-color': 'rgba(181,200,51,0.25)',
                    'border': '1.5px solid rgba(181,200,51,0.8)',
                    'color': '#4a3121',
                    'font-weight': '700'
                });
            } else if (isInRoute) {
                label.setStyle({
                    'background-color': 'rgba(255,248,236,0.97)',
                    'border': '1.5px solid rgba(181,200,51,0.8)',
                    'color': '#4a3121',
                    'font-weight': '700'
                });
            } else {
                label.setStyle({
                    'background-color': 'rgba(255,248,236,0.94)',
                    'border': '1.5px solid rgba(78,52,39,0.12)',
                    'color': '#6d5848',
                    'font-weight': '400'
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

    if (summaryName) summaryName.textContent = presetRoute ? presetRoute.name : (routeLocations.length ? '自定义路线' : '未选择路线');
    if (summaryCount) summaryCount.textContent = `${routeLocations.length} 站`;
    if (currentTitle) currentTitle.textContent = routeLocations.length ? (presetRoute ? presetRoute.name : '自定义路线') : '还没选路线';
    if (currentDesc) {
        currentDesc.textContent = routeLocations.length
            ? (presetRoute ? presetRoute.description : '您已经手动安排了一条自己的游览顺序。')
            : '点一个主题，我就把推荐的游览顺序铺在地图上。';
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

function syncRoutePolyline() {
    if (!map || typeof AMap === 'undefined') {
        return;
    }

    const path = routePlan.locationIds
        .map((locationId) => getGuideLocationById(locationId))
        .filter(Boolean)
        .map((location) => location.lngLat);

    if (routePolylineOuter) {
        routePolylineOuter.setMap(null);
        routePolylineOuter = null;
    }
    if (routePolylineInner) {
        routePolylineInner.setMap(null);
        routePolylineInner = null;
    }

    if (path.length >= 2) {
        routePolylineOuter = new AMap.Polyline({
            path,
            strokeColor: '#6D4C41',
            strokeWeight: 12,
            strokeOpacity: 0.28,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 90
        });
        routePolylineInner = new AMap.Polyline({
            path,
            strokeColor: '#B5C833',
            strokeWeight: 7,
            strokeOpacity: 1,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 91
        });
        routePolylineOuter.setMap(map);
        routePolylineInner.setMap(map);
    }

    updateMarkerStates();
    updateRouteSummary();
    saveRoutePlan();
}

function setRoutePlan(locationIds, presetId = null) {
    const normalizedIds = sortRouteLocationsByDirection(locationIds);
    routePlan = {
        presetId,
        locationIds: normalizedIds
    };
    activePresetRouteId = presetId;
    syncRoutePolyline();
}

function closeRoutePlannerPanel() {
    if (!routePlannerPanel) {
        return;
    }
    routePlannerPanel.classList.remove('is-open');
    routePlannerPanel.setAttribute('aria-hidden', 'true');
}

function previewRouteOnMap() {
    if (!map || !routePlan.locationIds.length) {
        return;
    }

    const path = routePlan.locationIds
        .map((locationId) => getGuideLocationById(locationId))
        .filter(Boolean)
        .map((location) => location.lngLat);

    closeRoutePlannerPanel();
    hideLocationCard();
    syncRoutePolyline();
    if (path.length >= 2) {
        const routeMarkers = routePlan.locationIds
            .map((locationId) => guideMarkers.get(locationId))
            .filter((entry) => entry && entry.marker)
            .map((entry) => entry.marker);
        map.setFitView([routePolylineOuter, routePolylineInner, ...routeMarkers], false, [54, 54, 180, 54]);
    } else if (path.length === 1) {
        map.setCenter(path[0]);
        map.setZoom(15.8);
    }
}

function clearRoutePlan() {
    routePlan = { presetId: null, locationIds: [] };
    activePresetRouteId = null;
    syncRoutePolyline();
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

function focusLocation(locationId, options = {}) {
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
    const heroText = document.getElementById('archiveHeroText');
    const introText = document.getElementById('archiveIntroText');
    const choiceTitle = document.getElementById('archiveChoiceTitle');
    const choicePrimary = document.getElementById('archiveChoicePrimary');
    const choiceSecondary = document.getElementById('archiveChoiceSecondary');
    const detailText = archiveMessageDetail ? archiveMessageDetail.querySelector('p') : null;
    const askText = archiveAskModal ? archiveAskModal.querySelector('.archive-ask-bubble p') : null;
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

function buildMarkerContent(location) {
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
        center: [116.3900, 39.9405],
        zoom: 15.6,
        zooms: [14, 18],
        mapStyle: 'amap://styles/fresh',
        resizeEnable: true,
        pitchEnable: false,
        rotateEnable: false,
        viewMode: '2D'
    });

    map.setLimitBounds(new AMap.Bounds([116.3700, 39.9280], [116.4150, 39.9520]));
    map.addControl(new AMap.ToolBar({
        position: { right: '14px', top: '72px' }
    }));

    guideLocations.forEach((location) => {
        // 使用内联 SVG content，避免外部图片路径在高德 SDK 下解析失败
        const marker = new AMap.Marker({
            position: location.lngLat,
            content: buildMarkerContent(location),
            anchor: 'bottom-center',
            clickable: true,
            zIndex: 150,
            title: location.name
        });

        marker.setMap(map);

        // 创建文字标签
        const label = new AMap.Text({
            text: location.name,
            position: location.lngLat,
            offset: new AMap.Pixel(0, -54),
            style: {
                'padding': '4px 10px',
                'border-radius': '999px',
                'background-color': 'rgba(255,248,236,0.94)',
                'border': '1.5px solid rgba(78,52,39,0.12)',
                'color': '#4a3121',
                'font-size': '12px',
                'font-family': 'PingFang SC, sans-serif',
                'white-space': 'nowrap',
                'box-shadow': '0 8px 20px rgba(74,49,33,0.12)',
                'text-align': 'center'
            },
            zIndex: 160
        });
        label.setMap(map);

        // markerNode 在地图渲染完成后才可靠获取，先存 null，complete 事件后再填入
        guideMarkers.set(location.id, { marker, label, markerNode: null });
        marker.on('click', (e) => {
            // 阻止冒泡到地图 click（否则 hideLocationCard 会立即关掉弹窗）
            if (e && e.originEvent) {
                e.originEvent.stopPropagation();
            }
            focusLocation(location.id);
        });
    });

    // 地图瓦片渲染完成后再获取 DOM 节点，此时 getElement() 才稳定返回真实节点
    map.on('complete', () => {
        guideMarkers.forEach(({ marker }, locationId) => {
            const el = marker.getElement ? marker.getElement() : null;
            if (el) {
                const entry = guideMarkers.get(locationId);
                entry.markerNode = el;
                // 阻止按钮的原生点击冒泡到地图容器，避免 hideLocationCard 被触发
                el.addEventListener('click', (domEvent) => {
                    domEvent.stopPropagation();
                });
            }
        });
        updateMarkerStates();
    });

    map.on('click', hideLocationCard);

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
    resetArchiveDialogueSequence();
    hideArchiveModal();
    queueArchiveTask(() => {
        revealArchiveDialogue(archiveMessageIntro);
        queueArchiveTask(() => revealArchiveDialogue(archiveMessageChoice), getRandomDelay());
    }, 3000);
}

function handleArchiveFinish() {
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
        showVisualModal();
    };
}

/* ========================================
   听觉页面功能
   ======================================== */
function initHearPage() {
    cleanupHearRecording();
    audioChunks = [];
    isRecording = false;
    isPlaying = false;
    elapsedTime = 0;
    audioUrl = null;
    if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement = null;
    }

    if (hearTimer) {
        hearTimer.textContent = '00:00:00';
    }
    if (hearRecordBtn) {
        hearRecordBtn.classList.remove('is-recording', 'is-playing');
    }
    if (hearSubmitBtn) {
        hearSubmitBtn.disabled = true;
    }
    if (hearWaveformCanvas && hearWaveformCtx) {
        hearWaveformCtx.clearRect(0, 0, hearWaveformCanvas.width, hearWaveformCanvas.height);
        drawEmptyWaveform();
    }
    if (hearFeedbackWaveformCanvas && hearFeedbackWaveformCtx) {
        hearFeedbackWaveformCtx.clearRect(0, 0, hearFeedbackWaveformCanvas.width, hearFeedbackWaveformCanvas.height);
        drawEmptyFeedbackWaveform();
    }
    if (hearStopBtn) {
        hearStopBtn.style.opacity = '0.5';
        hearStopBtn.style.pointerEvents = 'none';
    }
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
    const barCount = 32;
    const barWidth = 6;
    const gap = 8;
    const totalWidth = barCount * (barWidth + gap) - gap;
    const startX = (w - totalWidth) / 2;
    const centerY = h / 2;

    hearWaveformCtx.clearRect(0, 0, w, h);

    const step = Math.floor(dataArray.length / barCount);
    for (let i = 0; i < barCount; i++) {
        const idx = i * step;
        const val = dataArray[idx] || 0;
        const normalized = val / 128.0;
        const height = Math.max(4, normalized * 40);
        const x = startX + i * (barWidth + gap);
        const y = centerY - height / 2 - 10;
        const alpha = 0.5 + normalized * 0.5;
        hearWaveformCtx.fillStyle = `rgba(166, 92, 72, ${alpha})`;
        // 绘制圆角矩形
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

function drawFeedbackWaveformFromAudio(url) {
    const decodeAndDrawFeedback = (arrayBuffer) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(arrayBuffer)
            .then(decoded => {
                const channelData = decoded.getChannelData(0);
                const sampleStep = Math.floor(channelData.length / 24);
                const dataArray = new Uint8Array(24);
                for (let i = 0; i < 24; i++) {
                    const idx = i * sampleStep;
                    const val = Math.abs(channelData[idx] || 0);
                    dataArray[i] = Math.min(255, Math.floor(val * 255));
                }
                drawFeedbackWaveformFromData(dataArray);
            })
            .catch(err => {
                console.warn('无法解码音频绘制反馈波形:', err);
                drawEmptyFeedbackWaveform();
            });
    };

    if (lastAudioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => decodeAndDrawFeedback(reader.result);
        reader.readAsArrayBuffer(lastAudioBlob);
    } else {
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => decodeAndDrawFeedback(buf))
            .catch(err => {
                console.warn('fetch 失败:', err);
                drawEmptyFeedbackWaveform();
            });
    }
}

function startRecording() {
    if (isRecording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            // Pick a MIME type that's widely supported on mobile
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : '';
            mediaRecorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            audioChunks = [];
            isRecording = true;
            isPlaying = false;

            // timeslice=100ms ensures data arrives even on short recordings
            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                isRecording = false;

                // Stop animation loop first
                if (waveformAnimationId) {
                    cancelAnimationFrame(waveformAnimationId);
                    waveformAnimationId = null;
                }
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }

                // Stop microphone tracks
                stream.getTracks().forEach(t => t.stop());

                const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
                lastAudioBlob = blob; // store for FileReader-based decode
                if (audioUrl) URL.revokeObjectURL(audioUrl);
                audioUrl = URL.createObjectURL(blob);

                if (audioElement) {
                    audioElement.src = audioUrl;
                } else {
                    audioElement = new Audio(audioUrl);
                }
                audioElement.onended = () => {
                    isPlaying = false;
                    if (hearRecordBtn) hearRecordBtn.classList.remove('is-playing');
                    if (hearStopBtn) hearStopBtn.classList.remove('is-playing');
                };

                if (hearSubmitBtn) hearSubmitBtn.disabled = false;
                if (hearStopBtn) {
                    hearStopBtn.style.opacity = '1';
                    hearStopBtn.style.pointerEvents = 'auto';
                }
                if (hearRecordBtn) hearRecordBtn.classList.remove('is-recording');

                drawWaveformFromAudio(audioUrl);
            };

            mediaRecorder.start(100); // collect data every 100ms
            startTime = Date.now() - elapsedTime;
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 100);

            if (hearRecordBtn) hearRecordBtn.classList.add('is-recording');
            if (hearStopBtn) {
                hearStopBtn.style.opacity = '0.5';
                hearStopBtn.style.pointerEvents = 'none';
            }
            if (hearSubmitBtn) hearSubmitBtn.disabled = true;

            // Real-time waveform via Web Audio analyser
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function animateWaveform() {
                waveformAnimationId = requestAnimationFrame(animateWaveform);
                analyser.getByteFrequencyData(dataArray);
                drawWaveformFromData(dataArray);
                if (!isRecording) {
                    cancelAnimationFrame(waveformAnimationId);
                    waveformAnimationId = null;
                }
            }
            animateWaveform();

            mediaRecorder._audioContext = audioContext;
        })
        .catch((err) => {
            showToast('无法访问麦克风，请检查权限设置');
            console.error('麦克风访问被拒绝:', err);
        });
}

function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    mediaRecorder.stop();
}

function playRecording() {
    if (!audioUrl || isPlaying) return;
    if (!audioElement) {
        audioElement = new Audio(audioUrl);
        audioElement.onended = () => {
            isPlaying = false;
            if (hearStopBtn) {
                hearStopBtn.classList.remove('is-playing');
            }
        };
    }
    audioElement.play();
    isPlaying = true;
    if (hearStopBtn) {
        hearStopBtn.classList.add('is-playing');
    }
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
    // Use the stored blob directly if available, otherwise fall back to fetch
    const decodeAndDraw = (arrayBuffer) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(arrayBuffer)
            .then(decoded => {
                const channelData = decoded.getChannelData(0);
                const sampleStep = Math.floor(channelData.length / 48);
                const dataArray = new Uint8Array(48);
                for (let i = 0; i < 48; i++) {
                    const idx = i * sampleStep;
                    const val = Math.abs(channelData[idx] || 0);
                    dataArray[i] = Math.min(255, Math.floor(val * 255));
                }
                drawWaveformFromData(dataArray);
                drawFeedbackWaveformFromData(dataArray);
            })
            .catch(err => {
                console.warn('无法解码音频绘制波形:', err);
                drawEmptyWaveform();
            });
    };

    // Prefer stored blob over object URL (more reliable on mobile)
    if (lastAudioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => decodeAndDraw(reader.result);
        reader.readAsArrayBuffer(lastAudioBlob);
    } else {
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => decodeAndDraw(buf))
            .catch(err => {
                console.warn('fetch blob URL 失败:', err);
                drawEmptyWaveform();
            });
    }
}

function submitHearTask() {
    if (!audioUrl) {
        showToast('请先录制一段声音');
        return;
    }

    // 将音频 Blob 转换为 base64 存储
    fetch(audioUrl)
        .then(res => res.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64Audio = reader.result;

                // 保存到探索笔记
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
                showHearModal();
            };
            reader.readAsDataURL(blob);
        })
        .catch(err => {
            console.error('音频转换失败:', err);
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
        });
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
        noteCount.textContent = visitedPlaces.length * 3; // 模拟碎片数量
    }
    if (memoryDesc) {
        memoryDesc.textContent = `已点亮 ${visitedPlaces.length} 个地点`;
    }
    if (noteDesc) {
        noteDesc.textContent = `已收集 ${visitedPlaces.length * 3} 个胡同碎片`;
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
        if (query) {
            showToast(`正在搜索：${query}`);
        } else {
            showToast('请输入搜索内容');
        }
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
    if (_viewArchiveBtn) _viewArchiveBtn.addEventListener('click', navigateToArchive);
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
        senseRandomCard.addEventListener('click', () => showToast('机遇路线暂未开放'));
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
        hat:        ['帽饰1.png', '帽饰2.png', '帽饰3.png'],
        expression: ['表情1.png', '表情2.png', '表情3.png'],
        outfit:     ['服饰1.png', '服饰2.png', '服饰3.png']
    };
    const selectedSkin = { hat: 0, expression: 0, outfit: 0 };

    const layerMap = {
        hat:        document.getElementById('profileLayerHat'),
        expression: document.getElementById('profileLayerFace'),
        outfit:     document.getElementById('profileLayerCostume')
    };

    let openWardrobeType = null;
    let openWardrobeItem = null;
    let openWardrobeClip = { l: 0, r: 0 };
    const wardrobeGrid  = document.getElementById('wardrobeGrid');
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
            item.style.top      = '';
            item.style.height   = '';
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
            openWardrobeItem.style.top      = '';
            openWardrobeItem.style.height   = '';
            openWardrobeItem.style.clipPath = '';
        }

        const gridRect = wardrobeGrid.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const relTop   = itemRect.top  - gridRect.top;
        const relLeft  = itemRect.left - gridRect.left;
        const gridW    = gridRect.width;
        const itemW    = itemRect.width;
        const clipLeft  = relLeft;
        const clipRight = gridW - relLeft - itemW;

        openWardrobeClip = { l: clipLeft, r: clipRight };
        openWardrobeItem = item;
        openWardrobeType = type;

        // 锁住 grid 高度，隐藏其他格子
        wardrobeGrid.style.height = gridRect.height + 'px';
        wardrobeItems.forEach(el => {
            if (el !== item) el.style.visibility = 'hidden';
        });

        item.style.top    = relTop + 'px';
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
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || canvas.clientWidth || 300;
    const h = rect.height || canvas.clientHeight || 120;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
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
            innerContent = `<img src="${note.image}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\'color:#B5C833;font-size:14px;\'>图片加载中...</span>';">`;
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
            innerContent = `<div style="width:100%;height:100%;padding:10px 12px;font-size:14px;color:#4A2C1E;line-height:2;background-image:linear-gradient(rgba(180,160,140,0.25) 1px, transparent 1px);background-size:100% 2em;background-position:0 0.6em;overflow:hidden;">${previewText}</div>`;
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
            bubbleText.textContent = '"哎哟喂，这画面抓拍得倍儿地道！老北京那股子精气神儿全在里头了，我给您竖个大拇哥！"';
        } else if (note.type === 'hear') {
            bubbleText.textContent = '"得嘞！这动静真亲切，听得我心里头热乎乎的，简直就跟回了小时候的胡同口一样！"';
        } else if (note.type === 'touch') {
            bubbleText.textContent = '"讲究！您这感受写得也太细腻了，这砖瓦里的老故事全让您给盘活了，佩服佩服！"';
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
                noteDetailContent.innerHTML = `<div style="width:85%;height:85%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:10px;gap:12px;"><span style="font-size:40px;">📷</span><span style="font-size:15px;color:#4A2C1E;">照片未保存</span></div>`;
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
                noteDetailContent.innerHTML = `<div style="width:85%;height:85%;padding:16px;overflow-y:auto;background-image:linear-gradient(rgba(180,160,140,0.2) 1px, transparent 1px);background-size:100% 2em;background-position:0 0.6em;border:1px solid rgba(200,180,160,0.2);border-radius:12px;margin-right:10px;display:flex;align-items:flex-start;"><div style="font-family:'AiDianQuYaYuan','PingFang SC',sans-serif;font-size:15px;line-height:2;color:#3b2a1c;white-space:pre-wrap;word-break:break-word;width:100%;">${note.text}</div></div>`;
            } else {
                noteDetailContent.innerHTML = `<div style="width:85%;height:85%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:10px;gap:12px;"><span style="font-size:40px;">📝</span><span style="font-size:15px;color:#4A2C1E;">文字未保存</span></div>`;
            }
        } else {
            noteDetailPhoto.src = '';
            noteDetailPhoto.style.display = 'none';
            noteDetailContent.style.background = 'transparent';
            noteDetailContent.innerHTML = `<div style="width:85%;height:85%;display:flex;align-items:center;justify-content:center;margin-right:10px;"><span style="font-size:18px;color:#4A2C1E;">✨ 感知记录</span></div>`;
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
    if (noteDeleteTargetIndex !== null && noteDeleteTargetIndex >= 0 && noteDeleteTargetIndex < exploreNotes.length) {
        exploreNotes.splice(noteDeleteTargetIndex, 1);
        saveExploreNotes();
        renderNoteGrid();
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
