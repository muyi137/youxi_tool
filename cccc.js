"use strict";

function getSize(n, t, i) {
    return t * n + i * (n + 1)
}

function getPermutations(n) {
    const t = new Set,
        i = new Array(n.length).fill(!1);
    return backtrack(n, i, [], t), Array.from(t)
}

function backtrack(n, t, i, r) {
    if (i.length === n.length) {
        r.add(JSON.stringify([...i]));
        return
    }
    for (let u = 0; u < n.length; u++) t[u] || (t[u] = !0, i.push(n[u]), backtrack(n, t, i, r), t[u] = !1, i.pop())
}

function initXY() {
    var n, t, i;
    for (let r = 0; r < 512; r++) {
        let u = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            e = 0,
            f = r;
        n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) t = f % 2, f = Math.floor(f / 2), t && n && (u[n]++, n = 0), n += !t;
        n && u[n]++;
        for (i in u) e += (10 - Number(i)) * u[i];
        xyMap.push(e)
    }
}

function initZ() {
    var i, r, n, f, e, o, t, u;
    for (let s = 0; s < 512; s++) {
        let h = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            c = 0;
        r = [
            [],
            [],
            []
        ];
        n = s;
        for (let t = 8; t >= 0; t--) f = n % 2, n = Math.floor(n / 2), e = Math.floor(t / 3), o = t % 3, r[e][o] = f;
        t = function(n, u) {
            let f = 0;
            return n < GAME_INFO.BOARD_BLOCK_SET_WIDTH && u < GAME_INFO.BOARD_BLOCK_SET_WIDTH && !i[n * GAME_INFO.BOARD_BLOCK_SET_WIDTH + u] && r[n][u] && (i[n * GAME_INFO.BOARD_BLOCK_SET_WIDTH + u] = !0, f = 1 + t(n + 1, u) + t(n, u + 1)), f
        };
        i = {
            0: !1,
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1,
            8: !1
        };
        for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++)
            for (let i = 0; i < GAME_INFO.BOARD_BLOCK_SET_WIDTH; i++) {
                let r = t(n, i);
                r && h[r]++
            }
        for (u in h) c += (10 - Number(u)) * h[u];
        zMap.push(c)
    }
}

function bestSolutionCheck(n, t, i) {
    if (n.step.length === 0 || t.score > n.score || t.score === n.score && t.strik > n.strik) Object.assign(n, t), n.statusScore = i.evaluateStatus();
    else if (t.score === n.score && t.strik === n.strik) {
        let r = i.evaluateStatus();
        n.statusScore > r && (Object.assign(n, t), n.statusScore = r)
    }
}

function GetScore(n, t, i) {
    return t > 0 ? n.score + [0, 18, 42, 66, 90, 114, 132, 150, 168][t] + i * 5 : n.score
}

function clone(n) {
    var t, i, u, r;
    if (typeof n == "object")
        if (n === null) t = null;
        else if (n instanceof Array)
        for (t = [], i = 0, u = n.length; i < u; i++) t.push(clone(n[i]));
    else {
        t = Object.create(n);
        for (r in n) t[r] = clone(n[r])
    } else t = n;
    return t
}

function cloneSolution(n) {
    return {
        step: n.step.slice(),
        strik: n.strik,
        score: n.score,
        statusScore: n.statusScore
    }
}

function dfs(n, t, i, r, u) {
    if (i === t.length) {
        bestSolutionCheck(r, u, n);
        return
    }
    const f = t[i];
    var e = !1;
    for (let o = 0; o <= 9 - f.h; o++)
        for (let s = 0; s <= 9 - f.w; s++)
            if (n.canPutAt(s, o, f)) {
                e = !0;
                let c = n.clone();
                c.putAt(s, o, f);
                let l = c.checkAndEliminate(),
                    a = l > 0 ? u.strik + 1 : 0,
                    h = cloneSolution(u);
                h.step.push({
                    x: s,
                    y: o,
                    shape: f
                });
                h.strik = a;
                h.score += GetScore(f, l, u.strik);
                dfs(c, t, i + 1, r, h)
            }
    e || u.step.length > r.step.length && bestSolutionCheck(r, u, n)
}

function putShapes(n, t, i) {
    if (t.length !== 3) return !1;
    var r = clone(i);
    const u = getPermutations(t);
    for (let t of u) {
        let u = JSON.parse(t);
        dfs(n, u, 0, i, clone(r))
    }
    return !0
}

function setDivProperties(n, t, i, r, u, f) {
    var e = document.getElementById(n);
    e ? (e.style.zIndex = t || 0, e.style.display = i ? "block" : "none", e.style.position = r || "static", (r === "relative" || r === "absolute") && (e.style.left = u + "px", e.style.top = f + "px")) : console.error("No div found with the given id:", n)
}

function isHorizontalLayout() {
    if (window.innerWidth > window.innerHeight) return !0;
    var n = navigator.userAgent || navigator.vendor || window.opera;
    return /windows phone/i.test(n) ? !1 : /android/i.test(n) ? !1 : /iPad|iPhone|iPod/.test(n) && !window.MSStream ? !1 : /iOS/i.test(navigator.platform) ? !1 : /Win|Mac|Linux/.test(navigator.platform) ? !0 : !1
}

function showTimes(n) {
    document.getElementById("times").innerHTML = `可用：${Math.round(n/60)}分, 全网剩余：${piggy.freeMinutes}分`
}

function onResetButtonPress() {
    StartGame()
}

function StartGame() {
    window.solv = new slover;
    window.bestSolution = {
        step: [],
        strik: 0,
        score: 0,
        statusScore: 0
    };
    window.curStep = 0;
    window.boardStatus = c_BoardStatus.START;
    window.outCanvas.drawBoard([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    window.selectcanvas.clearSelect();
    window.selectcanvas.draw();
    FinishSelect();
    window.roundcanvas.draw([]);
    score = 0;
    document.getElementById("score").innerHTML = "得分: " + score.toString();
    onEditButtonPress()
}

function StartSelect() {
    selectedShape = [];
    window.boardStatus = c_BoardStatus.SELECT_SHAPE;
    window.selectcanvas.enable = !0;
    horizontalLayout || (window.selectcanvas.show = !0);
    ShowStatus("请选择本轮所用3个图案, 完成后点‘选好了’按钮");
    updateButtonStatus()
}

function FinishSelect() {
    horizontalLayout || (window.selectcanvas.show = !1);
    window.selectcanvas.enable = !1;
    window.selectcanvas.clearSelect();
    selectButton.disabled = !0
}

function onUpdated(n) {
    showTimes(n);
    // n > 0 ?
    (FinishSelect(), window.roundcanvas.draw([]), ShowStatus("计算中，请等待..."), bestSolution.step = [], bestSolution.statusScore = 1e6, requestIdleCallback(() => {
        putShapes(solv, selectedShape, bestSolution) ? (curStep = 0, ShowStatus("请跟随放置，然后点击下一步按钮"), onStepButtonPress()) : ShowStatus("无法放置")
    }))
    //  : (ShowStatus("无可用时长，无法使用"), selectButton.disabled = !1);
    resetButton.disabled = !1
}

function onSelectButtonPress() {
    window.boardStatus === c_BoardStatus.SELECT_SHAPE ? selectedShape.length == 3 && (selectButton.disabled = !0, resetButton.disabled = !0, piggy.update(onUpdated)) : window.boardStatus === c_BoardStatus.START ? (StartSelect(), Object.assign(solv.board, window.outCanvas.board)) : window.boardStatus === c_BoardStatus.EDIT && (StartSelect(), Object.assign(solv.board, window.outCanvas.board))
}

function onStepButtonPress() {
    if (curStep < bestSolution.step.length) {
        var n = bestSolution.step[curStep];
        window.outCanvas.drawBoard(solv.board);
        window.outCanvas.drawShape(n.x, n.y, n.shape);
        solv.putAt(n.x, n.y, n.shape);
        let t = solv.checkAndEliminate();
        score += GetScore(n.shape, t, streak);
        document.getElementById("score").innerHTML = "得分: " + score.toString();
        t > 0 ? streak++ : streak = 0;
        curStep++;
        curStep === bestSolution.step.length ? horizontalLayout ? t > 0 ? stepButton.disabled = !1 : (stepButton.disabled = !0, window.selectcanvas.enable = !0, curStep < 2 ? ShowStatus("无法全部放上, 游戏结束。请点‘重新开始’按钮") : StartSelect()) : stepButton.disabled = !1 : stepButton.disabled = !1
    } else curStep === bestSolution.step.length && (stepButton.disabled = !0, window.selectcanvas.enable = !0, window.outCanvas.drawBoard(solv.board), curStep < 2 ? ShowStatus("无法全部放上, 游戏结束。请点‘重新开始’按钮") : StartSelect())
}

function download(n, t) {
    var i = document.createElement("a");
    i.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(n));
    i.setAttribute("download", t);
    i.style.display = "none";
    document.body.appendChild(i);
    i.click();
    document.body.removeChild(i)
}

function ShowStatus(n) {
    document.getElementById("status").innerHTML = n
}

function updateButtonStatus() {
    switch (window.boardStatus) {
        case c_BoardStatus.SELECT_SHAPE:
        case c_BoardStatus.EDIT:
        case c_BoardStatus.START:
            stepButton.disabled = !0;
            resetButton.disabled = !1;
            selectButton.disabled = !1;
            return;
        case c_BoardStatus.CAL:
        case c_BoardStatus.DISABLE:
            stepButton.disabled = !0;
            resetButton.disabled = !0;
            selectButton.disabled = !0;
            return;
        case c_BoardStatus.MOVE:
            stepButton.disabled = !1;
            resetButton.disabled = !1;
            selectButton.disabled = !1
    }
}

function onEditButtonPress() {
    ShowStatus("请使用鼠标设置盘面, 完成后点‘选好了’按钮");
    window.selectcanvas.enable = !1;
    window.outCanvas.enableEdit(!0);
    window.boardStatus !== c_BoardStatus.START && (window.boardStatus = c_BoardStatus.EDIT);
    updateButtonStatus()
}
var FingerprintJS, piggy, shapes, xyMap, zMap, selectedShape, putShapeCount, streak, score;
! function(n, t) {
    "object" == typeof exports ? module.exports = exports = t() : "function" == typeof define && define.amd ? define([], t) : n.CryptoJS = t()
}(this, function() {
    function kr(n, t, i) {
        return n ^ t ^ i
    }

    function dr(n, t, i) {
        return n & t | ~n & i
    }

    function gr(n, t, i) {
        return (n | ~t) ^ i
    }

    function nu(n, t, i) {
        return n & i | t & ~i
    }

    function tu(n, t, i) {
        return n ^ (t | ~i)
    }

    function ut(n, t) {
        return n << t | n >>> 32 - t
    }

    function iu(n, t, i, r) {
        var f, e = this._iv,
            u;
        for (e ? (f = e.slice(0), this._iv = void 0) : f = this._prevBlock, r.encryptBlock(f, 0), u = 0; u < i; u++) n[t + u] ^= f[u]
    }

    function ru(n) {
        if (255 == (n >> 24 & 255)) {
            var t = n >> 16 & 255,
                i = n >> 8 & 255,
                r = 255 & n;
            255 === t ? (t = 0, 255 === i ? (i = 0, 255 === r ? r = 0 : ++r) : ++i) : ++t;
            n = 0;
            n += t << 16;
            n += i << 8;
            n += r
        } else n += 16777216;
        return n
    }

    function oi() {
        for (var r = this._X, n = this._C, i = 0; i < 8; i++) f[i] = n[i];
        for (n[0] = n[0] + 1295307597 + this._b | 0, n[1] = n[1] + 3545052371 + (n[0] >>> 0 < f[0] >>> 0 ? 1 : 0) | 0, n[2] = n[2] + 886263092 + (n[1] >>> 0 < f[1] >>> 0 ? 1 : 0) | 0, n[3] = n[3] + 1295307597 + (n[2] >>> 0 < f[2] >>> 0 ? 1 : 0) | 0, n[4] = n[4] + 3545052371 + (n[3] >>> 0 < f[3] >>> 0 ? 1 : 0) | 0, n[5] = n[5] + 886263092 + (n[4] >>> 0 < f[4] >>> 0 ? 1 : 0) | 0, n[6] = n[6] + 1295307597 + (n[5] >>> 0 < f[5] >>> 0 ? 1 : 0) | 0, n[7] = n[7] + 3545052371 + (n[6] >>> 0 < f[6] >>> 0 ? 1 : 0) | 0, this._b = n[7] >>> 0 < f[7] >>> 0 ? 1 : 0, i = 0; i < 8; i++) {
            var u = r[i] + n[i],
                e = 65535 & u,
                o = u >>> 16,
                s = ((e * e >>> 17) + e * o >>> 15) + o * o,
                h = ((4294901760 & u) * u | 0) + ((65535 & u) * u | 0);
            t[i] = s ^ h
        }
        r[0] = t[0] + (t[7] << 16 | t[7] >>> 16) + (t[6] << 16 | t[6] >>> 16) | 0;
        r[1] = t[1] + (t[0] << 8 | t[0] >>> 24) + t[7] | 0;
        r[2] = t[2] + (t[1] << 16 | t[1] >>> 16) + (t[0] << 16 | t[0] >>> 16) | 0;
        r[3] = t[3] + (t[2] << 8 | t[2] >>> 24) + t[1] | 0;
        r[4] = t[4] + (t[3] << 16 | t[3] >>> 16) + (t[2] << 16 | t[2] >>> 16) | 0;
        r[5] = t[5] + (t[4] << 8 | t[4] >>> 24) + t[3] | 0;
        r[6] = t[6] + (t[5] << 16 | t[5] >>> 16) + (t[4] << 16 | t[4] >>> 16) | 0;
        r[7] = t[7] + (t[6] << 8 | t[6] >>> 24) + t[5] | 0
    }

    function si() {
        for (var r = this._X, n = this._C, t = 0; t < 8; t++) e[t] = n[t];
        for (n[0] = n[0] + 1295307597 + this._b | 0, n[1] = n[1] + 3545052371 + (n[0] >>> 0 < e[0] >>> 0 ? 1 : 0) | 0, n[2] = n[2] + 886263092 + (n[1] >>> 0 < e[1] >>> 0 ? 1 : 0) | 0, n[3] = n[3] + 1295307597 + (n[2] >>> 0 < e[2] >>> 0 ? 1 : 0) | 0, n[4] = n[4] + 3545052371 + (n[3] >>> 0 < e[3] >>> 0 ? 1 : 0) | 0, n[5] = n[5] + 886263092 + (n[4] >>> 0 < e[4] >>> 0 ? 1 : 0) | 0, n[6] = n[6] + 1295307597 + (n[5] >>> 0 < e[5] >>> 0 ? 1 : 0) | 0, n[7] = n[7] + 3545052371 + (n[6] >>> 0 < e[6] >>> 0 ? 1 : 0) | 0, this._b = n[7] >>> 0 < e[7] >>> 0 ? 1 : 0, t = 0; t < 8; t++) {
            var u = r[t] + n[t],
                f = 65535 & u,
                o = u >>> 16,
                s = ((f * f >>> 17) + f * o >>> 15) + o * o,
                h = ((4294901760 & u) * u | 0) + ((65535 & u) * u | 0);
            i[t] = s ^ h
        }
        r[0] = i[0] + (i[7] << 16 | i[7] >>> 16) + (i[6] << 16 | i[6] >>> 16) | 0;
        r[1] = i[1] + (i[0] << 8 | i[0] >>> 24) + i[7] | 0;
        r[2] = i[2] + (i[1] << 16 | i[1] >>> 16) + (i[0] << 16 | i[0] >>> 16) | 0;
        r[3] = i[3] + (i[2] << 8 | i[2] >>> 24) + i[1] | 0;
        r[4] = i[4] + (i[3] << 16 | i[3] >>> 16) + (i[2] << 16 | i[2] >>> 16) | 0;
        r[5] = i[5] + (i[4] << 8 | i[4] >>> 24) + i[3] | 0;
        r[6] = i[6] + (i[5] << 16 | i[5] >>> 16) + (i[4] << 16 | i[4] >>> 16) | 0;
        r[7] = i[7] + (i[6] << 8 | i[6] >>> 24) + i[5] | 0
    }
    var hi, d, ft, ci, c, li, s, et, g, ot, h, l, ai, vi, yi, pi, wi, bi, ki, st, di, gi, ht, ct, lt, at, nt, nr, tr, ir, vt, yt, pt, rr, wt, ur, fr, tt, er, bt, a, kt, dt, it, or, sr, rt, gt, o, hr, ni, v, ti, y, p, w, cr, lr, ii, b, ar, ri, ui, vr, r, f, t, yr, k, pr, fi, ei, wr, u, e, i, br, n = n || function(n) {
        function l() {
            if (t) {
                if ("function" == typeof t.getRandomValues) try {
                    return t.getRandomValues(new Uint32Array(1))[0]
                } catch (t) {}
                if ("function" == typeof t.randomBytes) try {
                    return t.randomBytes(4).readInt32LE()
                } catch (t) {}
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
        }

        function e() {}
        var t, s;
        if ("undefined" != typeof window && window.crypto && (t = window.crypto), !t && "undefined" != typeof window && window.msCrypto && (t = window.msCrypto), !t && "undefined" != typeof global && global.crypto && (t = global.crypto), !t && "function" == typeof require) try {
            t = require("crypto")
        } catch (t) {}
        s = Object.create || function(n) {
            var t;
            return e.prototype = n, t = new e, e.prototype = null, t
        };
        var u = {},
            f = u.lib = {},
            i = f.Base = {
                extend: function(n) {
                    var t = s(this);
                    return n && t.mixIn(n), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function() {
                        t.$super.init.apply(this, arguments)
                    }), (t.init.prototype = t).$super = this, t
                },
                create: function() {
                    var n = this.extend();
                    return n.init.apply(n, arguments), n
                },
                init: function() {},
                mixIn: function(n) {
                    for (var t in n) n.hasOwnProperty(t) && (this[t] = n[t]);
                    n.hasOwnProperty("toString") && (this.toString = n.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            },
            r = f.WordArray = i.extend({
                init: function(n, t) {
                    n = this.words = n || [];
                    this.sigBytes = null != t ? t : 4 * n.length
                },
                toString: function(n) {
                    return (n || a).stringify(this)
                },
                concat: function(n) {
                    var u = this.words,
                        f = n.words,
                        i = this.sigBytes,
                        r = n.sigBytes,
                        t, e;
                    if (this.clamp(), i % 4)
                        for (t = 0; t < r; t++) e = f[t >>> 2] >>> 24 - t % 4 * 8 & 255, u[i + t >>> 2] |= e << 24 - (i + t) % 4 * 8;
                    else
                        for (t = 0; t < r; t += 4) u[i + t >>> 2] = f[t >>> 2];
                    return this.sigBytes += r, this
                },
                clamp: function() {
                    var i = this.words,
                        t = this.sigBytes;
                    i[t >>> 2] &= 4294967295 << 32 - t % 4 * 8;
                    i.length = n.ceil(t / 4)
                },
                clone: function() {
                    var n = i.clone.call(this);
                    return n.words = this.words.slice(0), n
                },
                random: function(n) {
                    for (var t = [], i = 0; i < n; i += 4) t.push(l());
                    return new r.init(t, n)
                }
            }),
            o = u.enc = {},
            a = o.Hex = {
                stringify: function(n) {
                    for (var r, u = n.words, f = n.sigBytes, i = [], t = 0; t < f; t++) r = u[t >>> 2] >>> 24 - t % 4 * 8 & 255, i.push((r >>> 4).toString(16)), i.push((15 & r).toString(16));
                    return i.join("")
                },
                parse: function(n) {
                    for (var i = n.length, u = [], t = 0; t < i; t += 2) u[t >>> 3] |= parseInt(n.substr(t, 2), 16) << 24 - t % 8 * 4;
                    return new r.init(u, i / 2)
                }
            },
            h = o.Latin1 = {
                stringify: function(n) {
                    for (var r, u = n.words, f = n.sigBytes, i = [], t = 0; t < f; t++) r = u[t >>> 2] >>> 24 - t % 4 * 8 & 255, i.push(String.fromCharCode(r));
                    return i.join("")
                },
                parse: function(n) {
                    for (var i = n.length, u = [], t = 0; t < i; t++) u[t >>> 2] |= (255 & n.charCodeAt(t)) << 24 - t % 4 * 8;
                    return new r.init(u, i)
                }
            },
            v = o.Utf8 = {
                stringify: function(n) {
                    try {
                        return decodeURIComponent(escape(h.stringify(n)))
                    } catch (n) {
                        throw new Error("Malformed UTF-8 data");
                    }
                },
                parse: function(n) {
                    return h.parse(unescape(encodeURIComponent(n)))
                }
            },
            c = f.BufferedBlockAlgorithm = i.extend({
                reset: function() {
                    this._data = new r.init;
                    this._nDataBytes = 0
                },
                _append: function(n) {
                    "string" == typeof n && (n = v.parse(n));
                    this._data.concat(n);
                    this._nDataBytes += n.sigBytes
                },
                _process: function(t) {
                    var s, f = this._data,
                        h = f.words,
                        c = f.sigBytes,
                        e = this.blockSize,
                        o = c / (4 * e),
                        i = (o = t ? n.ceil(o) : n.max((0 | o) - this._minBufferSize, 0)) * e,
                        l = n.min(4 * i, c),
                        u;
                    if (i) {
                        for (u = 0; u < i; u += e) this._doProcessBlock(h, u);
                        s = h.splice(0, i);
                        f.sigBytes -= l
                    }
                    return new r.init(s, l)
                },
                clone: function() {
                    var n = i.clone.call(this);
                    return n._data = this._data.clone(), n
                },
                _minBufferSize: 0
            }),
            y = (f.Hasher = c.extend({
                cfg: i.extend(),
                init: function(n) {
                    this.cfg = this.cfg.extend(n);
                    this.reset()
                },
                reset: function() {
                    c.reset.call(this);
                    this._doReset()
                },
                update: function(n) {
                    return this._append(n), this._process(), this
                },
                finalize: function(n) {
                    return n && this._append(n), this._doFinalize()
                },
                blockSize: 16,
                _createHelper: function(n) {
                    return function(t, i) {
                        return new n.init(i).finalize(t)
                    }
                },
                _createHmacHelper: function(n) {
                    return function(t, i) {
                        return new y.HMAC.init(n, i).finalize(t)
                    }
                }
            }), u.algo = {});
        return u
    }(Math);
    return hi = n.lib.WordArray, n.enc.Base64 = {
            stringify: function(n) {
                var u = n.words,
                    e = n.sigBytes,
                    o = this._map,
                    i, t, s, r, f;
                for (n.clamp(), i = [], t = 0; t < e; t += 3)
                    for (s = (u[t >>> 2] >>> 24 - t % 4 * 8 & 255) << 16 | (u[t + 1 >>> 2] >>> 24 - (t + 1) % 4 * 8 & 255) << 8 | u[t + 2 >>> 2] >>> 24 - (t + 2) % 4 * 8 & 255, r = 0; r < 4 && t + .75 * r < e; r++) i.push(o.charAt(s >>> 6 * (3 - r) & 63));
                if (f = o.charAt(64), f)
                    for (; i.length % 4;) i.push(f);
                return i.join("")
            },
            parse: function(n) {
                var e = n.length,
                    r = this._map,
                    i = this._reverseMap,
                    t, u, f;
                if (!i)
                    for (i = this._reverseMap = [], t = 0; t < r.length; t++) i[r.charCodeAt(t)] = t;
                return u = r.charAt(64), u && (f = n.indexOf(u), -1 !== f && (e = f)),
                    function(n, t, i) {
                        for (var f = [], u = 0, r = 0; r < t; r++)
                            if (r % 4) {
                                var e = i[n.charCodeAt(r - 1)] << r % 4 * 2,
                                    o = i[n.charCodeAt(r)] >>> 6 - r % 4 * 2,
                                    s = e | o;
                                f[u >>> 2] |= s << 24 - u % 4 * 8;
                                u++
                            }
                        return hi.create(f, u)
                    }(n, e, i)
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        },
        function(t) {
            function r(n, t, i, r, u, f, e) {
                var o = n + (t & i | ~t & r) + u + e;
                return (o << f | o >>> 32 - f) + t
            }

            function u(n, t, i, r, u, f, e) {
                var o = n + (t & r | i & ~r) + u + e;
                return (o << f | o >>> 32 - f) + t
            }

            function f(n, t, i, r, u, f, e) {
                var o = n + (t ^ i ^ r) + u + e;
                return (o << f | o >>> 32 - f) + t
            }

            function e(n, t, i, r, u, f, e) {
                var o = n + (i ^ (t | ~r)) + u + e;
                return (o << f | o >>> 32 - f) + t
            }
            var o = n,
                c = o.lib,
                l = c.WordArray,
                s = c.Hasher,
                a = o.algo,
                i = [],
                h;
            ! function() {
                for (var n = 0; n < 64; n++) i[n] = 4294967296 * t.abs(t.sin(n + 1)) | 0
            }();
            h = a.MD5 = s.extend({
                _doReset: function() {
                    this._hash = new l.init([1732584193, 4023233417, 2562383102, 271733878])
                },
                _doProcessBlock: function(n, t) {
                    for (var ht, a, v = 0; v < 16; v++) ht = t + v, a = n[ht], n[ht] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
                    var l = this._hash.words,
                        y = n[t + 0],
                        p = n[t + 1],
                        w = n[t + 2],
                        b = n[t + 3],
                        k = n[t + 4],
                        d = n[t + 5],
                        g = n[t + 6],
                        nt = n[t + 7],
                        tt = n[t + 8],
                        it = n[t + 9],
                        rt = n[t + 10],
                        ut = n[t + 11],
                        ft = n[t + 12],
                        et = n[t + 13],
                        ot = n[t + 14],
                        st = n[t + 15],
                        o = l[0],
                        c = l[1],
                        s = l[2],
                        h = l[3];
                    o = r(o, c, s, h, y, 7, i[0]);
                    h = r(h, o, c, s, p, 12, i[1]);
                    s = r(s, h, o, c, w, 17, i[2]);
                    c = r(c, s, h, o, b, 22, i[3]);
                    o = r(o, c, s, h, k, 7, i[4]);
                    h = r(h, o, c, s, d, 12, i[5]);
                    s = r(s, h, o, c, g, 17, i[6]);
                    c = r(c, s, h, o, nt, 22, i[7]);
                    o = r(o, c, s, h, tt, 7, i[8]);
                    h = r(h, o, c, s, it, 12, i[9]);
                    s = r(s, h, o, c, rt, 17, i[10]);
                    c = r(c, s, h, o, ut, 22, i[11]);
                    o = r(o, c, s, h, ft, 7, i[12]);
                    h = r(h, o, c, s, et, 12, i[13]);
                    s = r(s, h, o, c, ot, 17, i[14]);
                    o = u(o, c = r(c, s, h, o, st, 22, i[15]), s, h, p, 5, i[16]);
                    h = u(h, o, c, s, g, 9, i[17]);
                    s = u(s, h, o, c, ut, 14, i[18]);
                    c = u(c, s, h, o, y, 20, i[19]);
                    o = u(o, c, s, h, d, 5, i[20]);
                    h = u(h, o, c, s, rt, 9, i[21]);
                    s = u(s, h, o, c, st, 14, i[22]);
                    c = u(c, s, h, o, k, 20, i[23]);
                    o = u(o, c, s, h, it, 5, i[24]);
                    h = u(h, o, c, s, ot, 9, i[25]);
                    s = u(s, h, o, c, b, 14, i[26]);
                    c = u(c, s, h, o, tt, 20, i[27]);
                    o = u(o, c, s, h, et, 5, i[28]);
                    h = u(h, o, c, s, w, 9, i[29]);
                    s = u(s, h, o, c, nt, 14, i[30]);
                    o = f(o, c = u(c, s, h, o, ft, 20, i[31]), s, h, d, 4, i[32]);
                    h = f(h, o, c, s, tt, 11, i[33]);
                    s = f(s, h, o, c, ut, 16, i[34]);
                    c = f(c, s, h, o, ot, 23, i[35]);
                    o = f(o, c, s, h, p, 4, i[36]);
                    h = f(h, o, c, s, k, 11, i[37]);
                    s = f(s, h, o, c, nt, 16, i[38]);
                    c = f(c, s, h, o, rt, 23, i[39]);
                    o = f(o, c, s, h, et, 4, i[40]);
                    h = f(h, o, c, s, y, 11, i[41]);
                    s = f(s, h, o, c, b, 16, i[42]);
                    c = f(c, s, h, o, g, 23, i[43]);
                    o = f(o, c, s, h, it, 4, i[44]);
                    h = f(h, o, c, s, ft, 11, i[45]);
                    s = f(s, h, o, c, st, 16, i[46]);
                    o = e(o, c = f(c, s, h, o, w, 23, i[47]), s, h, y, 6, i[48]);
                    h = e(h, o, c, s, nt, 10, i[49]);
                    s = e(s, h, o, c, ot, 15, i[50]);
                    c = e(c, s, h, o, d, 21, i[51]);
                    o = e(o, c, s, h, ft, 6, i[52]);
                    h = e(h, o, c, s, b, 10, i[53]);
                    s = e(s, h, o, c, rt, 15, i[54]);
                    c = e(c, s, h, o, p, 21, i[55]);
                    o = e(o, c, s, h, tt, 6, i[56]);
                    h = e(h, o, c, s, st, 10, i[57]);
                    s = e(s, h, o, c, g, 15, i[58]);
                    c = e(c, s, h, o, et, 21, i[59]);
                    o = e(o, c, s, h, k, 6, i[60]);
                    h = e(h, o, c, s, ut, 10, i[61]);
                    s = e(s, h, o, c, w, 15, i[62]);
                    c = e(c, s, h, o, it, 21, i[63]);
                    l[0] = l[0] + o | 0;
                    l[1] = l[1] + c | 0;
                    l[2] = l[2] + s | 0;
                    l[3] = l[3] + h | 0
                },
                _doFinalize: function() {
                    var o = this._data,
                        u = o.words,
                        s = 8 * this._nDataBytes,
                        f = 8 * o.sigBytes,
                        n, i, r;
                    u[f >>> 5] |= 128 << 24 - f % 32;
                    n = t.floor(s / 4294967296);
                    i = s;
                    u[15 + (64 + f >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
                    u[14 + (64 + f >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
                    o.sigBytes = 4 * (u.length + 1);
                    this._process();
                    for (var h = this._hash, c = h.words, e = 0; e < 4; e++) r = c[e], c[e] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8);
                    return h
                },
                clone: function() {
                    var n = s.clone.call(this);
                    return n._hash = this._hash.clone(), n
                }
            });
            o.MD5 = s._createHelper(h);
            o.HmacMD5 = s._createHmacHelper(h)
        }(Math), ft = (d = n).lib, ci = ft.WordArray, c = ft.Hasher, li = d.algo, s = [], et = li.SHA1 = c.extend({
            _doReset: function() {
                this._hash = new ci.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(n, t) {
                for (var c, l, i = this._hash.words, o = i[0], u = i[1], f = i[2], e = i[3], h = i[4], r = 0; r < 80; r++) r < 16 ? s[r] = 0 | n[t + r] : (c = s[r - 3] ^ s[r - 8] ^ s[r - 14] ^ s[r - 16], s[r] = c << 1 | c >>> 31), l = (o << 5 | o >>> 27) + h + s[r], l += r < 20 ? 1518500249 + (u & f | ~u & e) : r < 40 ? 1859775393 + (u ^ f ^ e) : r < 60 ? (u & f | u & e | f & e) - 1894007588 : (u ^ f ^ e) - 899497514, h = e, e = f, f = u << 30 | u >>> 2, u = o, o = l;
                i[0] = i[0] + o | 0;
                i[1] = i[1] + u | 0;
                i[2] = i[2] + f | 0;
                i[3] = i[3] + e | 0;
                i[4] = i[4] + h | 0
            },
            _doFinalize: function() {
                var i = this._data,
                    n = i.words,
                    r = 8 * this._nDataBytes,
                    t = 8 * i.sigBytes;
                return n[t >>> 5] |= 128 << 24 - t % 32, n[14 + (64 + t >>> 9 << 4)] = Math.floor(r / 4294967296), n[15 + (64 + t >>> 9 << 4)] = r, i.sigBytes = 4 * n.length, this._process(), this._hash
            },
            clone: function() {
                var n = c.clone.call(this);
                return n._hash = this._hash.clone(), n
            }
        }), d.SHA1 = c._createHelper(et), d.HmacSHA1 = c._createHmacHelper(et),
        function(t) {
            var r = n,
                e = r.lib,
                h = e.WordArray,
                u = e.Hasher,
                c = r.algo,
                o = [],
                s = [],
                i, f;
            ! function() {
                function u(n) {
                    for (var r = t.sqrt(n), i = 2; i <= r; i++)
                        if (!(n % i)) return;
                    return 1
                }

                function r(n) {
                    return 4294967296 * (n - (0 | n)) | 0
                }
                for (var i = 2, n = 0; n < 64;) u(i) && (n < 8 && (o[n] = r(t.pow(i, .5))), s[n] = r(t.pow(i, 1 / 3)), n++), i++
            }();
            i = [];
            f = c.SHA256 = u.extend({
                _doReset: function() {
                    this._hash = new h.init(o.slice(0))
                },
                _doProcessBlock: function(n, t) {
                    for (var r = this._hash.words, f = r[0], o = r[1], h = r[2], y = r[3], e = r[4], a = r[5], v = r[6], p = r[7], u = 0; u < 64; u++) {
                        if (u < 16) i[u] = 0 | n[t + u];
                        else {
                            var c = i[u - 15],
                                b = (c << 25 | c >>> 7) ^ (c << 14 | c >>> 18) ^ c >>> 3,
                                l = i[u - 2],
                                k = (l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10;
                            i[u] = b + i[u - 7] + k + i[u - 16]
                        }
                        var d = f & o ^ f & h ^ o & h,
                            g = (f << 30 | f >>> 2) ^ (f << 19 | f >>> 13) ^ (f << 10 | f >>> 22),
                            w = p + ((e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25)) + (e & a ^ ~e & v) + s[u] + i[u];
                        p = v;
                        v = a;
                        a = e;
                        e = y + w | 0;
                        y = h;
                        h = o;
                        o = f;
                        f = w + (g + d) | 0
                    }
                    r[0] = r[0] + f | 0;
                    r[1] = r[1] + o | 0;
                    r[2] = r[2] + h | 0;
                    r[3] = r[3] + y | 0;
                    r[4] = r[4] + e | 0;
                    r[5] = r[5] + a | 0;
                    r[6] = r[6] + v | 0;
                    r[7] = r[7] + p | 0
                },
                _doFinalize: function() {
                    var r = this._data,
                        n = r.words,
                        u = 8 * this._nDataBytes,
                        i = 8 * r.sigBytes;
                    return n[i >>> 5] |= 128 << 24 - i % 32, n[14 + (64 + i >>> 9 << 4)] = t.floor(u / 4294967296), n[15 + (64 + i >>> 9 << 4)] = u, r.sigBytes = 4 * n.length, this._process(), this._hash
                },
                clone: function() {
                    var n = u.clone.call(this);
                    return n._hash = this._hash.clone(), n
                }
            });
            r.SHA256 = u._createHelper(f);
            r.HmacSHA256 = u._createHmacHelper(f)
        }(Math),
        function() {
            function r(n) {
                return n << 8 & 4278255360 | n >>> 8 & 16711935
            }
            var i = n.lib.WordArray,
                t = n.enc;
            t.Utf16 = t.Utf16BE = {
                stringify: function(n) {
                    for (var r, u = n.words, f = n.sigBytes, i = [], t = 0; t < f; t += 2) r = u[t >>> 2] >>> 16 - t % 4 * 8 & 65535, i.push(String.fromCharCode(r));
                    return i.join("")
                },
                parse: function(n) {
                    for (var r = n.length, u = [], t = 0; t < r; t++) u[t >>> 1] |= n.charCodeAt(t) << 16 - t % 2 * 16;
                    return i.create(u, 2 * r)
                }
            };
            t.Utf16LE = {
                stringify: function(n) {
                    for (var u, f = n.words, e = n.sigBytes, i = [], t = 0; t < e; t += 2) u = r(f[t >>> 2] >>> 16 - t % 4 * 8 & 65535), i.push(String.fromCharCode(u));
                    return i.join("")
                },
                parse: function(n) {
                    for (var u = n.length, f = [], t = 0; t < u; t++) f[t >>> 1] |= r(n.charCodeAt(t) << 16 - t % 2 * 16);
                    return i.create(f, 2 * u)
                }
            }
        }(),
        function() {
            if ("function" == typeof ArrayBuffer) {
                var t = n.lib.WordArray,
                    i = t.init;
                (t.init = function(n) {
                    "use strict";
                    if (n instanceof ArrayBuffer && (n = new Uint8Array(n)), (n instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && n instanceof Uint8ClampedArray || n instanceof Int16Array || n instanceof Uint16Array || n instanceof Int32Array || n instanceof Uint32Array || n instanceof Float32Array || n instanceof Float64Array) && (n = new Uint8Array(n.buffer, n.byteOffset, n.byteLength)), n instanceof Uint8Array) {
                        for (var r = n.byteLength, u = [], t = 0; t < r; t++) u[t >>> 2] |= n[t] << 24 - t % 4 * 8;
                        i.call(this, u, r)
                    } else i.apply(this, arguments)
                }).prototype = t
            }
        }(), Math, ot = (g = n).lib, h = ot.WordArray, l = ot.Hasher, ai = g.algo, vi = h.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), yi = h.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), pi = h.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), wi = h.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), bi = h.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), ki = h.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), st = ai.RIPEMD160 = l.extend({
            _doReset: function() {
                this._hash = h.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(n, t) {
                for (var k, l, i = 0; i < 16; i++) k = t + i, l = n[k], n[k] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8);
                var w, f, e, o, a, b, s, h, c, v, u, r = this._hash.words,
                    y = bi.words,
                    p = ki.words,
                    d = vi.words,
                    g = yi.words,
                    nt = pi.words,
                    tt = wi.words;
                for (b = w = r[0], s = f = r[1], h = e = r[2], c = o = r[3], v = a = r[4], i = 0; i < 80; i += 1) u = w + n[t + d[i]] | 0, u += i < 16 ? kr(f, e, o) + y[0] : i < 32 ? dr(f, e, o) + y[1] : i < 48 ? gr(f, e, o) + y[2] : i < 64 ? nu(f, e, o) + y[3] : tu(f, e, o) + y[4], u = (u = ut(u |= 0, nt[i])) + a | 0, w = a, a = o, o = ut(e, 10), e = f, f = u, u = b + n[t + g[i]] | 0, u += i < 16 ? tu(s, h, c) + p[0] : i < 32 ? nu(s, h, c) + p[1] : i < 48 ? gr(s, h, c) + p[2] : i < 64 ? dr(s, h, c) + p[3] : kr(s, h, c) + p[4], u = (u = ut(u |= 0, tt[i])) + v | 0, b = v, v = c, c = ut(h, 10), h = s, s = u;
                u = r[1] + e + c | 0;
                r[1] = r[2] + o + v | 0;
                r[2] = r[3] + a + b | 0;
                r[3] = r[4] + w + s | 0;
                r[4] = r[0] + f + h | 0;
                r[0] = u
            },
            _doFinalize: function() {
                var r = this._data,
                    u = r.words,
                    t = 8 * this._nDataBytes,
                    f = 8 * r.sigBytes,
                    n;
                u[f >>> 5] |= 128 << 24 - f % 32;
                u[14 + (64 + f >>> 9 << 4)] = 16711935 & (t << 8 | t >>> 24) | 4278255360 & (t << 24 | t >>> 8);
                r.sigBytes = 4 * (u.length + 1);
                this._process();
                for (var e = this._hash, o = e.words, i = 0; i < 5; i++) n = o[i], o[i] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
                return e
            },
            clone: function() {
                var n = l.clone.call(this);
                return n._hash = this._hash.clone(), n
            }
        }), g.RIPEMD160 = l._createHelper(st), g.HmacRIPEMD160 = l._createHmacHelper(st), di = n.lib.Base, gi = n.enc.Utf8, n.algo.HMAC = di.extend({
            init: function(n, t) {
                var r, u;
                n = this._hasher = new n.init;
                "string" == typeof t && (t = gi.parse(t));
                r = n.blockSize;
                u = 4 * r;
                t.sigBytes > u && (t = n.finalize(t));
                t.clamp();
                for (var f = this._oKey = t.clone(), e = this._iKey = t.clone(), o = f.words, s = e.words, i = 0; i < r; i++) o[i] ^= 1549556828, s[i] ^= 909522486;
                f.sigBytes = e.sigBytes = u;
                this.reset()
            },
            reset: function() {
                var n = this._hasher;
                n.reset();
                n.update(this._iKey)
            },
            update: function(n) {
                return this._hasher.update(n), this
            },
            finalize: function(n) {
                var t = this._hasher,
                    i = t.finalize(n);
                return t.reset(), t.finalize(this._oKey.clone().concat(i))
            }
        }), ct = (ht = n).lib, lt = ct.Base, at = ct.WordArray, nt = ht.algo, nr = nt.SHA1, tr = nt.HMAC, ir = nt.PBKDF2 = lt.extend({
            cfg: lt.extend({
                keySize: 4,
                hasher: nr,
                iterations: 1
            }),
            init: function(n) {
                this.cfg = this.cfg.extend(n)
            },
            compute: function(n, t) {
                for (var f, a, i, e = this.cfg, r = tr.create(e.hasher, n), u = at.create(), s = at.create([1]), v = u.words, y = s.words, h = e.keySize, p = e.iterations; v.length < h;) {
                    f = r.update(t).finalize(s);
                    r.reset();
                    for (var c = f.words, w = c.length, o = f, l = 1; l < p; l++)
                        for (o = r.finalize(o), r.reset(), a = o.words, i = 0; i < w; i++) c[i] ^= a[i];
                    u.concat(f);
                    y[0]++
                }
                return u.sigBytes = 4 * h, u
            }
        }), ht.PBKDF2 = function(n, t, i) {
            return ir.create(i).compute(n, t)
        }, yt = (vt = n).lib, pt = yt.Base, rr = yt.WordArray, wt = vt.algo, ur = wt.MD5, fr = wt.EvpKDF = pt.extend({
            cfg: pt.extend({
                keySize: 4,
                hasher: ur,
                iterations: 1
            }),
            init: function(n) {
                this.cfg = this.cfg.extend(n)
            },
            compute: function(n, t) {
                for (var e, i, f = this.cfg, r = f.hasher.create(), u = rr.create(), s = u.words, o = f.keySize, h = f.iterations; s.length < o;) {
                    for (i && r.update(i), i = r.update(n).finalize(t), r.reset(), e = 1; e < h; e++) i = r.finalize(i), r.reset();
                    u.concat(i)
                }
                return u.sigBytes = 4 * o, u
            }
        }), vt.EvpKDF = function(n, t, i) {
            return fr.create(i).compute(n, t)
        }, er = (tt = n).lib.WordArray, bt = tt.algo, a = bt.SHA256, kt = bt.SHA224 = a.extend({
            _doReset: function() {
                this._hash = new er.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
            },
            _doFinalize: function() {
                var n = a._doFinalize.call(this);
                return n.sigBytes -= 4, n
            }
        }), tt.SHA224 = a._createHelper(kt), tt.HmacSHA224 = a._createHmacHelper(kt), dt = n.lib, it = dt.Base, or = dt.WordArray, (sr = n.x64 = {}).Word = it.extend({
            init: function(n, t) {
                this.high = n;
                this.low = t
            }
        }), sr.WordArray = it.extend({
            init: function(n, t) {
                n = this.words = n || [];
                this.sigBytes = null != t ? t : 8 * n.length
            },
            toX32: function() {
                for (var i, r = this.words, u = r.length, n = [], t = 0; t < u; t++) i = r[t], n.push(i.high), n.push(i.low);
                return or.create(n, this.sigBytes)
            },
            clone: function() {
                for (var i = it.clone.call(this), t = i.words = this.words.slice(0), r = t.length, n = 0; n < r; n++) t[n] = t[n].clone();
                return i
            }
        }),
        function(t) {
            var r = n,
                o = r.lib,
                l = o.WordArray,
                u = o.Hasher,
                f = r.x64.Word,
                a = r.algo,
                s = [],
                h = [],
                c = [],
                i, e;
            ! function() {
                for (var l, i, u, e, t = 1, n = 0, r = 0; r < 24; r++) s[t + 5 * n] = (r + 1) * (r + 2) / 2 % 64, l = (2 * t + 3 * n) % 5, t = n % 5, n = l;
                for (t = 0; t < 5; t++)
                    for (n = 0; n < 5; n++) h[t + 5 * n] = n + (2 * t + 3 * n) % 5 * 5;
                for (i = 1, u = 0; u < 24; u++) {
                    for (var a = 0, v = 0, o = 0; o < 7; o++) 1 & i && (e = (1 << o) - 1, e < 32 ? v ^= 1 << e : a ^= 1 << e - 32), 128 & i ? i = i << 1 ^ 113 : i <<= 1;
                    c[u] = f.create(a, v)
                }
            }();
            i = [];
            ! function() {
                for (var n = 0; n < 25; n++) i[n] = f.create()
            }();
            e = a.SHA3 = u.extend({
                cfg: u.cfg.extend({
                    outputLength: 512
                }),
                _doReset: function() {
                    for (var t = this._state = [], n = 0; n < 25; n++) t[n] = new f.init;
                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                },
                _doProcessBlock: function(n, t) {
                    for (var a, v, b, r, g, o, nt, tt, it, rt, l = this._state, lt = this.blockSize / 2, w = 0; w < lt; w++) a = n[t + 2 * w], v = n[t + 2 * w + 1], a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), v = 16711935 & (v << 8 | v >>> 24) | 4278255360 & (v << 24 | v >>> 8), (f = l[w]).high ^= v, f.low ^= a;
                    for (b = 0; b < 24; b++) {
                        for (r = 0; r < 5; r++) {
                            for (var y = 0, p = 0, u = 0; u < 5; u++) y ^= (f = l[r + 5 * u]).high, p ^= f.low;
                            g = i[r];
                            g.high = y;
                            g.low = p
                        }
                        for (r = 0; r < 5; r++) {
                            var ut = i[(r + 4) % 5],
                                ft = i[(r + 1) % 5],
                                et = ft.high,
                                ot = ft.low;
                            for (y = ut.high ^ (et << 1 | ot >>> 31), p = ut.low ^ (ot << 1 | et >>> 31), u = 0; u < 5; u++)(f = l[r + 5 * u]).high ^= y, f.low ^= p
                        }
                        for (o = 1; o < 25; o++) {
                            var k = (f = l[o]).high,
                                d = f.low,
                                e = s[o];
                            p = e < 32 ? (y = k << e | d >>> 32 - e, d << e | k >>> 32 - e) : (y = d << e - 32 | k >>> 64 - e, k << e - 32 | d >>> 64 - e);
                            nt = i[h[o]];
                            nt.high = y;
                            nt.low = p
                        }
                        for (tt = i[0], it = l[0], tt.high = it.high, tt.low = it.low, r = 0; r < 5; r++)
                            for (u = 0; u < 5; u++) {
                                var f = l[o = r + 5 * u],
                                    st = i[o],
                                    ht = i[(r + 1) % 5 + 5 * u],
                                    ct = i[(r + 2) % 5 + 5 * u];
                                f.high = st.high ^ ~ht.high & ct.high;
                                f.low = st.low ^ ~ht.low & ct.low
                            }
                        f = l[0];
                        rt = c[b];
                        f.high ^= rt.high;
                        f.low ^= rt.low
                    }
                },
                _doFinalize: function() {
                    var r = this._data,
                        u = r.words,
                        f = (this._nDataBytes, 8 * r.sigBytes),
                        s = 32 * this.blockSize;
                    u[f >>> 5] |= 1 << 24 - f % 32;
                    u[(t.ceil((1 + f) / s) * s >>> 5) - 1] |= 128;
                    r.sigBytes = 4 * u.length;
                    this._process();
                    for (var a = this._state, h = this.cfg.outputLength / 8, v = h / 8, e = [], o = 0; o < v; o++) {
                        var c = a[o],
                            n = c.high,
                            i = c.low;
                        n = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
                        i = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
                        e.push(i);
                        e.push(n)
                    }
                    return new l.init(e, h)
                },
                clone: function() {
                    for (var t = u.clone.call(this), i = t._state = this._state.slice(0), n = 0; n < 25; n++) i[n] = i[n].clone();
                    return t
                }
            });
            r.SHA3 = u._createHelper(e);
            r.HmacSHA3 = u._createHmacHelper(e)
        }(Math),
        function() {
            function t() {
                return i.create.apply(i, arguments)
            }
            var u = n,
                f = u.lib.Hasher,
                o = u.x64,
                i = o.Word,
                s = o.WordArray,
                h = u.algo,
                c = [t(1116352408, 3609767458), t(1899447441, 602891725), t(3049323471, 3964484399), t(3921009573, 2173295548), t(961987163, 4081628472), t(1508970993, 3053834265), t(2453635748, 2937671579), t(2870763221, 3664609560), t(3624381080, 2734883394), t(310598401, 1164996542), t(607225278, 1323610764), t(1426881987, 3590304994), t(1925078388, 4068182383), t(2162078206, 991336113), t(2614888103, 633803317), t(3248222580, 3479774868), t(3835390401, 2666613458), t(4022224774, 944711139), t(264347078, 2341262773), t(604807628, 2007800933), t(770255983, 1495990901), t(1249150122, 1856431235), t(1555081692, 3175218132), t(1996064986, 2198950837), t(2554220882, 3999719339), t(2821834349, 766784016), t(2952996808, 2566594879), t(3210313671, 3203337956), t(3336571891, 1034457026), t(3584528711, 2466948901), t(113926993, 3758326383), t(338241895, 168717936), t(666307205, 1188179964), t(773529912, 1546045734), t(1294757372, 1522805485), t(1396182291, 2643833823), t(1695183700, 2343527390), t(1986661051, 1014477480), t(2177026350, 1206759142), t(2456956037, 344077627), t(2730485921, 1290863460), t(2820302411, 3158454273), t(3259730800, 3505952657), t(3345764771, 106217008), t(3516065817, 3606008344), t(3600352804, 1432725776), t(4094571909, 1467031594), t(275423344, 851169720), t(430227734, 3100823752), t(506948616, 1363258195), t(659060556, 3750685593), t(883997877, 3785050280), t(958139571, 3318307427), t(1322822218, 3812723403), t(1537002063, 2003034995), t(1747873779, 3602036899), t(1955562222, 1575990012), t(2024104815, 1125592928), t(2227730452, 2716904306), t(2361852424, 442776044), t(2428436474, 593698344), t(2756734187, 3733110249), t(3204031479, 2999351573), t(3329325298, 3815920427), t(3391569614, 3928383900), t(3515267271, 566280711), t(3940187606, 3454069534), t(4118630271, 4000239992), t(116418474, 1914138554), t(174292421, 2731055270), t(289380356, 3203993006), t(460393269, 320620315), t(685471733, 587496836), t(852142971, 1086792851), t(1017036298, 365543100), t(1126000580, 2618297676), t(1288033470, 3409855158), t(1501505948, 4234509866), t(1607167915, 987167468), t(1816402316, 1246189591)],
                r = [],
                e;
            ! function() {
                for (var n = 0; n < 80; n++) r[n] = t()
            }();
            e = h.SHA512 = f.extend({
                _doReset: function() {
                    this._hash = new s.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)])
                },
                _doProcessBlock: function(n, t) {
                    for (var l, y, it, h = this._hash.words, et = h[0], ot = h[1], st = h[2], ht = h[3], ct = h[4], lt = h[5], at = h[6], vt = h[7], fi = et.high, yt = et.low, ei = ot.high, pt = ot.low, oi = st.high, wt = st.low, si = ht.high, bt = ht.low, hi = ct.high, kt = ct.low, ci = lt.high, dt = lt.low, li = at.high, gt = at.low, ai = vt.high, ni = vt.low, f = fi, i = yt, b = ei, a = pt, k = oi, v = wt, ri = si, d = bt, e = hi, u = kt, ti = ci, g = dt, ii = li, nt = gt, ui = ai, tt = ni, o = 0; o < 80; o++) {
                        if (it = r[o], o < 16) y = it.high = 0 | n[t + 2 * o], l = it.low = 0 | n[t + 2 * o + 1];
                        else {
                            var vi = r[o - 15],
                                p = vi.high,
                                rt = vi.low,
                                ur = (p >>> 1 | rt << 31) ^ (p >>> 8 | rt << 24) ^ p >>> 7,
                                yi = (rt >>> 1 | p << 31) ^ (rt >>> 8 | p << 24) ^ (rt >>> 7 | p << 25),
                                pi = r[o - 2],
                                w = pi.high,
                                ut = pi.low,
                                fr = (w >>> 19 | ut << 13) ^ (w << 3 | ut >>> 29) ^ w >>> 6,
                                wi = (ut >>> 19 | w << 13) ^ (ut << 3 | w >>> 29) ^ (ut >>> 6 | w << 26),
                                bi = r[o - 7],
                                er = bi.high,
                                or = bi.low,
                                ki = r[o - 16],
                                sr = ki.high,
                                di = ki.low;
                            y = (y = (y = ur + er + ((l = yi + or) >>> 0 < yi >>> 0 ? 1 : 0)) + fr + ((l += wi) >>> 0 < wi >>> 0 ? 1 : 0)) + sr + ((l += di) >>> 0 < di >>> 0 ? 1 : 0);
                            it.high = y;
                            it.low = l
                        }
                        var s, hr = e & ti ^ ~e & ii,
                            gi = u & g ^ ~u & nt,
                            cr = f & b ^ f & k ^ b & k,
                            lr = i & a ^ i & v ^ a & v,
                            ar = (f >>> 28 | i << 4) ^ (f << 30 | i >>> 2) ^ (f << 25 | i >>> 7),
                            nr = (i >>> 28 | f << 4) ^ (i << 30 | f >>> 2) ^ (i << 25 | f >>> 7),
                            vr = (e >>> 14 | u << 18) ^ (e >>> 18 | u << 14) ^ (e << 23 | u >>> 9),
                            yr = (u >>> 14 | e << 18) ^ (u >>> 18 | e << 14) ^ (u << 23 | e >>> 9),
                            tr = c[o],
                            pr = tr.high,
                            ir = tr.low,
                            ft = ui + vr + ((s = tt + yr) >>> 0 < tt >>> 0 ? 1 : 0),
                            rr = nr + lr;
                        ui = ii;
                        tt = nt;
                        ii = ti;
                        nt = g;
                        ti = e;
                        g = u;
                        e = ri + (ft = (ft = (ft = ft + hr + ((s = s + gi) >>> 0 < gi >>> 0 ? 1 : 0)) + pr + ((s = s + ir) >>> 0 < ir >>> 0 ? 1 : 0)) + y + ((s = s + l) >>> 0 < l >>> 0 ? 1 : 0)) + ((u = d + s | 0) >>> 0 < d >>> 0 ? 1 : 0) | 0;
                        ri = k;
                        d = v;
                        k = b;
                        v = a;
                        b = f;
                        a = i;
                        f = ft + (ar + cr + (rr >>> 0 < nr >>> 0 ? 1 : 0)) + ((i = s + rr | 0) >>> 0 < s >>> 0 ? 1 : 0) | 0
                    }
                    yt = et.low = yt + i;
                    et.high = fi + f + (yt >>> 0 < i >>> 0 ? 1 : 0);
                    pt = ot.low = pt + a;
                    ot.high = ei + b + (pt >>> 0 < a >>> 0 ? 1 : 0);
                    wt = st.low = wt + v;
                    st.high = oi + k + (wt >>> 0 < v >>> 0 ? 1 : 0);
                    bt = ht.low = bt + d;
                    ht.high = si + ri + (bt >>> 0 < d >>> 0 ? 1 : 0);
                    kt = ct.low = kt + u;
                    ct.high = hi + e + (kt >>> 0 < u >>> 0 ? 1 : 0);
                    dt = lt.low = dt + g;
                    lt.high = ci + ti + (dt >>> 0 < g >>> 0 ? 1 : 0);
                    gt = at.low = gt + nt;
                    at.high = li + ii + (gt >>> 0 < nt >>> 0 ? 1 : 0);
                    ni = vt.low = ni + tt;
                    vt.high = ai + ui + (ni >>> 0 < tt >>> 0 ? 1 : 0)
                },
                _doFinalize: function() {
                    var i = this._data,
                        n = i.words,
                        r = 8 * this._nDataBytes,
                        t = 8 * i.sigBytes;
                    return n[t >>> 5] |= 128 << 24 - t % 32, n[30 + (128 + t >>> 10 << 5)] = Math.floor(r / 4294967296), n[31 + (128 + t >>> 10 << 5)] = r, i.sigBytes = 4 * n.length, this._process(), this._hash.toX32()
                },
                clone: function() {
                    var n = f.clone.call(this);
                    return n._hash = this._hash.clone(), n
                },
                blockSize: 32
            });
            u.SHA512 = f._createHelper(e);
            u.HmacSHA512 = f._createHmacHelper(e)
        }(), gt = (rt = n).x64, o = gt.Word, hr = gt.WordArray, ni = rt.algo, v = ni.SHA512, ti = ni.SHA384 = v.extend({
            _doReset: function() {
                this._hash = new hr.init([new o.init(3418070365, 3238371032), new o.init(1654270250, 914150663), new o.init(2438529370, 812702999), new o.init(355462360, 4144912697), new o.init(1731405415, 4290775857), new o.init(2394180231, 1750603025), new o.init(3675008525, 1694076839), new o.init(1203062813, 3204075428)])
            },
            _doFinalize: function() {
                var n = v._doFinalize.call(this);
                return n.sigBytes -= 16, n
            }
        }), rt.SHA384 = v._createHelper(ti), rt.HmacSHA384 = v._createHmacHelper(ti), n.lib.Cipher || function() {
            function a(n) {
                return "string" == typeof n ? nt : e
            }

            function v(n, t, i) {
                var u, f = this._iv,
                    r;
                for (f ? (u = f, this._iv = void 0) : u = this._prevBlock, r = 0; r < i; r++) n[t + r] ^= u[r]
            }
            var i = n,
                t = i.lib,
                r = t.Base,
                u = t.WordArray,
                h = t.BufferedBlockAlgorithm,
                c = i.enc,
                l = (c.Utf8, c.Base64),
                y = i.algo.EvpKDF,
                o = t.Cipher = h.extend({
                    cfg: r.extend(),
                    createEncryptor: function(n, t) {
                        return this.create(this._ENC_XFORM_MODE, n, t)
                    },
                    createDecryptor: function(n, t) {
                        return this.create(this._DEC_XFORM_MODE, n, t)
                    },
                    init: function(n, t, i) {
                        this.cfg = this.cfg.extend(i);
                        this._xformMode = n;
                        this._key = t;
                        this.reset()
                    },
                    reset: function() {
                        h.reset.call(this);
                        this._doReset()
                    },
                    process: function(n) {
                        return this._append(n), this._process()
                    },
                    finalize: function(n) {
                        return n && this._append(n), this._doFinalize()
                    },
                    keySize: 4,
                    ivSize: 4,
                    _ENC_XFORM_MODE: 1,
                    _DEC_XFORM_MODE: 2,
                    _createHelper: function(n) {
                        return {
                            encrypt: function(t, i, r) {
                                return a(i).encrypt(n, t, i, r)
                            },
                            decrypt: function(t, i, r) {
                                return a(i).decrypt(n, t, i, r)
                            }
                        }
                    }
                });
            t.StreamCipher = o.extend({
                _doFinalize: function() {
                    return this._process(!0)
                },
                blockSize: 1
            });
            var f, p = i.mode = {},
                w = t.BlockCipherMode = r.extend({
                    createEncryptor: function(n, t) {
                        return this.Encryptor.create(n, t)
                    },
                    createDecryptor: function(n, t) {
                        return this.Decryptor.create(n, t)
                    },
                    init: function(n, t) {
                        this._cipher = n;
                        this._iv = t
                    }
                }),
                b = p.CBC = ((f = w.extend()).Encryptor = f.extend({
                    processBlock: function(n, t) {
                        var i = this._cipher,
                            r = i.blockSize;
                        v.call(this, n, t, r);
                        i.encryptBlock(n, t);
                        this._prevBlock = n.slice(t, t + r)
                    }
                }), f.Decryptor = f.extend({
                    processBlock: function(n, t) {
                        var i = this._cipher,
                            r = i.blockSize,
                            u = n.slice(t, t + r);
                        i.decryptBlock(n, t);
                        v.call(this, n, t, r);
                        this._prevBlock = u
                    }
                }), f);
            var k = (i.pad = {}).Pkcs7 = {
                    pad: function(n, t) {
                        for (var o, r = 4 * t, i = r - n.sigBytes % r, s = i << 24 | i << 16 | i << 8 | i, f = [], e = 0; e < i; e += 4) f.push(s);
                        o = u.create(f, i);
                        n.concat(o)
                    },
                    unpad: function(n) {
                        var t = 255 & n.words[n.sigBytes - 1 >>> 2];
                        n.sigBytes -= t
                    }
                },
                s = (t.BlockCipher = o.extend({
                    cfg: o.cfg.extend({
                        mode: b,
                        padding: k
                    }),
                    reset: function() {
                        var n;
                        o.reset.call(this);
                        var r = this.cfg,
                            t = r.iv,
                            i = r.mode;
                        this._xformMode == this._ENC_XFORM_MODE ? n = i.createEncryptor : (n = i.createDecryptor, this._minBufferSize = 1);
                        this._mode && this._mode.__creator == n ? this._mode.init(this, t && t.words) : (this._mode = n.call(i, this, t && t.words), this._mode.__creator = n)
                    },
                    _doProcessBlock: function(n, t) {
                        this._mode.processBlock(n, t)
                    },
                    _doFinalize: function() {
                        var n, t = this.cfg.padding;
                        return this._xformMode == this._ENC_XFORM_MODE ? (t.pad(this._data, this.blockSize), n = this._process(!0)) : (n = this._process(!0), t.unpad(n)), n
                    },
                    blockSize: 4
                }), t.CipherParams = r.extend({
                    init: function(n) {
                        this.mixIn(n)
                    },
                    toString: function(n) {
                        return (n || this.formatter).stringify(this)
                    }
                })),
                d = (i.format = {}).OpenSSL = {
                    stringify: function(n) {
                        var t = n.ciphertext,
                            i = n.salt;
                        return (i ? u.create([1398893684, 1701076831]).concat(i).concat(t) : t).toString(l)
                    },
                    parse: function(n) {
                        var r, i = l.parse(n),
                            t = i.words;
                        return 1398893684 == t[0] && 1701076831 == t[1] && (r = u.create(t.slice(2, 4)), t.splice(0, 4), i.sigBytes -= 16), s.create({
                            ciphertext: i,
                            salt: r
                        })
                    }
                },
                e = t.SerializableCipher = r.extend({
                    cfg: r.extend({
                        format: d
                    }),
                    encrypt: function(n, t, i, r) {
                        r = this.cfg.extend(r);
                        var f = n.createEncryptor(i, r),
                            e = f.finalize(t),
                            u = f.cfg;
                        return s.create({
                            ciphertext: e,
                            key: i,
                            iv: u.iv,
                            algorithm: n,
                            mode: u.mode,
                            padding: u.padding,
                            blockSize: n.blockSize,
                            formatter: r.format
                        })
                    },
                    decrypt: function(n, t, i, r) {
                        return r = this.cfg.extend(r), t = this._parse(t, r.format), n.createDecryptor(i, r).finalize(t.ciphertext)
                    },
                    _parse: function(n, t) {
                        return "string" == typeof n ? t.parse(n, this) : n
                    }
                }),
                g = (i.kdf = {}).OpenSSL = {
                    execute: function(n, t, i, r) {
                        r = r || u.random(8);
                        var f = y.create({
                                keySize: t + i
                            }).compute(n, r),
                            e = u.create(f.words.slice(t), 4 * i);
                        return f.sigBytes = 4 * t, s.create({
                            key: f,
                            iv: e,
                            salt: r
                        })
                    }
                },
                nt = t.PasswordBasedCipher = e.extend({
                    cfg: e.cfg.extend({
                        kdf: g
                    }),
                    encrypt: function(n, t, i, r) {
                        var u = (r = this.cfg.extend(r)).kdf.execute(i, n.keySize, n.ivSize),
                            f;
                        return r.iv = u.iv, f = e.encrypt.call(this, n, t, u.key, r), f.mixIn(u), f
                    },
                    decrypt: function(n, t, i, r) {
                        r = this.cfg.extend(r);
                        t = this._parse(t, r.format);
                        var u = r.kdf.execute(i, n.keySize, n.ivSize, t.salt);
                        return r.iv = u.iv, e.decrypt.call(this, n, t, u.key, r)
                    }
                })
        }(), n.mode.CFB = ((y = n.lib.BlockCipherMode.extend()).Encryptor = y.extend({
            processBlock: function(n, t) {
                var i = this._cipher,
                    r = i.blockSize;
                iu.call(this, n, t, r, i);
                this._prevBlock = n.slice(t, t + r)
            }
        }), y.Decryptor = y.extend({
            processBlock: function(n, t) {
                var i = this._cipher,
                    r = i.blockSize,
                    u = n.slice(t, t + r);
                iu.call(this, n, t, r, i);
                this._prevBlock = u
            }
        }), y), n.mode.ECB = ((p = n.lib.BlockCipherMode.extend()).Encryptor = p.extend({
            processBlock: function(n, t) {
                this._cipher.encryptBlock(n, t)
            }
        }), p.Decryptor = p.extend({
            processBlock: function(n, t) {
                this._cipher.decryptBlock(n, t)
            }
        }), p), n.pad.AnsiX923 = {
            pad: function(n, t) {
                var r = n.sigBytes,
                    u = 4 * t,
                    i = u - r % u,
                    f = r + i - 1;
                n.clamp();
                n.words[f >>> 2] |= i << 24 - f % 4 * 8;
                n.sigBytes += i
            },
            unpad: function(n) {
                var t = 255 & n.words[n.sigBytes - 1 >>> 2];
                n.sigBytes -= t
            }
        }, n.pad.Iso10126 = {
            pad: function(t, i) {
                var r = 4 * i,
                    u = r - t.sigBytes % r;
                t.concat(n.lib.WordArray.random(u - 1)).concat(n.lib.WordArray.create([u << 24], 1))
            },
            unpad: function(n) {
                var t = 255 & n.words[n.sigBytes - 1 >>> 2];
                n.sigBytes -= t
            }
        }, n.pad.Iso97971 = {
            pad: function(t, i) {
                t.concat(n.lib.WordArray.create([2147483648], 1));
                n.pad.ZeroPadding.pad(t, i)
            },
            unpad: function(t) {
                n.pad.ZeroPadding.unpad(t);
                t.sigBytes--
            }
        }, n.mode.OFB = (w = n.lib.BlockCipherMode.extend(), cr = w.Encryptor = w.extend({
            processBlock: function(n, t) {
                var u = this._cipher,
                    e = u.blockSize,
                    f = this._iv,
                    r = this._keystream,
                    i;
                for (f && (r = this._keystream = f.slice(0), this._iv = void 0), u.encryptBlock(r, 0), i = 0; i < e; i++) n[t + i] ^= r[i]
            }
        }), w.Decryptor = cr, w), n.pad.NoPadding = {
            pad: function() {},
            unpad: function() {}
        }, lr = n.lib.CipherParams, ii = n.enc.Hex, n.format.Hex = {
            stringify: function(n) {
                return n.ciphertext.toString(ii)
            },
            parse: function(n) {
                var t = ii.parse(n);
                return lr.create({
                    ciphertext: t
                })
            }
        },
        function() {
            var i = n,
                o = i.lib.BlockCipher,
                p = i.algo,
                t = [],
                s = [],
                h = [],
                c = [],
                l = [],
                a = [],
                r = [],
                u = [],
                f = [],
                e = [],
                v, y;
            ! function() {
                for (var v, p, i, o = [], y = 0; y < 256; y++) o[y] = y < 128 ? y << 1 : y << 1 ^ 283;
                for (v = 0, p = 0, y = 0; y < 256; y++) {
                    i = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4;
                    i = i >>> 8 ^ 255 & i ^ 99;
                    t[v] = i;
                    var w = o[s[i] = v],
                        b = o[w],
                        k = o[b],
                        n = 257 * o[i] ^ 16843008 * i;
                    h[v] = n << 24 | n >>> 8;
                    c[v] = n << 16 | n >>> 16;
                    l[v] = n << 8 | n >>> 24;
                    a[v] = n;
                    n = 16843009 * k ^ 65537 * b ^ 257 * w ^ 16843008 * v;
                    r[i] = n << 24 | n >>> 8;
                    u[i] = n << 16 | n >>> 16;
                    f[i] = n << 8 | n >>> 24;
                    e[i] = n;
                    v ? (v = w ^ o[o[o[k ^ w]]], p ^= o[o[p]]) : v = p = 1
                }
            }();
            v = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
            y = p.AES = o.extend({
                _doReset: function() {
                    var a, s, n;
                    if (!this._nRounds || this._keyPriorReset !== this._key) {
                        for (var l = this._keyPriorReset = this._key, y = l.words, o = l.sigBytes / 4, c = 4 * (1 + (this._nRounds = 6 + o)), h = this._keySchedule = [], i = 0; i < c; i++) i < o ? h[i] = y[i] : (n = h[i - 1], i % o ? 6 < o && i % o == 4 && (n = t[n >>> 24] << 24 | t[n >>> 16 & 255] << 16 | t[n >>> 8 & 255] << 8 | t[255 & n]) : (n = t[(n = n << 8 | n >>> 24) >>> 24] << 24 | t[n >>> 16 & 255] << 16 | t[n >>> 8 & 255] << 8 | t[255 & n], n ^= v[i / o | 0] << 24), h[i] = h[i - o] ^ n);
                        for (a = this._invKeySchedule = [], s = 0; s < c; s++) i = c - s, n = s % 4 ? h[i] : h[i - 4], a[s] = s < 4 || i <= 4 ? n : r[t[n >>> 24]] ^ u[t[n >>> 16 & 255]] ^ f[t[n >>> 8 & 255]] ^ e[t[255 & n]]
                    }
                },
                encryptBlock: function(n, i) {
                    this._doCryptBlock(n, i, this._keySchedule, h, c, l, a, t)
                },
                decryptBlock: function(n, t) {
                    var i = n[t + 1];
                    n[t + 1] = n[t + 3];
                    n[t + 3] = i;
                    this._doCryptBlock(n, t, this._invKeySchedule, r, u, f, e, s);
                    i = n[t + 1];
                    n[t + 1] = n[t + 3];
                    n[t + 3] = i
                },
                _doCryptBlock: function(n, t, i, r, u, f, e, o) {
                    for (var k = this._nRounds, s = n[t] ^ i[0], h = n[t + 1] ^ i[1], c = n[t + 2] ^ i[2], l = n[t + 3] ^ i[3], a = 4, b = 1; b < k; b++) {
                        var v = r[s >>> 24] ^ u[h >>> 16 & 255] ^ f[c >>> 8 & 255] ^ e[255 & l] ^ i[a++],
                            y = r[h >>> 24] ^ u[c >>> 16 & 255] ^ f[l >>> 8 & 255] ^ e[255 & s] ^ i[a++],
                            p = r[c >>> 24] ^ u[l >>> 16 & 255] ^ f[s >>> 8 & 255] ^ e[255 & h] ^ i[a++],
                            w = r[l >>> 24] ^ u[s >>> 16 & 255] ^ f[h >>> 8 & 255] ^ e[255 & c] ^ i[a++];
                        s = v;
                        h = y;
                        c = p;
                        l = w
                    }
                    v = (o[s >>> 24] << 24 | o[h >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & l]) ^ i[a++];
                    y = (o[h >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[l >>> 8 & 255] << 8 | o[255 & s]) ^ i[a++];
                    p = (o[c >>> 24] << 24 | o[l >>> 16 & 255] << 16 | o[s >>> 8 & 255] << 8 | o[255 & h]) ^ i[a++];
                    w = (o[l >>> 24] << 24 | o[s >>> 16 & 255] << 16 | o[h >>> 8 & 255] << 8 | o[255 & c]) ^ i[a++];
                    n[t] = v;
                    n[t + 1] = y;
                    n[t + 2] = p;
                    n[t + 3] = w
                },
                keySize: 8
            });
            i.AES = o._createHelper(y)
        }(),
        function() {
            function t(n, t) {
                var i = (this._lBlock >>> n ^ this._rBlock) & t;
                this._rBlock ^= i;
                this._lBlock ^= i << n
            }

            function f(n, t) {
                var i = (this._rBlock >>> n ^ this._lBlock) & t;
                this._lBlock ^= i;
                this._rBlock ^= i << n
            }
            var i = n,
                o = i.lib,
                e = o.WordArray,
                r = o.BlockCipher,
                s = i.algo,
                l = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
                h = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
                a = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
                v = [{
                    0: 8421888,
                    268435456: 32768,
                    536870912: 8421378,
                    805306368: 2,
                    1073741824: 512,
                    1342177280: 8421890,
                    1610612736: 8389122,
                    1879048192: 8388608,
                    2147483648: 514,
                    2415919104: 8389120,
                    2684354560: 33280,
                    2952790016: 8421376,
                    3221225472: 32770,
                    3489660928: 8388610,
                    3758096384: 0,
                    4026531840: 33282,
                    134217728: 0,
                    402653184: 8421890,
                    671088640: 33282,
                    939524096: 32768,
                    1207959552: 8421888,
                    1476395008: 512,
                    1744830464: 8421378,
                    2013265920: 2,
                    2281701376: 8389120,
                    2550136832: 33280,
                    2818572288: 8421376,
                    3087007744: 8389122,
                    3355443200: 8388610,
                    3623878656: 32770,
                    3892314112: 514,
                    4160749568: 8388608,
                    1: 32768,
                    268435457: 2,
                    536870913: 8421888,
                    805306369: 8388608,
                    1073741825: 8421378,
                    1342177281: 33280,
                    1610612737: 512,
                    1879048193: 8389122,
                    2147483649: 8421890,
                    2415919105: 8421376,
                    2684354561: 8388610,
                    2952790017: 33282,
                    3221225473: 514,
                    3489660929: 8389120,
                    3758096385: 32770,
                    4026531841: 0,
                    134217729: 8421890,
                    402653185: 8421376,
                    671088641: 8388608,
                    939524097: 512,
                    1207959553: 32768,
                    1476395009: 8388610,
                    1744830465: 2,
                    2013265921: 33282,
                    2281701377: 32770,
                    2550136833: 8389122,
                    2818572289: 514,
                    3087007745: 8421888,
                    3355443201: 8389120,
                    3623878657: 0,
                    3892314113: 33280,
                    4160749569: 8421378
                }, {
                    0: 1074282512,
                    16777216: 16384,
                    33554432: 524288,
                    50331648: 1074266128,
                    67108864: 1073741840,
                    83886080: 1074282496,
                    100663296: 1073758208,
                    117440512: 16,
                    134217728: 540672,
                    150994944: 1073758224,
                    167772160: 1073741824,
                    184549376: 540688,
                    201326592: 524304,
                    218103808: 0,
                    234881024: 16400,
                    251658240: 1074266112,
                    8388608: 1073758208,
                    25165824: 540688,
                    41943040: 16,
                    58720256: 1073758224,
                    75497472: 1074282512,
                    92274688: 1073741824,
                    109051904: 524288,
                    125829120: 1074266128,
                    142606336: 524304,
                    159383552: 0,
                    176160768: 16384,
                    192937984: 1074266112,
                    209715200: 1073741840,
                    226492416: 540672,
                    243269632: 1074282496,
                    260046848: 16400,
                    268435456: 0,
                    285212672: 1074266128,
                    301989888: 1073758224,
                    318767104: 1074282496,
                    335544320: 1074266112,
                    352321536: 16,
                    369098752: 540688,
                    385875968: 16384,
                    402653184: 16400,
                    419430400: 524288,
                    436207616: 524304,
                    452984832: 1073741840,
                    469762048: 540672,
                    486539264: 1073758208,
                    503316480: 1073741824,
                    520093696: 1074282512,
                    276824064: 540688,
                    293601280: 524288,
                    310378496: 1074266112,
                    327155712: 16384,
                    343932928: 1073758208,
                    360710144: 1074282512,
                    377487360: 16,
                    394264576: 1073741824,
                    411041792: 1074282496,
                    427819008: 1073741840,
                    444596224: 1073758224,
                    461373440: 524304,
                    478150656: 0,
                    494927872: 16400,
                    511705088: 1074266128,
                    528482304: 540672
                }, {
                    0: 260,
                    1048576: 0,
                    2097152: 67109120,
                    3145728: 65796,
                    4194304: 65540,
                    5242880: 67108868,
                    6291456: 67174660,
                    7340032: 67174400,
                    8388608: 67108864,
                    9437184: 67174656,
                    10485760: 65792,
                    11534336: 67174404,
                    12582912: 67109124,
                    13631488: 65536,
                    14680064: 4,
                    15728640: 256,
                    524288: 67174656,
                    1572864: 67174404,
                    2621440: 0,
                    3670016: 67109120,
                    4718592: 67108868,
                    5767168: 65536,
                    6815744: 65540,
                    7864320: 260,
                    8912896: 4,
                    9961472: 256,
                    11010048: 67174400,
                    12058624: 65796,
                    13107200: 65792,
                    14155776: 67109124,
                    15204352: 67174660,
                    16252928: 67108864,
                    16777216: 67174656,
                    17825792: 65540,
                    18874368: 65536,
                    19922944: 67109120,
                    20971520: 256,
                    22020096: 67174660,
                    23068672: 67108868,
                    24117248: 0,
                    25165824: 67109124,
                    26214400: 67108864,
                    27262976: 4,
                    28311552: 65792,
                    29360128: 67174400,
                    30408704: 260,
                    31457280: 65796,
                    32505856: 67174404,
                    17301504: 67108864,
                    18350080: 260,
                    19398656: 67174656,
                    20447232: 0,
                    21495808: 65540,
                    22544384: 67109120,
                    23592960: 256,
                    24641536: 67174404,
                    25690112: 65536,
                    26738688: 67174660,
                    27787264: 65796,
                    28835840: 67108868,
                    29884416: 67109124,
                    30932992: 67174400,
                    31981568: 4,
                    33030144: 65792
                }, {
                    0: 2151682048,
                    65536: 2147487808,
                    131072: 4198464,
                    196608: 2151677952,
                    262144: 0,
                    327680: 4198400,
                    393216: 2147483712,
                    458752: 4194368,
                    524288: 2147483648,
                    589824: 4194304,
                    655360: 64,
                    720896: 2147487744,
                    786432: 2151678016,
                    851968: 4160,
                    917504: 4096,
                    983040: 2151682112,
                    32768: 2147487808,
                    98304: 64,
                    163840: 2151678016,
                    229376: 2147487744,
                    294912: 4198400,
                    360448: 2151682112,
                    425984: 0,
                    491520: 2151677952,
                    557056: 4096,
                    622592: 2151682048,
                    688128: 4194304,
                    753664: 4160,
                    819200: 2147483648,
                    884736: 4194368,
                    950272: 4198464,
                    1015808: 2147483712,
                    1048576: 4194368,
                    1114112: 4198400,
                    1179648: 2147483712,
                    1245184: 0,
                    1310720: 4160,
                    1376256: 2151678016,
                    1441792: 2151682048,
                    1507328: 2147487808,
                    1572864: 2151682112,
                    1638400: 2147483648,
                    1703936: 2151677952,
                    1769472: 4198464,
                    1835008: 2147487744,
                    1900544: 4194304,
                    1966080: 64,
                    2031616: 4096,
                    1081344: 2151677952,
                    1146880: 2151682112,
                    1212416: 0,
                    1277952: 4198400,
                    1343488: 4194368,
                    1409024: 2147483648,
                    1474560: 2147487808,
                    1540096: 64,
                    1605632: 2147483712,
                    1671168: 4096,
                    1736704: 2147487744,
                    1802240: 2151678016,
                    1867776: 4160,
                    1933312: 2151682048,
                    1998848: 4194304,
                    2064384: 4198464
                }, {
                    0: 128,
                    4096: 17039360,
                    8192: 262144,
                    12288: 536870912,
                    16384: 537133184,
                    20480: 16777344,
                    24576: 553648256,
                    28672: 262272,
                    32768: 16777216,
                    36864: 537133056,
                    40960: 536871040,
                    45056: 553910400,
                    49152: 553910272,
                    53248: 0,
                    57344: 17039488,
                    61440: 553648128,
                    2048: 17039488,
                    6144: 553648256,
                    10240: 128,
                    14336: 17039360,
                    18432: 262144,
                    22528: 537133184,
                    26624: 553910272,
                    30720: 536870912,
                    34816: 537133056,
                    38912: 0,
                    43008: 553910400,
                    47104: 16777344,
                    51200: 536871040,
                    55296: 553648128,
                    59392: 16777216,
                    63488: 262272,
                    65536: 262144,
                    69632: 128,
                    73728: 536870912,
                    77824: 553648256,
                    81920: 16777344,
                    86016: 553910272,
                    90112: 537133184,
                    94208: 16777216,
                    98304: 553910400,
                    102400: 553648128,
                    106496: 17039360,
                    110592: 537133056,
                    114688: 262272,
                    118784: 536871040,
                    122880: 0,
                    126976: 17039488,
                    67584: 553648256,
                    71680: 16777216,
                    75776: 17039360,
                    79872: 537133184,
                    83968: 536870912,
                    88064: 17039488,
                    92160: 128,
                    96256: 553910272,
                    100352: 262272,
                    104448: 553910400,
                    108544: 0,
                    112640: 553648128,
                    116736: 16777344,
                    120832: 262144,
                    124928: 537133056,
                    129024: 536871040
                }, {
                    0: 268435464,
                    256: 8192,
                    512: 270532608,
                    768: 270540808,
                    1024: 268443648,
                    1280: 2097152,
                    1536: 2097160,
                    1792: 268435456,
                    2048: 0,
                    2304: 268443656,
                    2560: 2105344,
                    2816: 8,
                    3072: 270532616,
                    3328: 2105352,
                    3584: 8200,
                    3840: 270540800,
                    128: 270532608,
                    384: 270540808,
                    640: 8,
                    896: 2097152,
                    1152: 2105352,
                    1408: 268435464,
                    1664: 268443648,
                    1920: 8200,
                    2176: 2097160,
                    2432: 8192,
                    2688: 268443656,
                    2944: 270532616,
                    3200: 0,
                    3456: 270540800,
                    3712: 2105344,
                    3968: 268435456,
                    4096: 268443648,
                    4352: 270532616,
                    4608: 270540808,
                    4864: 8200,
                    5120: 2097152,
                    5376: 268435456,
                    5632: 268435464,
                    5888: 2105344,
                    6144: 2105352,
                    6400: 0,
                    6656: 8,
                    6912: 270532608,
                    7168: 8192,
                    7424: 268443656,
                    7680: 270540800,
                    7936: 2097160,
                    4224: 8,
                    4480: 2105344,
                    4736: 2097152,
                    4992: 268435464,
                    5248: 268443648,
                    5504: 8200,
                    5760: 270540808,
                    6016: 270532608,
                    6272: 270540800,
                    6528: 270532616,
                    6784: 8192,
                    7040: 2105352,
                    7296: 2097160,
                    7552: 0,
                    7808: 268435456,
                    8064: 268443656
                }, {
                    0: 1048576,
                    16: 33555457,
                    32: 1024,
                    48: 1049601,
                    64: 34604033,
                    80: 0,
                    96: 1,
                    112: 34603009,
                    128: 33555456,
                    144: 1048577,
                    160: 33554433,
                    176: 34604032,
                    192: 34603008,
                    208: 1025,
                    224: 1049600,
                    240: 33554432,
                    8: 34603009,
                    24: 0,
                    40: 33555457,
                    56: 34604032,
                    72: 1048576,
                    88: 33554433,
                    104: 33554432,
                    120: 1025,
                    136: 1049601,
                    152: 33555456,
                    168: 34603008,
                    184: 1048577,
                    200: 1024,
                    216: 34604033,
                    232: 1,
                    248: 1049600,
                    256: 33554432,
                    272: 1048576,
                    288: 33555457,
                    304: 34603009,
                    320: 1048577,
                    336: 33555456,
                    352: 34604032,
                    368: 1049601,
                    384: 1025,
                    400: 34604033,
                    416: 1049600,
                    432: 1,
                    448: 0,
                    464: 34603008,
                    480: 33554433,
                    496: 1024,
                    264: 1049600,
                    280: 33555457,
                    296: 34603009,
                    312: 1,
                    328: 33554432,
                    344: 1048576,
                    360: 1025,
                    376: 34604032,
                    392: 33554433,
                    408: 34603008,
                    424: 0,
                    440: 34604033,
                    456: 1049601,
                    472: 1024,
                    488: 33555456,
                    504: 1048577
                }, {
                    0: 134219808,
                    1: 131072,
                    2: 134217728,
                    3: 32,
                    4: 131104,
                    5: 134350880,
                    6: 134350848,
                    7: 2048,
                    8: 134348800,
                    9: 134219776,
                    10: 133120,
                    11: 134348832,
                    12: 2080,
                    13: 0,
                    14: 134217760,
                    15: 133152,
                    2147483648: 2048,
                    2147483649: 134350880,
                    2147483650: 134219808,
                    2147483651: 134217728,
                    2147483652: 134348800,
                    2147483653: 133120,
                    2147483654: 133152,
                    2147483655: 32,
                    2147483656: 134217760,
                    2147483657: 2080,
                    2147483658: 131104,
                    2147483659: 134350848,
                    2147483660: 0,
                    2147483661: 134348832,
                    2147483662: 134219776,
                    2147483663: 131072,
                    16: 133152,
                    17: 134350848,
                    18: 32,
                    19: 2048,
                    20: 134219776,
                    21: 134217760,
                    22: 134348832,
                    23: 131072,
                    24: 0,
                    25: 131104,
                    26: 134348800,
                    27: 134219808,
                    28: 134350880,
                    29: 133120,
                    30: 2080,
                    31: 134217728,
                    2147483664: 131072,
                    2147483665: 2048,
                    2147483666: 134348832,
                    2147483667: 133152,
                    2147483668: 32,
                    2147483669: 134348800,
                    2147483670: 134217728,
                    2147483671: 134219808,
                    2147483672: 134350880,
                    2147483673: 134217760,
                    2147483674: 134219776,
                    2147483675: 0,
                    2147483676: 133120,
                    2147483677: 2080,
                    2147483678: 131104,
                    2147483679: 134350848
                }],
                y = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
                u = s.DES = r.extend({
                    _doReset: function() {
                        for (var u, f, i, t, e, o, s = this._key.words, r = [], n = 0; n < 56; n++) u = l[n] - 1, r[n] = s[u >>> 5] >>> 31 - u % 32 & 1;
                        for (f = this._subKeys = [], i = 0; i < 16; i++) {
                            for (t = f[i] = [], e = a[i], n = 0; n < 24; n++) t[n / 6 | 0] |= r[(h[n] - 1 + e) % 28] << 31 - n % 6, t[4 + (n / 6 | 0)] |= r[28 + (h[n + 24] - 1 + e) % 28] << 31 - n % 6;
                            for (t[0] = t[0] << 1 | t[0] >>> 31, n = 1; n < 7; n++) t[n] = t[n] >>> 4 * (n - 1) + 3;
                            t[7] = t[7] << 5 | t[7] >>> 27
                        }
                        for (o = this._invSubKeys = [], n = 0; n < 16; n++) o[n] = f[15 - n]
                    },
                    encryptBlock: function(n, t) {
                        this._doCryptBlock(n, t, this._subKeys)
                    },
                    decryptBlock: function(n, t) {
                        this._doCryptBlock(n, t, this._invSubKeys)
                    },
                    _doCryptBlock: function(n, i, r) {
                        var e, h;
                        for (this._lBlock = n[i], this._rBlock = n[i + 1], t.call(this, 4, 252645135), t.call(this, 16, 65535), f.call(this, 2, 858993459), f.call(this, 8, 16711935), t.call(this, 1, 1431655765), e = 0; e < 16; e++) {
                            for (var c = r[e], l = this._lBlock, o = this._rBlock, s = 0, u = 0; u < 8; u++) s |= v[u][((o ^ c[u]) & y[u]) >>> 0];
                            this._lBlock = o;
                            this._rBlock = l ^ s
                        }
                        h = this._lBlock;
                        this._lBlock = this._rBlock;
                        this._rBlock = h;
                        t.call(this, 1, 1431655765);
                        f.call(this, 8, 16711935);
                        f.call(this, 2, 858993459);
                        t.call(this, 16, 65535);
                        t.call(this, 4, 252645135);
                        n[i] = this._lBlock;
                        n[i + 1] = this._rBlock
                    },
                    keySize: 2,
                    ivSize: 2,
                    blockSize: 2
                }),
                c;
            i.DES = r._createHelper(u);
            c = s.TripleDES = r.extend({
                _doReset: function() {
                    var n = this._key.words;
                    if (2 !== n.length && 4 !== n.length && n.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                    var t = n.slice(0, 2),
                        i = n.length < 4 ? n.slice(0, 2) : n.slice(2, 4),
                        r = n.length < 6 ? n.slice(0, 2) : n.slice(4, 6);
                    this._des1 = u.createEncryptor(e.create(t));
                    this._des2 = u.createEncryptor(e.create(i));
                    this._des3 = u.createEncryptor(e.create(r))
                },
                encryptBlock: function(n, t) {
                    this._des1.encryptBlock(n, t);
                    this._des2.decryptBlock(n, t);
                    this._des3.encryptBlock(n, t)
                },
                decryptBlock: function(n, t) {
                    this._des3.decryptBlock(n, t);
                    this._des2.encryptBlock(n, t);
                    this._des1.decryptBlock(n, t)
                },
                keySize: 6,
                ivSize: 2,
                blockSize: 2
            });
            i.TripleDES = r._createHelper(c)
        }(),
        function() {
            function f() {
                for (var f, n = this._S, t = this._i, i = this._j, u = 0, r = 0; r < 4; r++) i = (i + n[t = (t + 1) % 256]) % 256, f = n[t], n[t] = n[i], n[i] = f, u |= n[(n[t] + n[i]) % 256] << 24 - 8 * r;
                return this._i = t, this._j = i, u
            }
            var t = n,
                r = t.lib.StreamCipher,
                u = t.algo,
                i = u.RC4 = r.extend({
                    _doReset: function() {
                        for (var i, r, f, e, u = this._key, o = u.words, s = u.sigBytes, t = this._S = [], n = 0; n < 256; n++) t[n] = n;
                        for (n = 0, i = 0; n < 256; n++) r = n % s, f = o[r >>> 2] >>> 24 - r % 4 * 8 & 255, i = (i + t[n] + f) % 256, e = t[n], t[n] = t[i], t[i] = e;
                        this._i = this._j = 0
                    },
                    _doProcessBlock: function(n, t) {
                        n[t] ^= f.call(this)
                    },
                    keySize: 8,
                    ivSize: 0
                }),
                e;
            t.RC4 = r._createHelper(i);
            e = u.RC4Drop = i.extend({
                cfg: i.cfg.extend({
                    drop: 192
                }),
                _doReset: function() {
                    i._doReset.call(this);
                    for (var n = this.cfg.drop; 0 < n; n--) f.call(this)
                }
            });
            t.RC4Drop = r._createHelper(e)
        }(), n.mode.CTRGladman = (b = n.lib.BlockCipherMode.extend(), ar = b.Encryptor = b.extend({
            processBlock: function(n, t) {
                var r, e = this._cipher,
                    s = e.blockSize,
                    o = this._iv,
                    u = this._counter,
                    f, i;
                for (o && (u = this._counter = o.slice(0), this._iv = void 0), 0 === ((r = u)[0] = ru(r[0])) && (r[1] = ru(r[1])), f = u.slice(0), e.encryptBlock(f, 0), i = 0; i < s; i++) n[t + i] ^= f[i]
            }
        }), b.Decryptor = ar, b), ui = (ri = n).lib.StreamCipher, vr = ri.algo, r = [], f = [], t = [], yr = vr.Rabbit = ui.extend({
            _doReset: function() {
                for (var s, i, n = this._key.words, o = this.cfg.iv, t = 0; t < 4; t++) n[t] = 16711935 & (n[t] << 8 | n[t] >>> 24) | 4278255360 & (n[t] << 24 | n[t] >>> 8);
                for (s = this._X = [n[0], n[3] << 16 | n[2] >>> 16, n[1], n[0] << 16 | n[3] >>> 16, n[2], n[1] << 16 | n[0] >>> 16, n[3], n[2] << 16 | n[1] >>> 16], i = this._C = [n[2] << 16 | n[2] >>> 16, 4294901760 & n[0] | 65535 & n[1], n[3] << 16 | n[3] >>> 16, 4294901760 & n[1] | 65535 & n[2], n[0] << 16 | n[0] >>> 16, 4294901760 & n[2] | 65535 & n[3], n[1] << 16 | n[1] >>> 16, 4294901760 & n[3] | 65535 & n[0]], t = this._b = 0; t < 4; t++) oi.call(this);
                for (t = 0; t < 8; t++) i[t] ^= s[t + 4 & 7];
                if (o) {
                    var h = o.words,
                        r = h[0],
                        u = h[1],
                        f = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8),
                        e = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8),
                        c = f >>> 16 | 4294901760 & e,
                        l = e << 16 | 65535 & f;
                    for (i[0] ^= f, i[1] ^= c, i[2] ^= e, i[3] ^= l, i[4] ^= f, i[5] ^= c, i[6] ^= e, i[7] ^= l, t = 0; t < 4; t++) oi.call(this)
                }
            },
            _doProcessBlock: function(n, t) {
                var i = this._X,
                    u;
                for (oi.call(this), r[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, r[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, r[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, r[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16, u = 0; u < 4; u++) r[u] = 16711935 & (r[u] << 8 | r[u] >>> 24) | 4278255360 & (r[u] << 24 | r[u] >>> 8), n[t + u] ^= r[u]
            },
            blockSize: 4,
            ivSize: 2
        }), ri.Rabbit = ui._createHelper(yr), n.mode.CTR = (k = n.lib.BlockCipherMode.extend(), pr = k.Encryptor = k.extend({
            processBlock: function(n, t) {
                var e = this._cipher,
                    u = e.blockSize,
                    o = this._iv,
                    r = this._counter,
                    f, i;
                for (o && (r = this._counter = o.slice(0), this._iv = void 0), f = r.slice(0), e.encryptBlock(f, 0), r[u - 1] = r[u - 1] + 1 | 0, i = 0; i < u; i++) n[t + i] ^= f[i]
            }
        }), k.Decryptor = pr, k), ei = (fi = n).lib.StreamCipher, wr = fi.algo, u = [], e = [], i = [], br = wr.RabbitLegacy = ei.extend({
            _doReset: function() {
                for (var n = this._key.words, o = this.cfg.iv, l = this._X = [n[0], n[3] << 16 | n[2] >>> 16, n[1], n[0] << 16 | n[3] >>> 16, n[2], n[1] << 16 | n[0] >>> 16, n[3], n[2] << 16 | n[1] >>> 16], i = this._C = [n[2] << 16 | n[2] >>> 16, 4294901760 & n[0] | 65535 & n[1], n[3] << 16 | n[3] >>> 16, 4294901760 & n[1] | 65535 & n[2], n[0] << 16 | n[0] >>> 16, 4294901760 & n[2] | 65535 & n[3], n[1] << 16 | n[1] >>> 16, 4294901760 & n[3] | 65535 & n[0]], t = this._b = 0; t < 4; t++) si.call(this);
                for (t = 0; t < 8; t++) i[t] ^= l[t + 4 & 7];
                if (o) {
                    var s = o.words,
                        r = s[0],
                        u = s[1],
                        f = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8),
                        e = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8),
                        h = f >>> 16 | 4294901760 & e,
                        c = e << 16 | 65535 & f;
                    for (i[0] ^= f, i[1] ^= h, i[2] ^= e, i[3] ^= c, i[4] ^= f, i[5] ^= h, i[6] ^= e, i[7] ^= c, t = 0; t < 4; t++) si.call(this)
                }
            },
            _doProcessBlock: function(n, t) {
                var i = this._X,
                    r;
                for (si.call(this), u[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, u[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, u[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, u[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16, r = 0; r < 4; r++) u[r] = 16711935 & (u[r] << 8 | u[r] >>> 24) | 4278255360 & (u[r] << 24 | u[r] >>> 8), n[t + r] ^= u[r]
            },
            blockSize: 4,
            ivSize: 2
        }), fi.RabbitLegacy = ei._createHelper(br), n.pad.ZeroPadding = {
            pad: function(n, t) {
                var i = 4 * t;
                n.clamp();
                n.sigBytes += i - (n.sigBytes % i || i)
            },
            unpad: function(n) {
                for (var i = n.words, t = n.sigBytes - 1, t = n.sigBytes - 1; 0 <= t; t--)
                    if (i[t >>> 2] >>> 24 - t % 4 * 8 & 255) {
                        n.sigBytes = t + 1;
                        break
                    }
            }
        }, n
});
FingerprintJS = function(n) {
    function s(n, t, i, r) {
        return new(i || (i = Promise))(function(u, f) {
            function o(n) {
                try {
                    e(r.next(n))
                } catch (t) {
                    f(t)
                }
            }

            function s(n) {
                try {
                    e(r.throw(n))
                } catch (t) {
                    f(t)
                }
            }

            function e(n) {
                var t;
                n.done ? u(n.value) : (t = n.value, t instanceof i ? t : new i(function(n) {
                    n(t)
                })).then(o, s)
            }
            e((r = r.apply(n, t || [])).next())
        })
    }

    function h(n, t) {
        function o(o) {
            return function(s) {
                return function(o) {
                    if (e) throw new TypeError("Generator is already executing.");
                    for (; f && (f = 0, o[0] && (r = 0)), r;) try {
                        if (e = 1, u && (i = 2 & o[0] ? u.return : o[0] ? u.throw || ((i = u.return) && i.call(u), 0) : u.next) && !(i = i.call(u, o[1])).done) return i;
                        switch (u = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                            case 0:
                            case 1:
                                i = o;
                                break;
                            case 4:
                                return r.label++, {
                                    value: o[1],
                                    done: !1
                                };
                            case 5:
                                r.label++;
                                u = o[1];
                                o = [0];
                                continue;
                            case 7:
                                o = r.ops.pop();
                                r.trys.pop();
                                continue;
                            default:
                                if (!(i = r.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                    r = 0;
                                    continue
                                }
                                if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                                    r.label = o[1];
                                    break
                                }
                                if (6 === o[0] && r.label < i[1]) {
                                    r.label = i[1];
                                    i = o;
                                    break
                                }
                                if (i && r.label < i[2]) {
                                    r.label = i[2];
                                    r.ops.push(o);
                                    break
                                }
                                i[2] && r.ops.pop();
                                r.trys.pop();
                                continue
                        }
                        o = t.call(n, r)
                    } catch (s) {
                        o = [6, s];
                        u = 0
                    } finally {
                        e = i = 0
                    }
                    if (5 & o[0]) throw o[1];
                    return {
                        value: o[0] ? o[1] : void 0,
                        done: !0
                    }
                }([o, s])
            }
        }
        var e, u, i, f, r = {
            label: 0,
            sent: function() {
                if (1 & i[0]) throw i[1];
                return i[1]
            },
            trys: [],
            ops: []
        };
        return f = {
            next: o(0),
            "throw": o(1),
            "return": o(2)
        }, "function" == typeof Symbol && (f[Symbol.iterator] = function() {
            return this
        }), f
    }

    function vt(n, t, i) {
        if (i || 2 === arguments.length)
            for (var u, r = 0, f = t.length; r < f; r++) !u && r in t || (u || (u = Array.prototype.slice.call(t, 0, r)), u[r] = t[r]);
        return n.concat(u || Array.prototype.slice.call(t))
    }

    function w(n, t) {
        return new Promise(function(i) {
            return setTimeout(i, n, t)
        })
    }

    function k(n) {
        return !!n && "function" == typeof n.then
    }

    function yt(n, t) {
        try {
            var i = n();
            k(i) ? i.then(function(n) {
                return t(!0, n)
            }, function(n) {
                return t(!1, n)
            }) : t(!0, i)
        } catch (r) {
            t(!1, r)
        }
    }

    function pt(n, t, i) {
        return void 0 === i && (i = 16), s(this, void 0, void 0, function() {
            var u, f, r, e;
            return h(this, function(o) {
                switch (o.label) {
                    case 0:
                        u = Array(n.length);
                        f = Date.now();
                        r = 0;
                        o.label = 1;
                    case 1:
                        return r < n.length ? (u[r] = t(n[r], r), (e = Date.now()) >= f + i ? (f = e, [4, w(0)]) : [3, 3]) : [3, 4];
                    case 2:
                        o.sent();
                        o.label = 3;
                    case 3:
                        return ++r, [3, 1];
                    case 4:
                        return [2, u]
                }
            })
        })
    }

    function b(n) {
        n.then(void 0, function() {})
    }

    function l(n, t) {
        n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
        t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
        var i = [0, 0, 0, 0];
        return i[3] += n[3] + t[3], i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += n[2] + t[2], i[1] += i[2] >>> 16, i[2] &= 65535, i[1] += n[1] + t[1], i[0] += i[1] >>> 16, i[1] &= 65535, i[0] += n[0] + t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]]
    }

    function f(n, t) {
        n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
        t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
        var i = [0, 0, 0, 0];
        return i[3] += n[3] * t[3], i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += n[2] * t[3], i[1] += i[2] >>> 16, i[2] &= 65535, i[2] += n[3] * t[2], i[1] += i[2] >>> 16, i[2] &= 65535, i[1] += n[1] * t[3], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += n[2] * t[2], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += n[3] * t[1], i[0] += i[1] >>> 16, i[1] &= 65535, i[0] += n[0] * t[3] + n[1] * t[2] + n[2] * t[1] + n[3] * t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]]
    }

    function a(n, t) {
        return 32 == (t %= 64) ? [n[1], n[0]] : t < 32 ? [n[0] << t | n[1] >>> 32 - t, n[1] << t | n[0] >>> 32 - t] : (t -= 32, [n[1] << t | n[0] >>> 32 - t, n[0] << t | n[1] >>> 32 - t])
    }

    function u(n, t) {
        return 0 == (t %= 64) ? n : t < 32 ? [n[0] << t | n[1] >>> 32 - t, n[1] << t] : [n[1] << t - 32, 0]
    }

    function i(n, t) {
        return [n[0] ^ t[0], n[1] ^ t[1]]
    }

    function wt(n) {
        return n = i(n, [0, n[0] >>> 1]), n = i(n = f(n, [4283543511, 3981806797]), [0, n[0] >>> 1]), n = i(n = f(n, [3301882366, 444984403]), [0, n[0] >>> 1])
    }

    function bt(n, t) {
        t = t || 0;
        for (var y = (n = n || "").length % 16, p = n.length - y, s = [0, t], h = [0, t], e = [0, 0], o = [0, 0], c = [2277735313, 289559509], v = [1291169091, 658871167], r = 0; r < p; r += 16) e = [255 & n.charCodeAt(r + 4) | (255 & n.charCodeAt(r + 5)) << 8 | (255 & n.charCodeAt(r + 6)) << 16 | (255 & n.charCodeAt(r + 7)) << 24, 255 & n.charCodeAt(r) | (255 & n.charCodeAt(r + 1)) << 8 | (255 & n.charCodeAt(r + 2)) << 16 | (255 & n.charCodeAt(r + 3)) << 24], o = [255 & n.charCodeAt(r + 12) | (255 & n.charCodeAt(r + 13)) << 8 | (255 & n.charCodeAt(r + 14)) << 16 | (255 & n.charCodeAt(r + 15)) << 24, 255 & n.charCodeAt(r + 8) | (255 & n.charCodeAt(r + 9)) << 8 | (255 & n.charCodeAt(r + 10)) << 16 | (255 & n.charCodeAt(r + 11)) << 24], e = a(e = f(e, c), 31), s = l(s = a(s = i(s, e = f(e, v)), 27), h), s = l(f(s, [0, 5]), [0, 1390208809]), o = a(o = f(o, v), 33), h = l(h = a(h = i(h, o = f(o, c)), 31), s), h = l(f(h, [0, 5]), [0, 944331445]);
        switch (e = [0, 0], o = [0, 0], y) {
            case 15:
                o = i(o, u([0, n.charCodeAt(r + 14)], 48));
            case 14:
                o = i(o, u([0, n.charCodeAt(r + 13)], 40));
            case 13:
                o = i(o, u([0, n.charCodeAt(r + 12)], 32));
            case 12:
                o = i(o, u([0, n.charCodeAt(r + 11)], 24));
            case 11:
                o = i(o, u([0, n.charCodeAt(r + 10)], 16));
            case 10:
                o = i(o, u([0, n.charCodeAt(r + 9)], 8));
            case 9:
                o = f(o = i(o, [0, n.charCodeAt(r + 8)]), v);
                h = i(h, o = f(o = a(o, 33), c));
            case 8:
                e = i(e, u([0, n.charCodeAt(r + 7)], 56));
            case 7:
                e = i(e, u([0, n.charCodeAt(r + 6)], 48));
            case 6:
                e = i(e, u([0, n.charCodeAt(r + 5)], 40));
            case 5:
                e = i(e, u([0, n.charCodeAt(r + 4)], 32));
            case 4:
                e = i(e, u([0, n.charCodeAt(r + 3)], 24));
            case 3:
                e = i(e, u([0, n.charCodeAt(r + 2)], 16));
            case 2:
                e = i(e, u([0, n.charCodeAt(r + 1)], 8));
            case 1:
                e = f(e = i(e, [0, n.charCodeAt(r)]), c);
                s = i(s, e = f(e = a(e, 31), v))
        }
        return s = l(s = i(s, [0, n.length]), h = i(h, [0, n.length])), h = l(h, s), s = l(s = wt(s), h = wt(h)), h = l(h, s), ("00000000" + (s[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (s[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h[1] >>> 0).toString(16)).slice(-8)
    }

    function it(n) {
        return parseInt(n)
    }

    function e(n) {
        return parseFloat(n)
    }

    function c(n, t) {
        return "number" == typeof n && isNaN(n) ? t : n
    }

    function o(n) {
        return n.reduce(function(n, t) {
            return n + (t ? 1 : 0)
        }, 0)
    }

    function kt(n, t) {
        if (void 0 === t && (t = 1), Math.abs(t) >= 1) return Math.round(n / t) * t;
        var i = 1 / t;
        return Math.round(n * i) / i
    }

    function dt(n) {
        return n && "object" == typeof n && "message" in n ? n : {
            message: n
        }
    }

    function gt(n) {
        return "function" != typeof n
    }

    function ni(n, t, i) {
        var r = Object.keys(n).filter(function(n) {
                return ! function(n, t) {
                    for (var i = 0, r = n.length; i < r; ++i)
                        if (n[i] === t) return !0;
                    return !1
                }(i, n)
            }),
            u = pt(r, function(i) {
                return function(n, t) {
                    var i = new Promise(function(i) {
                        var r = Date.now();
                        yt(n.bind(null, t), function() {
                            for (var u, f, n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
                            if (u = Date.now() - r, !n[0]) return i(function() {
                                return {
                                    error: dt(n[1]),
                                    duration: u
                                }
                            });
                            if (f = n[1], gt(f)) return i(function() {
                                return {
                                    value: f,
                                    duration: u
                                }
                            });
                            i(function() {
                                return new Promise(function(n) {
                                    var t = Date.now();
                                    yt(f, function() {
                                        for (var f, i = [], r = 0; r < arguments.length; r++) i[r] = arguments[r];
                                        if (f = u + Date.now() - t, !i[0]) return n({
                                            error: dt(i[1]),
                                            duration: f
                                        });
                                        n({
                                            value: i[1],
                                            duration: f
                                        })
                                    })
                                })
                            })
                        })
                    });
                    return b(i),
                        function() {
                            return i.then(function(n) {
                                return n()
                            })
                        }
                }(n[i], t)
            });
        return b(u),
            function() {
                return s(this, void 0, void 0, function() {
                    var i, f, t, n;
                    return h(this, function(e) {
                        switch (e.label) {
                            case 0:
                                return [4, u];
                            case 1:
                                return [4, pt(e.sent(), function(n) {
                                    var t = n();
                                    return b(t), t
                                })];
                            case 2:
                                return i = e.sent(), [4, Promise.all(i)];
                            case 3:
                                for (f = e.sent(), t = {}, n = 0; n < r.length; ++n) t[r[n]] = f[n];
                                return [2, t]
                        }
                    })
                })
            }
    }

    function rt() {
        var n = window,
            t = navigator;
        return o(["MSCSSMatrix" in n, "msSetImmediate" in n, "msIndexedDB" in n, "msMaxTouchPoints" in t, "msPointerEnabled" in t]) >= 4
    }

    function ti() {
        var n = window,
            t = navigator;
        return o(["msWriteProfilerMark" in n, "MSStream" in n, "msLaunchUri" in t, "msSaveBlob" in t]) >= 3 && !rt()
    }

    function d() {
        var n = window,
            t = navigator;
        return o(["webkitPersistentStorage" in t, "webkitTemporaryStorage" in t, 0 === t.vendor.indexOf("Google"), "webkitResolveLocalFileSystemURL" in n, "BatteryManager" in n, "webkitMediaStream" in n, "webkitSpeechGrammar" in n]) >= 5
    }

    function v() {
        var n = window,
            t = navigator;
        return o(["ApplePayError" in n, "CSSPrimitiveValue" in n, "Counter" in n, 0 === t.vendor.indexOf("Apple"), "getStorageUpdates" in t, "WebKitMediaKeys" in n]) >= 4
    }

    function g() {
        var n = window;
        return o(["safari" in n, !("DeviceMotionEvent" in n), !("ongestureend" in n), !("standalone" in navigator)]) >= 3
    }

    function ii() {
        var t, i, n = window;
        return o(["buildID" in navigator, "MozAppearance" in (null !== (i = null === (t = document.documentElement) || void 0 === t ? void 0 : t.style) && void 0 !== i ? i : {}), "onmozfullscreenchange" in n, "mozInnerScreenX" in n, "CSSMozDocumentRule" in n, "CanvasCaptureMediaStream" in n]) >= 4
    }

    function ri() {
        var n = document;
        return n.fullscreenElement || n.msFullscreenElement || n.mozFullScreenElement || n.webkitFullscreenElement || null
    }

    function ut() {
        var t = d(),
            i = ii(),
            n;
        return !t && !i ? !1 : (n = window, o(["onorientationchange" in n, "orientation" in n, t && !("SharedWorker" in n), i && /android/i.test(navigator.appVersion)]) >= 2)
    }

    function ui(n) {
        var t = new Error(n);
        return t.name = n, t
    }

    function ft(n, t, i) {
        var r, u, f;
        return void 0 === i && (i = 50), s(this, void 0, void 0, function() {
            var o, e;
            return h(this, function(s) {
                switch (s.label) {
                    case 0:
                        o = document;
                        s.label = 1;
                    case 1:
                        return o.body ? [3, 3] : [4, w(i)];
                    case 2:
                        return s.sent(), [3, 1];
                    case 3:
                        e = o.createElement("iframe");
                        s.label = 4;
                    case 4:
                        return s.trys.push([4, , 10, 11]), [4, new Promise(function(n, i) {
                            var u = !1,
                                s = function() {
                                    u = !0;
                                    n()
                                },
                                r, f;
                            e.onload = s;
                            e.onerror = function(n) {
                                u = !0;
                                i(n)
                            };
                            r = e.style;
                            r.setProperty("display", "block", "important");
                            r.position = "absolute";
                            r.top = "0";
                            r.left = "0";
                            r.visibility = "hidden";
                            t && "srcdoc" in e ? e.srcdoc = t : e.src = "about:blank";
                            o.body.appendChild(e);
                            f = function() {
                                var n, t;
                                u || ("complete" === (null === (t = null === (n = e.contentWindow) || void 0 === n ? void 0 : n.document) || void 0 === t ? void 0 : t.readyState) ? s() : setTimeout(f, 10))
                            };
                            f()
                        })];
                    case 5:
                        s.sent();
                        s.label = 6;
                    case 6:
                        return (null === (u = null === (r = e.contentWindow) || void 0 === r ? void 0 : r.document) || void 0 === u ? void 0 : u.body) ? [3, 8] : [4, w(i)];
                    case 7:
                        return s.sent(), [3, 6];
                    case 8:
                        return [4, n(e, e.contentWindow)];
                    case 9:
                        return [2, s.sent()];
                    case 10:
                        return null === (f = e.parentNode) || void 0 === f || f.removeChild(e), [7];
                    case 11:
                        return [2]
                }
            })
        })
    }

    function pi(n) {
        for (var t, u, f = function(n) {
                for (var o, t, i, u, f, s = "Unexpected syntax '".concat(n, "'"), h = /^\s*([a-z-]*)(.*)$/i.exec(n), c = h[1] || void 0, r = {}, l = /([.:#][\w-]+|\[.+?\])/gi, e = function(n, t) {
                        r[n] = r[n] || [];
                        r[n].push(t)
                    };;) {
                    if (o = l.exec(h[2]), !o) break;
                    t = o[0];
                    switch (t[0]) {
                        case ".":
                            e("class", t.slice(1));
                            break;
                        case "#":
                            e("id", t.slice(1));
                            break;
                        case "[":
                            if (i = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(t), !i) throw new Error(s);
                            e(i[1], null !== (f = null !== (u = i[4]) && void 0 !== u ? u : i[5]) && void 0 !== f ? f : "");
                            break;
                        default:
                            throw new Error(s);
                    }
                }
                return [c, r]
            }(n), e = f[0], o = f[1], i = document.createElement(null != e ? e : "div"), r = 0, s = Object.keys(o); r < s.length; r++) t = s[r], u = o[t].join(" "), "style" === t ? wi(i.style, u) : i.setAttribute(t, u);
        return i
    }

    function wi(n, t) {
        for (var f, i, r = 0, u = t.split(";"); r < u.length; r++)
            if (f = u[r], i = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(f), i) {
                var e = i[1],
                    o = i[2],
                    s = i[4];
                n.setProperty(e, o, s || "")
            }
    }

    function et(n) {
        return n.toDataURL()
    }

    function ei() {
        var n = this;
        return function() {
                if (void 0 === ot) {
                    var n = function() {
                        var t = st();
                        ht(t) ? ot = setTimeout(n, 2500) : (nt = t, ot = void 0)
                    };
                    n()
                }
            }(),
            function() {
                return s(n, void 0, void 0, function() {
                    var n;
                    return h(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return ht(n = st()) ? nt ? [2, vt([], nt, !0)] : ri() ? [4, (i = document, (i.exitFullscreen || i.msExitFullscreen || i.mozCancelFullScreen || i.webkitExitFullscreen).call(i))] : [3, 2] : [3, 2];
                            case 1:
                                t.sent();
                                n = st();
                                t.label = 2;
                            case 2:
                                return ht(n) || (nt = n), [2, n]
                        }
                        var i
                    })
                })
            }
    }

    function st() {
        var n = screen;
        return [c(e(n.availTop), null), c(e(n.width) - e(n.availWidth) - c(e(n.availLeft), 0), null), c(e(n.height) - e(n.availHeight) - c(e(n.availTop), 0), null), c(e(n.availLeft), null)]
    }

    function ht(n) {
        for (var t = 0; t < 4; ++t)
            if (n[t]) return !1;
        return !0
    }

    function bi(n) {
        var t;
        return s(this, void 0, void 0, function() {
            var u, r, e, o, f, s, i;
            return h(this, function(h) {
                switch (h.label) {
                    case 0:
                        for (u = document, r = u.createElement("div"), e = new Array(n.length), o = {}, oi(r), i = 0; i < n.length; ++i) "DIALOG" === (f = pi(n[i])).tagName && f.show(), oi(s = u.createElement("div")), s.appendChild(f), r.appendChild(s), e[i] = f;
                        h.label = 1;
                    case 1:
                        return u.body ? [3, 3] : [4, w(50)];
                    case 2:
                        return h.sent(), [3, 1];
                    case 3:
                        u.body.appendChild(r);
                        try {
                            for (i = 0; i < n.length; ++i) e[i].offsetParent || (o[n[i]] = !0)
                        } finally {
                            null === (t = r.parentNode) || void 0 === t || t.removeChild(r)
                        }
                        return [2, o]
                }
            })
        })
    }

    function oi(n) {
        n.style.setProperty("display", "block", "important")
    }

    function si(n) {
        return matchMedia("(inverted-colors: ".concat(n, ")")).matches
    }

    function hi(n) {
        return matchMedia("(forced-colors: ".concat(n, ")")).matches
    }

    function p(n) {
        return matchMedia("(prefers-contrast: ".concat(n, ")")).matches
    }

    function ci(n) {
        return matchMedia("(prefers-reduced-motion: ".concat(n, ")")).matches
    }

    function li(n) {
        return matchMedia("(dynamic-range: ".concat(n, ")")).matches
    }

    function ki(n) {
        var t = function(n) {
                if (ut()) return .4;
                if (v()) return g() ? .5 : .3;
                var t = n.platform.value || "";
                return /^Win/.test(t) ? .6 : /^Mac/.test(t) ? .5 : .7
            }(n),
            i = function(n) {
                return kt(.99 + .01 * n, .0001)
            }(t);
        return {
            score: t,
            comment: "$ if upgrade to Pro: https://fpjs.dev/pro".replace(/\$/g, "".concat(i))
        }
    }

    function lt(n) {
        return JSON.stringify(n, function(n, t) {
            return t instanceof Error ? tt({
                name: (i = t).name,
                message: i.message,
                stack: null === (r = i.stack) || void 0 === r ? void 0 : r.split("\n")
            }, i) : t;
            var i, r
        }, 2)
    }

    function at(n) {
        return bt(function(n) {
            for (var t = "", i = 0, r = Object.keys(n).sort(); i < r.length; i++) {
                var u = r[i],
                    f = n[u],
                    e = f.error ? "error" : JSON.stringify(f.value);
                t += "".concat(t ? "|" : "").concat(u.replace(/([:|\\])/g, "\\$1"), ":").concat(e)
            }
            return t
        }(n))
    }

    function vi(n) {
        return void 0 === n && (n = 50),
            function(n, t) {
                void 0 === t && (t = 1 / 0);
                var i = window.requestIdleCallback;
                return i ? new Promise(function(n) {
                    return i.call(window, function() {
                        return n()
                    }, {
                        timeout: t
                    })
                }) : w(Math.min(n, t))
            }(n, 2 * n)
    }

    function di(n, t) {
        var i = Date.now();
        return {
            get: function(r) {
                return s(this, void 0, void 0, function() {
                    var e, f, u;
                    return h(this, function(o) {
                        switch (o.label) {
                            case 0:
                                return e = Date.now(), [4, n()];
                            case 1:
                                return f = o.sent(), u = function(n) {
                                    var t;
                                    return {
                                        get visitorId() {
                                            return void 0 === t && (t = at(this.components)), t
                                        },
                                        set visitorId(n) {
                                            t = n
                                        },
                                        confidence: ki(n),
                                        components: n,
                                        version: "3.4.2"
                                    }
                                }(f), (t || (null == r ? void 0 : r.debug)) && console.log("Copy the text below to get the debug data:\n\n```\nversion: ".concat(u.version, "\nuserAgent: ").concat(navigator.userAgent, "\ntimeBetweenLoadAndGet: ").concat(e - i, "\nvisitorId: ").concat(u.visitorId, "\ncomponents: ").concat(lt(f), "\n```")), [2, u]
                        }
                    })
                })
            }
        }
    }

    function yi(n) {
        var t = void 0 === n ? {} : n,
            r = t.delayFallback,
            i = t.debug;
        return t.monitoring, s(this, void 0, void 0, function() {
            return h(this, function(n) {
                switch (n.label) {
                    case 0:
                        return [4, vi(r)];
                    case 1:
                        return n.sent(), [2, di(ni(ai, {
                            debug: i
                        }, []), i)]
                }
            })
        })
    }
    var tt = function() {
            return tt = Object.assign || function(n) {
                for (var r, i, t = 1, u = arguments.length; t < u; t++)
                    for (i in r = arguments[t]) Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
                return n
            }, tt.apply(this, arguments)
        },
        y = ["monospace", "sans-serif", "serif"],
        fi = ["sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF"],
        nt, ot, t = Math,
        r = function() {
            return 0
        },
        ct = {
            "default": [],
            apple: [{
                font: "-apple-system-body"
            }],
            serif: [{
                fontFamily: "serif"
            }],
            sans: [{
                fontFamily: "sans-serif"
            }],
            mono: [{
                fontFamily: "monospace"
            }],
            min: [{
                fontSize: "1px"
            }],
            system: [{
                fontFamily: "system-ui"
            }]
        },
        ai = {
            fonts: function() {
                return ft(function(n, t) {
                    var r = t.document,
                        u = r.body,
                        i;
                    u.style.fontSize = "48px";
                    var f = r.createElement("div"),
                        e = {},
                        o = {},
                        s = function(n) {
                            var t = r.createElement("span"),
                                i = t.style;
                            return i.position = "absolute", i.top = "0", i.left = "0", i.fontFamily = n, t.textContent = "mmMwWLliI0O&1", f.appendChild(t), t
                        },
                        h = y.map(s),
                        c = function() {
                            for (var t = {}, r = function(n) {
                                    t[n] = y.map(function(t) {
                                        return function(n, t) {
                                            return s("'".concat(n, "',").concat(t))
                                        }(n, t)
                                    })
                                }, n = 0, i = fi; n < i.length; n++) r(i[n]);
                            return t
                        }();
                    for (u.appendChild(f), i = 0; i < y.length; i++) e[y[i]] = h[i].offsetWidth, o[y[i]] = h[i].offsetHeight;
                    return fi.filter(function(n) {
                        return t = c[n], y.some(function(n, i) {
                            return t[i].offsetWidth !== e[n] || t[i].offsetHeight !== o[n]
                        });
                        var t
                    })
                })
            },
            domBlockers: function(n) {
                var t = (void 0 === n ? {} : n).debug;
                return s(this, void 0, void 0, function() {
                    var n, i, r, u, f;
                    return h(this, function(e) {
                        switch (e.label) {
                            case 0:
                                return v() || ut() ? (s = atob, n = {
                                    abpIndo: ["#Iklan-Melayang", "#Kolom-Iklan-728", "#SidebarIklan-wrapper", '[title="ALIENBOLA" i]', s("I0JveC1CYW5uZXItYWRz")],
                                    abpvn: [".quangcao", "#mobileCatfish", s("LmNsb3NlLWFkcw=="), '[id^="bn_bottom_fixed_"]', "#pmadv"],
                                    adBlockFinland: [".mainostila", s("LnNwb25zb3JpdA=="), ".ylamainos", s("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"), s("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd")],
                                    adBlockPersian: ["#navbar_notice_50", ".kadr", 'TABLE[width="140px"]', "#divAgahi", s("YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd")],
                                    adBlockWarningRemoval: ["#adblock-honeypot", ".adblocker-root", ".wp_adblock_detect", s("LmhlYWRlci1ibG9ja2VkLWFk"), s("I2FkX2Jsb2NrZXI=")],
                                    adGuardAnnoyances: [".hs-sosyal", "#cookieconsentdiv", 'div[class^="app_gdpr"]', ".as-oil", '[data-cypress="soft-push-notification-piggy_modal"]'],
                                    adGuardBase: [".BetterJsPopOverlay", s("I2FkXzMwMFgyNTA="), s("I2Jhbm5lcmZsb2F0MjI="), s("I2NhbXBhaWduLWJhbm5lcg=="), s("I0FkLUNvbnRlbnQ=")],
                                    adGuardChinese: [s("LlppX2FkX2FfSA=="), s("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"), "#widget-quan", s("YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd"), s("YVtocmVmKj0iLjE5NTZobC5jb20vIl0=")],
                                    adGuardFrench: ["#pavePub", s("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"), ".mobile_adhesion", ".widgetadv", s("LmFkc19iYW4=")],
                                    adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
                                    adGuardJapanese: ["#kauli_yad_1", s("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="), s("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="), s("LmFkZ29vZ2xl"), s("Ll9faXNib29zdFJldHVybkFk")],
                                    adGuardMobile: [s("YW1wLWF1dG8tYWRz"), s("LmFtcF9hZA=="), 'amp-embed[type="24smi"]', "#mgid_iframe1", s("I2FkX2ludmlld19hcmVh")],
                                    adGuardRussian: [s("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="), s("LnJlY2xhbWE="), 'div[id^="smi2adblock"]', s("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"), "#psyduckpockeball"],
                                    adGuardSocial: [s("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="), s("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="), ".etsy-tweet", "#inlineShare", ".popup-social"],
                                    adGuardSpanishPortuguese: ["#barraPublicidade", "#Publicidade", "#publiEspecial", "#queTooltip", ".cnt-publi"],
                                    adGuardTrackingProtection: ["#qoo-counter", s("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="), s("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="), s("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="), "#top100counter"],
                                    adGuardTurkish: ["#backkapat", s("I3Jla2xhbWk="), s("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="), s("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"), s("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ==")],
                                    bulgarian: [s("dGQjZnJlZW5ldF90YWJsZV9hZHM="), "#ea_intext_div", ".lapni-pop-over", "#xenium_hot_offers"],
                                    easyList: [".yb-floorad", s("LndpZGdldF9wb19hZHNfd2lkZ2V0"), s("LnRyYWZmaWNqdW5reS1hZA=="), ".textad_headline", s("LnNwb25zb3JlZC10ZXh0LWxpbmtz")],
                                    easyListChina: [s("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="), s("LmZyb250cGFnZUFkdk0="), "#taotaole", "#aafoot.top_box", ".cfa_popup"],
                                    easyListCookie: [".ezmob-footer", ".cc-CookieWarning", "[data-cookie-number]", s("LmF3LWNvb2tpZS1iYW5uZXI="), ".sygnal24-gdpr-piggy_modal-wrap"],
                                    easyListCzechSlovak: ["#onlajny-stickers", s("I3Jla2xhbW5pLWJveA=="), s("LnJla2xhbWEtbWVnYWJvYXJk"), ".sklik", s("W2lkXj0ic2tsaWtSZWtsYW1hIl0=")],
                                    easyListDutch: [s("I2FkdmVydGVudGll"), s("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="), ".adstekst", s("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="), "#semilo-lrectangle"],
                                    easyListGermany: ["#SSpotIMPopSlider", s("LnNwb25zb3JsaW5rZ3J1ZW4="), s("I3dlcmJ1bmdza3k="), s("I3Jla2xhbWUtcmVjaHRzLW1pdHRl"), s("YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0=")],
                                    easyListItaly: [s("LmJveF9hZHZfYW5udW5jaQ=="), ".sb-box-pubbliredazionale", s("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"), s("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"), s("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ==")],
                                    easyListLithuania: [s("LnJla2xhbW9zX3RhcnBhcw=="), s("LnJla2xhbW9zX251b3JvZG9z"), s("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"), s("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"), s("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd")],
                                    estonian: [s("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],
                                    fanboyAnnoyances: ["#ac-lre-player", ".navigate-to-top", "#subscribe_popup", ".newsletter_holder", "#back-top"],
                                    fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
                                    fanboyEnhancedTrackers: [".open.pushpiggy_modal", "#issuem-leaky-paywall-articles-zero-remaining-nag", "#sovrn_container", 'div[class$="-hide"][zoompage-fontsize][style="display: block;"]', ".BlockNag__Card"],
                                    fanboySocial: ["#FollowUs", "#meteored_share", "#social_follow", ".article-sharer", ".community__social-desc"],
                                    frellwitSwedish: [s("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="), s("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="), "article.category-samarbete", s("ZGl2LmhvbGlkQWRz"), "ul.adsmodern"],
                                    greekAdBlock: [s("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"), s("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="), s("QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd"), "DIV.agores300", "TABLE.advright"],
                                    hungarian: ["#cemp_doboz", ".optimonk-iframe-container", s("LmFkX19tYWlu"), s("W2NsYXNzKj0iR29vZ2xlQWRzIl0="), "#hirdetesek_box"],
                                    iDontCareAboutCookies: ['.alert-info[data-block-track*="CookieNotice"]', ".ModuleTemplateCookieIndicator", ".o--cookies--container", "#cookies-policy-sticky", "#stickyCookieBar"],
                                    icelandicAbp: [s("QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==")],
                                    latvian: [s("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0="), s("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==")],
                                    listKr: [s("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="), s("I2xpdmVyZUFkV3JhcHBlcg=="), s("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="), s("aW5zLmZhc3R2aWV3LWFk"), ".revenue_unit_item.dable"],
                                    listeAr: [s("LmdlbWluaUxCMUFk"), ".right-and-left-sponsers", s("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="), s("YVtocmVmKj0iYm9vcmFxLm9yZyJd"), s("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd")],
                                    listeFr: [s("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="), s("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="), s("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="), ".site-pub-interstitiel", 'div[id^="crt-"][data-criteo-id]'],
                                    officialPolish: ["#ceneo-placeholder-ceneo-12", s("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"), s("YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=="), s("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="), s("ZGl2I3NrYXBpZWNfYWQ=")],
                                    ro: [s("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"), s("YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd"), s("YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0="), s("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd"), 'a[href^="/url/"]'],
                                    ruAd: [s("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"), s("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="), s("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="), "#pgeldiz", ".yandex-rtb-block"],
                                    thaiAds: ["a[href*=macau-uta-popup]", s("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="), s("LmFkczMwMHM="), ".bumq", ".img-kosana"],
                                    webAnnoyancesUltralist: ["#mod-social-share-2", "#social-tools", s("LmN0cGwtZnVsbGJhbm5lcg=="), ".zergnet-recommend", ".yt.btn-link.btn-md.btn"]
                                }, i = Object.keys(n), [4, bi((f = []).concat.apply(f, i.map(function(t) {
                                    return n[t]
                                })))]) : [2, void 0];
                            case 1:
                                return r = e.sent(), t && function(n, t) {
                                    for (var f, i, e, o, r = "DOM blockers debug:\n```", u = 0, s = Object.keys(n); u < s.length; u++)
                                        for (f = s[u], r += "\n".concat(f, ":"), i = 0, e = n[f]; i < e.length; i++) o = e[i], r += "\n  ".concat(t[o] ? "🚫" : "➡️", " ").concat(o);
                                    console.log("".concat(r, "\n```"))
                                }(n, r), (u = i.filter(function(t) {
                                    var i = n[t];
                                    return o(i.map(function(n) {
                                        return r[n]
                                    })) > .6 * i.length
                                })).sort(), [2, u]
                        }
                        var s
                    })
                })
            },
            fontPreferences: function() {
                return function(n, t) {
                    return void 0 === t && (t = 4e3), ft(function(i, r) {
                        var f = r.document,
                            u = f.body,
                            e = u.style,
                            o;
                        return e.width = "".concat(t, "px"), e.webkitTextSizeAdjust = e.textSizeAdjust = "none", d() ? u.style.zoom = "".concat(1 / r.devicePixelRatio) : v() && (u.style.zoom = "reset"), o = f.createElement("div"), o.textContent = vt([], Array(t / 20 << 0), !0).map(function() {
                            return "word"
                        }).join(" "), u.appendChild(o), n(f, u)
                    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">')
                }(function(n, t) {
                    for (var u, o, s, h, f, c, l = {}, a = {}, e = 0, v = Object.keys(ct); e < v.length; e++) {
                        var r = v[e],
                            y = ct[r],
                            p = y[0],
                            w = void 0 === p ? {} : p,
                            b = y[1],
                            k = void 0 === b ? "mmMwWLliI0fiflO&1" : b,
                            i = n.createElement("span");
                        for (i.textContent = k, i.style.whiteSpace = "nowrap", u = 0, o = Object.keys(w); u < o.length; u++) s = o[u], h = w[s], void 0 !== h && (i.style[s] = h);
                        l[r] = i;
                        t.appendChild(n.createElement("br"));
                        t.appendChild(i)
                    }
                    for (f = 0, c = Object.keys(ct); f < c.length; f++) a[r = c[f]] = l[r].getBoundingClientRect().width;
                    return a
                })
            },
            audio: function() {
                var r = window,
                    u = r.OfflineAudioContext || r.webkitOfflineAudioContext,
                    t, i, n;
                if (!u) return -2;
                if (v() && !g() && ! function() {
                        var n = window;
                        return o(["DOMRectList" in n, "RTCPeerConnectionIceEvent" in n, "SVGGeometryElement" in n, "ontransitioncancel" in n]) >= 3
                    }()) return -1;
                t = new u(1, 5e3, 44100);
                i = t.createOscillator();
                i.type = "triangle";
                i.frequency.value = 1e4;
                n = t.createDynamicsCompressor();
                n.threshold.value = -50;
                n.knee.value = 40;
                n.ratio.value = 12;
                n.attack.value = 0;
                n.release.value = .25;
                i.connect(n);
                n.connect(t.destination);
                i.start(0);
                var f = function(n) {
                        var i = 3,
                            r = 500,
                            u = 500,
                            f = 5e3,
                            t = function() {};
                        return [new Promise(function(e, o) {
                            var s = !1,
                                a = 0,
                                h = 0,
                                c, l;
                            n.oncomplete = function(n) {
                                return e(n.renderedBuffer)
                            };
                            c = function() {
                                setTimeout(function() {
                                    return o(ui("timeout"))
                                }, Math.min(u, h + f - Date.now()))
                            };
                            l = function() {
                                try {
                                    var t = n.startRendering();
                                    switch (k(t) && b(t), n.state) {
                                        case "running":
                                            h = Date.now();
                                            s && c();
                                            break;
                                        case "suspended":
                                            document.hidden || a++;
                                            s && a >= i ? o(ui("suspended")) : setTimeout(l, r)
                                    }
                                } catch (u) {
                                    o(u)
                                }
                            };
                            l();
                            t = function() {
                                s || (s = !0, h > 0 && c())
                            }
                        }), t]
                    }(t),
                    s = f[0],
                    h = f[1],
                    e = s.then(function(n) {
                        return function(n) {
                            for (var i = 0, t = 0; t < n.length; ++t) i += Math.abs(n[t]);
                            return i
                        }(n.getChannelData(0).subarray(4500))
                    }, function(n) {
                        if ("timeout" === n.name || "suspended" === n.name) return -3;
                        throw n;
                    });
                return b(e),
                    function() {
                        return h(), e
                    }
            },
            screenFrame: function() {
                var n = this,
                    t = ei();
                return function() {
                    return s(n, void 0, void 0, function() {
                        var n, i;
                        return h(this, function(r) {
                            switch (r.label) {
                                case 0:
                                    return [4, t()];
                                case 1:
                                    return n = r.sent(), [2, [(i = function(n) {
                                        return null === n ? null : kt(n, 10)
                                    })(n[0]), i(n[1]), i(n[2]), i(n[3])]]
                            }
                        })
                    })
                }
            },
            osCpu: function() {
                return navigator.oscpu
            },
            languages: function() {
                var t, n = navigator,
                    i = [],
                    u = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage,
                    r;
                return (void 0 !== u && i.push([u]), Array.isArray(n.languages)) ? d() && o([!("MediaSettingsRange" in (t = window)), "RTCEncodedAudioFrame" in t, "" + t.Intl == "[object Intl]", "" + t.Reflect == "[object Reflect]"]) >= 3 || i.push(n.languages) : "string" == typeof n.languages && (r = n.languages, r && i.push(r.split(","))), i
            },
            colorDepth: function() {
                return window.screen.colorDepth
            },
            deviceMemory: function() {
                return c(e(navigator.deviceMemory), void 0)
            },
            screenResolution: function() {
                var n = screen,
                    t = function(n) {
                        return c(it(n), null)
                    },
                    i = [t(n.width), t(n.height)];
                return i.sort().reverse(), i
            },
            hardwareConcurrency: function() {
                return c(it(navigator.hardwareConcurrency), void 0)
            },
            timezone: function() {
                var n, u = null === (n = window.Intl) || void 0 === n ? void 0 : n.DateTimeFormat,
                    t, i, r;
                return u && (t = (new u).resolvedOptions().timeZone, t) ? t : (r = (i = (new Date).getFullYear(), -Math.max(e(new Date(i, 0, 1).getTimezoneOffset()), e(new Date(i, 6, 1).getTimezoneOffset()))), "UTC".concat(r >= 0 ? "+" : "").concat(Math.abs(r)))
            },
            sessionStorage: function() {
                try {
                    return !!window.sessionStorage
                } catch (n) {
                    return !0
                }
            },
            localStorage: function() {
                try {
                    return !!window.localStorage
                } catch (n) {
                    return !0
                }
            },
            indexedDB: function() {
                if (!rt() && !ti()) try {
                    return !!window.indexedDB
                } catch (n) {
                    return !0
                }
            },
            openDatabase: function() {
                return !!window.openDatabase
            },
            cpuClass: function() {
                return navigator.cpuClass
            },
            platform: function() {
                var n = navigator.platform;
                return "MacIntel" === n && v() && !g() ? function() {
                    if ("iPad" === navigator.platform) return !0;
                    var n = screen,
                        t = n.width / n.height;
                    return o(["MediaSource" in window, !!Element.prototype.webkitRequestFullscreen, t > .65 && t < 1.53]) >= 2
                }() ? "iPad" : "iPhone" : n
            },
            plugins: function() {
                var r = navigator.plugins,
                    u, t, n, f, i, e;
                if (r) {
                    for (u = [], t = 0; t < r.length; ++t)
                        if (n = r[t], n) {
                            for (f = [], i = 0; i < n.length; ++i) e = n[i], f.push({
                                type: e.type,
                                suffixes: e.suffixes
                            });
                            u.push({
                                name: n.name,
                                description: n.description,
                                mimeTypes: f
                            })
                        }
                    return u
                }
            },
            canvas: function() {
                var t, i, f = !1,
                    e = function() {
                        var n = document.createElement("canvas");
                        return n.width = 1, n.height = 1, [n, n.getContext("2d")]
                    }(),
                    n = e[0],
                    r = e[1],
                    u;
                return function(n, t) {
                    return !(!t || !n.toDataURL)
                }(n, r) ? (f = function(n) {
                    return n.rect(0, 0, 10, 10), n.rect(2, 2, 6, 6), !n.isPointInPath(5, 5, "evenodd")
                }(r), function(n, t) {
                    n.width = 240;
                    n.height = 60;
                    t.textBaseline = "alphabetic";
                    t.fillStyle = "#f60";
                    t.fillRect(100, 1, 62, 20);
                    t.fillStyle = "#069";
                    t.font = '11pt "Times New Roman"';
                    var i = "Cwm fjordbank gly ".concat(String.fromCharCode(55357, 56835));
                    t.fillText(i, 2, 15);
                    t.fillStyle = "rgba(102, 204, 0, 0.2)";
                    t.font = "18pt Arial";
                    t.fillText(i, 4, 45)
                }(n, r), u = et(n), u !== et(n) ? t = i = "unstable" : (i = u, function(n, t) {
                    var i, r;
                    for (n.width = 122, n.height = 110, t.globalCompositeOperation = "multiply", i = 0, r = [
                            ["#f2f", 40, 40],
                            ["#2ff", 80, 40],
                            ["#ff2", 60, 80]
                        ]; i < r.length; i++) {
                        var u = r[i],
                            f = u[0],
                            e = u[1],
                            o = u[2];
                        t.fillStyle = f;
                        t.beginPath();
                        t.arc(e, o, 40, 0, 2 * Math.PI, !0);
                        t.closePath();
                        t.fill()
                    }
                    t.fillStyle = "#f9c";
                    t.arc(60, 60, 60, 0, 2 * Math.PI, !0);
                    t.arc(60, 60, 20, 0, 2 * Math.PI, !0);
                    t.fill("evenodd")
                }(n, r), t = et(n))) : t = i = "", {
                    winding: f,
                    geometry: t,
                    text: i
                }
            },
            touchSupport: function() {
                var t, n = navigator,
                    i = 0;
                void 0 !== n.maxTouchPoints ? i = it(n.maxTouchPoints) : void 0 !== n.msMaxTouchPoints && (i = n.msMaxTouchPoints);
                try {
                    document.createEvent("TouchEvent");
                    t = !0
                } catch (r) {
                    t = !1
                }
                return {
                    maxTouchPoints: i,
                    touchEvent: t,
                    touchStart: "ontouchstart" in window
                }
            },
            vendor: function() {
                return navigator.vendor || ""
            },
            vendorFlavors: function() {
                for (var t, i, r = [], n = 0, u = ["chrome", "safari", "__crWeb", "__gCrWeb", "yandex", "__yb", "__ybro", "__firefox__", "__edgeTrackingPreventionStatistics", "webkit", "oprt", "samsungAr", "ucweb", "UCShellJava", "puffinDevice"]; n < u.length; n++) t = u[n], i = window[t], i && "object" == typeof i && r.push(t);
                return r.sort()
            },
            cookiesEnabled: function() {
                var n = document,
                    t;
                try {
                    return n.cookie = "cookietest=1; SameSite=Strict;", t = -1 !== n.cookie.indexOf("cookietest="), n.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT", t
                } catch (i) {
                    return !1
                }
            },
            colorGamut: function() {
                for (var i, n = 0, t = ["rec2020", "p3", "srgb"]; n < t.length; n++)
                    if (i = t[n], matchMedia("(color-gamut: ".concat(i, ")")).matches) return i
            },
            invertedColors: function() {
                return !!si("inverted") || !si("none") && void 0
            },
            forcedColors: function() {
                return !!hi("active") || !hi("none") && void 0
            },
            monochrome: function() {
                if (matchMedia("(min-monochrome: 0)").matches) {
                    for (var n = 0; n <= 100; ++n)
                        if (matchMedia("(max-monochrome: ".concat(n, ")")).matches) return n;
                    throw new Error("Too high value");
                }
            },
            contrast: function() {
                return p("no-preference") ? 0 : p("high") || p("more") ? 1 : p("low") || p("less") ? -1 : p("forced") ? 10 : void 0
            },
            reducedMotion: function() {
                return !!ci("reduce") || !ci("no-preference") && void 0
            },
            hdr: function() {
                return !!li("high") || !li("standard") && void 0
            },
            math: function() {
                var n, i = t.acos || r,
                    u = t.acosh || r,
                    f = t.asin || r,
                    e = t.asinh || r,
                    o = t.atanh || r,
                    s = t.atan || r,
                    h = t.sin || r,
                    c = t.sinh || r,
                    l = t.cos || r,
                    a = t.cosh || r,
                    v = t.tan || r,
                    y = t.tanh || r,
                    p = t.exp || r,
                    w = t.expm1 || r,
                    b = t.log1p || r;
                return {
                    acos: i(.12312423423423424),
                    acosh: u(1e308),
                    acoshPf: (n = 1e154, t.log(n + t.sqrt(n * n - 1))),
                    asin: f(.12312423423423424),
                    asinh: e(1),
                    asinhPf: function(n) {
                        return t.log(n + t.sqrt(n * n + 1))
                    }(1),
                    atanh: o(.5),
                    atanhPf: function(n) {
                        return t.log((1 + n) / (1 - n)) / 2
                    }(.5),
                    atan: s(.5),
                    sin: h(-1e300),
                    sinh: c(1),
                    sinhPf: function(n) {
                        return t.exp(n) - 1 / t.exp(n) / 2
                    }(1),
                    cos: l(10.000000000123),
                    cosh: a(1),
                    coshPf: function(n) {
                        return (t.exp(n) + 1 / t.exp(n)) / 2
                    }(1),
                    tan: v(-1e300),
                    tanh: y(1),
                    tanhPf: function(n) {
                        return (t.exp(2 * n) - 1) / (t.exp(2 * n) + 1)
                    }(1),
                    exp: p(1),
                    expm1: w(1),
                    expm1Pf: function(n) {
                        return t.exp(n) - 1
                    }(1),
                    log1p: b(10),
                    log1pPf: function(n) {
                        return t.log(1 + n)
                    }(10),
                    powPI: function(n) {
                        return t.pow(t.PI, n)
                    }(-100)
                }
            },
            videoCard: function() {
                var i, r = document.createElement("canvas"),
                    n = null !== (i = r.getContext("webgl")) && void 0 !== i ? i : r.getContext("experimental-webgl"),
                    t;
                if (n && "getExtension" in n && (t = n.getExtension("WEBGL_debug_renderer_info"), t)) return {
                    vendor: (n.getParameter(t.UNMASKED_VENDOR_WEBGL) || "").toString(),
                    renderer: (n.getParameter(t.UNMASKED_RENDERER_WEBGL) || "").toString()
                }
            },
            pdfViewerEnabled: function() {
                return navigator.pdfViewerEnabled
            },
            architecture: function() {
                var n = new Float32Array(1),
                    t = new Uint8Array(n.buffer);
                return n[0] = 1 / 0, n[0] = n[0] - n[0], t[3]
            }
        },
        gi = {
            load: yi,
            hashComponents: at,
            componentsToDebugString: lt
        },
        nr = bt;
    return n.componentsToDebugString = lt, n.default = gi, n.getFullscreenElement = ri, n.getScreenFrame = ei, n.hashComponents = at, n.isAndroid = ut, n.isChromium = d, n.isDesktopSafari = g, n.isEdgeHTML = ti, n.isGecko = ii, n.isTrident = rt, n.isWebKit = v, n.load = yi, n.loadSources = ni, n.murmurX64Hash128 = nr, n.prepareForSources = vi, n.sources = ai, n.transformSource = function(n, t) {
        var i = function(n) {
            return gt(n) ? t(n) : function() {
                var i = n();
                return k(i) ? i.then(t) : t(i)
            }
        };
        return function(t) {
            var r = n(t);
            return k(r) ? r.then(i) : i(r)
        }
    }, n.withIframe = ft, Object.defineProperty(n, "__esModule", {
        value: !0
    }), n
}({});
piggy = {};
piggy.load = function(n, t) {
    function s(n) {
        if (window.localStorage) {
            let i = localStorage.getItem(n);
            if (i) {
                var t = CryptoJS.AES.decrypt(i, "a291632468a4c10f");
                return t.toString(CryptoJS.enc.Utf8)
            }
        }
    }

    function h(n, t) {
        window.localStorage && localStorage.setItem(n, CryptoJS.AES.encrypt(t.toString(), "a291632468a4c10f").toString())
    }

    function c(n, t, i, r) {
        var u = new XMLHttpRequest;
        u.open("POST", n, !0);
        u.setRequestHeader("Content-Type", "application/json");
        u.onload = i;
        u.onerror = r;
        u.ontimeout = r;
        u.timeout = 15e3;
        u.send(JSON.stringify(t))
    }

    function a(n) {
        piggy.freeMinutes = 3000, i += 10 * 60, l += 10 * 60
            // if (u) {
            // let t = o + "/block/get_time",
            // r = {
            // ip: piggy.ip,
            // userId: piggy.uid,
            // requestId: f()
            // },
            // e = function(t) {
            // if (t.srcElement.status === 200) {
            // var r = JSON.parse(t.srcElement.responseText);
            // r.result ? (piggy.freeMinutes = r.total, i += r.free * 60, l += r.free * 60) : piggy.freeMinutes = r.total
            // }
            // n(i);
            // u = !0
            // },
            // s = function() {
            // n(i);
            // u = !0
            // };
            // u = !1;
            // c(t, r, e, s)
            // } else n(i)
    }
    var f;
    const o = "https://www.pigtool.fun";
    if (piggy.uid = s("userId"), !piggy.uid) {
        const t = FingerprintJS.load();
        t.then(n => n.get()).then(t => {
            piggy.uid = t.visitorId, h("userId", piggy.uid), typeof piggy.ip != "undefined" && piggy.ip.length > 0 && typeof n != "undefined" && n()
        })
    }(function() {
        // var i = new XMLHttpRequest;
        // i.open("GET", "https://myexternalip.com/raw", !0);
        // i.responseText = '8.8.8.8';
        // console.log(i.responseText);
        // (piggy.ip = i.responseText, piggy.uid && typeof n != "undefined" && n())
        // i.onload = function() {
        // i.status === 200 ? (piggy.ip = i.responseText, piggy.uid && typeof n != "undefined" && n()) : piggy.ip = ""
        // };
        // i.onerror = function() {
        // piggy.ip = "";
        // typeof t != "undefined" && t()
        // };
        // i.ontimeout = function() {
        // piggy.ip = "";
        // typeof t != "undefined" && t()
        // };
        // i.timeout = 3e3;
        // i.send()
    })();
    f = function() {
        var n = 0;
        return function() {
            return n++
        }
    }();
    piggy.freeMinutes = 0;
    var i = 0,
        e = 0,
        l = 0,
        r = 0,
        u = !0;
    const v = () => Math.floor(Date.now() / 1e3);
    piggy.update = n => {
        var u = v(),
            t;
        if (r > 0) {
            if (t = u - r, t < 0) {
                i = 0;
                n(i);
                return
            }
            if (t < 10) {
                n(i - t > 0 ? i - t : 0);
                return
            }
            i > t ? (i -= t, e += t) : i > 0 && (e += i, i = 0);
            r = u
        } else r = u;
        i > 120 ? n(i) : piggy.uid && typeof piggy.ip != "undefined" && piggy.ip !== "" ? a(n) : n(i)
    }
};
class canvas {
    constructor(n, t, i, r) {
        this.ctx = null;
        this.canvas = document.getElementById(n);
        this.backgroundColor = r;
        this.initCanvas(t, i);
        this.width = t;
        this.height = i
    }
    initCanvas(n, t) {
        this.canvas.style.width = n + "px";
        this.canvas.style.height = t + "px";
        const i = window.devicePixelRatio;
        this.canvas.width = Math.floor(n * i);
        this.canvas.height = Math.floor(t * i);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(i, i);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }
    setPosition(n, t, i) {
        this.canvas.style.left = n + "px";
        this.canvas.style.top = t + "px";
        this.canvas.style.zIndex = i
    }
    resize(n, t, i, r, u) {
        this.setPosition(n, t, u);
        this.initCanvas(i, r)
    }
    drawRoundedRect(n, t, i, r, u, f) {
        this.ctx.beginPath();
        this.ctx.moveTo(n + u, t);
        this.ctx.lineTo(n + i - u, t);
        this.ctx.arc(n + i - u, t + u, u, Math.PI / 2, 0);
        this.ctx.lineTo(n + i, t + r - u);
        this.ctx.arc(n + i - u, t + r - u, u, 0, Math.PI / 2);
        this.ctx.lineTo(n + u, t + r);
        this.ctx.arc(n + u, t + r - u, u, Math.PI / 2, Math.PI);
        this.ctx.lineTo(n, t + u);
        this.ctx.arc(n + u, t + u, u, Math.PI, Math.PI / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = f;
        this.ctx.fill()
    }
    isPointInRectangle(n, t, i, r, u, f) {
        let e = n + i - 1,
            o = t + r - 1;
        return u < n || u > e || f < t || f > o ? !1 : !0
    }
    clear(n) {
        this.ctx.fillStyle = n;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }
    set show(n) {
        this.canvas.style.display = n ? "block" : "none"
    }
}
const GAME_INFO = {
    BOARD_SIZE_BLOCK: 9,
    BOARD_BLOCK_SET_WIDTH: 3,
    BOARD_AREA: {
        SIZE: {
            X: 450,
            Y: 450
        }
    },
    ELEMENT_AREA: {
        SIZE: {
            X: 450,
            Y: 100
        }
    },
    ALL_ELEMENT_AREA: {
        SIZE: {
            X: 450,
            Y: 240
        }
    },
    BLOCK_SIZE_PX: 50
};
class board extends canvas {
    constructor(n, t, i, r, u) {
        super(n, t, i, "black");
        this.blockSize = r;
        this.spacing = u;
        this.color = ["rgba(100, 70, 68, 255)", "rgba(68, 43, 27, 255)", "rgba(62, 181, 117, 255)", "rgba(192, 10, 10, 255)"];
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }
    draw() {
        for (var n, i, r, t = this.spacing, u = 0; t < this.width; t += this.blockSize + this.spacing, u++)
            for (n = this.spacing, i = 0; n < this.width; n += this.blockSize + this.spacing, i++) r = (Math.floor(t / 3 / this.blockSize) + Math.floor(n / 3 / this.blockSize)) % 2, this.board[i][u] === 1 && (r = 2), this.drawRoundedRect(t, n, this.blockSize, this.blockSize, 3, this.color[r])
    }
    drawBoard(n) {
        Object.assign(this.board, n);
        this.draw()
    }
    drawShape(n, t, i) {
        for (var r, u = 0; u < i.h; u++)
            for (r = 0; r < i.w; r++) {
                let f = this.spacing + (this.spacing + this.blockSize) * (n + r),
                    e = this.spacing + (this.spacing + this.blockSize) * (t + u);
                i.s[u * i.w + r] && this.drawRoundedRect(f, e, this.blockSize, this.blockSize, 3, colors[6])
            }
    }
    getPosition(n, t) {
        let i = Math.round((n - this.spacing) / (this.spacing + this.blockSize)),
            r = Math.round((t - this.spacing) / (this.spacing + this.blockSize));
        return i >= 0 && i < 9 && r >= 0 && r < 9 ? {
            x: i,
            y: r
        } : null
    }
    enableEdit(n) {
        this.canvas.onclick = n ? n => this.onClick(n) : null
    }
    onClick(n) {
        let t = Math.floor((n.offsetX - this.spacing) / (this.spacing + this.blockSize)),
            i = Math.floor((n.offsetY - this.spacing) / (this.spacing + this.blockSize));
        t >= 0 && t < 9 && i >= 0 && i < 9 && (this.board[i][t] = this.board[i][t] ? 0 : 1, this.draw())
    }
}
shapes = [{
    w: 2,
    h: 1,
    s: [1, 1],
    c: 0,
    score: 2
}, {
    w: 3,
    h: 1,
    s: [1, 1, 1],
    c: 0,
    score: 3
}, {
    w: 4,
    h: 1,
    s: [1, 1, 1, 1],
    c: 0,
    score: 4
}, {
    w: 5,
    h: 1,
    s: [1, 1, 1, 1, 1],
    c: 0,
    score: 5
}, {
    w: 1,
    h: 2,
    s: [1, 1],
    c: 0,
    score: 2
}, {
    w: 1,
    h: 3,
    s: [1, 1, 1],
    c: 0,
    score: 3
}, {
    w: 1,
    h: 4,
    s: [1, 1, 1, 1],
    c: 0,
    score: 4
}, {
    w: 1,
    h: 5,
    s: [1, 1, 1, 1, 1],
    c: 0,
    score: 5
}, {
    w: 3,
    h: 2,
    s: [1, 1, 1, 1, 0, 0],
    c: 1,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [1, 1, 1, 0, 0, 1],
    c: 1,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [1, 0, 0, 1, 1, 1],
    c: 1,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [0, 0, 1, 1, 1, 1],
    c: 1,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [1, 1, 1, 0, 1, 0],
    c: 1,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [1, 1, 0, 1, 0, 1],
    c: 1,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [1, 0, 1, 0, 1, 1],
    c: 1,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [0, 1, 0, 1, 1, 1],
    c: 1,
    score: 4
}, {
    w: 4,
    h: 2,
    s: [1, 0, 0, 0, 1, 1, 1, 1],
    c: 3,
    score: 5
}, {
    w: 4,
    h: 2,
    s: [0, 0, 0, 1, 1, 1, 1, 1],
    c: 3,
    score: 5
}, {
    w: 4,
    h: 2,
    s: [1, 1, 1, 1, 1, 0, 0, 0],
    c: 3,
    score: 5
}, {
    w: 4,
    h: 2,
    s: [1, 1, 1, 1, 0, 0, 0, 1],
    c: 3,
    score: 5
}, {
    w: 2,
    h: 4,
    s: [1, 1, 1, 0, 1, 0, 1, 0],
    c: 3,
    score: 5
}, {
    w: 2,
    h: 4,
    s: [1, 1, 0, 1, 0, 1, 0, 1],
    c: 3,
    score: 5
}, {
    w: 2,
    h: 4,
    s: [1, 0, 1, 0, 1, 0, 1, 1],
    c: 3,
    score: 5
}, {
    w: 2,
    h: 4,
    s: [0, 1, 0, 1, 0, 1, 1, 1],
    c: 3,
    score: 5
}, {
    w: 3,
    h: 2,
    s: [1, 1, 1, 0, 1, 0],
    c: 2,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [0, 1, 0, 1, 1, 1],
    c: 2,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [1, 0, 1, 1, 1, 0],
    c: 2,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [0, 1, 1, 1, 0, 1],
    c: 2,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [0, 1, 1, 1, 1, 0],
    c: 2,
    score: 4
}, {
    w: 3,
    h: 2,
    s: [1, 1, 0, 0, 1, 1],
    c: 2,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [1, 0, 1, 1, 0, 1],
    c: 2,
    score: 4
}, {
    w: 2,
    h: 3,
    s: [0, 1, 1, 1, 1, 0],
    c: 2,
    score: 4
}, {
    w: 2,
    h: 2,
    s: [1, 1, 1, 0],
    c: 0,
    score: 3
}, {
    w: 2,
    h: 2,
    s: [1, 1, 0, 1],
    c: 0,
    score: 3
}, {
    w: 2,
    h: 2,
    s: [1, 0, 1, 1],
    c: 0,
    score: 3
}, {
    w: 2,
    h: 2,
    s: [0, 1, 1, 1],
    c: 0,
    score: 3
}, {
    w: 3,
    h: 3,
    s: [1, 1, 1, 1, 0, 0, 1, 0, 0],
    c: 3,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 1, 1, 0, 0, 1, 0, 0, 1],
    c: 3,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 0, 0, 1, 0, 0, 1, 1, 1],
    c: 3,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [0, 0, 1, 0, 0, 1, 1, 1, 1],
    c: 3,
    score: 5
}, {
    w: 2,
    h: 3,
    s: [1, 1, 1, 0, 1, 1],
    c: 4,
    score: 5
}, {
    w: 2,
    h: 3,
    s: [1, 1, 0, 1, 1, 1],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 2,
    s: [1, 1, 1, 1, 0, 1],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 2,
    s: [1, 0, 1, 1, 1, 1],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 1, 1, 0, 1, 0, 0, 1, 0],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [0, 1, 0, 0, 1, 0, 1, 1, 1],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 0, 0, 1, 1, 1, 1, 0, 0],
    c: 4,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [0, 0, 1, 1, 1, 1, 0, 0, 1],
    c: 4,
    score: 5
}, {
    w: 1,
    h: 1,
    s: [1],
    c: 0,
    score: 1
}, {
    w: 2,
    h: 2,
    s: [1, 0, 0, 1],
    c: 2,
    score: 2
}, {
    w: 2,
    h: 2,
    s: [0, 1, 1, 0],
    c: 2,
    score: 2
}, {
    w: 3,
    h: 3,
    s: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    c: 2,
    score: 3
}, {
    w: 3,
    h: 3,
    s: [0, 0, 1, 0, 1, 0, 1, 0, 0],
    c: 3,
    score: 3
}, {
    w: 4,
    h: 4,
    s: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    c: 5,
    score: 4
}, {
    w: 4,
    h: 4,
    s: [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    c: 5,
    score: 4
}, {
    w: 2,
    h: 2,
    s: [1, 1, 1, 1],
    c: 0,
    score: 4
}, {
    w: 3,
    h: 3,
    s: [0, 1, 0, 1, 1, 1, 0, 1, 0],
    c: 5,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 0, 0, 1, 1, 1, 0, 0, 1],
    c: 5,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [0, 0, 1, 1, 1, 1, 1, 0, 0],
    c: 5,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [0, 1, 1, 0, 1, 0, 1, 1, 0],
    c: 5,
    score: 5
}, {
    w: 3,
    h: 3,
    s: [1, 1, 0, 0, 1, 0, 0, 1, 1],
    c: 5,
    score: 5
}];
const colors = ["#74A800", "#07C160", "#1196FF", "#8183FF", "#CC9C00", "#C87D2F", "#FA5151", "#3EB575", "#10AEFF", "#7D90A9"],
    rate_0 = [
        [0, 9],
        [1, 18],
        [2, 9],
        [4, 9],
        [5, 18],
        [6, 9],
        [55, 28]
    ];
class roundGen {
    constructor() {
        this.shapeSelector = []
    }
    setRate(n) {
        var i, r;
        this.shapeSelector = [];
        let t = [];
        for (i of n)
            for (r = 0; r < i[1]; r++) t.push(i[0]);
        while (t.length > 0) {
            let n = Math.floor(Math.random() * t.length);
            this.shapeSelector.push(t[n]);
            t.splice(n, 1)
        }
    }
    getShapes() {
        for (var n = [], t = 0; t < 3; t++) {
            let t = Math.floor(Math.random() * this.shapeSelector.length);
            n.push(shapes[this.shapeSelector[t]])
        }
        return n
    }
}
class shapeSelector extends canvas {
    constructor(n, t) {
        super(n, t, t, "black");
        this.frameWidth = 2;
        this.shapePos = null;
        this.enable = !0;
        this.roundSelected = [];
        this.highlightShape = null;
        this.lineCount = Math.round(Math.sqrt(shapes.length) + .5);
        this.shapeSize = Math.floor(t / this.lineCount);
        this.spacing = 1;
        this.blockSize = Math.floor((this.shapeSize - this.frameWidth * 2) / 5 - this.spacing);
        this.shapes = shapes;
        for (var i = 0; i < this.shapes.length; i++) this.shapes[i].id = i;
        this.canvas.addEventListener("click", n => this.onMouseClick(n));
        this.canvas.addEventListener("mouseout", n => this.onMouseOut(n));
        this.canvas.addEventListener("mousemove", n => this.onMouseMove(n))
    }
    draw() {
        var n, i, r, t;
        let u = this.shapePos === null;
        for (u && (this.shapePos = []), n = 0; n < this.shapes.length; n++) {
            let o = n % this.lineCount,
                s = Math.floor(n / this.lineCount);
            i = o * this.shapeSize;
            r = s * this.shapeSize;
            let f = getSize(shapes[n].w, this.blockSize, this.spacing),
                e = getSize(shapes[n].h, this.blockSize, this.spacing);
            i += Math.floor((this.shapeSize - f) / 2) + this.spacing;
            r += Math.floor((this.shapeSize - e) / 2) + this.spacing;
            this.drawShape(i, r, shapes[n], colors[shapes[n].c]);
            u && (t = {}, t.x = i, t.y = r, t.width = f, t.height = e, t.shape = shapes[n], this.shapePos.push(t))
        }
    }
    drawShape(n, t, i, r) {
        for (var u, f = 0; f < i.h; f++)
            for (u = 0; u < i.w; u++) {
                let e = n + (this.spacing + this.blockSize) * u,
                    o = t + (this.spacing + this.blockSize) * f;
                i.s[f * i.w + u] && this.drawRoundedRect(e, o, this.blockSize, this.blockSize, 2, r)
            }
    }
    clearSelect() {
        this.roundSelected = []
    }
    findShapeAtPos(n, t) {
        for (var i = 0; i < this.shapePos.length; i++) {
            let r = this.shapePos[i];
            if (this.isPointInRectangle(r.x, r.y, r.width, r.height, n, t)) return r
        }
        return null
    }
    onMouseClick(n) {
        if (this.enable !== !1 && this.shapePos !== null) {
            const i = n.offsetX,
                r = n.offsetY;
            let t = this.findShapeAtPos(i, r);
            if (t) {
                this.roundSelected.length >= 3 && this.roundSelected.shift();
                this.roundSelected.push(t);
                var n = new CustomEvent("SelectedShapeChanged", {
                    detail: this.roundSelected
                });
                this.canvas.dispatchEvent(n)
            }
        }
    }
    onMouseOut() {
        this.enable !== !1 && this.clearHighlight()
    }
    clearHighlight() {
        this.highlightShape && (this.drawShape(this.highlightShape.x, this.highlightShape.y, this.highlightShape.shape, colors[this.highlightShape.shape.c]), this.highlightShape = null)
    }
    onMouseMove(n) {
        if (this.enable !== !1) {
            var t = n.target.getBoundingClientRect(),
                i = n.clientX - t.left,
                r = n.clientY - t.top;
            let u = this.findShapeAtPos(i, r);
            if (u) {
                if (this.highlightShape) {
                    if (this.highlightShape == u) return;
                    this.drawShape(this.highlightShape.x, this.highlightShape.y, this.highlightShape.shape, colors[this.highlightShape.shape.c])
                }
                this.highlightShape = u;
                this.drawShape(u.x, u.y, u.shape, colors[9]);
                return
            }
            this.clearHighlight()
        }
    }
    addSelectedShapeChangedEventListener(n) {
        this.canvas.addEventListener("SelectedShapeChanged", n)
    }
}
const transparentColor = "rgba(255, 255, 255, 0)";
class dragbleShape extends canvas {
    constructor(n, t, i, r, u) {
        super(n, r, r, transparentColor);
        this.shape = null;
        this.spacing = 1;
        this.frameWidth = 1;
        this.isDragging = !1;
        this.shapeDraged = null;
        this.bigBlockSize = u;
        this.blockSize = Math.floor((r - this.frameWidth * 2 - this.spacing) / 5) - this.spacing;
        this.info = {
            size: r,
            x: t,
            y: i
        };
        let f = this.calculateRect();
        this.resize(f.left, f.top, f.width, f.height, 10)
    }
    enableBig(n) {
        this.blockSize = n ? this.bigBlockSize : Math.floor((this.info.size - this.frameWidth * 2 - this.spacing) / 5) - this.spacing;
        let t = this.calculateRect();
        this.resize(t.left, t.top, t.width, t.height, 10);
        this.draw()
    }
    calculateRect() {
        if (this.shape !== null) {
            let n = getSize(this.shape.w, this.blockSize, this.spacing),
                t = getSize(this.shape.h, this.blockSize, this.spacing);
            return {
                left: Math.round(this.info.x - n / 2),
                top: Math.round(this.info.y - t / 2),
                width: n,
                height: t
            }
        }
        return {
            left: this.info.x,
            top: this.info.y,
            width: 1,
            height: 1
        }
    }
    setShape(n) {
        this.shape = n;
        let t = this.calculateRect();
        this.resize(t.left, t.top, t.width, t.height, 10);
        this.draw()
    }
    draw() {
        this.clear(transparentColor);
        this.shape !== null && this.drawShape(0, 0, this.shape)
    }
    drawShape(n, t, i) {
        for (var r, u = 0; u < i.h; u++)
            for (r = 0; r < i.w; r++) {
                let f = n + (this.spacing + this.blockSize) * r,
                    e = t + (this.spacing + this.blockSize) * u;
                i.s[u * i.w + r] && this.drawRoundedRect(f, e, this.blockSize, this.blockSize, 2, "green")
            }
    }
    enableDrag(n) {
        this.canvas.onmousedown = n && this.shape !== null ? n => this.onMouseDown(n) : null
    }
    onMouseDown(n) {
        n.preventDefault();
        this.isDragging = !0;
        this.enableBig(!0);
        this.offsetX = n.clientX - this.canvas.offsetLeft;
        this.offsetY = n.clientY - this.canvas.offsetTop;
        this.canvas.onmousemove = n => this.onMouseMove(n);
        this.canvas.onmouseup = n => this.onMouseUp(n)
    }
    onMouseMove(n) {
        if (this.isDragging) {
            var t = n.clientX - this.offsetX,
                i = n.clientY - this.offsetY;
            this.setPosition(t, i, 100)
        }
    }
    onMouseUp(n) {
        if (this.isDragging) {
            this.isDragging = !1;
            this.canvas.onmousemove = null;
            this.canvas.onmouseup = null;
            var t = n.clientX - this.offsetX,
                i = n.clientY - this.offsetY;
            shapeDraged !== null && (shapeDraged(t, i, this.shape) ? (this.canvas.onmousedown = null, this.shape = null, this.enableBig(!1)) : this.enableBig(!1))
        }
    }
}
class roundShape extends canvas {
    constructor(n, t, i) {
        super(n, t, i, "rgba(32, 32, 32, 255)");
        this.spacing = 3;
        this.lineCount = 3;
        this.frameWidth = 4;
        this.selectedShape = [];
        this.colWidth = Math.floor((t - 2 * this.frameWidth) / this.lineCount);
        this.colHeight = i - 2 * this.frameWidth;
        let r = Math.min(Math.floor(t / this.lineCount), i) - (this.spacing + this.frameWidth) * 2;
        this.blockSize = Math.floor(r / 5) - this.spacing
    }
    draw(n) {
        var t, i, r;
        for (this.clear(this.backgroundColor), this.selectedShape = [], t = 0; t < n.length; t++) {
            i = this.frameWidth + t * this.colWidth;
            r = this.frameWidth;
            let u = n[t],
                f = getSize(u.w, this.blockSize, this.spacing),
                e = getSize(u.h, this.blockSize, this.spacing);
            i += Math.floor((this.colWidth - f) / 2);
            r += Math.floor((this.colHeight - e) / 2);
            this.drawShape(i, r, u);
            this.selectedShape.push(u)
        }
    }
    getSelectedShape() {
        return this.selectedShape
    }
    drawShape(n, t, i) {
        for (var r, u = 0; u < i.h; u++)
            for (r = 0; r < i.w; r++) {
                let f = n + (this.spacing + this.blockSize) * r,
                    e = t + (this.spacing + this.blockSize) * u;
                i.s[u * i.w + r] && this.drawRoundedRect(f, e, this.blockSize, this.blockSize, 2, colors[i.c])
            }
    }
}
xyMap = [];
initXY();
zMap = [];
initZ();
class slover {
    constructor() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.chromosome = {
            a: 5.44,
            b: 6.17,
            c: 5.85,
            d: 3.9,
            e: -5.37,
            f: 3.53,
            g: -5.76,
            h: -.66
        }
    }
    clone() {
        for (var t = new slover, n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.board[n] = this.board[n].slice();
        return t
    }
    canEliminateRow(n) {
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            if (this.board[n][t] === 0) return !1;
        return !0
    }
    canEliminateCol(n) {
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            if (this.board[t][n] === 0) return !1;
        return !0
    }
    canEliminateBlock(n, t) {
        for (let i = 0; i < 3; i++)
            for (let r = 0; r < 3; r++)
                if (this.board[n + i][t + r] === 0) return !1;
        return !0
    }
    canEliminateBlockSet(n) {
        n = Number(n);
        let t = n % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
            i = Math.floor(n / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH;
        return this.canEliminateBlock(i, t)
    }
    checkAndEliminate() {
        var t = [],
            n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++)
            if (this.canEliminateRow(i)) {
                for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.push([i, n]);
                n++
            }
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++)
            if (this.canEliminateCol(i)) {
                for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t.push([n, i]);
                n++
            }
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t += 3)
            for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i += 3)
                if (this.canEliminateBlock(t, i)) {
                    for (let n = 0; n < 3; n++)
                        for (let r = 0; r < 3; r++) this.board[t + n][i + r] = 0;
                    n++
                }
        for (let n of t) this.board[n[0]][n[1]] = 0;
        return n
    }
    canPutAt(n, t, i) {
        for (var r, u = 0; u < i.h; u++)
            for (r = 0; r < i.w; r++) {
                let f = this.board[u + t][r + n],
                    e = i.s[u * i.w + r];
                if (f === 1 && e === 1) return !1
            }
        return !0
    }
    putAt(n, t, i) {
        for (var r, u = 0; u < i.h; u++)
            for (r = 0; r < i.w; r++) this.board[u + t][r + n] |= i.s[u * i.w + r]
    }
    getBlockSet_fast(n) {
        n = Number(n);
        let t = 0,
            i = n % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
            r = Math.floor(n / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH;
        for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) {
            var u = n + r;
            for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) t = t * 2 + this.board[u][n + i]
        }
        return t
    }
    getBlockSet(n) {
        var t, r;
        n = Number(n);
        let i = {},
            u = {
                x: n % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
                y: Math.floor(n / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH
            };
        for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) {
            t = n + u.y;
            i[t] === undefined && (i[t] = {});
            for (let n = 0; n < GAME_INFO.BOARD_BLOCK_SET_WIDTH; n++) r = n + u.x, i[t][r] = this.board[t][r]
        }
        return i
    }
    getX_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = 0;
            for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t = t * 2 + this.board[n][i];
            n += xyMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getX() {
        var t, i, r;
        let n = {
            divCount: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            divValue: 0
        };
        for (let r = 0; r < GAME_INFO.BOARD_SIZE_BLOCK; r++) {
            t = 0;
            for (let u = 0; u < GAME_INFO.BOARD_SIZE_BLOCK; u++) i = this.board[u][r], i && t && (n.divCount[t]++, t = 0), t += !i;
            t && n.divCount[t]++
        }
        for (r in n.divCount) n.divValue += (10 - Number(r)) * n.divCount[r];
        return n.divValue /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n.divValue = Math.round(n.divValue * 100) / 100, n
    }
    getY_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = 0;
            for (let n = 0; n < GAME_INFO.BOARD_SIZE_BLOCK; n++) t = t * 2 + this.board[i][n];
            n += xyMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getY() {
        var t, i, r;
        let n = {
            divCount: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            divValue: 0
        };
        for (let r = 0; r < GAME_INFO.BOARD_SIZE_BLOCK; r++) {
            t = 0;
            for (let u = 0; u < GAME_INFO.BOARD_SIZE_BLOCK; u++) i = this.board[r][u], i && t && (n.divCount[t]++, t = 0), t += !i;
            t && n.divCount[t]++
        }
        for (r in n.divCount) n.divValue += (10 - Number(r)) * n.divCount[r];
        return n.divValue /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n.divValue = Math.round(n.divValue * 100) / 100, n
    }
    getZ_fast() {
        let n = 0;
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            var t = this.getBlockSet_fast(i);
            n += zMap[t]
        }
        return n /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n = Math.round(n * 100) / 100
    }
    getZ() {
        var i, u, t, r;
        let n = {
            divCount: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            divValue: 0
        };
        t = function(n, r, f) {
            let e = 0;
            return r < GAME_INFO.BOARD_BLOCK_SET_WIDTH && f < GAME_INFO.BOARD_BLOCK_SET_WIDTH && !i[r * GAME_INFO.BOARD_BLOCK_SET_WIDTH + f] && u[r + n.y][f + n.x] && (i[r * GAME_INFO.BOARD_BLOCK_SET_WIDTH + f] = !0, e = 1 + t(n, r + 1, f) + t(n, r, f + 1)), e
        };
        for (let r = 0; r < GAME_INFO.BOARD_SIZE_BLOCK; r++) {
            i = {
                0: !1,
                1: !1,
                2: !1,
                3: !1,
                4: !1,
                5: !1,
                6: !1,
                7: !1,
                8: !1
            };
            u = this.getBlockSet(r);
            for (let i = 0; i < GAME_INFO.BOARD_BLOCK_SET_WIDTH; i++)
                for (let u = 0; u < GAME_INFO.BOARD_BLOCK_SET_WIDTH; u++) {
                    let f = t({
                        x: r % GAME_INFO.BOARD_BLOCK_SET_WIDTH * GAME_INFO.BOARD_BLOCK_SET_WIDTH,
                        y: Math.floor(r / GAME_INFO.BOARD_BLOCK_SET_WIDTH) * GAME_INFO.BOARD_BLOCK_SET_WIDTH
                    }, i, u);
                    f && n.divCount[f]++
                }
        }
        for (r in n.divCount) n.divValue += (10 - Number(r)) * n.divCount[r];
        return n.divValue /= GAME_INFO.BOARD_SIZE_BLOCK * 45, n.divValue = Math.round(n.divValue * 100) / 100, n
    }
    getW() {
        let n = 0;
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++)
            for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK; i++) n += this.board[t][i];
        return n /= Math.pow(GAME_INFO.BOARD_SIZE_BLOCK, 2), Math.round(n * 100) / 100
    }
    getT() {
        let n = 0;
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK; t++) n += this.canEliminateBlockSet(t) ? 1 : 0, n += this.canEliminateRow(t) ? 1 : 0, n += this.canEliminateCol(t) ? 1 : 0;
        return n /= 3 * GAME_INFO.BOARD_SIZE_BLOCK, Math.round(n * 100) / 100
    }
    getS() {
        var i, t, r;
        let n = {
            divCount: {},
            divValue: 0
        };
        i = [];
        for (let t = 0; t < GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK; t++) n.divCount[t + 1] = 0, i.push(!1);
        t = function(n, r, u) {
            let f = 0,
                e = u * GAME_INFO.BOARD_SIZE_BLOCK + r;
            return u < GAME_INFO.BOARD_SIZE_BLOCK && r < GAME_INFO.BOARD_SIZE_BLOCK && !i[e] && n[u][r] && (i[e] = !0, f = 1 + t(n, r + 1, u) + t(n, r, u + 1) + t(n, r + 1, u + 1)), f
        };
        for (let i = 0; i < GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK; i++) {
            let r = t(this.board, i % GAME_INFO.BOARD_SIZE_BLOCK, Math.floor(i / GAME_INFO.BOARD_SIZE_BLOCK));
            r && n.divCount[r]++
        }
        for (r in n.divCount) n.divValue += (GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK + 1 - Number(r)) * n.divCount[r];
        return n.divValue /= GAME_INFO.BOARD_SIZE_BLOCK * GAME_INFO.BOARD_SIZE_BLOCK * 45, n.divValue = Math.round(n.divValue * 100) / 100, n
    }
    evaluateStatus() {
        let n = this.chromosome.a * this.getX_fast() + this.chromosome.b * this.getY_fast() + this.chromosome.c * this.getZ_fast();
        return +this.chromosome.d * this.getW() + this.chromosome.f + this.chromosome.g * this.getT() + this.chromosome.h * this.getS().divValue, Math.abs(n)
    }
}
const horizontalLayout = isHorizontalLayout();
window.onload = function() {
    piggy.load(() => {
        console.log("READY!"), piggy.update(showTimes), setInterval(() => {
            piggy.update(showTimes)
        }, 3e4)
    }, () => {
        console.log("get ip ERROR!"), piggy.update(showTimes)
    });
    let t = 50,
        i = 3,
        n = getSize(9, t, i);
    if (horizontalLayout) {
        let r = Math.floor((window.innerHeight - n - 345) / 9);
        r > 0 && (t += r, n = getSize(9, t, i))
    } else {
        let r = Math.floor((window.innerWidth - n) / 9 - 1);
        t += r;
        n = getSize(9, t, i)
    }
    window.outCanvas = new board("canvasOutput", n, n, t, i);
    window.roundcanvas = new roundShape("canvasRound", n, 140);
    window.selectcanvas = new shapeSelector("canvasSelector", n);
    horizontalLayout ? (window.selectcanvas.show = !0, window.selectcanvas.setPosition(n + 20, 0, 50)) : (window.selectcanvas.show = !1, window.selectcanvas.setPosition(0, 0, 50));
    window.selectcanvas.addSelectedShapeChangedEventListener(function(n) {
        selectedShape = [];
        for (var t = 0; t < n.detail.length; t++) selectedShape.push(n.detail[t].shape);
        window.roundcanvas.draw(selectedShape);
        selectButton.disabled = selectedShape.length !== 3
    });
    StartGame()
};
let stepButton = document.getElementById("step");
stepButton.addEventListener("click", onStepButtonPress);
let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", onResetButtonPress);
let selectButton = document.getElementById("InputButton");
selectButton.onclick = onSelectButtonPress;
selectedShape = [];
putShapeCount = 0;
const c_BoardStatus = {
    SELECT_SHAPE: 0,
    EDIT: 1,
    MOVE: 2,
    CAL: 3,
    START: 4,
    DISABLE: 5
};
streak = 0;
score = 0