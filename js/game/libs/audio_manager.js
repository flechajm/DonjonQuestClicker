import Howl from "./howler.js";

class AudioManager {
    #bgm;
    #sfx;
    #shuffledMusic = [];
    #bmgVolume;
    #sfxVolume;

    /**
     * Constructor of AudioManager.
     */
    constructor() {
        this.bgmOn = true;
        this.sfxOn = true;

        this.#bgm;
        this.#sfx;
        this.#bmgVolume;
        this.#sfxVolume = 1;
        this.#shuffledMusic = this.shuffle();
    }

    /**
     * Inits and configure the Audio Manager.
     */
    init() {
        const audioManager = this;
        const volumeControl = $("#volume-control");
        volumeControl.bind("input", function (e) {
            audioManager.setBGMVolume(e.currentTarget.value / 100);
        });

        audioManager.setBGMVolume(volumeControl.val() / 100);
        audioManager.playBGM(0);
    }

    /**
     * Plays the selected sound.
     * @param {soundTypes} sound Sound to play.
     */
    play(sound, volume) {
        const audioManager = this;
        this.#sfx = new Howl({
            src: [`../audio/sfx/${sound}.mp3`],
            preload: true,
            volume: (volume ?? 1) / audioManager.getSFXVolume(),
        });

        this.#sfx.play();
    }

    /**
     * Gets the music name.
     * @param {String} bgm BGM file.
     */
    getMusicName(bgm) {
        let indexOfSlash = bgm.lastIndexOf('/') + 1;
        let audionNameLength = bgm.length - 4;
        return `🎵&nbsp;&nbsp;${bgm.substring(indexOfSlash, audionNameLength)}`;
    }

    /**
     * Stops the BGM and SFX.
     */
    stop() {
        if (this.#bgm != null) this.#bgm.unload();
        if (this.#sfx != null) this.#sfx.unload();
    }

    /**
     * Toggles the BGM between ON and OFF.
     * @param {Boolean} playWhenToggle  Sets if the BGM should be play itself when toggle.
     * @returns {Boolean} State of BGM.
     */
    toggleBGM(playWhenToggle = true) {
        this.bgmOn = !this.bgmOn;

        if (!this.bgmOn) {
            this.#bgm?.stop();
        } else if (playWhenToggle) {
            //this.#setBGM(this.#getSource(soundTypes.bgm));
        }

        this.#updateDOM('bgm');

        return this.bgmOn;
    }

    /**
     * Toggles the SFX between ON and OFF.
     * @returns {Boolean} State of SFX.
     */
    toggleSFX() {
        this.sfxOn = !this.sfxOn;
        this.#sfx?.mute(!this.bgmOn);

        this.#updateDOM('sfx');

        return this.sfxOn;
    }

    /**
     * Shuffles the music files.
     */
    shuffle() {
        if (this.#shuffledMusic.length == 0) {
            let musicFiles = [
                'Battle of the Creek - Alexander Nakarada.mp3',
                'Behind The Sword - Alexander Nakarada.mp3',
                'Bonfire - Alexander Nakarada.mp3',
                'Celebration - Alexander Nakarada.mp3',
                'Dungeons and Dragons - Alexander Nakarada.mp3',
                'Fairy of the Forest - Alexander Nakarada.mp3',
                'Forest Walk - Alexander Nakarada.mp3',
                'Grundar - Alexander Nakarada.mp3',
                'Mysterious Adventure - Alexander Nakarada .mp3',
                'Now we Feast - Alexander Nakarada.mp3',
                'Prepare for War - Alexander Nekarara.mp3',
                'Sir Honourspell - Ean Grimm.mp3',
                'Sir Orkshield - Ean Grimm.mp3',
                'The Road Home - Alexander Nekarada.mp3',
                'The Streets of Prague - Alexander Nakarada.mp3',
                'Viking Trolls - Ean Grimm.mp3',
                'Wonderland - Alexander Nakarada.mp3',
            ];
            let randomMusicFiles = this.#shuffleArray(musicFiles);
            for (var i = 0; i < randomMusicFiles.length; i++) {
                this.#shuffledMusic.push(`../audio/bgm/${randomMusicFiles[i]}`);
            }
        }

        return this.#shuffledMusic;
    }

    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    #updateDOM(id) {
        let onOff = id == 'bgm' ? this.bgmOn : this.sfxOn;
        const element = document.getElementById(id);
        const value = element.getElementsByClassName('value')[0];
        value.innerHTML = onOff ? '<div>ON</div><div>🔊</div>' : '<div>OFF</div><div>🔈</div>';
    }



    /**
     * Gets the SFX volume
     */
    getSFXVolume() {
        return this.#sfxVolume;
    }

    /**
     * Sets the SFX volume
     * @param {Number} volume Volume.
     */
    setSFXVolume(volume) {
        this.#bmgVolume = volume;
        if (this.#sfx) {
            this.#sfx.volume(this.#sfxVolume);
        }
    }

    /**
     * Sets the BGM volume
     * @param {Number} volume Volume.
     */
    setBGMVolume(volume) {
        this.#bmgVolume = volume;
        if (this.#bgm) {
            this.#bgm.volume(this.#bmgVolume);
        }
    }

    /**
     * Gets the BGM volume
     */
    getBGMVolume() {
        return this.#bmgVolume;
    }

    /**
     * Sets and configure the BGM with the selected sound.
     * @param {Number} index Sound index.
     */
    playBGM(index) {
        const audioManager = this;
        const randomList = this.#shuffledMusic;
        const actualBGM = randomList[index];
        const actualBGMName = this.getMusicName(actualBGM);

        this.#bgm = new Howl({
            src: [actualBGM],
            preload: true,
            autoplay: true,
            volume: audioManager.getBGMVolume(),
            onplay: function () {
                $('.music').css('display', 'flex');
                $('.music').find('span').eq(0).html(actualBGMName);
            },
            onend: function () {
                $('.music').css('display', 'none');
                if ((index + 1) == randomList.length) {
                    audioManager.playBGM(0);
                } else {
                    audioManager.playBGM(index + 1);
                }
            }
        });

        this.#bgm.play();
    }

    /**
     * Sets and configure the SFX with the selected sound.
     * @param {String} source Sound to set as source.
     */
    #setSFX(source) {
        this.#sfx?.unload();
        this.#sfx = new Howl({
            src: [source],
            autoplay: false,
            volume: 0.2,
        });

        this.#sfx.play();
    }
}

export default AudioManager;