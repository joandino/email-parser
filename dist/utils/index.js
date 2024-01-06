"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidURL = void 0;
function isValidURL(url) {
    var res = url.match(/(https?:\/\/[^ ]*)/g);
    return (res !== null);
}
exports.isValidURL = isValidURL;
;
//# sourceMappingURL=index.js.map