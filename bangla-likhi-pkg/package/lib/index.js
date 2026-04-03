"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanglaLikhi = void 0;
var bijoy2unicode_1 = require("./bijoy2unicode");
var unicode2bijoy_1 = require("./unicode2bijoy");
var BanglaLikhi = /** @class */ (function () {
    function BanglaLikhi() {
    }
    BanglaLikhi.bijoyToUnicode = function (bijoyText) {
        return (0, bijoy2unicode_1.default)(bijoyText);
    };
    BanglaLikhi.unicodeToBijoy = function (unicodeText) {
        return (0, unicode2bijoy_1.default)(unicodeText);
    };
    return BanglaLikhi;
}());
exports.BanglaLikhi = BanglaLikhi;
