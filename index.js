"use strict";


class Navigation {
    #onselect;
    #element;
    #items;
    #curItem;

    constructor(count, selectHandler) {
        this.#items = Array(count);
        this.#onselect = selectHandler;
    }

    get position() {
        return this.#items.indexOf(this.#curItem);
    }

    prev() {
        let pos = this.position - 1;
        if (pos < 0) pos = this.#items.length - 1;
        this.#setCurItem(this.#items[pos]);
        return pos;
    }

    next() {
        let pos = this.position + 1;
        if (pos >= this.#items.length) pos = 0;
        this.#setCurItem(this.#items[pos]);
        return pos;
    }

    create() {
        if (this.#element) return;
        this.#attach();
        if (this.#items.length === 0)
            throw new Error("items count is 0");
        this.#addItems();
        this.#setCurItem(this.#items[0]);
    }

    #attach() {
        this.#element = document.querySelector(".navigation");
        this.#element.onclick = this.#onClickItem.bind(this);
    }

    #onClickItem(event) {
        const item = event.target.closest(".navigation__item");
        if (!item) return;
        this.#setCurItem(item);
    }

    #createItem() {
        const item = document.createElement("div");
        this.#element.append(item);
        item.innerHTML = `<svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="10" stroke="gray" fill="white" stroke-width="2"/>
        </svg>`;
        item.classList.add("navigation__item");
        return item;
    }

    #addItems() {
        for (let i = 0; i < this.#items.length; i++) {
            this.#items[i] = this.#createItem();
        }
    }

    #setCurItem(item) {
        if (this.#curItem) {
            this.#curItem.classList.remove("navigation__item_sel");
        }
        this.#curItem = item;
        this.#curItem.classList.add("navigation__item_sel");
        this.#onselect(this.position);
    }
}


class Viewer {
    #viewer;
    #image;

    create() {
        this.#viewer = document.querySelector(".viewer");
        this.#viewer.onclick = this.#onClick.bind(this);
        this.#image = document.querySelector(".viewer__img");
    }

    show(image) {
        this.#image.setAttribute("src", image);
        this.#viewer.classList.add("viewer_visible");
    }

    hide() {
        this.#viewer.classList.remove("viewer_visible");
    }

    #onClick(event) {
        if (event.target.closest(".viewer")) {
            this.hide();
        }
    }
}


class Slider {
    #images;
    #curImage;
    #imgElement;
    #viewer;
    #navigation;

    create(...images) {
        if (images.length == 0) return;
        this.#images = [...images];
        this.#attachImg();
        this.#attachPrev();
        this.#attachNext();
        this.#createViewer();
        this.#createNavigation();
    }

    #attachImg() {
        this.#imgElement = document.querySelector(".slider__img");
        this.#imgElement.onclick = () => this.#viewer.show(this.#curImage);
    }

    #attachPrev() {
        const prev = document.querySelector(".slider__prev");
        prev.onclick = () => this.#navigation.prev();
    }

    #attachNext() {
        const next = document.querySelector(".slider__next");
        next.onclick = () => this.#navigation.next();
    }

    #createNavigation() {
        this.#navigation = new Navigation(this.#images.length, this.#changeImage.bind(this));
        this.#navigation.create();
    }

    #createViewer() {
        this.#viewer = new Viewer();
        this.#viewer.create();
    }

    #changeImage(index) {
        this.#curImage = this.#images[index];
        this.#imgElement.setAttribute("src", this.#curImage);
    }
}



const slider = new Slider();
slider.create("img/img1.png", "img/img2.png", "img/img3.png", "img/img4.png", "img/img5.png");
