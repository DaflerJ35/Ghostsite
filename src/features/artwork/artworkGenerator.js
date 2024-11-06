export class ArtworkGenerator {
    constructor() {
        this.isGenerating = false;
        this.currentStyle = 'dark-aesthetic';
        this.setupGenerator();
    }

    setupGenerator() {
        // UI Elements
        this.generateButton = document.querySelector('.generate-button');
        this.artworkGallery = document.querySelector('.artwork-gallery');
        this.styleControls = document.querySelector('.style-controls');

        // Preset Styles
        this.styles = {
            'dark-aesthetic': {
                prompt: 'Dark moody studio atmosphere with neon accents',
                settings: { seed: Math.random() * 1000, steps: 50 }
            },
            'cyberpunk': {
                prompt: 'Cyberpunk record studio with holographic displays',
                settings: { seed: Math.random() * 1000, steps: 50 }
            },
            'minimal': {
                prompt: 'Minimalist abstract sound waves in monochrome',
                settings: { seed: Math.random() * 1000, steps: 50 }
            }
        };

        this.setupEventListeners();
        this.createStyleControls();
        this.loadExamples();
    }

    setupEventListeners() {
        this.generateButton?.addEventListener('click', () => {
            if (!this.isGenerating) {
                this.generateArtwork();
            }
        });
    }

    createStyleControls() {
        if (!this.styleControls) return;

        Object.keys(this.styles).forEach(style => {
            const button = document.createElement('button');
            button.className = 'style-button';
            button.textContent = style.replace('-', ' ').toUpperCase();
            button.addEventListener('click', () => {
                this.currentStyle = style;
                this.highlightSelectedStyle(button);
            });
            this.styleControls.appendChild(button);
        });
    }

    highlightSelectedStyle(selectedButton) {
        this.styleControls.querySelectorAll('.style-button').forEach(button => {
            button.classList.remove('selected');
        });
        selectedButton.classList.add('selected');
    }

    async generateArtwork() {
        this.isGenerating = true;
        this.updateUIState('generating');

        try {
            const style = this.styles[this.currentStyle];
            const response = await this.callAIService(style);
            
            if (response.artwork) {
                this.displayArtwork(response.artwork);
            }
        } catch (error) {
            console.error('Artwork generation failed:', error);
            this.showError('Failed to generate artwork. Please try again.');
        } finally {
            this.isGenerating = false;
            this.updateUIState('ready');
        }
    }

    async callAIService(style) {
        // Simulate AI service call (replace with actual API call)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    artwork: this.generatePlaceholderArtwork(style)
                });
            }, 2000);
        });
    }

    generatePlaceholderArtwork(style) {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 500, 500);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#4a4a4a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 500, 500);

        // Add some visual elements based on style
        ctx.strokeStyle = '#00ff99';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 500, Math.random() * 500);
            ctx.lineTo(Math.random() * 500, Math.random() * 500);
            ctx.stroke();
        }

        return canvas.toDataURL();
    }

    displayArtwork(artworkUrl) {
        if (!this.artworkGallery) return;

        const artworkElement = document.createElement('div');
        artworkElement.className = 'artwork-item';
        
        const img = document.createElement('img');
        img.src = artworkUrl;
        img.alt = 'Generated Artwork';
        
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => this.downloadArtwork(artworkUrl));

        artworkElement.appendChild(img);
        artworkElement.appendChild(downloadButton);
        
        this.artworkGallery.insertBefore(artworkElement, this.artworkGallery.firstChild);
    }

    downloadArtwork(artworkUrl) {
        const link = document.createElement('a');
        link.href = artworkUrl;
        link.download = `ghostwriter-artwork-${Date.now()}.png`;
        link.click();
    }

    updateUIState(state) {
        if (!this.generateButton) return;

        switch (state) {
            case 'generating':
                this.generateButton.textContent = 'Generating...';
                this.generateButton.disabled = true;
                break;
            case 'ready':
                this.generateButton.textContent = 'Generate Artwork';
                this.generateButton.disabled = false;
                break;
        }
    }

    showError(message) {
        // Implement error notification
        console.error(message);
    }

    loadExamples() {
        // Load example artworks
        const examples = [
            { style: 'dark-aesthetic', url: 'assets/images/example1.jpg' },
            { style: 'cyberpunk', url: 'assets/images/example2.jpg' },
            { style: 'minimal', url: 'assets/images/example3.jpg' }
        ];

        examples.forEach(example => {
            this.displayArtwork(example.url);
        });
    }
} 