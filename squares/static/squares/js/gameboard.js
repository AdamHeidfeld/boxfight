var redrawTime = 4;

function getMousePos(canvas, evt) 
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top,
	};
}

function drawLine(canvas, fromX, fromY, toX, toY, color)
{
	var context = canvas.getContext('2d');
	context.beginPath();
	context.strokeStyle=color;
	context.moveTo(fromX, fromY);
	context.lineTo(toX, toY);
	context.stroke();
}

function drawBoard(canvas, number)
{
	canvas.width=50*number;
	canvas.height=50*number;

	for (var i=1; i<=number; i++)
	{
		drawLine(canvas, 0, 0+50*i, canvas.height, 0+50*i, "#DCDCDC");
		drawLine(canvas, 0+50*i, 0, 0+50*i, canvas.height, "#DCDCDC");
	}
}

function drawSegment(canvas, posX, posY)
{
	var pos = getPosition(posX, posY);
	for (var i=0; i<=redrawTime; i++) 
	{
	  drawLine(canvas, pos.fromX*50, pos.fromY*50, pos.toX*50, pos.toY*50, "#000000");
	}
}

function setBoardData(posX, posY)
{// setting a data structure about which line is drawn,
 // so that we can decide whether a square in created.
	var pos = getPosition(posX, posY);
	var pos_str = pos.fromX + "_" + pos.fromY + "_" + pos.toX + "_" + pos.toY;
	boardLines[pos_str] = "X";// X for drawn
}


function getPosition(posX, posY)
{
	var Xmod = posX%50;
	var XXmod = Xmod;
	var Xdiv = Math.floor(posX/50);
	var Ymod = posY%50;
	var YYmod = Ymod;
	var Ydiv = Math.floor(posY/50);
	if (Xmod > 25) 
	{
		XXmod = 50 - Xmod;
	}
	if (Ymod > 25)
	{
		YYmod = 50 - Ymod;
	}

	if (YYmod < XXmod)
	{
		if (Ymod > 25) 
		{
			Ydiv++;
		}
		return {
			fromX: Xdiv,
			fromY: Ydiv,
			toX: Xdiv+1,
			toY: Ydiv,
		};
	}
	else 
	{
		if (Xmod > 25)
		{
			Xdiv++;
		}
		return {
			fromX: Xdiv,
			fromY: Ydiv,
			toX: Xdiv,
			toY: Ydiv+1,
		};
	}
}

function notDrownClick(posX, posY)
{
	var pos = getPosition(posX, posY);
	var pos_str = pos.fromX + "_" + pos.fromY + "_" + pos.toX + "_" + pos.toY;
	if (boardLines[pos_str]=='X')
	{
		return false;
	} 
	else
	{
		return true;
	}
}

function notDrown(fromX, fromY, toX, toY)
{
	var pos_str = fromX + "_" + fromY + "_" + toX + "_" + toY;
	if (boardLines[pos_str]=='X')
	{
		return false;
	} 
	else
	{
		return true;
	}
}

function testBoxCreated(owner, posX, posY)
{
	var pos = getPosition(posX, posY);
	var boxNum = 2;
	if (pos.fromX == pos.toX)
	{// the line is vertical
		if (notDrown(pos.fromX, pos.fromY, pos.fromX+1, pos.fromY) ||
			notDrown(pos.toX, pos.toY, pos.toX+1, pos.toY) ||
			notDrown(pos.fromX+1, pos.fromY, pos.toX+1, pos.toY))
		{
			boxNum --;
		} else
		{
			var color;
			if(owner=='player1')
			{
				color = 'red';
			} else if(owner=='player2')
			{
				color = 'blue';
			}
			fillColor(color, pos.fromX, pos.fromY);
		}

		if (notDrown(pos.fromX-1, pos.fromY, pos.fromX, pos.fromY) ||
			notDrown(pos.toX-1, pos.toY, pos.toX, pos.toY) ||
			notDrown(pos.fromX-1, pos.fromY, pos.toX-1, pos.toY))
		{
			boxNum --;
		} else
		{
			var color;
			if(owner=='player1')
			{
				color = 'red';
			} else if(owner=='player2')
			{
				color = 'blue';
			}
			fillColor(color, pos.fromX-1, pos.fromY);
		}

		return boxNum;
	} else if (pos.fromY == pos.toY)
	{// the line is horizontal
		if (notDrown(pos.fromX, pos.fromY, pos.fromX, pos.fromY+1) ||
			notDrown(pos.toX, pos.toY, pos.toX, pos.toY+1) ||
			notDrown(pos.fromX, pos.fromY+1, pos.toX, pos.toY+1))
		{
			boxNum --;
		} else 
		{
			var color;
			if(owner=='player1')
			{
				color = 'red';
			} else if(owner=='player2')
			{
				color = 'blue';
			}
			fillColor(color, pos.fromX, pos.fromY);
		}

		if (notDrown(pos.fromX, pos.fromY-1, pos.fromX, pos.fromY) ||
			notDrown(pos.toX, pos.toY-1, pos.toX, pos.toY) ||
			notDrown(pos.fromX, pos.fromY-1, pos.toX, pos.toY-1))
		{
			boxNum --;
		} else
		{
			var color;
			if(owner=='player1')
			{
				color = 'red';
			} else if(owner=='player2')
			{
				color = 'blue';
			}
			fillColor(color, pos.fromX, pos.fromY-1);
		}

		return boxNum;
	} else 
	{// wrong parameter,and of course the anwser is no box.
		return 0;
	}
}

function fillColor(color, fromX, fromY)
{
	var c = document.getElementById("board");
	var ctx = c.getContext('2d');
	ctx.fillStyle=color;
	ctx.fillRect(fromX*50, fromY*50, 50, 50);
}

var boardLines = {};

var canvas = document.getElementById('board');

var boxCount1 = 0;
var boxCount2 = 0;

var penOwner = 'player1'; // or player2

canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	var temp = notDrown(mousePos.x, mousePos.y);
	var currCount = 0;
	if (notDrownClick(mousePos.x, mousePos.y)) 
	{
		drawSegment(canvas, mousePos.x, mousePos.y);
		setBoardData(mousePos.x, mousePos.y);
		var boxes = testBoxCreated(penOwner, mousePos.x, mousePos.y);
		if (penOwner == 'player1')
		{
 			boxCount1 += boxes;
			currCount = boxCount1;
			if (boxes == 0) 
			{
				penOwner = 'player2';
				currCount = boxCount2;
			}
		} else if (penOwner == 'player2')
		{
 			boxCount2 += boxes;
			currCount = boxCount2;
			if (boxes == 0)
			{
				penOwner = 'player1';
				currCount = boxCount1;
			}
		} 

		document.getElementById('player1').style.fontSize='x-large';
		document.getElementById('player2').style.fontSize='x-large';
		document.getElementById(penOwner).style.fontSize='xx-large';
		
		document.getElementById('count'+penOwner).innerHTML=currCount;
	}
}, false);

drawBoard(canvas, 7);
document.getElementById('player1').style.color='red';
document.getElementById('player2').style.color='blue';
document.getElementById('player1').style.fontSize='xx-large';
document.getElementById('player2').style.fontSize='x-large';

