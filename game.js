/* Initializes a Game Object */
function Game(){

	// SVG objects for Left map
	this.leftMap = SVG('leftMap');
	this.leftPath = this.leftMap.nested();
	this.leftCheckpoints = new Array();

	// SVG objects for Right map
	this.rightMap = SVG('rightMap');
	this.rightPath = this.rightMap.nested();
	this.rightCheckpoints = new Array();

	this.spinnerSection = SVG('spinner');	// SVG object for the Spinner section

	this.svgObjects = new Array();			// Array of all svg objects in the game

	// Initial positions of Player placeholders 
	this.leftStartPosition;
	this.rightStartPosition;

	// Continents in this game
	this.continent0;
	this.continent1;

	// Players in this game
	this.player0;
	this.player1;

	this.right = false;			// keeps track of the turns

	// Animal Capture points for players in the game
	this.leftCapturePoints = capturePoints.slice();
	this.rightCapturePoints = capturePoints.slice();

	this.currentMessage = "Welcome to Zoo Parade!";
	this.currentQuestion = "";
	this.currentAnswer = "";

	this.created = false;
}

/* Starts the game by initializing all the game variables 
 * Parameter types: (Game)
 */
function StartGame(game){
	Setup(game);
}


/* Sets up the game graphics */
function Setup(game){
	
	AddStartArrows(game, false);
	AddStartArrows(game, true);

	// Creates Left Map
	CreateMapCheckpoints(game, game.leftMap, game.leftCheckpoints, false);
	LinkCheckpoints(game, game.leftPath, false);

	// Creates Right Map
	CreateMapCheckpoints(game, game.rightMap, game.rightCheckpoints, true);
	LinkCheckpoints(game, game.rightPath, true);

	// Set continent names and continent animals
	var continent0Name = 'North America';
	var continent0Animals = [new Animal('Moose', continent1Name, 'Moose'), 
							new Animal('Grizzly Bear', continent1Name, 'Grizzly'), 
							new Animal('Big Horn', continent1Name, 'Bighorn')];

	var continent1Name = 'Asia';
	var continent1Animals = [new Animal('Indian Rhinoceros', continent1Name, 'Rhinoceros'), 
							new Animal('Indian Elephant', continent1Name, 'Elephant'), 
							new Animal('Bengal Tiger', continent1Name, 'Tiger')];

	// Create two Continent objects
	game.continent0 = new Continent(continent0Name, continent0Animals, game.leftCheckpoints);
	game.continent1 = new Continent(continent1Name, continent1Animals, game.rightCheckpoints);

	// Add names of continents to the maps
	AddContinentName(game, continent0Name, false);
	AddContinentName(game, continent1Name, true);

	// Add the svg images of animals to the map
	PositionAnimals(game, continent0Animals, false);
	PositionAnimals(game, continent1Animals, true);

	// Add the pictures on the edges of the board
	AddAnimalImages(game, continent0Animals, false);
	AddAnimalImages(game, continent1Animals, true);

	CreateSpinner(game);
	
	if (game.player0 == null && game.player1 == null){
		game.player0 = new Player("Player0", game.continent0, game.leftMap, game.leftCheckpoints, game.leftCapturePoints, false);
		game.player1 = new Player("Player1", game.continent1, game.rightMap, game.rightCheckpoints, game.rightCapturePoints, true);
	}

	AddPlayerPlaceHolder(game, false);
	AddPlayerPlaceHolder(game, true);

	AddQuestionText(game.currentQuestion);
	AddAnswerText(game.currentAnswer);
	AddMessage(game.currentMessage);

	game.created = true;
}


/* Destroys the svg objects of the game */
function Destroy(game){

	for(var i = 0; i < game.svgObjects.length; i++){
		game.svgObjects[i].parent.removeElement(game.svgObjects[i]);
	}
	game.svgObjects = new Array();
}


/* Adds the red start arrows to the board */
function AddStartArrows(game, right){
	var map = game.leftMap;
	if (right) map = game.rightMap;

	var polygonCoordinates = new Array();
	var xDeviation = GetMapWidth() * arrowXDeviation;
	var yDeviation = GetMapHeight() * arrowYDeviation;
	var cpSize = GetMapWidth() * checkpointSize;

	for (var i = 0; i < arrowPolygonCoordinates.length; i++){
		var x = arrowPolygonCoordinates[i][0] * GetMapWidth() * 0.015 + xDeviation;
		if (right) x = GetMapWidth() - x;
		var y = arrowPolygonCoordinates[i][1] * GetMapHeight() * 0.015 + yDeviation;
		polygonCoordinates.push([x, y]);
	}

	var arrow = map.polygon(polygonCoordinates).fill('red').stroke({width: GetMapWidth() * 0.003});
	var cx = polygonCoordinates[3][0];
	var cy = (polygonCoordinates [3][1] + polygonCoordinates[5][1]) * 0.5;
	var arrowCircle = map.circle(cpSize).attr({ cx: cx, cy: cy, fill: 'red', stroke:'yellow', 'stroke-width': GetMapWidth() * 0.003});
	var text = map.text('1');
	text.font({ family: "Tahoma", size: cpSize * checkpointTextSize, anchor: 'middle', fill: 'yellow' });
	text.move(cx, cy + cpSize * checkpointTextYScale);

	game.svgObjects.push(arrow);
	game.svgObjects.push(arrowCircle);
	game.svgObjects.push(text);

	if (right) game.rightStartPosition = {x: cx - GetMapWidth() * 0.003, y: cy};
	else game.leftStartPosition = {x: cx + GetMapWidth() * 0.001, y: cy};
}











































