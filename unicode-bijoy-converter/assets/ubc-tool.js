(function () {
    'use strict';

    function isBanglaPreKar(char) {
        return char === 'ি' || char === 'ৈ' || char === 'ে';
    }

    function isBanglaPostKar(char) {
        return char === 'া' || char === 'ো' || char === 'ৌ' || char === 'ৗ' || char === 'ু' || char === 'ূ' || char === 'ী' || char === 'ৃ';
    }

    function isBanglaKar(char) {
        return isBanglaPreKar(char) || isBanglaPostKar(char);
    }

    function isBanglaBanjonborno(char) {
        return 'কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমশষসহযরলয়ংঃঁৎ'.indexOf(char) !== -1;
    }

    function isBanglaNukta(char) {
        return char === 'ং' || char === 'ঃ' || char === 'ঁ';
    }

    function isBanglaHalant(char) {
        return char === '্';
    }

    function isSpace(char) {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    var unicodeToBijoyMap = {
        '।': '|',
        '‘': 'Ô',
        '’': 'Õ',
        '“': 'Ò',
        '”': 'Ó',
        '্র্য': 'ª¨',
        'র‌্য': 'i¨',
        'ক্ক': '°',
        'ক্ট': '±',
        'ক্ত': '³',
        'ক্ব': 'K¡',
        'স্ক্র': '¯Œ',
        'ক্র': 'µ',
        'ক্ল': 'K¬',
        'ক্ষ': '¶',
        'ক্স': '·',
        'গু': '¸',
        'গ্ধ': '»',
        'গ্ন': 'Mœ',
        'গ্ম': 'M¥',
        'গ্ল': 'M­',
        'গ্রু': 'Mªy',
        'ঙ্ক': '¼',
        'ঙ্ক্ষ': '•¶',
        'ঙ্খ': '•L',
        'ঙ্গ': '½',
        'ঙ্ঘ': '•N',
        'চ্চ': '”P',
        'চ্ছ': '”Q',
        'চ্ছ্ব': '”Q¡',
        'চ্ঞ': '”T',
        'জ্জ্ব': '¾¡',
        'জ্জ': '¾',
        'জ্ঝ': 'À',
        'জ্ঞ': 'Á',
        'জ্ব': 'R¡',
        'ঞ্চ': 'Â',
        'ঞ্ছ': 'Ã',
        'ঞ্জ': 'Ä',
        'ঞ্ঝ': 'Å',
        'ট্ট': 'Æ',
        'ট্ব': 'U¡',
        'ট্ম': 'U¥',
        'ড্ড': 'Ç',
        'ণ্ট': 'È',
        'ণ্ঠ': 'É',
        'ন্স': 'Ý',
        'ণ্ড': 'Ê',
        'ন্তু': 'š‘',
        'ণ্ব': 'Y^',
        'ত্ত': 'Ë',
        'ত্ত্ব': 'Ë¡',
        'ত্থ': 'Ì',
        'ত্ন': 'Zœ',
        'ত্ম': 'Z¥',
        'ন্ত্ব': 'š—¡',
        'ত্ব': 'Z¡',
        'থ্ব': '_¡',
        'দ্গ': '˜M',
        'দ্ঘ': '˜N',
        'দ্দ': 'Ï',
        'দ্ধ': '×',
        'দ্ব': 'Ø',
        'দ্ভ': '™¢',
        'দ্ম': 'Ù',
        'দ্রু': '`ª“',
        'ধ্ব': 'aŸ',
        'ধ্ম': 'a¥',
        'ন্ট': '›U',
        'ন্ঠ': 'Ú',
        'ন্ড': 'Û',
        'ন্ত্র': 'š¿',
        'ন্ত': 'š—',
        'স্ত্র': '¯¿',
        'ত্র': 'Î',
        'ন্থ': 'š’',
        'ন্দ': '›`',
        'ন্দ্ব': '›Ø',
        'ন্ধ': 'Ü',
        'ন্ন': 'bœ',
        'ন্ব': 'š^',
        'ন্ম': 'b¥',
        'প্ট': 'Þ',
        'প্ত': 'ß',
        'প্ন': 'cœ',
        'প্প': 'à',
        'প্ল': 'c­',
        'প্স': 'á',
        'ফ্ল': 'd¬',
        'ব্জ': 'â',
        'ব্দ': 'ã',
        'ব্ধ': 'ä',
        'ব্ব': 'eŸ',
        'ব্ল': 'e­',
        'ভ্র': 'å',
        'ম্ন': 'gœ',
        'ম্প': '¤ú',
        'ম্ফ': 'ç',
        'ম্ব': '¤^',
        'ম্ভ': '¤¢',
        'ম্ভ্র': '¤£',
        'ম্ম': '¤§',
        'ম্ল': '¤­',
        'রু': 'i“',
        'রূ': 'iƒ',
        'ল্ক': 'é',
        'ল্গ': 'ê',
        'ল্প': 'í',
        'ল্ট': 'ë',
        'ল্ড': 'ì',
        'ল্ফ': 'î',
        'ল্ব': 'j¦',
        'ল্ম': 'j¥',
        'ল্ল': 'jø',
        'শু': 'ï',
        'শ্চ': 'ð',
        'শ্ন': 'kœ',
        'শ্ব': 'k¦',
        'শ্ম': 'k¥',
        'শ্ল': 'kø',
        'ষ্ক': '®‹',
        'ষ্ক্র': '®Œ',
        'ষ্ট': 'ó',
        'ষ্ঠ': 'ô',
        'ষ্ণ': 'ò',
        'ষ্প': '®ú',
        'ষ্ফ': 'õ',
        'ষ্ম': '®§',
        'স্ক': '¯‹',
        'স্ট': '÷',
        'স্খ': 'ö',
        'স্ত': '¯—',
        'স্তু': '¯‘',
        'স্থ': '¯’',
        'স্ন': 'mœ',
        'স্প': '¯ú',
        'স্ফ': 'ù',
        'স্ব': '¯^',
        'স্ম': '¯§',
        'স্ল': '¯­',
        'হু': 'û',
        'হ্ণ': 'nè',
        'হ্ন': 'ý',
        'হ্ম': 'þ',
        'হ্ল': 'n¬',
        'হৃ': 'ü',
        'র্': '©',
        '্র': '«',
        '্য': '¨',
        '্‌': '&‌',
        '্‍': '&‍',
        '্': '&',
        '‌': '‌',
        '‍': '‍',
        '়': '়',
        'আ': 'Av',
        'অ': 'A',
        'ই': 'B',
        'ঈ': 'C',
        'উ': 'D',
        'ঊ': 'E',
        'ঋ': 'F',
        'এ': 'G',
        'ঐ': 'H',
        'ও': 'I',
        'ঔ': 'J',
        'ক': 'K',
        'খ': 'L',
        'গ': 'M',
        'ঘ': 'N',
        'ঙ': 'O',
        'চ': 'P',
        'ছ': 'Q',
        'জ': 'R',
        'ঝ': 'S',
        'ঞ': 'T',
        'ট': 'U',
        'ঠ': 'V',
        'ড': 'W',
        'ঢ': 'X',
        'ণ': 'Y',
        'ত': 'Z',
        'থ': '_',
        'দ': '`',
        'ধ': 'a',
        'ন': 'b',
        'প': 'c',
        'ফ': 'd',
        'ব': 'e',
        'ভ': 'f',
        'ম': 'g',
        'য': 'h',
        'র': 'i',
        'ল': 'j',
        'শ': 'k',
        'ষ': 'l',
        'স': 'm',
        'হ': 'n',
        'ড়': 'o',
        'ঢ়': 'p',
        'য়': 'q',
        'ৎ': 'r',
        '০': '0',
        '১': '1',
        '২': '2',
        '৩': '3',
        '৪': '4',
        '৫': '5',
        '৬': '6',
        '৭': '7',
        '৮': '8',
        '৯': '9',
        'া': 'v',
        'ি': 'w',
        'ী': 'x',
        'ু': 'y',
        'ূ': '~',
        'ৃ': '…',
        'ে': '‡',
        'ৈ': '‰',
        'ৗ': 'Š',
        'ং': 's',
        'ঃ': 't',
        'ঁ': 'u'
    };

    var bijoyToUnicodeMap = {
        'i¨': 'র‌্য',
        'ª¨': '্র্য',
        '°': 'ক্ক',
        '±': 'ক্ট',
        '³': 'ক্ত',
        'K¡': 'ক্ব',
        '¯Œ': 'স্ক্র',
        'µ': 'ক্র',
        'K¬': 'ক্ল',
        '¶': 'ক্ষ',
        'ÿ': 'ক্ষ',
        '·': 'ক্স',
        '¸': 'গু',
        '»': 'গ্ধ',
        'Mœ': 'গ্ন',
        'M¥': 'গ্ম',
        'M­': 'গ্ল',
        '¼': 'ঙ্ক',
        '•¶': 'ঙ্ক্ষ',
        '•L': 'ঙ্খ',
        '½': 'ঙ্গ',
        '•N': 'ঙ্ঘ',
        '•': 'ক্স',
        '”P': 'চ্চ',
        '”Q': 'চ্ছ',
        '”Q¡': 'চ্ছ্ব',
        '”T': 'চ্ঞ',
        '¾¡': 'জ্জ্ব',
        '¾': 'জ্জ',
        'À': 'জ্ঝ',
        'Á': 'জ্ঞ',
        'R¡': 'জ্ব',
        'Â': 'ঞ্চ',
        'Ã': 'ঞ্ছ',
        'Ä': 'ঞ্জ',
        'Å': 'ঞ্ঝ',
        'Æ': 'ট্ট',
        'U¡': 'ট্ব',
        'U¥': 'ট্ম',
        'Ç': 'ড্ড',
        'È': 'ণ্ট',
        'É': 'ণ্ঠ',
        'Ý': 'ন্স',
        'Ê': 'ণ্ড',
        'š‘': 'ন্তু',
        'Y^': 'ণ্ব',
        'Ë¡': 'ত্ত্ব',
        'Ë': 'ত্ত',
        'Ì': 'ত্থ',
        'Z¥': 'ত্ম',
        'š—¡': 'ন্ত্ব',
        'Z¡': 'ত্ব',
        'Î': 'ত্র',
        '_¡': 'থ্ব',
        '˜M': 'দ্গ',
        '˜N': 'দ্ঘ',
        'Ï': 'দ্দ',
        '×': 'দ্ধ',
        '˜¡': 'দ্ব',
        'Ø': 'দ্ব',
        '™¢': 'দ্ভ',
        'Ù': 'দ্ম',
        '`ª“': 'দ্রু',
        'aŸ': 'ধ্ব',
        'a¥': 'ধ্ম',
        '›U': 'ন্ট',
        'Ú': 'ন্ঠ',
        'Û': 'ন্ড',
        'šÍ': 'ন্ত',
        'š—': 'ন্ত',
        'š¿': 'ন্ত্র',
        'š’': 'ন্থ',
        '›`': 'ন্দ',
        '›Ø': 'ন্দ্ব',
        'Ü': 'ন্ধ',
        'bœ': 'ন্ন',
        'š^': 'ন্ব',
        'b¥': 'ন্ম',
        'Þ': 'প্ট',
        'ß': 'প্ত',
        'cœ': 'প্ন',
        'à': 'প্প',
        'cø': 'প্ল',
        'c­': 'প্ল',
        'á': 'প্স',
        'd¬': 'ফ্ল',
        'â': 'ব্জ',
        'ã': 'ব্দ',
        'ä': 'ব্ধ',
        'eŸ': 'ব্ব',
        'e­': 'ব্ল',
        'å': 'ভ্র',
        'gœ': 'ম্ন',
        '¤ú': 'ম্প',
        'ç': 'ম্ফ',
        '¤^': 'ম্ব',
        '¤¢': 'ম্ভ',
        '¤£': 'ম্ভ্র',
        '¤§': 'ম্ম',
        '¤­': 'ম্ল',
        'i“': 'রু',
        'iæ': 'রু',
        'iƒ': 'রূ',
        'é': 'ল্ক',
        'ê': 'ল্গ',
        'ë': 'ল্ট',
        'ì': 'ল্ড',
        'í': 'ল্প',
        'î': 'ল্ফ',
        'j¦': 'ল্ব',
        'j¥': 'ল্ম',
        'jø': 'ল্ল',
        'ï': 'শু',
        'ð': 'শ্চ',
        'kœ': 'শ্ন',
        'kø': 'শ্ল',
        'k¦': 'শ্ব',
        'k¥': 'শ্ম',
        'k­': 'শ্ল',
        '®‹': 'ষ্ক',
        '®Œ': 'ষ্ক্র',
        'ó': 'ষ্ট',
        'ô': 'ষ্ঠ',
        'ò': 'ষ্ণ',
        '®ú': 'ষ্প',
        'õ': 'ষ্ফ',
        '®§': 'ষ্ম',
        '¯‹': 'স্ক',
        '÷': 'স্ট',
        'ö': 'স্খ',
        '¯—': 'স্ত',
        '¯Í': 'স্ত',
        '¯‘': 'স্তু',
        '¯¿': 'স্ত্র',
        '¯’': 'স্থ',
        'mœ': 'স্ন',
        '¯ú': 'স্প',
        'ù': 'স্ফ',
        '¯^': 'স্ব',
        '¯§': 'স্ম',
        '¯­': 'স্ল',
        'û': 'হু',
        'nè': 'হ্ণ',
        'ý': 'হ্ন',
        'þ': 'হ্ম',
        'n¬': 'হ্ল',
        'ü': 'হৃ',
        '©': 'র্',
        'Av': 'আ',
        'A': 'অ',
        'B': 'ই',
        'C': 'ঈ',
        'D': 'উ',
        'E': 'ঊ',
        'F': 'ঋ',
        'G': 'এ',
        'H': 'ঐ',
        'I': 'ও',
        'J': 'ঔ',
        'K': 'ক',
        'L': 'খ',
        'M': 'গ',
        'N': 'ঘ',
        'O': 'ঙ',
        'P': 'চ',
        'Q': 'ছ',
        'R': 'জ',
        'S': 'ঝ',
        'T': 'ঞ',
        'U': 'ট',
        'V': 'ঠ',
        'W': 'ড',
        'X': 'ঢ',
        'Y': 'ণ',
        'Z': 'ত',
        '_': 'থ',
        '`': 'দ',
        'a': 'ধ',
        'b': 'ন',
        'c': 'প',
        'd': 'ফ',
        'e': 'ব',
        'f': 'ভ',
        'g': 'ম',
        'h': 'য',
        'i': 'র',
        'j': 'ল',
        'k': 'শ',
        'l': 'ষ',
        'm': 'স',
        'n': 'হ',
        'o': 'ড়',
        'p': 'ঢ়',
        'q': 'য়',
        'r': 'ৎ',
        '0': '০',
        '1': '১',
        '2': '২',
        '3': '৩',
        '4': '৪',
        '5': '৫',
        '6': '৬',
        '7': '৭',
        '8': '৮',
        '9': '৯',
        'v': 'া',
        'w': 'ি',
        'x': 'ী',
        'y': 'ু',
        'z': 'ু',
        '~': 'ূ',
        '„': 'ৃ',
        '‡': 'ে',
        '†': 'ে',
        '‰': 'ৈ',
        'ˆ': 'ৈ',
        'Š': 'ৗ',
        'Ô': '‘',
        'Õ': '’',
        '|': '।',
        'Ò': '“',
        'Ó': '”',
        's': 'ং',
        't': 'ঃ',
        'u': 'ঁ',
        'ª': '্র',
        'Ö': '্র',
        '«': '্র',
        '¨': '্য',
        '&‌': '্‌',
        '&‍': '্‍',
        '&': '্',
        '‌': '‌',
        '‍': '‍',
        '়': '়',
        '…': 'ৃ'
    };

    var unicodeKeys = Object.keys(unicodeToBijoyMap).sort(function (a, b) {
        return b.length - a.length;
    });
    var bijoyKeys = Object.keys(bijoyToUnicodeMap).sort(function (a, b) {
        return b.length - a.length;
    });

    function reArrangeUnicodeText(text) {
        var barrier = 0;
        for (var i = 0; i < text.length; i++) {
            if (i < text.length && isBanglaPreKar(text.charAt(i))) {
                var j = 1;
                while (isBanglaBanjonborno(text.charAt(i - j))) {
                    if (i - j < 0 || i - j <= barrier) {
                        break;
                    }
                    if (isBanglaHalant(text.charAt(i - j - 1))) {
                        j += 2;
                    } else {
                        break;
                    }
                }
                text = text.substring(0, i - j) + text.charAt(i) + text.substring(i - j, i) + text.substring(i + 1);
                barrier = i + 1;
                continue;
            }
            if (i < text.length - 1 && isBanglaHalant(text.charAt(i)) && text.charAt(i - 1) === 'র' && !isBanglaHalant(text.charAt(i - 2))) {
                var step = 1;
                var foundPreKar = 0;
                while (true) {
                    if (isBanglaBanjonborno(text.charAt(i + step)) && isBanglaHalant(text.charAt(i + step + 1))) {
                        step += 2;
                    } else if (isBanglaBanjonborno(text.charAt(i + step)) && isBanglaPreKar(text.charAt(i + step + 1))) {
                        foundPreKar = 1;
                        break;
                    } else {
                        break;
                    }
                }
                text = text.substring(0, i - 1) + text.substring(i + step + 1, i + step + foundPreKar + 1) + text.substring(i + 1, i + step + 1) + text.charAt(i - 1) + text.charAt(i) + text.substring(i + step + foundPreKar + 1);
                i += step + foundPreKar;
                barrier = i + 1;
            }
        }
        return text;
    }

    function reArrangeUnicodeConvertedText(text) {
        for (var i = 0; i < text.length; i++) {
            if (i > 0 && text.charAt(i) === '্' && (isBanglaKar(text.charAt(i - 1)) || isBanglaNukta(text.charAt(i - 1))) && i < text.length - 1) {
                text = text.substring(0, i - 1) + text.charAt(i) + text.charAt(i + 1) + text.charAt(i - 1) + text.substring(i + 2);
            }
            if (i > 0 && i < text.length - 1 && text.charAt(i) === '্' && text.charAt(i - 1) === 'র' && text.charAt(i - 2) !== '্' && isBanglaKar(text.charAt(i + 1))) {
                text = text.substring(0, i - 1) + text.charAt(i + 1) + text.charAt(i - 1) + text.charAt(i) + text.substring(i + 2);
            }
            if (i < text.length - 1 && text.charAt(i) === 'র' && isBanglaHalant(text.charAt(i + 1)) && !isBanglaHalant(text.charAt(i - 1))) {
                var move = 1;
                while (true) {
                    if (i - move < 0) {
                        break;
                    }
                    if (isBanglaBanjonborno(text.charAt(i - move)) && isBanglaHalant(text.charAt(i - move - 1))) {
                        move += 2;
                    } else if (move === 1 && isBanglaKar(text.charAt(i - move))) {
                        move++;
                    } else {
                        break;
                    }
                }
                text = text.substring(0, i - move) + text.charAt(i) + text.charAt(i + 1) + text.substring(i - move, i) + text.substring(i + 2);
                i += 1;
                continue;
            }
            if (i < text.length - 1 && isBanglaPreKar(text.charAt(i)) && !isSpace(text.charAt(i + 1))) {
                var prefix = text.substring(0, i);
                var offset = 1;
                while (isBanglaBanjonborno(text.charAt(i + offset))) {
                    if (isBanglaHalant(text.charAt(i + offset + 1))) {
                        offset += 2;
                    } else {
                        break;
                    }
                }
                prefix += text.substring(i + 1, i + offset + 1);
                var extra = 0;
                if (text.charAt(i) === 'ে' && text.charAt(i + offset + 1) === 'া') {
                    prefix += 'ো';
                    extra = 1;
                } else if (text.charAt(i) === 'ে' && text.charAt(i + offset + 1) === 'ৗ') {
                    prefix += 'ৌ';
                    extra = 1;
                } else {
                    prefix += text.charAt(i);
                }
                prefix += text.substring(i + offset + extra + 1);
                text = prefix;
                i += offset;
            }
            if (i < text.length - 1 && text.charAt(i) === 'ঁ' && isBanglaPostKar(text.charAt(i + 1))) {
                text = text.substring(0, i) + text.charAt(i + 1) + text.charAt(i) + text.substring(i + 2);
            }
        }
        return text;
    }

    function convertByMap(text, keys, mapping) {
        var output = text;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            output = output.split(key).join(mapping[key]);
        }
        return output;
    }

    // Convert long text in smaller segments, preserving separators as-is.
    function convertInChunks(text, converter) {
        var parts = text.split(/(\s+|[।,!?;:\n\r]+)/);
        var output = '';
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (!part) {
                continue;
            }
            if (/^(\s+|[।,!?;:\n\r]+)$/.test(part)) {
                output += part;
            } else {
                output += converter(part);
            }
        }
        return output;
    }

    // Returns true if text contains Bengali Unicode characters
    function isUnicodeBangla(text) {
        return /[\u0980-\u09FF]/.test(text);
    }

    function convertToBijoy(text) {
        return convertInChunks(text, function (part) {
            var prepared = part.replace(/ো/g, 'ো').replace(/ৌ/g, 'ৌ');
            prepared = reArrangeUnicodeText(prepared);
            return convertByMap(prepared, unicodeKeys, unicodeToBijoyMap);
        });
    }

    function convertToUnicode(text) {
        return convertInChunks(text, function (part) {
            var converted = convertByMap(part, bijoyKeys, bijoyToUnicodeMap);
            converted = reArrangeUnicodeConvertedText(converted);
            return converted.replace(/অা/g, 'আ');
        });
    }

    var recognition = null;
    var listening = false;
    var stoppedByUser = false;

    function setStatus(message, type) {
        var status = document.getElementById('ubc-status');
        if (!status) {
            return;
        }
        status.textContent = message || '';
        status.className = 'ubc-status' + (type ? ' ubc-status--' + type : '');
    }

    function syncHeights() {
        var input = document.getElementById('ubc-input');
        var output = document.getElementById('ubc-output');
        if (!input || !output) {
            return;
        }
        input.style.height = 'auto';
        output.style.height = 'auto';
        var height = Math.max(240, input.scrollHeight, output.scrollHeight);
        input.style.height = height + 'px';
        output.style.height = height + 'px';
    }

    function syncLinkedFocusState() {
        var wrap = document.getElementById('ubc-wrap');
        var input = document.getElementById('ubc-input');
        if (!wrap || !input) {
            return;
        }
        var isHovered = input.matches(':hover');
        var isFocused = document.activeElement === input;
        var hasText = input.value.length > 0;
        wrap.classList.toggle('ubc-linked-focus', isHovered || isFocused || hasText);
    }

    function updateCounters() {
        var input = document.getElementById('ubc-input');
        var output = document.getElementById('ubc-output');
        var inputCountSpan = document.getElementById('ubc-input-count');
        var inputCharsSpan = document.getElementById('ubc-input-chars');
        var outputCountSpan = document.getElementById('ubc-output-count');
        var outputCharsSpan = document.getElementById('ubc-output-chars');

        if (!input || !output || !inputCountSpan || !inputCharsSpan || !outputCountSpan || !outputCharsSpan) {
            return;
        }

        // Count input
        var inputText = input.value.trim();
        var inputWords = inputText.length > 0 ? inputText.split(/\s+/).length : 0;
        var inputChars = input.value.length;

        // Count output
        var outputText = output.value.trim();
        var outputWords = outputText.length > 0 ? outputText.split(/\s+/).length : 0;
        var outputChars = output.value.length;

        inputCountSpan.textContent = inputWords;
        inputCharsSpan.textContent = inputChars;
        outputCountSpan.textContent = outputWords;
        outputCharsSpan.textContent = outputChars;
    }

    function initVoice() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return null;
        }
        var instance = new SpeechRecognition();
        instance.lang = 'bn-BD';
        instance.continuous = true;
        instance.interimResults = true;
        instance.maxAlternatives = 1;
        return instance;
    }

    function setMicStatus(on) {
        var label = document.getElementById('ubc-mic-label');
        if (!label) { return; }
        label.textContent = on ? 'Mic On' : 'Mic Off';
        label.className = 'ubc-mic-label' + (on ? ' ubc-mic-label--on' : '');
    }

    function stopMic() {
        if (listening && recognition) {
            stoppedByUser = true;
            recognition.stop();
        }
    }

    function startVoice() {
        var input = document.getElementById('ubc-input');
        var micButton = document.getElementById('ubc-mic-btn');
        if (!input || !micButton) {
            return;
        }
        if (listening && recognition) {
            stoppedByUser = true;
            recognition.stop();
            return;
        }
        recognition = initVoice();
        if (!recognition) {
            setStatus('Voice input is not supported in this browser. Use Chrome or Edge.', 'error');
            return;
        }
        listening = true;
        stoppedByUser = false;
        micButton.classList.add('ubc-mic-btn--recording');
        setMicStatus(true);
        setStatus('', '');
        recognition.onresult = function (event) {
            var transcript = '';
            for (var i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            input.value = transcript;
            updateCounters();
        };
        recognition.onerror = function (event) {
            if (event.error === 'no-speech') { return; }
            listening = false;
            stoppedByUser = false;
            micButton.className = 'ubc-mic-btn';
            setMicStatus(false);
            setStatus('', '');
        };
        recognition.onend = function () {
            if (listening && !stoppedByUser) {
                try { recognition.start(); } catch (e) {}
                return;
            }
            listening = false;
            stoppedByUser = false;
            micButton.className = 'ubc-mic-btn';
            setMicStatus(false);
            setStatus('', '');
        };
        recognition.start();

    }

    function stopMic() {
        if (listening && recognition) {
            stoppedByUser = true;
            recognition.stop();
        }
    }

    function init() {
        var input = document.getElementById('ubc-input');
        var output = document.getElementById('ubc-output');
        var toUnicode = document.getElementById('ubc-to-unicode-btn');
        var toBijoy = document.getElementById('ubc-to-bijoy-btn');
        var copy = document.getElementById('ubc-copy-btn');
        var mic = document.getElementById('ubc-mic-btn');
        var clear = document.getElementById('ubc-clear-btn');

        if (!input || !output || !toUnicode || !toBijoy || !copy || !mic || !clear) {
            return;
        }

        input.addEventListener('input', syncLinkedFocusState);
        input.addEventListener('input', updateCounters);
        input.addEventListener('focus', syncLinkedFocusState);
        input.addEventListener('blur', syncLinkedFocusState);
        input.addEventListener('mouseenter', syncLinkedFocusState);
        input.addEventListener('mouseleave', syncLinkedFocusState);

        toUnicode.addEventListener('click', function () {
            stopMic();
            if (isUnicodeBangla(input.value)) {
                output.value = input.value;
            } else {
                output.value = convertToUnicode(input.value);
            }
            output.classList.remove('ubc-textarea--bijoy');
            output.classList.add('ubc-textarea--unicode');
            setStatus('', '');
            updateCounters();
            toUnicode.blur();
        });

        toBijoy.addEventListener('click', function () {
            stopMic();
            if (!isUnicodeBangla(input.value)) {
                output.value = input.value;
            } else {
                output.value = convertToBijoy(input.value);
            }
            output.classList.remove('ubc-textarea--unicode');
            output.classList.add('ubc-textarea--bijoy');
            setStatus('', '');
            updateCounters();
            toBijoy.blur();
        });

        copy.addEventListener('click', function () {
            stopMic();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(output.value).then(function () {
                    setStatus('', '');
                }).catch(function () {
                    setStatus('Copy failed. Select output and press Ctrl+C.', 'error');
                });
            } else {
                setStatus('Copy not supported in this browser.', 'error');
            }
            copy.blur();
        });

        mic.addEventListener('click', startVoice);

        clear.addEventListener('click', function () {
            stopMic();
            input.value = '';
            output.value = '';
            output.classList.remove('ubc-textarea--bijoy');
            output.classList.add('ubc-textarea--unicode');
            setStatus('', '');
            input.blur();
            output.blur();
            syncLinkedFocusState();
            updateCounters();
            clear.blur();
        });

        syncHeights();
        syncLinkedFocusState();
        updateCounters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
