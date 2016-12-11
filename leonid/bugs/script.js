var FPS = 30;

var MAX_ROATATION_SPEED = 2;

var MAX_MOVE_SPEED = 13;

var MOUSE_X = window.innerWidth / 2;
var MOUSE_Y = window.innerHeight / 2;

var MAX_TOWARDS_MOUSE_SPEED = 10;
var MAX_TOWARDS_MOUSE_DISTANCE = 300;

var MAX_CHASER_PROXIMITY = 10;

var START_TIME = Date.now();


var bugs;



var updateTicker;
var difficultyTicker;





function bugSetup()
{	
	bugs = new Array(1);
	
	for (var i = 0; i < bugs.length; i++)
	{
		bugs[i] = spawnRandomBug();
	}
	
	updateTicker = setInterval(bugUpdater, 1000/FPS);
	difficultyTicker = setInterval(difficultyUp, 1000);
}







function spawnRandomBug()
{	
	var bugImage = document.createElement('img');
	
	bugImage.className = 'bug';
	bugImage.src = 'bug.png';
	
	document.getElementById('rootpane').appendChild(bugImage);

	
	var bug = new Object();
	
	bug.type = Math.random() < 0.2 ? 'chaser' : 'slapper';
	
	bug.image = bugImage;
	
	bug.x = Math.random() * window.innerWidth;
	bug.y = Math.random() * window.innerHeight;
	
	bug.speedX = (Math.random() > 0.5 ? -1 : 1) * (Math.random() * MAX_MOVE_SPEED / 2 + MAX_MOVE_SPEED / 2);
	bug.speedY = (Math.random() > 0.5 ? -1 : 1) * (Math.random() * MAX_MOVE_SPEED / 2 + MAX_MOVE_SPEED / 2);
	
	bug.rotation = Math.random() * 360;
	
	bug.speedRotation = Math.random() * MAX_ROATATION_SPEED / 2 + MAX_ROATATION_SPEED / 2;
	
	bugRender(bug);
	
	return bug;
}





function difficultyUp()
{	
	bugs.push(spawnRandomBug());
}


function smashBug(_bug, _index)
{	
	document.getElementById('rootpane').removeChild(_bug.image);

	bugs.splice(_index, 1);
}

function endGame()
{
	var score = (Date.now() - START_TIME) / 1000;
	
	
	clearInterval(updateTicker);
	clearInterval(difficultyTicker);
	
	var endGameDiv = document.createElement('div');
	
	endGameDiv.className = 'endgamediv';
	endGameDiv.innerHTML = 'Game Over!<br>';
	
	var resultDiv = document.createElement('div');
	
	resultDiv.className = 'result';
	resultDiv.innerHTML = 'Score: ' + score + ".<br><i><span onclick=\"retryGame()\" style=\"cursor: pointer;\">Click to retry.</span></i>";
	
	document.getElementById('rootpane').appendChild(endGameDiv);
	
	document.getElementById('rootpane').appendChild(resultDiv);
}



function retryGame()
{
	START_TIME = Date.now();
	
	document.getElementById('rootpane').innerHTML = "";
	
	bugSetup();
}


function bugUpdater()
{
	
	if (
		MOUSE_X + 10 > window.innerWidth
		||
		MOUSE_X - 10 < 0
		||
		MOUSE_Y + 10 > window.innerHeight
		||
		MOUSE_Y - 10 < 0
	)
	{
		endGame();
	}
	
	for (var i = 0; i < bugs.length; i++)
	{		
		bugs[i].rotation += bugs[i].speedRotation;
		
		if (bugs[i].rotation > 360)
		{
			bugs[i].rotation = 0;
		}
		
		if (bugs[i].type == 'chaser')
		{			
			bugs[i].x += MAX_TOWARDS_MOUSE_SPEED * (MOUSE_X - bugs[i].x) / MAX_TOWARDS_MOUSE_DISTANCE;
			bugs[i].y += MAX_TOWARDS_MOUSE_SPEED * (MOUSE_Y - bugs[i].y) / MAX_TOWARDS_MOUSE_DISTANCE;
			
			for (var j = 0; j < i; j++)
			{
				if (bugs[j].type == 'chaser')
				{
					if (Math.abs(bugs[i].x - bugs[j].x) < MAX_CHASER_PROXIMITY && Math.abs(bugs[i].y - bugs[j].y) < MAX_CHASER_PROXIMITY)
					{
						smashBug(bugs[j], j);
					}
				}
			}
		}
		else
		{
			bugs[i].x += bugs[i].speedX;
			bugs[i].y += bugs[i].speedY;
			
			if (bugs[i].x < 0)
			{
				bugs[i].speedX *= -1;
				bugs[i].x = 0;
				bugs[i].speedRotation *= -1;
			}
			if (bugs[i].y < 0)
			{
				bugs[i].speedY *= -1;
				bugs[i].y = 0;
				bugs[i].speedRotation *= -1;
			}
			if (bugs[i].x > window.innerWidth - bugs[i].image.width)
			{
				bugs[i].speedX *= -1;
				bugs[i].x = window.innerWidth - bugs[i].image.width;
				bugs[i].speedRotation *= -1;
			}
			if (bugs[i].y > window.innerHeight - bugs[i].image.height)
			{
				bugs[i].speedY *= -1;
				bugs[i].y = window.innerHeight - bugs[i].image.height;
				bugs[i].speedRotation *= -1;
			}
		}
		
		if (
			MOUSE_X > bugs[i].x
			&&
			MOUSE_X < bugs[i].x + bugs[i].image.width
			&&
			MOUSE_Y > bugs[i].y
			&&
			MOUSE_Y < bugs[i].y + bugs[i].image.height
		)
		{
			endGame();
		}
			
		
		bugRender(bugs[i]);
	}
}

function bugRender(_bug)
{
	_bug.image.style.left = _bug.x + 'px';
	_bug.image.style.top  = _bug.y + 'px';
	_bug.image.style.transform = 'rotate(' + _bug.rotation + 'deg)';
}


function mouseMoveOnHtml(_event)
{	
    MOUSE_X = _event.clientX;
    MOUSE_Y = _event.clientY;
}