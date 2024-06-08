let BLOCK_BLANK = 1;
let	BLOCK_UNKNOWN = 0;

class Bottle
{
	m_color = new Array();
	m_top = 0;
	m_blanks = 0;
	m_unknowns = 0;
	m_isOK = false;
	m_blocks = 4;
	
	constructor(blocks) {
		this.m_blocks = blocks;
	}	

	initBottle() {
		for (let i = 0; i < this.m_blocks; i++) {
			this.m_color.push(BLOCK_BLANK);
		}
		this.m_top = BLOCK_BLANK;
		this.m_blanks = this.m_blocks;
		this.m_unknowns = 0;
		this.m_isOK = false;
	}

	getState() {
		var state = '';
		if (this.m_isOK)
			return state;
		for (var char of this.m_color) {
			state += String.fromCharCode(char + 63);
		}
		return state;
	}
	//getState() {
	//	if (this.m_blocks == 1) {
	//		return String.fromCharCode(this.m_color[0]);
	//	}
	//	else {
	//		var state = new Array();

	//		for (var i = 0; i < this.m_color.length - 1; i += 2) {
	//			var char = String.fromCharCode(this.m_color[i] << 4 | this.m_color[i + 1]);
	//			state.push(char);
	//		}

	//		return state.join('');
	//	}
	//}

	getColor(index)
	{
		if (index >= 0 && index < this.m_blocks)
		{
			return this.m_color[index];
		}
		else
		{
			return null;
		}
	}

	empty()
	{
		return this.m_blanks == this.m_blocks;
	}

	blanks()
	{
		var bs = 0;
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] == BLOCK_BLANK)
				bs++;
			else
				return bs;
		}
		return bs;
	}

	unknowns()
	{
		var us = 0;
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] == BLOCK_UNKNOWN)
				us++;
		}
		return us;
	}

	isOK()
	{
		if ((this.m_blanks + this.m_unknowns) > 0) return false;

		for (var i = 1; i < this.m_blocks; i++)
		{
			if (this.m_color[i] != this.m_top)
				return false;
		}
		return true;
	}

	topColor()
	{
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] != BLOCK_BLANK)
				return this.m_color[i];
		}
		return BLOCK_BLANK;
	}

	setColor(index, color)
	{
		if (index >= 0 && index < this.m_blocks)
			this.m_color[index] = color;
	}

	setTop(color)
	{
		if (color != BLOCK_BLANK && color != BLOCK_UNKNOWN)
		{
			for (var i = 0; i < this.m_blocks; i++)
			{
				if (this.m_color[i] != BLOCK_BLANK)
				{
					if (this.m_color[i] == BLOCK_UNKNOWN)
					{
						this.m_unknowns--;
					}
					this.setColor(i, color);
					this.m_top = color;
					if (i == 0 && this.m_unknowns == 0)
					{
						this.m_isOK = isOK();
					}
					return;
				}
			}
		}
	}

	// 是否可以倒出
	canPureOut()
	{
		return this.m_blanks < this.m_blocks && this.m_top != BLOCK_UNKNOWN ;	// 非空瓶, 且顶部颜色已知才可倒出
	}

	// 是否可以倒入
	canPureIn(color)
	{
		if (this.empty())
		{
			return true;	// 空瓶当然可以倒入
		}
		else
		{
			return this.m_blanks > 0 && this.m_top == color;	// 有空位，且顶部颜色符合要倒入的颜色
		}
	}

	canPureTo(other)
	{
		if (this.isSameColor())
		{
			// 把一个同色瓶倒入一个空瓶虽然可操作，但是个废操作
			if (other.empty())	
				return false;
			
			return other.canPureIn(this.m_top);
		}
		else
		{
			return this.canPureOut() && other.canPureIn(this.m_top);
		}
	}

	isSameColor()
	{
		if (this.m_top == BLOCK_BLANK) return true;	// 此乃空瓶，当然也算同色
		if (this.m_top == BLOCK_UNKNOWN) return false;	// 顶部未知块，当然也不能算同色

		let c = this.m_color[this.m_blocks-1];
		for (var i = this.m_blocks - 2; i >= 0; i--)
		{
			let oc = this.m_color[i];
			if (oc == BLOCK_BLANK)
				return true;
			else if (oc != c)
				return false;
		}
		return true;
	}

	pureTo(other) {
		if (this.canPureTo(other)) {
			const top = this.m_top;
			while (other.m_blanks > 0 && this.m_top == top) {
				other.m_blanks--;
				other.setColor(other.m_blanks, this.m_top);
				this.setColor(this.m_blanks, BLOCK_BLANK);
				this.m_blanks++;
				this.m_top = this.m_blanks >= this.m_blocks ? BLOCK_BLANK : this.getColor(this.m_blanks);
			}
			other.m_top = top;
			other.m_isOK = other.isOK();
			this.m_isOK = false;	// 倒出了水，肯定不满了
		}
	}

	//pureTo(other)
	//{
	//	while (this.canPureTo(other))
	//	{	
	//		if (other.m_blanks > 0)
	//		{
	//			other.m_blanks--;
	//			other.setColor(other.m_blanks, this.m_top);
	//			other.m_top = this.m_top;

	//			this.setColor(this.m_blanks, BLOCK_BLANK);
	//			this.m_blanks++;
	//			this.m_isOK = false;	// 倒出了水，肯定不满了
	//		}
	//		else
	//		{
	//			// 错误
	//			return;
	//		}
	//		this.m_top = this.topColor();
	//	}
	//	other.m_isOK = other.isOK();
	//	return;
	//}

	pureBlocksTo(other, blocks)
	{
		//assert(other.m_blanks >= blocks);
		//assert(blocks > 0 && blocks < 4);
		var color = this.m_top;
		for (var i = 0; i < blocks; i++)
		{
			other.set(--other.m_blanks, color);
			this.setColor(this.m_blanks++, BLOCK_BLANK);
		}
		this.m_top = this.topColor();
		this.m_isOK = false;	// 倒出了水，肯定不满了

		other.m_top = other.topColor();
		other.m_isOK = other.isOK();
	}
	
	Update()
	{
		this.m_top = this.topColor();
		this.m_blanks = this.blanks(); 
		this.m_unknowns = this.unknowns();
		this.m_isOK = this.isOK();
	}

};

function clone(obj)
{
	var o;
	if (typeof obj == "object")
	{
		if (obj === null)
		{
			o = null;
		}
		else
		{
			if (obj instanceof Array)
			{
				o = [];
				for (var i = 0, len = obj.length; i < len; i++)
				{
					o.push(clone(obj[i]));
				}
			}
			else
			{
				o = Object.create(obj);
				for (var j in obj)
				{
					o[j] = clone(obj[j]);
				}
			}
		}
	}
	else
	{
		o = obj;
	}
	return o;
}

// problem包括以下成员
//   rows，显示的行数
//   cols, 数组，每行显示的瓶子数
//   color，数组，使用的颜色
//   bottles，数组，所有的瓶子，Bottle

function GetColors(problem)
{
	var colors = [];
	
	for (var bottle of problem.bottles)
	{
		for (var i = 0; i < bottle.m_blocks; i++)
		{
			var index = bottle.getColor(i);
			if (index != BLOCK_BLANK && index != BLOCK_UNKNOWN)
			{
				var find = colors.findIndex(function(item, id, arr){
  				return item.index === index;
				});
				if (find != -1)
				{
					colors[find].count++;
				}
				else
				{
					var color = { 'index': index, 'count': 1 };
					colors.push(color);
				}
			}
		}
	}
	return colors;
}

function GetBlanks(problem)
{
	var blanks = 0;
	for (var bottle of problem.bottles)
	{
		if (bottle.m_blocks == 4)
			blanks += bottle.m_blanks;
	}
	return blanks;
}

function GetFullBottles(problem) {
	var bottles = 0;
	for (var bottle of problem.bottles) {
		if (bottle.m_blocks == 4)
			bottles ++;
	}
	return bottles;
}

function GetUnknowns(problem)
{
	var unknowns = 0;
	for (var bottle of problem.bottles)
	{
		unknowns += bottle.m_unknowns;
	}
	return unknowns;
}

function GetState(problem)
{
	var stateArray = new Array();
	for (var P of problem.bottles)
	{
		if (!(P.m_isOK || P.empty()))
			stateArray.push(P.getState());
	}
	stateArray.sort(function (a, b) { return a.localeCompare(b); });
	return stateArray.join('');
}

var g_allState = new Set();

function InitSet(state) {
	g_allState.clear();
	g_allState.add(state);
}

function IsDuplicateState(state) {
	if (g_allState.has(state)) {
		return true;
	}
	else {
		g_allState.add(state);
		return false;
    }
}

function IsDuplicateProblem(problem) {
	let state = GetState(problem);
	return IsDuplicateState(state);
}

function CheckProblem(problem)
{
	let blanks = GetBlanks(problem);
	//if (blanks <= 0 || blanks % 4) return false;	// 没有空位，或者空位不是4的整数倍
	
	let bottles = GetFullBottles(problem);
	let colors = GetColors(problem);
	let unknowns = GetUnknowns(problem);

	if (unknowns < 4)
	{
		// 只有未知块小于4时，才能检查颜色总数是否合适
		//var colorCount = colors.length;
		//if (colorCount + blanks / 4 != bottles) return false;

		let lackColorBlocks = 0;
		for (var color of colors)
		{
			if (color.count > 4) {
				ShowStatus('有颜色的数目（{color.count}）大于4');
				return false;
			}
			else
			{
				lackColorBlocks += 4 - color.count;
			}
		}
		if (unknowns != lackColorBlocks)
		{
			ShowStatus('未知颜色的块数目不对');
			return false;
		}
	}
	else
	{
		// 颜色过多显然是不对的
		if (colors.length + Math.floor(blanks / 4) > bottles) return false;

		var colorBlocks = 0;
		for (var color of colors)
		{
			// 单个颜色的块数不能超过4
			if (color.count > 4)
			{
				ShowStatus('有颜色的数目（${color.count}）大于4');
				return false;
			}
			colorBlocks += color.count;
		}
		
		if (unknowns + blanks + colorBlocks != bottles * 4)
			return false;
	}
	return true;
}

function cloneProblem(problem) {
	let cloned = { rows: problem.rows, color: problem.color, bottles: [] };
	for (var bottle of problem.bottles) {
		let b = new Bottle(4);
		b.m_color = bottle.m_color.slice();
		b.m_top = bottle.m_top;
		b.m_blanks = bottle.m_blanks;
		b.m_unknowns = bottle.m_unknowns;
		b.m_isOK = bottle.m_isOK;
		b.m_blocks = bottle.m_blocks;
		cloned.bottles.push(b);
	}
	return cloned;
}

// 检查是否已经完成
function IsSolved(problem)
{
	let size = problem.bottles.length;
	for (var i = 0; i < size; i++)
	{
		if (problem.bottles[i].m_ok || problem.bottles[i].isSameColor() || problem.bottles[i].m_blanks == problem.bottles[i].m_blocks)
			continue;
		else
			return false;
	}
	return true;
}

function FinishPure(problem, pure) {
	let bottles = problem.bottles;
	for (var i = 0; i < bottles.length - 1; i++) {
		if (!bottles[i].m_isOK && bottles[i].isSameColor()) {
			for (var j = i + 1; j < bottles.length; j++) {
				if (bottles[j].canPureTo(bottles[i])) {
					bottles[j].pureTo(bottles[i]);
					pure.push({ 'from': j, 'to': i });
				}
			}
		}
	}
}
function FindPossibleNext(problem, nextDeep)
{
	let bottles = problem.problem.bottles;
	for (var i = 0; i < bottles.length; i++) {
		if (!bottles[i].m_isOK) {
			for (var j = 0; j < bottles.length; j++) {
				if (j !== i) {
					if (bottles[i].canPureTo(bottles[j])) {
						let newProblem = cloneProblem(problem.problem);
						newProblem.bottles[i].pureTo(newProblem.bottles[j]);
						if (!IsDuplicateProblem(newProblem)) {
							var pure = problem.pure.slice();//clone(problem.pure);	//加速
							pure.push({ 'from': i, 'to': j });
							if (IsSolved(newProblem)) {
								FinishPure(newProblem, pure);
								return pure;
							}
							else {
								nextDeep.push({ 'problem': newProblem, 'pure': pure });
							}
						}
					}
				}
			}
		}
	}

	return null;
}

function SolveDeep(problemList, deep)
{
	var nextDeep = new Array();
	for (var problem of problemList)
	{
		let find = FindPossibleNext(problem, nextDeep);
		if (find !== null) {
			return find;
        }
	}
	if (nextDeep.length > 0)
		return SolveDeep(nextDeep, deep + 1);
	else
		return null;
}

function Solve(problem)
{
	var nextDeep = [{ 'problem': problem, 'pure': new Array() }];
	var state = GetState(problem);
	InitSet(state);
	return SolveDeep(nextDeep, 1);
}

function FindMoreUnkonwns(problem)
{
	var best = {'pure': new Array(), 'score' : -10000, 'oks': 0};
	var nextDeep = [{ 'problem': problem, 'pure': new Array() }];
	var state = GetState(problem);
	InitSet(state);
	FindMoreUnkonwnsDeep(nextDeep, best);
	return best;
}

function PrepareToEvaluation(problem)
{
	let bottles = problem.bottles;
	let pured = false;
	do {
		pured = false;
		for (var i = 0; i < bottles.length; i++) {
			if (!bottles[i].m_isOK && bottles[i].isSameColor() && bottles[i].m_top != BLOCK_BLANK && bottles[i].m_top != BLOCK_UNKNOWN) {
				// 同色未满瓶
				for (var j = 0; j < bottles.length; j++) {
					if (i != j && bottles[j].m_top == bottles[i].m_top) {
						problem.bottles[j].pureTo(problem.bottles[i]);
						pured = true;
					}
				}
			}
		}
	} while (pured);
}

function Evaluation(problem)
{
	let bottles = problem.bottles;
	let score = 0;
	for (var i = 0; i < bottles.length; i++) {
		if (bottles[i].m_isOK)
			score += 10;
		else
		{
			switch (bottles[i].m_blanks) {
				case 1:
					score += 5;
					break;
				case 2:
					score -= 5;
					break;
				case 3:
					score -= 10;
					break;
				case 4:
					score += 10;
					break;
			}
		}
	}
	return score;
}

function FindPossibleNextWithUnknown(problem, nextDeep, best)
{
	let bottles = problem.problem.bottles;
	for (var i = 0; i < bottles.length; i++) {
		if (!bottles[i].m_isOK) {
			for (var j = 0; j < bottles.length; j++) {
				if (j !== i) {
					if (bottles[i].canPureTo(bottles[j])) {
						let newProblem = cloneProblem(problem.problem);
						newProblem.bottles[i].pureTo(newProblem.bottles[j]);
						if (!IsDuplicateProblem(newProblem)) {
							var pure = problem.pure.slice();
							pure.push({ 'from': i, 'to': j });
							if (newProblem.bottles[i].m_top == BLOCK_UNKNOWN) {
								// 翻出了1个未知块
								PrepareToEvaluation(newProblem);
								var score = Evaluation(newProblem);
								var oks = 0;
								for (var k = 0; k < newProblem.bottles.length; k++) {
									if (newProblem.bottles[k].m_isOK)
										oks++;
								}
								if (best.score < score || 
									(best.score == score && best.oks < oks)) {
									best.score = score
									best.pure = pure;
									best.oks = oks;
								}
							}
							else {
								nextDeep.push({ 'problem': newProblem, 'pure': pure });
							}
						}
					}
				}
			}
		}
	}
}

function FindMoreUnkonwnsDeep(problemList, best)
{
	var nextDeep = new Array();
	for (var problem of problemList)
	{
		FindPossibleNextWithUnknown(problem, nextDeep, best);
	}
	if (nextDeep.length > 0)
		FindMoreUnkonwnsDeep(nextDeep, best);
}

function FixQuestionMark(problem) {
	let unknowns = GetUnknowns(problem);
	if (unknowns === 1) {
		// 对于只有一个问号的，是可以找出来它应该是啥颜色的哦
		let colors = GetColors(problem);
		let colorUnknown = 0;
		for (var color of colors) {
			if (color.count < 4) {
				colorUnknown = color.index;
				break;
			}
		}
		for (var bottle of problem.bottles) {
			for (var i = 0; i < bottle.m_blocks; i++) {
				var index = bottle.getColor(i);
				if (index == BLOCK_UNKNOWN) {
					bottle.setColor(i, colorUnknown);
					bottle.Update();
				}
			}
		}
		return true;
	}
	else
		return false;
}

// 有少量问号，试图找出一定能解出来的
function TrySolve(problem)
{
	
}