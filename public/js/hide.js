'use strict';

const hideActions = [
    {
        selector: '.city-info',
        openSelector: ".open-city-info",
        xOrientation: 'left',
        yOrientation: null,
    },
    {
        selector: '.chunk-info',
        openSelector: '.open-chunk-info',
        xOrientation: null,
        yOrientation: 'bottom'
    }
];

class HideOpenAction{
    constructor(element, xOrientation, yOrientation) {
        this.element = element;
        this.xOrientation = xOrientation;
        this.yOrientation = yOrientation;

        const rect = this.element.getBoundingClientRect();
        this.move = this.xOrientation ? rect.width : rect.height;
    }

    hide() {
        this.element.style = `position: absolute; ${this.xOrientation ? this.xOrientation : this.yOrientation}: -${this.move}px`;
        this.element.setAttribute('data-is-show', 'false');
    }

    show() {
        this.element.style = `position: absolute; ${this.xOrientation ? this.xOrientation : this.yOrientation}: 0px`;
        this.element.setAttribute('data-is-show', 'true');
    }
}

for (const action of hideActions) {
    const element = $(action.selector);
    const hideHandler = new HideOpenAction(element, action.xOrientation, action.yOrientation);

    hideHandler.hide();

    $(action.openSelector).addEventListener('click',
        () => element.getAttribute('data-is-show') === 'true' ? hideHandler.hide() : hideHandler.show()
    );
}
