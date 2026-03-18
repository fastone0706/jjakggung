document.addEventListener('DOMContentLoaded', () => {
    initStars();
    setupEventListeners();
    setupNavigation();
    setupModal();
});

// Initialize Background Star Animation
function initStars() {
    const container = document.getElementById('stars-container');
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;
        container.appendChild(star);
    }
}

// Navigation Logic (SPA)
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');

    function switchView(hash) {
        const targetId = hash ? `view-${hash.replace('#', '')}` : 'view-home';
        const targetView = document.getElementById(targetId);

        if (targetView) {
            views.forEach(v => v.classList.add('hidden'));
            targetView.classList.remove('hidden');
            targetView.classList.add('animate-fade-in');

            // Update nav links
            navLinks.forEach(link => {
                const linkHash = link.getAttribute('href').replace('#', '');
                if (targetId.includes(linkHash)) {
                    link.classList.add('text-brand-gold');
                } else {
                    link.classList.remove('text-brand-gold');
                }
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            switchView(hash);
        });
    });

    // Handle initial load
    if (window.location.hash) {
        switchView(window.location.hash);
    }
}

// Modal Logic
function setupModal() {
    const modal = document.getElementById('modal-filter');
    const btnOpen = document.getElementById('btnOpenFilter');
    const btnClose = document.getElementById('btnCloseFilter');
    const btnApply = document.getElementById('btnApplyFilter');

    if (btnOpen) btnOpen.onclick = () => modal.classList.remove('hidden');
    if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');
    if (btnApply) btnApply.onclick = () => {
        modal.classList.add('hidden');
        alert('필터가 적용되었습니다.');
    };

    window.onclick = (event) => {
        if (event.target == modal) modal.classList.add('hidden');
    };
}

// Event Listeners Setup
function setupEventListeners() {
    const btnFindFate = document.getElementById('btnFindFate');
    const viewHome = document.getElementById('view-home');
    const viewMatching = document.getElementById('view-matching');
    const btnBackToMatches = document.getElementById('btnBackToMatches');
    const viewMatchDetail = document.getElementById('view-match-detail');

    if (btnFindFate) {
        btnFindFate.addEventListener('click', () => {
            const birthDate = document.getElementById('birthDate').value;
            if (!birthDate) {
                alert('생년월일을 입력해주세요.');
                return;
            }

            btnFindFate.innerText = "운명의 짝궁을 찾는 중...";
            btnFindFate.disabled = true;

            setTimeout(() => {
                viewHome.classList.add('hidden');
                viewMatching.classList.remove('hidden');
                viewMatching.classList.add('animate-fade-in');
                showMatches();
                
                btnFindFate.innerText = "운명의 상대 찾기";
                btnFindFate.disabled = false;
            }, 2000);
        });
    }

    if (btnBackToMatches) {
        btnBackToMatches.onclick = () => {
            viewMatchDetail.classList.add('hidden');
            viewMatching.classList.remove('hidden');
            viewMatching.classList.add('animate-fade-in');
        };
    }
}

// Simulate Match Data
function showMatches() {
    const container = document.getElementById('matches-container');
    container.innerHTML = '';

    const mockMatches = [
        { 
            name: '이지원', age: 26, location: '서울 강남구', compatibility: 98, 
            type: '목기 가득한 인연', emoji: '🌿', color: 'text-green-400',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
            report: '상대방은 갑목(甲木)의 기운을 가지고 있어, 등불 같은 당신의 정화(丁火) 기운을 만나 끊임없이 빛나게 해줍니다.'
        },
        { 
            name: '박민수', age: 29, location: '경기 성남시', compatibility: 85, 
            type: '화기애애한 열정', emoji: '🔥', color: 'text-red-400',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
            report: '활발한 화기운이 넘치는 박민수님은 당신의 열정을 함께 키워나갈 수 있는 동반자입니다.'
        },
        { 
            name: '최현아', age: 25, location: '서울 마포구', compatibility: 92, 
            type: '유연한 금기운', emoji: '💎', color: 'text-blue-300',
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000',
            report: '차분하고 정돈된 금기운은 당신의 불안함을 잠재워주는 편안한 안식처가 될 것입니다.'
        }
    ];

    mockMatches.sort((a, b) => b.compatibility - a.compatibility);

    mockMatches.forEach((match, index) => {
        const card = document.createElement('div');
        card.className = `glass-card match-card p-6 rounded-2xl flex items-center justify-between border-l-4 cursor-pointer ${index === 0 ? 'border-brand-gold' : 'border-white/10'}`;
        card.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl overflow-hidden">
                    <img src="${match.image}" class="w-full h-full object-cover">
                </div>
                <div>
                    <h3 class="text-lg font-bold">${match.name} <span class="text-sm font-normal text-gray-400">${match.age}세</span></h3>
                    <p class="text-xs text-gray-400">${match.location}</p>
                    <p class="text-[10px] uppercase tracking-widest mt-1 ${match.color}">${match.type}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold ${match.compatibility > 90 ? 'text-brand-gold' : 'text-white'}">${match.compatibility}%</div>
                <div class="text-[10px] text-gray-500 uppercase">궁합 지수</div>
            </div>
        `;
        
        card.onclick = () => showDetail(match);
        container.appendChild(card);
    });
}

// Show Detail Page
function showDetail(match) {
    const viewMatching = document.getElementById('view-matching');
    const viewMatchDetail = document.getElementById('view-match-detail');

    // Populate detail page
    document.getElementById('detail-name').innerText = match.name;
    document.getElementById('detail-age').innerText = match.age;
    document.getElementById('detail-location').innerText = match.location;
    document.getElementById('detail-image').src = match.image;
    document.getElementById('detail-compat-badge').innerText = `${match.compatibility}% Match`;
    document.getElementById('detail-type').innerText = match.type;
    document.getElementById('detail-report').innerHTML = match.report;

    // Transition
    viewMatching.classList.add('hidden');
    viewMatchDetail.classList.remove('hidden');
    viewMatchDetail.classList.add('animate-fade-in');
    window.scrollTo(0, 0);
}
