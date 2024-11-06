export class MusicPlayer {
    constructor() {
        this.tracks = [
            {
                title: "Demo Track 1 - Original",
                artist: "Ghostwriter Records",
                url: "assets/audio/demo1.mp3",
                artwork: "assets/images/artwork1.jpg"
            },
            {
                title: "Demo Track 1 - AI Mastered",
                artist: "Ghostwriter Records",
                url: "assets/audio/demo1-mastered.mp3",
                artwork: "assets/images/artwork1.jpg"
            }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.setupPlayer();
        this.setupVisualizer();
    }

    setupPlayer() {
        // Player UI Elements
        this.playerUI = {
            playButton: document.getElementById('play-demo'),
            compareButton: document.getElementById('compare'),
            trackInfo: document.querySelector('.track-info'),
            progressBar: document.querySelector('.progress-bar'),
            artwork: document.querySelector('.track-artwork')
        };

        // Event Listeners
        this.playerUI.playButton?.addEventListener('click', () => this.togglePlay());
        this.playerUI.compareButton?.addEventListener('click', () => this.compareVersions());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());

        // Initialize first track
        this.loadTrack(this.currentTrack);
    }

    setupVisualizer() {
        // Create audio context and analyser
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        
        // Connect audio to analyser
        const source = this.audioContext.createMediaElementSource(this.audio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // Setup visualization
        this.visualize();
    }

    loadTrack(index) {
        const track = this.tracks[index];
        this.audio.src = track.url;
        this.audio.load();
        
        // Update UI
        if (this.playerUI.trackInfo) {
            this.playerUI.trackInfo.textContent = `${track.title} - ${track.artist}`;
        }
        if (this.playerUI.artwork) {
            this.playerUI.artwork.src = track.artwork;
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playerUI.playButton.textContent = 'Play';
        } else {
            this.audio.play();
            this.playerUI.playButton.textContent = 'Pause';
        }
        this.isPlaying = !this.isPlaying;
    }

    compareVersions() {
        this.currentTrack = this.currentTrack === 0 ? 1 : 0;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    updateProgress() {
        if (this.playerUI.progressBar) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.playerUI.progressBar.style.width = `${progress}%`;
        }
    }

    onTrackEnd() {
        this.isPlaying = false;
        this.playerUI.playButton.textContent = 'Play';
    }

    visualize() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const canvas = document.querySelector('.visualizer-canvas');
        const ctx = canvas?.getContext('2d');
        
        if (!ctx) return;

        const draw = () => {
            requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                
                const r = barHeight + (25 * (i/bufferLength));
                const g = 250 * (i/bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };
        
        draw();
    }
} 