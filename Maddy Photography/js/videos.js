/* ============================================
   Video Gallery — localStorage Powered
   ============================================ */

class VideoManager {
    constructor() {
        this.storageKey = 'studioVideos';
        this.container = document.getElementById('video-grid');
        if (this.container) {
            this.render();
        }
    }

    getVideos() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    }

    saveVideos(videos) {
        localStorage.setItem(this.storageKey, JSON.stringify(videos));
    }

    addVideo(title, url) {
        const videos = this.getVideos();
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        videos.unshift({
            id,
            title,
            url: this.normalizeUrl(url),
            addedAt: new Date().toISOString()
        });
        this.saveVideos(videos);
        return id;
    }

    deleteVideo(id) {
        const videos = this.getVideos().filter(v => v.id !== id);
        this.saveVideos(videos);
    }

    normalizeUrl(url) {
        // Convert Instagram reel URL to embed URL
        let embedUrl = url.trim();
        // Handle various Instagram URL formats
        if (embedUrl.includes('instagram.com/reel/') || embedUrl.includes('instagram.com/p/')) {
            // Extract the shortcode
            const match = embedUrl.match(/instagram\.com\/(reel|p)\/([^/?]+)/);
            if (match) {
                embedUrl = `https://www.instagram.com/reel/${match[2]}/embed`;
            }
        }
        if (!embedUrl.endsWith('/embed') && !embedUrl.endsWith('/embed/')) {
            embedUrl = embedUrl.replace(/\/$/, '') + '/embed';
        }
        return embedUrl;
    }

    render() {
        const videos = this.getVideos();

        if (videos.length === 0) {
            this.container.innerHTML = `
        <div class="video-empty" style="grid-column: 1/-1;">
          <p>🎬 Videos coming soon! Stay tuned.</p>
        </div>
      `;
            return;
        }

        this.container.innerHTML = videos.map(video => `
      <div class="video-card reveal">
        <div class="video-card-embed">
          <iframe 
            src="${video.url}" 
            allowfullscreen 
            loading="lazy"
            title="${video.title}"
          ></iframe>
        </div>
        <div class="video-card-info">
          <h3 class="video-card-title">${this.escapeHtml(video.title)}</h3>
          <p class="video-card-date">${this.formatDate(video.addedAt)}</p>
        </div>
      </div>
    `).join('');
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

window.VideoManager = VideoManager;
