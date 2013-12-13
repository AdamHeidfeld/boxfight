function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
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
		drawLine(canvas, 50*Xdiv, 50*Ydiv, 50*Xdiv+50, 50*Ydiv, "#000000");
	}
	else 
	{
		if (Xmod > 25)
		{
			Xdiv++;
		}
		drawLine(canvas, 50*Xdiv, 50*Ydiv, 50*Xdiv, 50*Ydiv+50, "#000000");
	}
}

var canvas = document.getElementById('board');

canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	drawSegment(canvas, mousePos.x, mousePos.y);
}, false);

drawBoard(canvas, 7);
