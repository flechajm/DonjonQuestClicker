class ImageLoader {
    #socialMediaImages = {
        path: "img/social/",
        images: [
            "github.png",
            "github32.png",
            "twitter.png",
            "twitter32.png",
            "youtube.png",
            "youtube32.png",
        ],
    };

    #rootImages = {
        path: "img/",
        images: [
            "building_button.png",
            "chest.png",
            "coins.png",
            "flare.png",
            "popup_bg.png",
            "stats.png",
            "tooltip_border.png",
            "top_bar.jpg",
            "treasure_chest_bright.png",
            "treasure_chest.png",
        ],
    }

    #buildingImages = {
        path: "img/buildings/",
        images: [
            "carpentry_{index}.png",
            "farm_{index}.png",
            "forge_{index}.png",
            "inn_{index}.png",
            "sawmill_{index}.png",
            "scout_{index}.png",
            "shield_bearer_{index}.png",
            "tavern_{index}.png",
            "wizard_{index}.png",
        ]
    }

    async loadAll() {
        await this.#preloadImages(this.#rootImages);
        await this.#preloadImages(this.#socialMediaImages);
        await this.#preloadImages(this.#buildingImages);
    }

    async #loadImage(src) {
        const img = new Image();

        return new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = src;
        });
    }

    async #preloadImages(arrayImages) {
        for (const image of arrayImages.images) {
            let path = arrayImages.path;
            let fileName = '';
            if (arrayImages.path == 'img/buildings/') {
                for (let index = 1; index <= 3; index++) {
                    fileName = `${path}${image.replace('{index}', index)}`;
                    await this.#loadImage(fileName);
                    console.log(`Image loaded: ${fileName}`);
                }
            } else {
                fileName = `${path}${image}`;
                await this.#loadImage(fileName);
                console.log(`Image loaded: ${fileName}`);
            }
        };
    }
}

export default ImageLoader;