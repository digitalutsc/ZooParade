/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca
 * 
 * Player Class
 */

/* Initializer for Player object
 * Parameter types : (string, Continent, SVG, list of Checkpoint, list of boolean, boolean)
 */
function Player(name, continent, map, checkpoints, capturePoints, right){
	this.name = name;
	this.continent = continent;
	this.map = map;
	this.checkpoints = checkpoints;
	this.capturePoints = capturePoints;
	this.right = right;

	this.currentCheckpoint = null;
	this.currentAnimal = null;
	this.animalSelected = false;
	this.visitedCheckpoints = new Array();
	this.animalsCaptured = new Array();
	this.captured = false;
	this.placeHolder = null;
	this.spin = false;
	this.steps = 1;
	this.possiblePaths = null;
	this.move1 = true;
	this.move2 = true;
	this.move3 = true;

	this.fleeCount = 0;
}


/* Returns the next checkpoint for AI 
 * Parameter types : (Player, int)
 * Return type : Checkpoint
 */
function GetNextCheckpoint(player, steps){
	var moves = GetPossibleMoves(player.continent);
	return moves[Math.floor(Math.random() * moves.length)];
}


/* Gets all possible paths that the player can take in steps number of steps
 * Parameter type: (Player, int)
 * Return type: list of list of Checkpoint
 */
function GetPossiblePaths(player, steps){
	
	var prev = Remove(player.currentCheckpoint.nextCheckpoints, player.visitedCheckpoints[player.visitedCheckpoints.length - 1]);
	var allPaths = GetPaths([[player.currentCheckpoint]], steps);
	player.currentCheckpoint.nextCheckpoints.push(prev);
	return allPaths;
}


/* Recursively finds all possible paths from the given path list 
 * steps steps away
 * Parameter type: (list of list of Checkpoint, int)
 * Return type: list of list
 */
function GetPaths(pathList, steps){

	if (steps == 0){
		return pathList;
	}
	var newPathList = new Array();
	
	for (var i = 0; i < pathList.length; i++){
		var lastCp = pathList[i][pathList[i].length - 1];
		var previousCp = null;

		if (pathList[i].length > 1){
			previousCp = Remove(lastCp.nextCheckpoints, pathList[i][pathList[i].length - 2]);
		}

		for (var j = 0; j < lastCp.nextCheckpoints.length; j++){
			var path = pathList[i].slice();
			path.push(lastCp.nextCheckpoints[j]);
			newPathList.push(path);
		}

		if (previousCp != null){
			lastCp.nextCheckpoints.push(previousCp);
		}
	}
	return GetPaths(newPathList, steps - 1);
}


/* Add the checkpoint to the visited checkpoints of the player 
 * Parameter types : (Player, Checkpoint)
 */
function AddVisitedCheckpoint(player, checkpoint){
	player.visitedCheckpoints.push(checkpoint);
}

function VisitCheckpoint(player, checkpoint, pass)
{
	if (checkpoint.capture)
	{
		if (player.currentAnimal == checkpoint.animal)
		{
			if (pass)
			{
				// Animal flees from the capture point
				checkpoint.capture = false;
				player.capturePoints[checkpoint.index] = false;
				RemoveCapturePoint(player.map, checkpoint);
				Flee(checkpoint.animal, checkpoint);
			}
		} 
	}
}

/* Add the animal to the list of animals captured of the player
 * Parameter types : (Player, Animal)
 */
function AddAnimalsCaptured(player, animal){
	player.animalsCaptured.push(animal);
}

/* Adds placeholders for both the players 
 * Parameter types: (Game, boolean)
 */
function AddPlayerPlaceHolder(game, right){
	var player = game.player0;
	if (right) player = game.player1;

	var map = game.leftMap;
	if (right) map = game.rightMap;

	var sign = 1;
	if (right) sign = -1;

	var imgSrc = 'Resources/Player0.png';
	if (right) imgSrc = 'Resources/Player1.png';

	var position = game.leftStartPosition;
	if (right) position = game.rightStartPosition;

	if (player.currentCheckpoint != null) position = {x: player.currentCheckpoint.x, y: player.currentCheckpoint.y};
	if (player.captured) position = {x: player.currentAnimal.image.cx(), y: player.currentAnimal.image.cy()};

	player.placeHolder = map.image(imgSrc, GetMapWidth() * mapScale * playerPlaceHolderScale, 
							GetMapHeight() * mapScale * playerPlaceHolderScale);
	player.placeHolder.cx(position.x + GetMapWidth() * playerPlaceHolderXScale * sign);
	player.placeHolder.cy(position.y + GetMapHeight() * playerPlaceHolderYScale);

	game.svgObjects.push(player.placeHolder);
}

/* Moves the player to the given checkpoint
 * Parameter types: (Player, Checkpoint)
 */
function MovePlayer(player, checkpoint)
{

	if (player.currentCheckpoint != null) AddVisitedCheckpoint(player, player.currentCheckpoint);

	var scrollUp = player.currentCheckpoint != null && (player.currentCheckpoint.redS || player.currentCheckpoint.greenS);

	if (player.steps > 0) MoveForward(player, checkpoint);
	else MoveBackwards(player, checkpoint);

	player.currentCheckpoint = checkpoint;
	player.steps = 1;
	player.spin = (checkpoint.redS || checkpoint.greenS);

	setTimeout(function()
						{
					    	VisitCheckpoint(player, player.currentCheckpoint, false);
					    	if (player.currentCheckpoint.hazard)
					    	{
					    		player.steps = -2;

					    		// Task #6089:  Add hazard text to user display.
					    		var hazardText = "";
					    		if (player.currentCheckpoint.index == 19)
					    		{	hazardText = "Animal alarmed &mdash; Back 2 towards fresh trail.";
					    		}
					    		else //if (player.currentCheckpoint.index == 30)
					    		{	hazardText = "Storm &mdash; Trail blocked &mdash; Go back 2 towards fresh trail.";
					    		}

					    		AddMessage(hazardText);
					    		//alert(player.currentCheckpoint.index);
					    		MovePlayer(player, player.visitedCheckpoints[player.visitedCheckpoints.length - 2]);
					    		//alert("afterMovePlayer\nTotalanimationtime is " + totalAnimationTime);
					    	}
						}, 
						totalAnimationTime);

	if (scrollUp) $('#spinnerSection').animate({scrollTop: -GetPanelHeight()}, 1000);
}

/* Moves the given player forward 
 * Parameter types: (Player, Checkpoint, float, float, float)
 */
function MoveForward(player, checkpoint)
{
	var xDeviation = GetMapWidth() * playerPlaceholderXDeviation;
	var yDeviation = GetMapHeight() * playerPlaceholderYDeviation;

	var path;
	if (player.possiblePaths != null){
		for (var i = 0; i < player.possiblePaths.length; i++){

			DeselectCheckpoint(player.possiblePaths[i][player.possiblePaths[i].length - 1]);
			if (player.possiblePaths[i][player.possiblePaths[i].length - 1] == checkpoint) path = player.possiblePaths[i];
		}
	}

	if (player.steps > 1){
		
		var totalDistance = 0;
		var distances = new Array();
		for (var i = 0; i < path.length - 1; i++){
			var distance = Math.pow(Math.pow(path[i].x - path[i+1].x, 2) + Math.pow(path[i].y - path[i+1].y, 2), 0.5);
			totalDistance += distance;
			distances.push(distance);
		}
		
		totalAnimationTime = totalDistance / GetMapWidth() * playerMoveSpeed;
		MovePlayerAnimation(player, path, totalDistance, distances, xDeviation, yDeviation, true);

	} else {

		totalAnimationTime = 150;
		player.placeHolder.animate(150).move(checkpoint.x + xDeviation, checkpoint.y + yDeviation);
	}
}

/* Moves the given player backwards 
 * Parameter types: (Player, Checkpoint, float, float, float)
 */
function MoveBackwards(player, checkpoint)
{
	var xDeviation = GetMapWidth() * playerPlaceholderXDeviation;
	var yDeviation = GetMapHeight() * playerPlaceholderYDeviation;

	player.visitedCheckpoints.pop();
	if (player.steps < -1)
	{
		var path = new Array();
		while (player.steps != 0)
		{
			path.push(player.visitedCheckpoints.pop());
			player.steps++;
		}

		var totalDistance = 0;
		var distances = new Array();
		for (var i = 0; i < path.length - 1; i++)
		{
			var distance = Math.pow(Math.pow(path[i].x - path[i+1].x, 2) + Math.pow(path[i].y - path[i+1].y, 2), 0.5);
			totalDistance += distance;
			distances.push(distance);
		}
		
		totalAnimationTime = totalDistance / GetMapWidth() * playerMoveSpeed;
		MovePlayerAnimation(player, path, totalDistance, distances, xDeviation, yDeviation, false);

	} 
	else 
	{
		totalAnimationTime = 150;
		player.placeHolder.animate(150).move(checkpoint.x + xDeviation, checkpoint.y + yDeviation);
		player.visitedCheckpoints.pop();
	}
}

/* Animates Player placeholder's movement along the path 
 * Parameter types: (Player, list of Checkpoint, float, float, float, float, float, boolean)
 */
function MovePlayerAnimation(player, path, totalDistance, distances, xDeviation, yDeviation, forward){
	var i = 1;
	var animationTime = (distances[i] / totalDistance) * totalAnimationTime;

	player.placeHolder.animate(animationTime).move(path[i].x + xDeviation, path[i].y + yDeviation);
	i++;

	function animationLoop () {
		animationTime = (distances[i - 1] / totalDistance) * totalAnimationTime;
		setTimeout(function () {
			if (i < path.length) {
				if (forward){
					VisitCheckpoint(player, path[i - 1], true);
					AddVisitedCheckpoint(player, path[i - 1]);
				}
				player.placeHolder.animate(animationTime).move(path[i].x + xDeviation, path[i].y + yDeviation);
				i++;
				animationLoop();
			}
		}, animationTime);
	}
	animationLoop();
}