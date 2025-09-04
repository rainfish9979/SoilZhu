/**
 * 哈吉米语翻译核心实现代码
 * 
 * @author WIFI连接超时
 * @version 1.0
 * Create Time 2025/7/18_21:37
 */

const haJimiConstants = new Map([
    ["哈", "哈气！"]
]);

function seededRandom(seed) {
    // 把 seed 给 hash 一下
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0; // 正整数
    }

    // 线性同余生成器 LCG
    return function() {
        hash = (hash * 9301 + 49297) % 233280;
        return hash / 233280;
    };
}

function shuffleString(input, seed) {
    const rand = seededRandom(seed);
    const arr = input.split('');

    // Fisher-Yates 洗牌算法
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join('');
}

function getHaJimiWords(seed) {
    const baseHaJimiWords = 
        '哈基米窝那没撸多阿西噶压库路曼波' +
        '哦吗吉利咋酷友达喔哪买奈诺娜美嘎' +
        '呀菇啊自一漫步耶哒我找咕马子砸不' +
        '南北绿豆椰奶龙瓦塔尼莫欧季里得喵';
    return shuffleString(baseHaJimiWords, seed);
}

function encode(str, haJimiWords) {
    const encoder = new TextEncoder();
    const input = encoder.encode(str);
    let output = '';
    let i = 0;

    while (i < input.length) {
        const byte1 = input[i++];
        const byte2 = i < input.length ? input[i++] : NaN;
        const byte3 = i < input.length ? input[i++] : NaN;

        const enc1 = byte1 >> 2;
        const enc2 = ((byte1 & 0x03) << 4) | (isNaN(byte2) ? 0 : byte2 >> 4);
        const enc3 = isNaN(byte2) ? 64 : ((byte2 & 0x0F) << 2) | (isNaN(byte3) ? 0 : byte3 >> 6);
        const enc4 = isNaN(byte3) ? 64 : byte3 & 0x3F;

        output += haJimiWords[enc1];
        output += haJimiWords[enc2];
        output += enc3 === 64 ? '哩' : haJimiWords[enc3];
        output += enc4 === 64 ? '哩' : haJimiWords[enc4];
    }

    return output;
}

function decode(base64, haJimiWords) {
    const revMap = new Map();
    for (let i = 0; i < haJimiWords.length; i++) {
        revMap.set(haJimiWords[i], i);
    }

    const output = [];

    for (let i = 0; i < base64.length; i += 4) {
        const c1 = base64[i];
        const c2 = base64[i + 1];
        const c3 = base64[i + 2];
        const c4 = base64[i + 3];

        const e1 = revMap.get(c1) || 0;
        const e2 = revMap.get(c2) || 0;
        const e3 = c3 === '哩' ? 0 : revMap.get(c3) || 0;
        const e4 = c4 === '哩' ? 0 : revMap.get(c4) || 0;

        const byte1 = (e1 << 2) | (e2 >> 4);
        output.push(byte1);

        if (c3 !== '哩') {
            const byte2 = ((e2 & 15) << 4) | (e3 >> 2);
            output.push(byte2);
        }

        if (c4 !== '哩') {
            const byte3 = ((e3 & 3) << 6) | e4;
            output.push(byte3);
        }
    }

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(output));
}

const decorations = [
    '哈基米',
    '窝那没撸多',
    '阿西噶压',
    '库路曼波',
    '奈诺娜美嘎',
    '哦吗吉利',
    '南北绿豆',
    '欧莫季里',
    '椰奶龙',
];

const punctuationSet = ['，', '；', '？', '。'];

function encodeHaJimi(text) {
    const chunks = [];
    let i = 0;

    while (i < text.length) {
        const remain = text.length - i;
        const len = Math.min(7, Math.max(4, Math.floor(Math.random() * 4 + 4))); // 4~7
        const actualLen = Math.min(remain, len);
        chunks.push(text.slice(i, i + actualLen));
        i += actualLen;
    }

    const result = [];
    let lastPunc = '';

    for (let j = 0; j < chunks.length; j++) {
        const body = chunks[j];
        const prefix = decorations[Math.floor(Math.random() * decorations.length)];
        const suffix = decorations[Math.floor(Math.random() * decorations.length)];

        let punctuation = '';
        const isLast = j === chunks.length - 1;

        if (isLast) {
            punctuation = '。';
        } else {
            let candidates = ['，', '；', '？', '。'];
            if (lastPunc === '？' || lastPunc === '。') {
                candidates = candidates.filter(p => p !== lastPunc);
            }
            punctuation = candidates[Math.floor(Math.random() * candidates.length)];
        }

        lastPunc = punctuation;
        result.push(`${prefix}${body}${suffix}${punctuation}`);
    }

    return result.join('');
}

function decodeHaJimi(encodedText) {
    // 正则匹配前缀+正文+后缀+标点结构
    const decoRegexStr = decorations.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const punctRegexStr = punctuationSet.map(p => `\\${p}`).join('');

    const regex = new RegExp(`(${decoRegexStr})(.{1,10})(${decoRegexStr})([${punctRegexStr}])`, 'g');

    let match;
    const parts = [];

    while ((match = regex.exec(encodedText)) !== null) {
        // match[2] 是正文，提取出来拼接
        parts.push(match[2]);
    }

    return parts.join('');
}

function humanToHaJimi(text, haJimiWords) {
    return encodeHaJimi(encode(text, getHaJimiWords(haJimiWords)));
}

function haJimiToHuman(text, haJimiWords) {
    const filter = doHaJimiConstFilter(text);
    if (filter) return filter;
    return decode(decodeHaJimi(text), getHaJimiWords(haJimiWords));
}

// 有人说"哈"也算哈吉话等待，字符串匹配进行哈气！
function doHaJimiConstFilter(text) {
    let result;
    haJimiConstants.forEach((value, key) => {
        if (key === text) {
            result = value;
            return;
        }
    });
    return result;
}

class schajimi {
    getInfo() {
        return {
            id: 'hajimi',
            name: '哈基米语',
            blocks: [
                {
                    opcode: 'huthj',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '人儿转哈基米 [text1]',
                    arguments: {
                        text1: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello,world'
                        },
                    }
                },
                {
                    opcode: 'hjthu',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '哈基米转人儿 [text2]',
                    arguments: {
                        text2: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '阿西噶压哈哒季哩库路曼波。'
                        },
                    }
                },
            ]
        };
    }
    huthj(args) {
        return humanToHaJimi(args.text1, getHaJimiWords("哈吉米"));
    }
    hjthu(args) {
        return haJimiToHuman(args.text2, getHaJimiWords("哈吉米"));
    }
}

Scratch.extensions.register(new schajimi());