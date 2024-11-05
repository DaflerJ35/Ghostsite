import { Howl } from 'howler';

export default class Audio {
    constructor() {
        this.init();
    }

    init() {
        this.sound = new Howl({
            src: ['assets/audio/background.mp3'],
            loop: true,
            volume: 0.5
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('play-audio')?.addEventListener('click', () => this.sound.play());
        document.getElementById('pause-audio')?.addEventListener('click', () => this.sound.pause());
    }
} 