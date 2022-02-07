'use strict';

const $ = ($) => document.querySelector($);
const $$ = ($$) => document.querySelectorAll($$);

function writeToClipboard(value) {
    navigator.clipboard.writeText(value).then(function () {});
}
