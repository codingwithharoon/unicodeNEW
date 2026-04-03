"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BijoyToUnicode;
var bangladeshi_bangla_alphabets_1 = require("../common/bangladeshi-bangla-alphabets");
var bangladeshi_joined_alphabets_1 = require("../common/bangladeshi-joined-alphabets");
var bangladeshi_number_alphabets_1 = require("../common/bangladeshi-number-alphabets");
var bangladeshi_sign_alphabets_1 = require("../common/bangladeshi-sign-alphabets");
var bangladeshi_vowel_alphabets_1 = require("../common/bangladeshi-vowel-alphabets");
var bangladeshi_vowel_sign_alphabets_1 = require("../common/bangladeshi-vowel-sign-alphabets");
var re_arrangement_map_1 = require("../common/mapping/re-arrangement-map");
var bijoyConverter = function (text) {
    var mappings = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], bangladeshi_bangla_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true), bangladeshi_vowel_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true), bangladeshi_vowel_sign_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true), bangladeshi_number_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true), bangladeshi_sign_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true), bangladeshi_joined_alphabets_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    }), true);
    var convertedText = "";
    var i = 0;
    while (i < text.length) {
        var char = text[i];
        var nextChar = text[i + 1] || "";
        for (var _i = 0, mappings_1 = mappings; _i < mappings_1.length; _i++) {
            var mapping = mappings_1[_i];
            if (mapping.key === char + nextChar) {
                convertedText += mapping.value;
                i += 2;
            }
            else if (mapping.key === char) {
                convertedText += mapping.value;
                i += 1;
            }
        }
    }
    return convertedText;
};
function BijoyToUnicode(text) {
    var mappings = re_arrangement_map_1.default.map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v });
    });
    var remappingText = "";
    // Bijoy to Unicode remapping
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var nextChar = text[i + 1];
        for (var _i = 0, mappings_2 = mappings; _i < mappings_2.length; _i++) {
            var mapping = mappings_2[_i];
            if (mapping.key === nextChar) {
                remappingText += char + nextChar;
                i++;
            }
            else if (mapping.key === char) {
                remappingText += nextChar;
                remappingText += char;
                i++;
            }
        }
    }
    return bijoyConverter(remappingText);
}
