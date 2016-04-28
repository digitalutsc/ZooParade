/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca 
 *
 * Checkpoint class 
 */

/* Initializer for Checkpoint object
 * Parameter types : (float, float, bool, bool, bool, bool)
 */
function Checkpoint(x, y, capture, greenS, redS, hazard, index, right){
	this.x = x;
	this.y = y;
	this.capture = capture;
	this.greenS = greenS;
	this.redS = redS;
	this.hazard = hazard;
	this.index = index;
	this.right = right;

	this.animal = null;

	this.visited = false;
	this.selected = false;
	this.circle = null;
	this.letter = null;
	this.clickCircle = null;
	this.nextCheckpoints = new Array();
}

/* Creates the checkpoints for a map at the required positions and sets the status of capture point,
 * green S point, red S point and hazard point for each checkpoint for the given map
 * Parameter types: (Game, boolean)
 */
function CreateMapCheckpoints(game, map, checkpointsList, right)
{
	var capturePoints = game.leftCapturePoints;
	if (right) capturePoints = game.rightCapturePoints;

	for (var i = 0; i < positions.length; i++)
	{
		var cpSize = GetMapWidth() * checkpointSize;
		if (hazardPoints[i] || greenSPoints[i] || redSPoints[i] || capturePoints[i]) cpSize = GetMapWidth() * specialCheckpointSize;
		
		var x = (GetMapWidth() * positions[i][0] * mapScaleX) + (GetMapWidth() * moveHorizontal);
		if (right) x = (GetMapWidth() - (GetMapWidth() * positions[i][0] * mapScale)) - (GetMapWidth() * moveHorizontal);
		var y = (GetMapHeight() * positions[i][1] * mapScaleY) + (GetMapHeight() * moveVertical);
		
		if (game.created) 
		{
			checkpointsList[i].x = x;
			checkpointsList[i].y = y;
		} 
		else 
		{
			var checkpoint = new Checkpoint(x, y, capturePoints[i], greenSPoints[i], redSPoints[i], hazardPoints[i], i, right);
			checkpointsList.push(checkpoint);
		}

		CreateMapCheckpoint(game, map, checkpointsList[i], cpSize);
	}
}

/* Creates a single checkpoint 
 * Parameter types: (Game, SVG, Checkpoint, float)
 */
function CreateMapCheckpoint(game, map, checkpoint, cpSize)
{
	checkpoint.circle = map.circle(cpSize).attr({ cx: checkpoint.x, cy: checkpoint.y });
	game.svgObjects.push(checkpoint.circle);
	
	SetCheckpointColor(checkpoint);
	SetCheckpointLetter(game, checkpoint, map, cpSize);

	checkpoint.clickCircle = map.circle(cpSize).attr({ cx: checkpoint.x, cy: checkpoint.y, opacity: 0 });
	game.svgObjects.push(checkpoint.clickCircle);

	SetCheckpointClickCircleId(checkpoint);

	SetCheckpointClick(checkpoint);

	// Task #6032:  Remove checkpoint highlight on non-events
	//SetCheckpointMouseover(checkpoint);
	//SetCheckpointMouseout(checkpoint);
}

/* Links all the checkpoints in the given path based on the edges for the given map
 * Parameter types: (Game, boolean)
 */
function LinkCheckpoints(game, path, right)
{
	var checkpointsList = game.leftCheckpoints;
	if (right) checkpointsList = game.rightCheckpoints;

	for (var i = 0; i < pathEdges.length; i++)
	{
		index1 = pathEdges[i][0];
		index2 = pathEdges[i][1];

		var eWidth = GetMapWidth() * edgeWidth;

		var line = path.line(checkpointsList[index1].x, checkpointsList[index1].y, checkpointsList[index2].x, 
		checkpointsList[index2].y).stroke({ width: eWidth, color: checkpointColor });

		if (!game.created)
		{
			checkpointsList[index1].nextCheckpoints.push(checkpointsList[index2]);
			checkpointsList[index2].nextCheckpoints.push(checkpointsList[index1]);

			// Task #6122:  Remove link back between checkpoints 2 and 1 (2 is the first red spinner) so that path cannot be re-entered.
			// This should act as a one way link to get on the trail, but not off of it.
			if (i == 1)
			{
				checkpointsList[index2].nextCheckpoints.pop();
			}
		}
		game.svgObjects.push(line);
	}
}


/* Makes a capture point into a normal checkpoint after animal has fled 
 * Parameter types: (SVG, Checkpoint)
 */
function RemoveCapturePoint(map, checkpoint){
	var cpSize = GetMapWidth() * checkpointSize;
	var id = checkpoint.clickCircle.attr('id');
	id = 'N' + id.slice(1);

	checkpoint.circle.size(cpSize);
	checkpoint.circle.attr({id: id, fill: checkpointColor, 'stroke-width': 0});
	checkpoint.clickCircle.size(cpSize);

	var letterIndex = game.svgObjects.indexOf(checkpoint.letter);
	game.svgObjects[letterIndex].parent.removeElement(game.svgObjects[letterIndex]);
	game.svgObjects.splice(letterIndex, 1);
}

/* Selects the given checkpoint 
 * Parameter types: (Checkpoint) 
 */
function SelectCheckpoint(checkpoint)
{
	checkpoint.clickCircle.attr({ id: 'P' + checkpoint.index.toString()});
	checkpoint.clickCircle.attr({ fill: 'magenta', opacity: 0.65 });
	checkpoint.selected = true;
}

/* Deselects the given checkpoint
 * Parameter types: (Checkpoint)
 */
function DeselectCheckpoint(checkpoint)
{
	checkpoint.clickCircle.attr({ fill: 'black', opacity: 0 });
	SetCheckpointColor(checkpoint);
	SetCheckpointClickCircleId(checkpoint);
	checkpoint.selected = false;
}

/* Sets the onclick function for the given checkpoint 
 * Parameter types: (Checkpoint)
 */
function SetCheckpointClick(checkpoint)
{
	checkpoint.clickCircle.click(function()
										{
											if (!(ai && game.right)) SelectedCheckpointClickFunction(checkpoint);
										});
}

function SelectedCheckpointClickFunction(checkpoint)
{	
	if (checkpoint.selected && checkpoint.right == game.right) 
	{	
		var player = game.player0;
		if (game.right) player = game.player1;

		var nextPlayer = game.player1;
		if (game.right) nextPlayer = game.player0;

		var spinnerPoint = player.currentCheckpoint.redS || player.currentCheckpoint.greenS;
		MovePlayer(player, checkpoint);
		setTimeout(function()
							{
								totalAnimationTime = 0;
								if (spinnerPoint) 
								{
									Proceed();
									var message = nextPlayer.name + "'s turn";
									if (nextPlayer.spin) message += '<br/>Please spin the Spinner by clicking the "SPIN" button.';
									if (!game.gameOver) AddMessage(message);
								}
								else 
									AddInfoText();
							},
							totalAnimationTime);
	}
}

/* Sets the on mouseover function for the given checkpoint 
 * Parameter types: (Checkpoint)
 */
function SetCheckpointMouseover(checkpoint)
{
	checkpoint.clickCircle.mouseover(function()
										{
											var id = this.attr('id');
											var type = id.slice(0, 1);
											var index = parseInt(id.slice(1));
											if (type == 'N' || type == 'R' || type == 'H')
											{
												checkpoint.clickCircle.attr({fill: 'black', opacity: 0.4});
											} 
										});
}

/* Sets the on mouseout function for the given checkpoint 
 * Parameter types: (Checkpoint)
 */
			checkpoint.clickCircle.attr('opacity', 0);
function SetCheckpointMouseout(checkpoint)
{
	checkpoint.clickCircle.mouseout(function()
										{
											var id = this.attr('id');
											var type = id.slice(0, 1);
											var index = parseInt(id.slice(1));
											if (type == 'N' || type == 'R' || type == 'H')
											{
											} 
										});
}

/* Sets the colour of the given checkpoint
 * Parameter types: (Checkpoint)
 */
function SetCheckpointColor(checkpoint){
	var pointColor = checkpointColor;
	if (checkpoint.redS || checkpoint.capture) pointColor = redSPointColor;
	else if (checkpoint.hazard) pointColor = hazardPointColor;
	checkpoint.circle.attr('fill', pointColor);
	if (checkpoint.capture) checkpoint.circle.attr({'stroke-width': GetMapWidth() * 0.005});
}

/* Sets the letter of the given checkpoint
 * Parameter types: (Game, Checkpoint, SVG, float)
 */
function SetCheckpointLetter(game, checkpoint, map, cpSize){
	var letter = null;
	var letterColor = checkpointLetterColor;

	if (checkpoint.greenS || checkpoint.redS) letter = 'S';
	else if (checkpoint.hazard) letter = 'H';
	else if (checkpoint.capture) letter = 'C';
	else if (checkpoint.index < 2) letter = (checkpoint.index + 2).toString();

	if (checkpoint.redS) letterColor = "yellow";

	var textYDeviation = cpSize * checkpointTextYScale;

	if (letter != null){
		var text = map.text(letter);
		text.font({ family: "Tahoma", size: cpSize * checkpointTextSize, fill: letterColor, anchor: "middle" });
		text.move(checkpoint.x, checkpoint.y + textYDeviation);
		checkpoint.letter = text;
		game.svgObjects.push(text);
	}
}

/* Sets the id attribute of the given checkpoint's click circle
 * Parameter types: (Checkpoint)
 */
function SetCheckpointClickCircleId(checkpoint){
	var id = 'N';
	if (checkpoint.redS || checkpoint.capture) id = 'R';
	if (checkpoint.hazard) id = 'H';
	id = id + checkpoint.index.toString();
	checkpoint.clickCircle.attr('id', id);
}