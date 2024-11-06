export class ArtistCarousel {
    constructor() {
        this.currentIndex = 0;
        this.artists = [
            {
                name: "T-Mac",
                image: "assets/images/artists/t-mac.jpg",
                description: "Hip-hop producer and sound engineer",
                featured: "Latest Release: 'Midnight Sessions'"
            },
            {
                name: "DJ Dafler",
                image: "assets/images/artists/dj-dafler.jpg",
                description: "Electronic music pioneer",
                featured: "Featured Track: 'Neural Waves'"
            }
            // Add more artists here
        ];
        this.setupCarousel();
    }

    setupCarousel() {
        this.carousel = document.querySelector('.artist-carousel');
        this.createCarouselItems();
        this.setupControls();
        this.startAutoPlay();
    }

    createCarouselItems() {
        this.artists.forEach((artist, index) => {
            const item = this.createArtistCard(artist);
            this.carousel?.appendChild(item);
        });
    }

    createArtistCard(artist) {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <div class="artist-image">
                <img src="${artist.image}" alt="${artist.name}">
            </div>
            <div class="artist-info">
                <h3>${artist.name}</h3>
                <p>${artist.description}</p>
                <p class="featured">${artist.featured}</p>
            </div>
        `;
        return card;
    }

    setupControls() {
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        prevButton.className = 'carousel-control prev';
        nextButton.className = 'carousel-control next';
        
        prevButton.addEventListener('click', () => this.navigate(-1));
        nextButton.addEventListener('click', () => this.navigate(1));
        
        this.carousel?.parentElement?.appendChild(prevButton);
        this.carousel?.parentElement?.appendChild(nextButton);
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.artists.length) % this.artists.length;
        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.carousel) return;
        const offset = -this.currentIndex * 100;
        this.carousel.style.transform = `translateX(${offset}%)`;
    }

    startAutoPlay() {
        setInterval(() => this.navigate(1), 5000);
    }
} 