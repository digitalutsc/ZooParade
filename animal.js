/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca
 *
 * Animal Class 
 */

/* Initializer for Animal Object 
 * Parameter types : (string, string, string)
 */
function Animal(name, continent, shortName)
{
	this.name = name;
	this.continent = continent;
	this.svg = {};
	this.image = null;
	this.selected = false;
	this.transported = false;
	this.shadow = null;
	this.csvPath = 'Resources/CSV/' + shortName + '.csv';
	this.svgPath = 'Resources/SVG/' + shortName + '.svg';
	this.leftImgPath = 'Resources/AnimalImages/LeftImages/' + shortName + 'Left.svg';
	this.rightImgPath = 'Resources/AnimalImages/RightImages/' + shortName + 'Right.svg';
	this.cageImgPath = 'Resources/AnimalImages/Cage/SVG/' + shortName + 'Cage.svg';
	// Feature #6029:  Render footprint images; adding image path information
	this.footprintYesImgPath = 'Resources/SVG/FootPrints/' + shortName + '_yes.svg';
	this.footprintNoImgPath = 'Resources/SVG/FootPrints/' + shortName + '_no.svg';
}


function Flee(animal, animalCheckpoint){
	
	var animalIndex = game.svgObjects.indexOf(animal.svg[animalCheckpoint.index]);
	game.svgObjects[animalIndex].parent.removeElement(game.svgObjects[animalIndex]);
	game.svgObjects.splice(animalIndex, 1);

	delete animal.svg[animalCheckpoint.index];

	var player = game.player0;
	if (game.right) player = game.player1;

	var nextPlayer = game.player1;
	if (game.right) nextPlayer = game.player0;

	player.fleeCount++;

	if (player.fleeCount == 2){
		game.gameOver = true;
		game.winner = nextPlayer;
	}
}


/* Positions animal svgs at the right position for the animals
 * Parameter types: (Game, list of Animal, boolean)
 */
function PositionAnimals(game, animals, right){

	var path = game.leftPath;
	if (right) path = game.rightPath;

	var checkpointsList = game.leftCheckpoints;
	if (right) checkpointsList = game.rightCheckpoints;

	var capturePoints = game.leftCapturePoints;
	if (right) capturePoints = game.rightCapturePoints;
	
	if (capturePoints[animal0Checkpoints[0]])
	PositionAnimal(game, animals[0], path, checkpointsList, animal0Checkpoints[0], a0C0XDeviation, a0C0YDeviation, right);
	if (capturePoints[animal0Checkpoints[1]])
	PositionAnimal(game, animals[0], path, checkpointsList, animal0Checkpoints[1], a0C1XDeviation, a0C1YDeviation, right);
	
	if (capturePoints[animal1Checkpoints[0]])
	PositionAnimal(game, animals[1], path, checkpointsList, animal1Checkpoints[0], a1C0XDeviation, a1C0YDeviation, right);
	if (capturePoints[animal1Checkpoints[1]])
	PositionAnimal(game, animals[1], path, checkpointsList, animal1Checkpoints[1], a1C1XDeviation, a1C1YDeviation, right);
	
	if (capturePoints[animal2Checkpoints[0]])
	PositionAnimal(game, animals[2], path, checkpointsList, animal2Checkpoints[0], a2C1XDeviation, a2C1YDeviation, right);
	if (capturePoints[animal2Checkpoints[1]])
	PositionAnimal(game, animals[2], path, checkpointsList, animal2Checkpoints[1], a2C1XDeviation, a2C1YDeviation, right);
}


/* Position a single animal at the checkpoint at checkpointIndex and apply 
 * the x and y deviations 
 * Parameter types: (Game, Animal, SVG, list of Checkpoint, int, float, float, boolean)
 */
function PositionAnimal(game, animal, path, checkpointsList, checkpointIndex, xDeviation, yDeviation, right) {
	
	var sign = 1;
	if (right) sign = -1;

	var image = path.image(animal.svgPath, GetMapWidth() * mapScale, GetMapHeight() * mapScale);
	image.cx(checkpointsList[checkpointIndex].x + GetMapWidth() * xDeviation * sign);
	image.cy(checkpointsList[checkpointIndex].y + GetMapHeight() * yDeviation);
	game.svgObjects.push(image);

	animal.svg[checkpointIndex] = image;
	checkpointsList[checkpointIndex].animal = animal;
}

/* Adds Animal images at the edges of the board 
 * Parameter types: (Game, list of Animal, boolean)
 */
function AddAnimalImages(game, animals, right){

	var path = game.leftPath;
	if(right) path = game.rightPath;

	var imgWidth = GetMapWidth() * mapScale * 3;
	var imgHeight = GetMapHeight() * mapScale * 2;

	var x = imgWidth / 2;
	if (right) x = GetMapWidth() - x;
	var y = GetMapHeight() * mapScale * 3;

	AddAnimalImage(game, animals[0], path, imgWidth, imgHeight, x, y, right);
	y += imgHeight * 1.02;
	AddAnimalImage(game, animals[1], path, imgWidth, imgHeight, x, y, right);
	y += imgHeight * 1.02;
	AddAnimalImage(game, animals[2], path, imgWidth, imgHeight, x, y, right);
	
}

/* Adds animal image at the edge of the board
 * Parameter types: (Game, Animal, SVG, float, float, float, float, boolean)
 */
function AddAnimalImage(game, animal, path, imgWidth, imgHeight, x, y, right){
	var imgPath = animal.leftImgPath;
	if(right) imgPath = animal.rightImgPath;

	var image = path.image(imgPath, imgWidth, imgHeight);
	image.cx(x);
	image.cy(y);
	game.svgObjects.push(image);
	animal.image = image;

	var rect = path.rect(imgWidth, imgHeight * 0.15).attr({fill: 'white', x: x - imgWidth * 0.5, y: y + imgHeight * 0.4, stroke: '#000'});
	game.svgObjects.push(rect);

	var text = path.text(animal.name);
	text.font({ family: "Tahoma", size: imgWidth * 0.08, fill: '#000', anchor: "middle" });
	text.move(x, y + imgHeight * 0.425);
	game.svgObjects.push(text);

	animal.shadow = path.rect(imgWidth, imgHeight * 0.85).attr({id:'shadow', x: x - imgWidth * 0.5, y: y - imgHeight * 0.45, fill: 'white', opacity: 0});
	game.svgObjects.push(animal.shadow);

	SetAnimalImageOnClick(animal);

	if (animal.selected) ShadowAnimalImage(animal);
}


/* Add shadow to the animal's image if the animal is
 * selected or already transported
 * Parameter types: (Animal)
 */
function ShadowAnimalImage(animal){
	animal.shadow.attr({opacity: 0.5});
	if (animal.transported) animal.shadow.attr({fill: '#000'});
}

/* Sets the onClick method for an animal image */
function SetAnimalImageOnClick(animal){
	animal.shadow.click(function(){
		if (!(ai && game.right)) AnimalImageClickFunction(animal);
	});
}

/* Adds click function to the animal images
 * Parameter types: (Animal)
 */
function AnimalImageClickFunction(animal)
{
	var player = game.player0;
	if (game.right) player = game.player1;

	if (animal.continent.checkpoints[0].right == game.right) 
	{
		if (player.currentAnimal == null && player.animalsCaptured.indexOf(animal) == -1) 
		{
			player.currentAnimal = animal;
			player.animalSelected = true;
			animal.selected = true;
			ShadowAnimalImage(animal);
			AnimalSelected(player, animal);
		}
	}
}

/* Displays the animal image in the zoo section
 * Parameter types: (Animal, boolean, int)
 */
function PutAnimalInZoo(animal, right, position){

	var zoo = game.zoo0;
	if (right) zoo = game.zoo1;

	var zooImgWidth = GetMiddleWidth() * 0.3;
	var zooImgHeight = GetMapHeight() * 0.17;

	var image = zoo.image(animal.cageImgPath, zooImgWidth, zooImgHeight);

	var zooAnimalX =  zooImgWidth * 0.57 + (position) * zooImgWidth;

	image.cx(zooAnimalX);

	game.svgObjects.push(image);
}

/* Puts all the animals in animals list in the zoo section
 * Note: this is called on resize
 * Parameter types: (list of Animal, boolean)
 */
function PutAnimalsInZoo(animals, right){
	for (var i = 0; i < animals.length; i++){
		PutAnimalInZoo(animals[i], right, i);
	}
}