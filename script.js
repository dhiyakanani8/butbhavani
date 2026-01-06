// ===== COUNTDOWN TIMER =====
function updateTimer() {
    const targetDate = new Date(2026, 0, 29, 10, 30, 0).getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('mins');
        const secsEl = document.getElementById('secs');

        if (daysEl) daysEl.innerText = d < 10 ? '0' + d : d;
        if (hoursEl) hoursEl.innerText = h < 10 ? '0' + h : h;
        if (minsEl) minsEl.innerText = m < 10 ? '0' + m : m;
        if (secsEl) secsEl.innerText = s < 10 ? '0' + s : s;
    } else {
        const timer = document.getElementById('timer');
        if (timer) {
            timer.innerHTML = "<b style='color:var(--gold); font-size: 1.5rem;'>🙏 મહોત્સવ શરૂ થઈ ગયો છે 🙏</b>";
        }
    }
}

// ===== MUSIC CONTROL =====
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
const musicSrc = document.getElementById('musicSrc');

if (musicSrc) {
    const randomTrack = Math.floor(Math.random() * 3) + 1;
    musicSrc.src = `https://raw.githubusercontent.com/dhiyakanani8/donationlist/main/${randomTrack}.mp3`;
    audio.load();
}

let audioPlayed = false;

function initAudio() {
    if (!audioPlayed && audio) {
        audio.play()
            .then(() => {
                audioPlayed = true;
                if (musicBtn) musicBtn.innerText = "🔊";
            })
            .catch(e => console.log('Audio autoplay blocked'));
    }
}

if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play();
            musicBtn.innerText = "🔊";
        } else {
            audio.pause();
            musicBtn.innerText = "🔇";
        }
    });
}

// ===== GUJARATI NUMBER CONVERTER =====
function toGuj(n) {
    const d = { '0': '૦', '1': '૧', '2': '૨', '3': '૩', '4': '૪', '5': '૫', '6': '૬', '7': '૭', '8': '૮', '9': '૯' };
    return n.toString().replace(/\d/g, m => d[m]);
}

// ===== FETCH DONATION DATA =====
async function fetchData() {
    const API = "https://script.google.com/macros/s/AKfycbwkcvhOgd2O12xdrhXkrsqg7NYIoRO8pHGKPEF2Om7ay8bsPVy-r1wA5UUD9Zx_aOWO2w/exec?api=alldata";
    
    try {
        const res = await fetch(API);
        const data = await res.json();
        
        // Update total value
        const totalVal = document.getElementById('totalVal');
        if (totalVal) {
            totalVal.innerText = "₹ " + toGuj(data.total.toLocaleString('en-IN'));
        }
        
        // Update donor count
        const donorCount = document.getElementById('donorCount');
        if (donorCount) {
            donorCount.innerText = toGuj(data.records.length);
        }
        
        // Update donor list
        const mainList = document.getElementById('mainList');
        if (mainList) {
            mainList.innerHTML = data.records.map(r => `
                <div class="donor-row" data-name="${r.name.toLowerCase()}">
                    <div>
                        <div class="donor-name">${r.name}</div>
                        <div class="donor-village">📍 ${r.village.replace("રસ્કા", "રાસ્કા")}</div>
                    </div>
                    <div class="donor-amount">₹ ${toGuj(r.amount.toLocaleString('en-IN'))}</div>
                </div>
            `).join('');
        }
        
        // Store data for search
        window.donorData = data.records;
        
    } catch (e) {
        console.error("Data fetch error:", e);
        const mainList = document.getElementById('mainList');
        if (mainList) {
            mainList.innerHTML = '<p style="text-align:center; color:#888;">ડેટા લોડ કરવામાં ભૂલ થઈ</p>';
        }
    }
}

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchDonor');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.donor-row');
        
        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            if (name.includes(query)) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ===== NAVBAR TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SCROLL ANIMATIONS =====
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-section');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 100) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ===== PARTICLES ANIMATION =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ===== LIGHTBOX FUNCTIONALITY =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (!lightbox) return;
    
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                alert('ફોર્મ સફળતાપૂર્વક સબમિટ થયું! 🙏');
                form.reset();
            }
        });
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updateTimer();
    setInterval(updateTimer, 1000);
    fetchData();
    createParticles();
    initLightbox();
    initFormValidation();
});
