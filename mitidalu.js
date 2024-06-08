class BottleLine
{
	bottles = {};
	possible_y = 0;
	
	constructor() {
  }
	
	append(bottle)
	{
		if (this.possible_y > 0)
		{
			if (Math.abs(bottle.y - this.possible_y) > bottle.height)
			{
				return false;
			}
			else
			{
				this.bottles[Math.floor(bottle.x)] = bottle;
				return true;
			}
		}
		else
		{
			this.possible_y = bottle.y;
			this.bottles[Math.floor(bottle.x)] = bottle;
			return true;
		}
	}
};

//let g_mitidalu_color = {
//		"未知": [156, 170, 170, 'rgba(156, 170, 170, 1)'],
//		"空": [15, 41, 52, 'rgba(15, 41, 52, 0)'],
//		"蓝": [12,	95,	215, 'rgba(12, 95, 215, 1)'],
//		"绿": [16,	97,	94, 'rgba(16,	97,	94, 1)'],
//		"浅绿": [85, 198, 58, 'rgba(85, 198, 58, 1)'],
//		"红": [189, 31, 24, 'rgba(189, 31, 24, 1)'],
//		"紫": [141, 56, 213, 'rgba(141, 56, 213, 1)'],
//		"黄": [239, 189, 13, 'rgba(239, 189, 13, 1)'],
//		"肉色": [255, 209, 184, 'rgba(255, 209, 184, 1)'],
//		"灰": [101, 102, 104, 'rgba(101, 102, 104, 1)'],
//		"浅蓝": [94, 170, 233, 'rgba(94, 170, 233, 1)'],
//		"粉": [236, 98, 127, 'rgba(236, 98, 127, 1)'],
//		"橙": [245, 145, 42, 'rgba(245, 145, 42, 1)'],
//		"青": [73,	62,	198, 'rgba(73, 62, 198, 1)'],
//		"棕": [105, 31, 57, 'rgba(105, 31, 57, 1)'],
//		"浅紫": [222, 151, 224, 'rgba(222, 151, 224, 1)']
//};

function IsSameColor(R, G, B, color, allowed_distance)
{
		let r = R - color[0];
		let g = G - color[1];
		let b = B - color[2];
		let distance = Math.sqrt((r * r + g * g + b * b) / 3);
		if (distance <= allowed_distance)
			return true;
		else
			return false;;
}

function GetColor(image, x, y, colors)
{
	let Rtotal = 0;
	let Gtotal = 0;
	let Btotal = 0;
	let range = 3;
	let count = (range * 2 + 1);
	count = count * count;
	let unknownCount = 0;
	let blankCount = 0;
	for (let row = -range; row <= range; row++)
	{
		for (let col = -range; col <= range; col++)
		{
			let pixel = image.ucharPtr(y + row * 2, x + col * 2);
			let R = pixel[0];
			let G = pixel[1];
			let B = pixel[2];
			if (IsSameColor(R, G, B, colors["未知"], 28))
			{
				// 问号
				unknownCount++;
			}
			else if (IsSameColor(R, G, B, colors["空"], 28))
			{
				blankCount++;
			}
			else if (R > 220 && G > 220 && B > 220)
			{
				// 疑似完成瓶的白泡泡
				count--;
			}
			else
			{
				Rtotal += R;
				Gtotal += G;
				Btotal += B;
				//printf("(R: %d, G: %d, B: %d)\n", rgb.red, rgb.green, rgb.blue);
			}
		}
	}
	if (unknownCount + blankCount > 8)
	{
		if (unknownCount > 4)
		{
			//printf("%s, ", g_mitidalu_color[0].name.c_str());
			return BLOCK_UNKNOWN;
		}
		else
		{
			//printf("%s, ", g_mitidalu_color[1].name.c_str());
			return BLOCK_BLANK;
		}
	}
	else
	{
		let colorCount = count - unknownCount - blankCount;
		let red = Rtotal / colorCount;
		let green = Gtotal / colorCount;
		let blue = Btotal / colorCount;
		//printf("R: %d, G: %d, B: %d\r\n", R / count, G / count, B / count);
		var index = 0;
		for (let key in colors)
		{
			if (IsSameColor(red, green, blue, colors[key], 20))
			{
				//printf("%s, ", colors[i].name.c_str());
				return index;
			}
			index++;
		}
		//printf("(R: %d, G: %d, B: %d), ", color.red, color.green, color.blue);
		return -1;
	}
}

function GetBottle(image, rect, select)
{
	let bottle = new Bottle(4);
	let half_block = rect.height / 8;
	for (let i = 0; i < 4; i++)
	{
		let x = rect.x + rect.width / 2;
		let y = rect.y + half_block * (i * 2 + 1);
		let color = GetColor(image, x, y, select.color);
		bottle.setColor(i, color);
		//Rect rect(x - 1, y - 1, 3, 3);
		// 定义矩形的左上角和右下角的坐标  
		let pt1 = new cv.Point(x-1, y-1); // 左上角坐标  
		let pt2 = new cv.Point(x+2, y+2); // 右下角坐标  

		// 定义矩形的颜色，这里使用 BGR 格式，例如蓝色 (255, 0, 0)  
		let fillcolor = new cv.Scalar(0, 0, 255); // 蓝色  

		// 定义矩形的线条厚度，-1 表示填充整个矩形  
		let thickness = -1;

		// 在 Mat 对象上绘制填充的矩形  
		cv.rectangle(image, pt1, pt2, fillcolor, thickness);
	}
	//bottle.m_colors = colors;
	//bottle.m_color_count = size;
	bottle.Update();
	return bottle;
}

solver.init = function (src, select) {
	let dst = new cv.Mat();
	let gray = new cv.Mat();
	cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
	let low = new cv.Mat(gray.rows, gray.cols, gray.type(), [select.maskLow, 0, 0, 0]);
	let high = new cv.Mat(gray.rows, gray.cols, gray.type(), [255, 0, 0, 0]);
	cv.inRange(gray, low, high, dst);
	gray.delete(); low.delete(); high.delete();

	cv.imshow('mask', dst);

	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();

	// You can try more different parameters
	cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
	// draw bottles
	let rectangleColor = new cv.Scalar(255, 0, 0, 255);
	let bottleLines = new Array();
	for (let i = 0; i < contours.size(); ++i)
	{
 		let rect = cv.boundingRect(contours.get(i));
		let radio = parseFloat(rect.height) / parseFloat(rect.width);
		if (radio > 2.5 && radio < 4.0 && rect.width > dst.cols * 0.084)
		{
			let leftmargin = rect.width * select.marginLeft;
			rect.x += leftmargin;
			rect.width -= leftmargin;
			let topmargin = rect.height * select.marginTop;
			rect.y += topmargin;
			rect.height -= topmargin;
			let point1 = new cv.Point(rect.x, rect.y);
			let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);	
			cv.rectangle(src, point1, point2, rectangleColor, 2, cv.LINE_8);
					
			inserted = false;
			for (let key in bottleLines)
			{
				if (bottleLines[key].append(rect))
				{
					inserted = true;
					break;
				}
			}
			if (!inserted)
			{
				let bl = new BottleLine();
				bl.append(rect);
				bottleLines.push(bl);
			}
 		}
	}
	dst.delete(); contours.delete(); hierarchy.delete();

	bottleLines.sort(function(a,b){
		return a.possible_y - b.possible_y;
		});
	
	var problem = new Object();
	problem.rows = bottleLines.length;
	problem.color = new Array();
	problem.bottles = new Array();
	var index = 0;
	for (let key in select.color)
	{
		problem.color[index] = select.color[key][3];	// 最后一个是给网页显示用的
		index++;
	}
	problem.cols = new Array();
	
	for (let key in bottleLines)
	{
		var bottles = bottleLines[key].bottles;
		var count = 0;
		for (let bottlekey in bottles)
		{
			var bl = GetBottle(src, bottles[bottlekey], select);
			problem.bottles.push(bl);
			count++;
		}
		problem.cols.push(count);
	}

	cv.imshow('src', src);
	return problem;
}
