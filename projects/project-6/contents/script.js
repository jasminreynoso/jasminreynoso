let songs = [];
let uploadedPhotoUrl = '';

async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        const data = await response.json();
        songs = data.songs;
    } catch (error) {
        console.error('Error loading songs:', error);
        // Fallback songs if file doesn't load
        songs = [
            { title: "Lo-Fi Hip Hop", videoId: "jfKfPfyJRdk" },
            { title: "Chill Beats", videoId: "5qap5aO4i9A" },
            { title: "Jazz Vibes", videoId: "rUxyKA_-grg" }
        ];
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedPhotoUrl = e.target.result;
        const preview = document.getElementById('preview');
        preview.innerHTML = `
            <img src="${uploadedPhotoUrl}" alt="Uploaded photo" id="uploadedPhoto">
            <div class="scanning-overlay" id="scanningOverlay" style="display: none;">
                <div class="scan-grid"></div>
                <div class="scan-line"></div>
            </div>
        `;
        
        // Start analysis
        setTimeout(() => {
            startAnalysis();
        }, 500);
    };
    reader.readAsDataURL(file);
}

function startAnalysis() {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('analyzing').style.display = 'block';
    
    // Show photo with scanning animation in analyzing section
    const analyzingPhoto = document.getElementById('analyzingPhoto');
    analyzingPhoto.innerHTML = `
        <img src="${uploadedPhotoUrl}" alt="Analyzing photo" id="analyzingPhotoImg">
        <div class="scanning-overlay">
            <div class="scan-grid"></div>
            <div class="scan-line"></div>
        </div>
    `;
    
    // Simulate analysis progress
    const progress = document.getElementById('progress');
    let width = 0;
    const interval = setInterval(() => {
        width += 10;
        progress.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showResult();
            }, 500);
        }
    }, 300);
}

function showResult() {
    document.getElementById('analyzing').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    // Get random song
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    
    // Show photo in result
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.innerHTML = `<img src="${uploadedPhotoUrl}" alt="Analyzed photo">`;
    
    // Show video embed
    const embedDiv = document.getElementById('songEmbed');
    embedDiv.innerHTML = `
        <p>${randomSong.title}</p>
        <iframe 
            src="https://www.youtube.com/embed/${randomSong.videoId}?autoplay=1" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    `;
    
    // Scroll to result
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// Load songs on page load
loadSongs();
