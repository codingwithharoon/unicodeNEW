/**
 * Unicode to Bijoy Converter — ubc-converter.js
 * Handles:
 *   1. Unicode → Bijoy (SutonnyMJ ANSI) conversion
 *   2. Bijoy → Unicode conversion
 *   3. Voice input via Web Speech API (bn-BD)
 *   4. Copy, Download, Swap, Clear, Paste helpers
 */
(function () {
    'use strict';

    /* ===================================================================
     * CONVERSION TABLE  (Unicode codepoint → Bijoy ANSI character)
     * Source: SutonnyMJ font mapping — industry standard
     * =================================================================== */

    // Multi-character Unicode sequences must be checked BEFORE single chars
    // (longest match first). Each entry: [unicodeString, bijoyString]
    var UNI_TO_BIJOY = [

        /* ── Conjuncts / Hasanta combinations (order matters) ── */

        // ক্ষ
        ['\u0995\u09CD\u09B7', 'ÿ'],
        // ক্ষ্ম
        ['\u0995\u09CD\u09B7\u09CD\u09AE', 'ÿ¥'],
        // হ্ম
        ['\u09B9\u09CD\u09AE', 'ý'],
        // ষ্ক
        ['\u09B7\u09CD\u0995', 'ú'],
        // ষ্ট
        ['\u09B7\u09CD\u099F', 'óU'],
        // ষ্ণ
        ['\u09B7\u09CD\u09A3', 'ûY'],
        // ষ্ফ
        ['\u09B7\u09CD\u09AB', 'ûd'],
        // ষ্প
        ['\u09B7\u09CD\u09AA', 'ûc'],
        // ষ্ব
        ['\u09B7\u09CD\u09AC', 'ûe'],
        // ষ্ম
        ['\u09B7\u09CD\u09AE', 'û¥'],
        // জ্ঞ
        ['\u099C\u09CD\u099E', 'Á'],
        // ত্ত
        ['\u09A4\u09CD\u09A4', 'Ë'],
        // ত্থ
        ['\u09A4\u09CD\u09A5', 'Ì'],
        // দ্ধ
        ['\u09A6\u09CD\u09A7', 'Ø'],
        // দ্ভ
        ['\u09A6\u09CD\u09AD', 'Ù'],
        // ন্ঠ
        ['\u09A8\u09CD\u099A', 'ZÄ'],
        // ন্ড
        ['\u09A8\u09CD\u09A1', 'Ú'],
        // ন্ত
        ['\u09A8\u09CD\u09A4', 'š'],
        // ন্থ
        ['\u09A8\u09CD\u09A5', '›'],
        // ন্দ
        ['\u09A8\u09CD\u09A6', 'Û'],
        // ন্ধ
        ['\u09A8\u09CD\u09A7', 'Ü'],
        // ন্ন
        ['\u09A8\u09CD\u09A8', 'œ'],
        // ন্ব
        ['\u09A8\u09CD\u09AC', 'Ý'],
        // ন্ম
        ['\u09A8\u09CD\u09AE', 'Þ'],
        // ন্য
        ['\u09A8\u09CD\u09AF', 'Ü¨'],
        // ম্ন
        ['\u09AE\u09CD\u09A8', '¤'],
        // ম্ব
        ['\u09AE\u09CD\u09AC', '¥'],
        // ম্ভ
        ['\u09AE\u09CD\u09AD', '¦'],
        // ম্ম
        ['\u09AE\u09CD\u09AE', '§'],
        // ম্য
        ['\u09AE\u09CD\u09AF', '©'],
        // স্ত
        ['\u09B8\u09CD\u09A4', 'ÿœ'],
        // স্থ
        ['\u09B8\u09CD\u09A5', 'ÿ'],
        // স্ন
        ['\u09B8\u09CD\u09A8', 'þ'],
        // স্প
        ['\u09B8\u09CD\u09AA', 'ÿc'],
        // স্ফ
        ['\u09B8\u09CD\u09AB', 'ÿd'],
        // স্ব
        ['\u09B8\u09CD\u09AC', 'ÿe'],
        // স্ম
        ['\u09B8\u09CD\u09AE', 'ÿ¥'],
        // স্য
        ['\u09B8\u09CD\u09AF', 'ÿ¨'],
        // স্র
        ['\u09B8\u09CD\u09B0', 'ÿ«'],
        // স্ল
        ['\u09B8\u09CD\u09B2', 'ÿ¬'],
        // ল্ক
        ['\u09B2\u09CD\u0995', 'j¬'],
        // ল্গ
        ['\u09B2\u09CD\u0997', 'j¬'],
        // ল্ট
        ['\u09B2\u09CD\u099F', 'j®'],
        // ল্ড
        ['\u09B2\u09CD\u09A1', 'j¯'],
        // ল্প
        ['\u09B2\u09CD\u09AA', 'j°'],
        // ল্ফ
        ['\u09B2\u09CD\u09AB', 'j±'],
        // ল্ব
        ['\u09B2\u09CD\u09AC', 'j²'],
        // ল্ভ
        ['\u09B2\u09CD\u09AD', 'j³'],
        // ল্ম
        ['\u09B2\u09CD\u09AE', 'j´'],
        // ল্য
        ['\u09B2\u09CD\u09AF', 'jµ'],
        // ল্ল
        ['\u09B2\u09CD\u09B2', 'j¶'],

        /* ── র-ফলা  (র + হসন্ত → ¨) combined with preceding consonant ── */
        // handled generically below after consonant mapping

        /* ── Hasanta (্) + following consonant → fola / juktakkhor ── */
        // য-ফলা ্য → ¨
        ['\u09CD\u09AF', '\u00A8'],
        // ব-ফলা ্ব → ¡
        ['\u09CD\u09AC', '\u00A1'],
        // ম-ফলা ্ম → ¥ (generic fallback after specific conjuncts)
        ['\u09CD\u09AE', '\u00A5'],
        // ন-ফলা ্ন → ¯
        ['\u09CD\u09A8', '\u00AF'],
        // ল-ফলা ্ল → ¬
        ['\u09CD\u09B2', '\u00AC'],
        // রেফ  র্ (r + hasanta before consonant) → handled as ©  prepend
        // ্র (hasanta + র) = র-ফলা → «
        ['\u09CD\u09B0', '\u00AB'],
        // ্ক
        ['\u09CD\u0995', 'K'],
        // ্খ
        ['\u09CD\u0996', 'L'],
        // ্গ
        ['\u09CD\u0997', 'M'],
        // ্ঘ
        ['\u09CD\u0998', 'N'],
        // ্চ
        ['\u09CD\u099A', 'P'],
        // ্ছ
        ['\u09CD\u099B', 'Q'],
        // ্জ
        ['\u09CD\u099C', 'R'],
        // ্ঝ
        ['\u09CD\u099D', 'S'],
        // ্ট
        ['\u09CD\u099F', 'U'],
        // ্ঠ
        ['\u09CD\u09A0', 'V'],
        // ্ড
        ['\u09CD\u09A1', 'W'],
        // ্ঢ
        ['\u09CD\u09A2', 'X'],
        // ্ণ
        ['\u09CD\u09A3', 'Y'],
        // ্ত
        ['\u09CD\u09A4', 'Z'],
        // ্থ
        ['\u09CD\u09A5', '_'],
        // ্দ
        ['\u09CD\u09A6', '`'],
        // ্ধ
        ['\u09CD\u09A7', 'a'],
        // ্ন
        ['\u09CD\u09A8', 'b'],
        // ্প
        ['\u09CD\u09AA', 'c'],
        // ্ফ
        ['\u09CD\u09AB', 'd'],
        // ্ভ
        ['\u09CD\u09AD', 'f'],
        // ্ষ
        ['\u09CD\u09B7', 'ó'],
        // ্স
        ['\u09CD\u09B8', 'ü'],
        // ্হ
        ['\u09CD\u09B9', 'n'],
        // ্ শ
        ['\u09CD\u09B6', 'ö'],

        /* ── Reph  র্ (র + ্) before a consonant → © placed AFTER target consonant ──
           Handled in the main loop via lookahead  */

        /* ── Vowels (Independent) ── */
        ['\u0985', 'A'],   // অ
        ['\u0986', 'Av'],  // আ
        ['\u0987', 'B'],   // ই
        ['\u0988', 'C'],   // ঈ
        ['\u0989', 'D'],   // উ
        ['\u098A', 'E'],   // ঊ
        ['\u098B', 'F'],   // ঋ
        ['\u098F', 'G'],   // এ
        ['\u0990', 'H'],   // ঐ
        ['\u0993', 'I'],   // ও
        ['\u0994', 'J'],   // ঔ

        /* ── Consonants ── */
        ['\u0995', 'K'],   // ক
        ['\u0996', 'L'],   // খ
        ['\u0997', 'M'],   // গ
        ['\u0998', 'N'],   // ঘ
        ['\u0999', 'O'],   // ঙ
        ['\u099A', 'P'],   // চ
        ['\u099B', 'Q'],   // ছ
        ['\u099C', 'R'],   // জ
        ['\u099D', 'S'],   // ঝ
        ['\u099E', 'T'],   // ঞ
        ['\u099F', 'U'],   // ট
        ['\u09A0', 'V'],   // ঠ
        ['\u09A1', 'W'],   // ড
        ['\u09A2', 'X'],   // ঢ
        ['\u09A3', 'Y'],   // ণ
        ['\u09A4', 'Z'],   // ত
        ['\u09A5', '_'],   // থ
        ['\u09A6', '`'],   // দ
        ['\u09A7', 'a'],   // ধ
        ['\u09A8', 'b'],   // ন
        ['\u09AA', 'c'],   // প
        ['\u09AB', 'd'],   // ফ
        ['\u09AC', 'e'],   // ব
        ['\u09AD', 'f'],   // ভ
        ['\u09AE', 'g'],   // ম
        ['\u09AF', 'h'],   // য
        ['\u09B0', 'i'],   // র
        ['\u09B2', 'j'],   // ল
        ['\u09B6', 'k'],   // শ
        ['\u09B7', 'l'],   // ষ
        ['\u09B8', 'm'],   // স
        ['\u09B9', 'n'],   // হ
        ['\u09DC', 'o'],   // ড়
        ['\u09DD', 'p'],   // ঢ়
        ['\u09DF', 'q'],   // য়
        ['\u09CE', 'r'],   // ৎ

        /* ── Vowel diacritics (kars) ── */
        ['\u09BE', 'v'],   // া
        ['\u09BF', 'w'],   // ি  (goes before consonant — handled in loop)
        ['\u09C0', 'x'],   // ী
        ['\u09C1', 'y'],   // ু
        ['\u09C2', 'z'],   // ূ
        ['\u09C3', '\u00F4'],  // ৃ  → ô
        ['\u09C7', '\u00A2'],  // ে  (goes before consonant)
        ['\u09C8', '\u00A3'],  // ৈ
        ['\u09CB', '\u00A4'],  // ো  = ে + া  → £v but encoded as single ো in Unicode; output ¤
        ['\u09CC', '\u00A5'],  // ৌ  → ¦ but use ¥ — depends on font; safest: \u00A5
        ['\u09C4', '\u00F4'],  // ৄ  (fallback = ৃ equivalent)

        /* ── Hasanta ── */
        ['\u09CD', '&'],   // ্ (standalone hasanta = halant)

        /* ── Special consonant signs ── */
        ['\u0982', 's'],   // ং
        ['\u0983', ':'],   // ঃ
        ['\u0981', 'u'],   // ঁ

        /* ── Bangla digits ── */
        ['\u09E6', '0'],
        ['\u09E7', '1'],
        ['\u09E8', '2'],
        ['\u09E9', '3'],
        ['\u09EA', '4'],
        ['\u09EB', '5'],
        ['\u09EC', '6'],
        ['\u09ED', '7'],
        ['\u09EE', '8'],
        ['\u09EF', '9'],

        /* ── Punctuation ── */
        ['\u0964', '|'],   // ।  (daari)
        ['\u0965', '||'],  // ॥  (double daari)
        ['\u09F7', '/'],   // ৷
        ['\u2013', '-'],   // –
        ['\u2014', '--'],  // —
    ];

    /* Build prefix-indexed map for fast multi-char lookup */
    var UNI_MAP = {};
    for (var i = 0; i < UNI_TO_BIJOY.length; i++) {
        var uni = UNI_TO_BIJOY[i][0];
        var bij = UNI_TO_BIJOY[i][1];
        if (!UNI_MAP[uni[0]]) UNI_MAP[uni[0]] = [];
        UNI_MAP[uni[0]].push([uni, bij]);
    }
    // Sort each bucket by length DESC so longest match wins
    for (var ch in UNI_MAP) {
        UNI_MAP[ch].sort(function (a, b) { return b[0].length - a[0].length; });
    }

    /* ===================================================================
     * BIJOY → UNICODE TABLE  (reverse mapping)
     * =================================================================== */
    var BIJOY_TO_UNI = [
        // Multi-char Bijoy first (longest match first)
        ['Av', '\u0986'],   // আ
        ['gy', '\u09AE\u09C1'], // মু
        // single char
        ['A', '\u0985'],    // অ
        ['B', '\u0987'],    // ই
        ['C', '\u0988'],    // ঈ
        ['D', '\u0989'],    // উ
        ['E', '\u098A'],    // ঊ
        ['F', '\u098B'],    // ঋ
        ['G', '\u098F'],    // এ
        ['H', '\u0990'],    // ঐ
        ['I', '\u0993'],    // ও
        ['J', '\u0994'],    // ঔ
        ['K', '\u0995'],    // ক
        ['L', '\u0996'],    // খ
        ['M', '\u0997'],    // গ
        ['N', '\u0998'],    // ঘ
        ['O', '\u0999'],    // ঙ
        ['P', '\u099A'],    // চ
        ['Q', '\u099B'],    // ছ
        ['R', '\u099C'],    // জ
        ['S', '\u099D'],    // ঝ
        ['T', '\u099E'],    // ঞ
        ['U', '\u099F'],    // ট
        ['V', '\u09A0'],    // ঠ
        ['W', '\u09A1'],    // ড
        ['X', '\u09A2'],    // ঢ
        ['Y', '\u09A3'],    // ণ
        ['Z', '\u09A4'],    // ত
        ['_', '\u09A5'],    // থ
        ['`', '\u09A6'],    // দ
        ['a', '\u09A7'],    // ধ
        ['b', '\u09A8'],    // ন
        ['c', '\u09AA'],    // প
        ['d', '\u09AB'],    // ফ
        ['e', '\u09AC'],    // ব
        ['f', '\u09AD'],    // ভ
        ['g', '\u09AE'],    // ম
        ['h', '\u09AF'],    // য
        ['i', '\u09B0'],    // র
        ['j', '\u09B2'],    // ল
        ['k', '\u09B6'],    // শ
        ['l', '\u09B7'],    // ষ
        ['m', '\u09B8'],    // স
        ['n', '\u09B9'],    // হ
        ['o', '\u09DC'],    // ড়
        ['p', '\u09DD'],    // ঢ়
        ['q', '\u09DF'],    // য়
        ['r', '\u09CE'],    // ৎ
        ['s', '\u0982'],    // ং
        [':', '\u0983'],    // ঃ
        ['u', '\u0981'],    // ঁ
        ['v', '\u09BE'],    // া
        ['w', '\u09BF'],    // ি
        ['x', '\u09C0'],    // ী
        ['y', '\u09C1'],    // ু
        ['z', '\u09C2'],    // ূ
        ['\u00F4', '\u09C3'],  // ৃ
        ['\u00A2', '\u09C7'],  // ে
        ['\u00A3', '\u09C8'],  // ৈ
        ['\u00A4', '\u09CB'],  // ো
        ['\u00A5', '\u09CC'],  // ৌ
        ['&', '\u09CD'],    // ্
        ['\u00A8', '\u09CD\u09AF'], // ্য
        ['\u00A1', '\u09CD\u09AC'], // ্ব
        ['\u00AB', '\u09CD\u09B0'], // ্র
        ['\u00AC', '\u09CD\u09B2'], // ্ল
        ['\u00AF', '\u09CD\u09A8'], // ্ন
        ['|', '\u0964'],    // ।
        ['||', '\u0965'],   // ॥
        ['0', '\u09E6'],
        ['1', '\u09E7'],
        ['2', '\u09E8'],
        ['3', '\u09E9'],
        ['4', '\u09EA'],
        ['5', '\u09EB'],
        ['6', '\u09EC'],
        ['7', '\u09ED'],
        ['8', '\u09EE'],
        ['9', '\u09EF'],
    ];

    var BIJOY_MAP = {};
    for (var j = 0; j < BIJOY_TO_UNI.length; j++) {
        var bij2 = BIJOY_TO_UNI[j][0];
        var uni2 = BIJOY_TO_UNI[j][1];
        if (!BIJOY_MAP[bij2[0]]) BIJOY_MAP[bij2[0]] = [];
        BIJOY_MAP[bij2[0]].push([bij2, uni2]);
    }
    for (var bch in BIJOY_MAP) {
        BIJOY_MAP[bch].sort(function (a, b) { return b[0].length - a[0].length; });
    }

    /* ===================================================================
     * CORE CONVERSION FUNCTIONS
     * =================================================================== */

    /**
     * Reorder i-kar (ি) and e-kar (ে) / ai-kar (ৈ): 
     * In Unicode they follow the consonant; in Bijoy ANSI they must precede it.
     * We pre-process the Unicode string to move these markers BEFORE their consonant.
     */
    function preprocessUnicode(str) {
        // i-kar (\u09BF) — move before the preceding consonant cluster
        // e-kar (\u09C7) — same
        // ai-kar (\u09C8) — same
        // o-kar (\u09CB) = e-kar + aa-kar — keep as is (handled in table)
        // We swap: consonant + i-kar → i-kar + consonant  etc.
        // Already in correct LOGICAL order for Unicode; Bijoy encoding handles this
        // by the table entries placing w/¢/£ before the consonant code.
        // So no reordering needed at Unicode level; we handle it in the output step.
        return str;
    }

    /**
     * Convert Unicode Bangla → Bijoy ANSI encoding.
     * Uses greedy longest-match left-to-right scan.
     */
    function unicodeToBijoy(input) {
        if (!input) return '';
        var out = '';
        var i = 0;
        var len = input.length;

        // Step 1: handle reph  (র + ্ = র্) — needs to be placed AFTER the
        // following consonant cluster in Bijoy.  We'll mark positions.
        // We do a two-pass approach: first substitute everything, then fix reph.

        while (i < len) {
            var ch = input[i];

            // Check if we have a Bengali reph sequence: র + হসন্ত (not followed by vowel)
            // র = \u09B0, হসন্ত = \u09CD
            if (ch === '\u09B0' && input[i + 1] === '\u09CD' && i + 2 < len) {
                // This is a reph — consume র্, then convert the following cluster,
                // then append © (reph in SutonnyMJ)
                i += 2; // skip র্
                // Convert the next consonant cluster (until next vowel/word boundary)
                var clusterStart = i;
                var cluster = '';
                // collect one consonant + possible hasanta+consonant sequences
                var k = i;
                while (k < len) {
                    var kch = input[k];
                    var matched = false;
                    if (UNI_MAP[kch]) {
                        var buckets = UNI_MAP[kch];
                        for (var b = 0; b < buckets.length; b++) {
                            var seq = buckets[b][0];
                            var rep = buckets[b][1];
                            if (input.substr(k, seq.length) === seq) {
                                cluster += rep;
                                k += seq.length;
                                matched = true;
                                break;
                            }
                        }
                    }
                    if (!matched) {
                        // non-Bangla or unknown — stop cluster
                        break;
                    }
                    // if we just output a consonant and next is NOT hasanta, stop
                    if (input[k] !== '\u09CD' && input[k] !== '\u09BF' &&
                        input[k] !== '\u09C0' && input[k] !== '\u09C1' &&
                        input[k] !== '\u09C2' && input[k] !== '\u09C3' &&
                        input[k] !== '\u09BE' && input[k] !== '\u09C7' &&
                        input[k] !== '\u09C8' && input[k] !== '\u09CB' &&
                        input[k] !== '\u09CC') {
                        break;
                    }
                }
                i = k;
                // Reph in SutonnyMJ = © = \u00A9, placed AFTER the cluster
                out += cluster + '\u00A9';
                continue;
            }

            // Normal greedy match
            var foundBuckets = UNI_MAP[ch];
            var found = false;
            if (foundBuckets) {
                for (var b2 = 0; b2 < foundBuckets.length; b2++) {
                    var seq2 = foundBuckets[b2][0];
                    var rep2 = foundBuckets[b2][1];
                    if (input.substr(i, seq2.length) === seq2) {
                        // Special handling: ি (i-kar) and ে/ৈ (e-kar/ai-kar)
                        // must appear before the consonant in Bijoy.
                        // We've already output the consonant; we need to INSERT before last char.
                        if (seq2 === '\u09BF' || seq2 === '\u09C7' || seq2 === '\u09C8') {
                            // Insert the kar BEFORE the last Bijoy character written
                            // (which is the consonant)
                            if (out.length > 0) {
                                out = out.slice(0, -1) + rep2 + out.slice(-1);
                            } else {
                                out += rep2;
                            }
                        } else {
                            out += rep2;
                        }
                        i += seq2.length;
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                // Pass through non-Bangla characters as-is
                out += ch;
                i++;
            }
        }
        return out;
    }

    /**
     * Convert Bijoy ANSI → Unicode Bangla.
     * Greedy longest-match left-to-right.
     */
    function bijoyToUnicode(input) {
        if (!input) return '';
        var out = '';
        var i = 0;
        var len = input.length;
        while (i < len) {
            var ch = input[i];
            var buckets = BIJOY_MAP[ch];
            var found = false;
            if (buckets) {
                for (var b = 0; b < buckets.length; b++) {
                    var seq = buckets[b][0];
                    var rep = buckets[b][1];
                    if (input.substr(i, seq.length) === seq) {
                        out += rep;
                        i += seq.length;
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                out += ch;
                i++;
            }
        }
        return out;
    }

    /* ===================================================================
     * VOICE INPUT  (Web Speech API — bn-BD)
     * =================================================================== */
    var recognition = null;
    var isListening = false;

    function initVoice() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        var rec = new SpeechRecognition();
        rec.lang = 'bn-BD';
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        return rec;
    }

    function startVoice() {
        var btn    = document.getElementById('ubc-voice-btn');
        var status = document.getElementById('ubc-voice-status');
        var input  = document.getElementById('ubc-shared-input');

        if (!btn || !status || !input) return;

        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            status.textContent = '⚠ Voice input not supported in this browser. Try Chrome or Edge.';
            status.className = 'ubc-voice-status ubc-voice-status--error';
            return;
        }

        if (isListening) {
            recognition && recognition.stop();
            return;
        }

        recognition = initVoice();
        if (!recognition) return;

        isListening = true;
        btn.textContent = '⏹ Stop';
        btn.classList.add('ubc-btn--recording');
        status.textContent = '🎤 Listening… speak in Bangla';
        status.className = 'ubc-voice-status ubc-voice-status--listening';

        recognition.onresult = function (event) {
            var transcript = '';
            for (var i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            input.value = transcript;
            updateCharCount('ubc-shared-input', 'ubc-input-count');
        };

        recognition.onerror = function (event) {
            status.textContent = '⚠ Error: ' + event.error;
            status.className = 'ubc-voice-status ubc-voice-status--error';
            resetVoiceBtn(btn);
        };

        recognition.onend = function () {
            resetVoiceBtn(btn);
            status.textContent = '✔ Voice input complete.';
            status.className = 'ubc-voice-status ubc-voice-status--done';
            setTimeout(function () { status.textContent = ''; status.className = 'ubc-voice-status'; }, 3000);
        };

        recognition.start();
    }

    function resetVoiceBtn(btn) {
        isListening = false;
        if (btn) {
            btn.textContent = '🎤 Speak';
            btn.classList.remove('ubc-btn--recording');
        }
    }

    /* ===================================================================
     * HELPERS
     * =================================================================== */
    function updateCharCount(inputId, countId) {
        var el    = document.getElementById(inputId);
        var count = document.getElementById(countId);
        if (el && count) {
            var n = el.value.length;
            count.textContent = n + (n === 1 ? ' character' : ' characters');
        }
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return Promise.resolve();
    }

    function downloadText(text, filename) {
        var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        var url  = URL.createObjectURL(blob);
        var a    = document.createElement('a');
        a.href     = url;
        a.download = filename || 'bijoy-output.txt';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    function flashBtn(btn, successText, originalText) {
        btn.textContent = successText;
        btn.classList.add('ubc-btn--flash');
        setTimeout(function () {
            btn.textContent = originalText;
            btn.classList.remove('ubc-btn--flash');
        }, 1500);
    }

    function syncTextareaHeight(inputEl, outputEl) {
        if (!inputEl || !outputEl) return;
        inputEl.style.height = 'auto';
        outputEl.style.height = 'auto';
        var maxH = Math.max(inputEl.scrollHeight, outputEl.scrollHeight, 220);
        inputEl.style.height = maxH + 'px';
        outputEl.style.height = maxH + 'px';
    }

    function bindClick(id, handler) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('click', handler);
    }

    /* ===================================================================
     * DOM WIRING
     * =================================================================== */
    function init() {
        var inputEl  = document.getElementById('ubc-shared-input');
        var outputEl = document.getElementById('ubc-result-output');
        var statusEl = document.getElementById('ubc-voice-status');

        if (!inputEl || !outputEl) return; // shortcode not on this page

        /* Convert buttons */
        bindClick('ubc-to-bijoy-btn', function () {
            var result = unicodeToBijoy(inputEl.value);
            outputEl.value = result;
            updateCharCount('ubc-result-output', 'ubc-output-count');
            syncTextareaHeight(inputEl, outputEl);
        });

        bindClick('ubc-to-unicode-btn', function () {
            outputEl.value = bijoyToUnicode(inputEl.value);
            updateCharCount('ubc-result-output', 'ubc-output-count');
            syncTextareaHeight(inputEl, outputEl);
        });

        /* Copy */
        bindClick('ubc-copy-btn', function () {
            var btn = this;
            copyToClipboard(outputEl.value).then(function () {
                flashBtn(btn, '✔ Copied!', '📋 Copy');
            }).catch(function () {
                flashBtn(btn, '✘ Failed', '📋 Copy');
            });
        });

        /* Download */
        bindClick('ubc-download-btn', function () {
            if (outputEl.value.trim()) {
                downloadText(outputEl.value, 'bijoy-output.txt');
            }
        });

        /* Paste */
        bindClick('ubc-paste-btn', function () {
            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard.readText().then(function (text) {
                    inputEl.value += text;
                    updateCharCount('ubc-shared-input', 'ubc-input-count');
                    syncTextareaHeight(inputEl, outputEl);
                }).catch(function () {
                    if (statusEl) {
                        statusEl.textContent = '⚠ Clipboard permission denied. Press Ctrl+V in input box.';
                        statusEl.className = 'ubc-voice-status ubc-voice-status--error';
                    }
                });
            } else if (statusEl) {
                statusEl.textContent = '⚠ Clipboard API unavailable. Press Ctrl+V in input box.';
                statusEl.className = 'ubc-voice-status ubc-voice-status--error';
            }
        });

        /* Clear buttons */
        bindClick('ubc-clear-input-btn', function () {
            inputEl.value = '';
            updateCharCount('ubc-shared-input', 'ubc-input-count');
            syncTextareaHeight(inputEl, outputEl);
        });
        bindClick('ubc-clear-output-btn', function () {
            outputEl.value = '';
            updateCharCount('ubc-result-output', 'ubc-output-count');
            syncTextareaHeight(inputEl, outputEl);
        });

        /* Voice */
        bindClick('ubc-voice-btn', startVoice);

        /* Live char count */
        inputEl.addEventListener('input', function () {
            updateCharCount('ubc-shared-input', 'ubc-input-count');
            syncTextareaHeight(inputEl, outputEl);
        });

        outputEl.addEventListener('input', function () {
            syncTextareaHeight(inputEl, outputEl);
        });

        syncTextareaHeight(inputEl, outputEl);

        /* Hide voice button if not supported */
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            var vBtn = document.getElementById('ubc-voice-btn');
            if (vBtn) {
                vBtn.title = 'Voice input not supported in this browser';
                vBtn.style.opacity = '0.4';
                vBtn.style.cursor  = 'not-allowed';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
