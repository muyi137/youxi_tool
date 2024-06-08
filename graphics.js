'use strict';

class GameDisplay {
    ctx = null;
    constructor(canvasId, width, height, selectId) {
        this.canvas = document.getElementById(canvasId);
        this.selector = document.getElementById(selectId);
        this.selector.addEventListener('click', event => this.onSelectorMouseClick(event));
        this.canvas.addEventListener('click', event => this.onMouseClick(event));

        //this.canvas.style.transformOrigin="0 0";
        //this.canvas.style.transform = `scale(${this.scale}) `;
        this.canvasSize = [];
        this.vialDimensions = []; // Populated when we call draw().
        this.initCanvas(width, height);
    }

    initCanvas(width, height) {
        // Set display size (css pixels).  Manually chosen to fit 14 vials.
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        // Set actual size in memory (scaled to account for extra pixel density).
        // Change to 1 on retina screens to see blurry canvas.
        //const scale = window.devicePixelRatio;
        this.canvas.width = width;
        this.canvas.height = height;

        // Normalize coordinate system to use css pixels.
        this.ctx = this.canvas.getContext('2d');
        //this.ctx.scale(scale, scale);
        // Clear previous drawing.
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 1)';
        this.ctx.lineWidth = 3;
        this.ctx.font = '28px sans-serif'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'
    }

    init(problem) {
        [this.vialSize, this.vialDimensions] = GameDisplay.getVialDimensions(problem.rows, problem.cols);
        let xOff = (this.canvas.width - this.vialSize[0]) / 2;
        let yOff = (this.canvas.height - this.vialSize[1]) / 2;
        for (var id in this.vialDimensions) {
            this.vialDimensions[id][0] += xOff;
            this.vialDimensions[id][1] += yOff;
        }
        //this.initCanvas(this.canvasSize[0], this.canvasSize[1]);

        //this.initSelector(problem);
    }

    getColorCount(index, colors) {
        for (var color of colors) {
            if (color.index == index) {
                return color.count;
            }
        }
        return 0;
    }

    initSelector(problem, id, blockIdex) {
        this.usedColor = new Array();

        let colors = GetColors(problem);
        let blanks = GetBlanks(problem) / 4;
        let bottles = problem.bottles.length;
        if (colors.length + blanks == bottles) {
            // 使用colors里面的颜色
            for (var color of colors) {
                if (color.index > BLOCK_BLANK && color.count < 4) {

                    this.usedColor.push({ 'index': color.index, 'color': problem.color[color.index] });
                }
            }
        }
        else {
            // 原始图中的颜色数过少，不能使用colors里面的颜色，直接使用problem.cols里面的颜臿
            for (var i = BLOCK_BLANK + 1; i < problem.color.length; i++) {
                if (this.getColorCount(i, colors) < 4) {
                    // 只显示使用不满4个的颜色
                    this.usedColor.push({ 'index': i, 'color': problem.color[i] });
                }
            }
        }

        this.zoom = document.body.style.zoom;
        this.selectorSize = 32 * this.zoom;
        if (this.usedColor.length > 3)
            this.selector.width = 3 * this.selectorSize - 1;
        else
            this.selector.width = this.usedColor.length * this.selectorSize - 1;
        this.selector.height = this.selectorSize * Math.floor((this.usedColor.length + 2) / 3) - 1;

        var x = this.vialDimensions[id][0] + (this.vialDimensions[id][2] - this.selector.width) / 2;
        var y = this.vialDimensions[id][1] + this.vialDimensions[id][3] / 8 * (2 * (blockIdex + 1) + 1);
        this.selector.style.top = `${y}px`;
        this.selector.style.left = `${x}px`;
        this.selector.style.visibility = 'visible';
        let ctx = this.selector.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (var i = 0; i < this.usedColor.length; i++) {
            let x = (i % 3) * this.selectorSize;
            let y = Math.floor(i / 3) * this.selectorSize;
            this.fillVialSegmentRect(this.selector.getContext('2d'), x, y, x + this.selectorSize - 1, y + this.selectorSize - 1, this.usedColor[i].color);
        }
    }

    inWhichColor(x, y) {
        let id = Math.floor(y / this.selectorSize) * 3 + Math.floor(x / this.selectorSize);
        if (id < this.usedColor.length)
            return this.usedColor[id].index;
        else
            return -1;
    }

    initCorrector(id, blockIdex) {
        this.usedColor = new Array();
        for (var i = 0; i < this.color.length; i++) {
            this.usedColor.push({ 'index': i, 'color': this.color[i] });
        }

        this.zoom = document.body.style.zoom;
        this.selectorSize = 32 * this.zoom;
        if (this.usedColor.length > 3)
            this.selector.width = 3 * this.selectorSize - 1;
        else
            this.selector.width = this.usedColor.length * this.selectorSize - 1;
        this.selector.height = this.selectorSize * Math.floor((this.usedColor.length + 2) / 3) - 1;

        var x = this.vialDimensions[id][0] + (this.vialDimensions[id][2] - this.selector.width) / 2;
        var y = this.vialDimensions[id][1] + this.vialDimensions[id][3] / 8 * (2 * (blockIdex + 1) + 1);
        this.selector.style.top = `${y}px`;
        this.selector.style.left = `${x}px`;
        this.selector.style.visibility = 'visible';
        let ctx = this.selector.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.font = '24px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        for (var i = 0; i < this.usedColor.length; i++) {
            let x = (i % 3) * this.selectorSize;
            let y = Math.floor(i / 3) * this.selectorSize;
            if (i === 0) {
                // 未知块
                this.fillVialSegmentRect(ctx, x, y, x + this.selectorSize - 1, y + this.selectorSize - 1, 'black');
                ctx.fillStyle = 'white'
                ctx.fillText('?', x + this.selectorSize / 2, y + (this.selectorSize - 24) / 2);
            }
            else if (i === 1) {
                // 空块
                this.fillVialSegmentRect(ctx, x, y, x + this.selectorSize - 1, y + this.selectorSize - 1, 'black');
            }
            else
                this.fillVialSegmentRect(ctx, x, y, x + this.selectorSize - 1, y + this.selectorSize - 1, this.usedColor[i].color);
        }
    }

    correctColor = false;
    showall = true;
    color = null;
    enableCorrectColor(enable, color, showall = false) {
        this.correctColor = enable;
        this.color = color;
        this.showall = showall;
        this.selector.style.visibility = 'hidden'; // 即使enable，也先把以前显示出来的颜色选择窗口给隐藏了
	  }

    toChange = null;
    onMouseClick(event) {
        if (!this.correctColor) return;

        const x = event.offsetX;
        const y = event.offsetY;
        const curr = this.inWhichStackSegment(x, y);
        if (curr === null) return;

        this.toChange = curr;
        this.initCorrector(curr[0], 3 - curr[1]);
    }

    onColorChanged = null;
    onSelectorMouseClick(event) {
        const x = event.offsetX / this.zoom;
        const y = event.offsetY / this.zoom;
        const id = this.inWhichColor(x, y);
        if (this.correctColor) {
            this.selector.style.visibility = 'hidden';
            this.onColorChanged(this.toChange[0], 3 - this.toChange[1], id);
        }
        else if (id >= 0) {
            let problem = cloneProblem(movingProblem);
            let pure = pureMethod[pureIndex - 1];
            let bottle = problem.bottles[pure.from];
            bottle.setTop(id);
            if (!CheckProblem(problem)) {
                ShowStatus('<b>选择颜色有误，颜色组合不符合要求，请重新选择...');
            }
            else {
                ShowStatus('根据翻出的颜色重新解题，请等待......');
                colorSelecting = false;
                this.selector.style.visibility = 'hidden';
                movingProblem = problem;
                FixQuestionMark(movingProblem);
                this.show(movingProblem);

                // 根据翻出的颜色，更新原始问题
                let orgBottle = orgProblem.bottles[pure.from];
                orgBottle.setColor(bottle.m_blanks, id);
                orgBottle.Update();
                orgProblemChanged = true;
				currentStatus = status.solving;
                requestIdleCallback(() => { SolveProblem(movingProblem, false); });
            }
        }
    }

    show(problem) {
        // Clear previous drawing.
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (const [i, dims] of this.vialDimensions.entries()) {
            const [x, y, width, height] = dims;
            if (problem.bottles[i].m_blocks == 1) {
                this.drawSmallBottle(x, y, width, height);
                this.fillSmallBottleSegments(x, y, width, height, problem.bottles[i], problem.color);
            }
            else {
                this.drawVial(x, y, width, height);
                this.fillSegments(x, y, width, height, problem.bottles[i], problem.color);
            }
        }
    }

    drawVial(x, y, width, height, colors) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.arc(x + width / 2, y + height, width / 2, 0, Math.PI, false);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawSmallBottle(x, y, width, height, colors) {
        const dy = height / 8;
        const top = y + 3 * 2 * dy;
        this.ctx.beginPath();
        this.ctx.moveTo(x, top);
        this.ctx.lineTo(x + width, top);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.arc(x + width / 2, y + height, width / 2, 0, Math.PI, false);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    fillSegments(x, y, width, height, bottle, colors) {
        // Split the vial rectangle into 8 strips. The top strip will be empty;
        // Each segment will consist of 2 strips; the bottom segment will have
        // one rectangular strip and one semicircular arc.
        const dy = height / 8;
        const pad = this.ctx.lineWidth / 2;
        const x1 = x + pad;
        const x2 = x + width - pad;

        for (let i = 0; i < 3; i++) {
            let color = bottle.getColor(i);
            let yoff = (i * 2 + 1) * dy;
            if (color < 0) {
            		// 未识别出来的块，写上红色的X
                this.ctx.fillStyle = 'red'
                this.ctx.fillText('X', (x1 + x2) / 2, y + yoff + 0.5 * dy);
						}            	
            else if (color === BLOCK_UNKNOWN) {
                this.ctx.fillStyle = 'white'
                this.ctx.fillText('?', (x1 + x2) / 2, y + yoff + 0.5 * dy);
            }
            else if (color !== BLOCK_BLANK) {
                this.fillVialSegmentRect(this.ctx, x1, y + yoff, x2, y + yoff + 2 * dy, colors[color]);
            }
        }

        let color = bottle.getColor(3);
        if (color < 0) {
        		// 未识别出来的块，写上红色的X
            this.ctx.fillStyle = 'red'
            this.ctx.fillText('X', (x1 + x2) / 2, y + 7.5 * dy);
        }
        else if (color == BLOCK_UNKNOWN) {
            this.ctx.fillStyle = 'white'
            this.ctx.fillText('?', (x1 + x2) / 2, y + 7.5 * dy);
        }
        else if (color !== BLOCK_BLANK) {
            this.fillVialSegmentBottom(x1, y + 7 * dy, x2, y + 8 * dy, colors[color]);
        }
    }

    fillSmallBottleSegments(x, y, width, height, bottle, colors) {
        // Split the vial rectangle into 8 strips. The top strip will be empty;
        // Each segment will consist of 2 strips; the bottom segment will have
        // one rectangular strip and one semicircular arc.
        const dy = height / 8;
        const pad = this.ctx.lineWidth / 2;
        const x1 = x + pad;
        const x2 = x + width - pad;

        let color = bottle.getColor(0);
        if (color !== BLOCK_BLANK) 
	        this.fillVialSegmentBottom(x1, y + 7 * dy, x2, y + 8 * dy, colors[color]);
    }

    fillVialSegmentRect(ctx, x1, y1, x2, y2, color) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    fillVialSegmentBottom(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x1, y2);
        const radius = (x2 - x1) / 2;
        this.ctx.arc((x2 + x1) / 2, y2, radius, Math.PI, 0, true);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x2, y1);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    inWhichStackSegment(x, y) {
        for (const [i, dims] of this.vialDimensions.entries()) {
            const [x1, y1, width, height] = dims;
            const dy = height / 8;
            const x2 = x1 + width;
            // Return [stack, segment]
            if (isPointInBottom(x1, y1 + 7 * dy, x2, y1 + 8 * dy, x, y)) return [i, 0];
            if (isPointInRectangle(x1, y1 + 5 * dy, x2, y1 + 7 * dy, x, y)) return [i, 1];
            if (isPointInRectangle(x1, y1 + 3 * dy, x2, y1 + 5 * dy, x, y)) return [i, 2];
            if (isPointInRectangle(x1, y1 + 1 * dy, x2, y1 + 3 * dy, x, y)) return [i, 3];
        }
        return null;
    }

    static getVialDimensions(rows, cols) {
        const dimsArray = [];
        const radius = 20;
        // Height must be divisible by 8 to avoid empty pixels when filling colors.
        // On retina screens with 2x scale, height must be divisible by 4.
        const height = radius * 7;
        const width = 2 * radius;
        const x0 = 5;
        const y0 = 10;
        const spacing = 2.5 * radius;
        const gap = radius;

        var maxCols = 0;
        for (let i in cols) {
            if (cols[i] > maxCols) {
                maxCols = cols[i];
            }
        }

        const canvasWidth = (maxCols - 1) * spacing + width + 2 * x0;
        const canvasHeight = rows * (height + radius) + (rows - 1) * gap + 2 * y0;

        var y = y0;
        for (let row = 0; row < rows; row++) {
            var bottles = cols[row];
            var x = Math.floor((canvasWidth - ((bottles - 1) * spacing + width)) / 2);
            for (let col = 0; col < bottles; col++) {
                dimsArray.push([x + col * spacing, y, width, height]);
            }
            y = y + height + radius + gap;
        }
        return [[canvasWidth, canvasHeight], dimsArray];
    }
}

// Utility functions.
// TODO: Investigate why canvas isPointInPath doesn't work.
function isPointInRectangle(x1, y1, x2, y2, x, y) {
  if (x < x1 || x > x2 || y < y1 || y > y2) return false;
  return true;
}
function isPointInBottom(x1, y1, x2, y2, x, y) {
  const xMid = (x1 + x2)/2;
  const radius = (x2 - x1)/2;
  if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
    return true;
  } else if ((x - xMid)**2 + (y - y2)**2 <= radius**2) {
    return true;
  }
  return false;
}