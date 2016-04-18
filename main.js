/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca
 *
 * Zoo Parade Game's main class
 */

// Get the Player's continent and name (read in in gameplay.php)
var continent0Name = passedContinent;
if (continent0Name == "") {
	continent0Name = continentNames[Math.floor(Math.random() * continentNames.length)];
}

var player0Name = passedPlayerName;
if (player0Name == "") {
	player0Name = 'Zoo Director';
}

// Set Player's continent animal names
var continent0Index = northAmericaIndex;
if (continent0Name != "North America"){
	if (continent0Name == "South America") continent0Index = southAmericaIndex;
	else if (continent0Name == "Asia") continent0Index = asiaIndex;
	else continent0Index = africaIndex;
}
var continent0AnimalNames = continentAnimalNames[continent0Index];
var continent0AnimalShortNames = continentAnimalShortNames[continent0Index];

// Remove the continent player chose from the list of continents
Remove(continentNames, continent0Name);

// Randomly choose a continent for the AI from the remaining continents
var continent1Name = continentNames[Math.floor(Math.random() * continentNames.length)];
var player1Name = "Computer";

var continent1Index = northAmericaIndex;
if (continent1Name != "North America"){
	if (continent1Name == "South America") continent1Index = southAmericaIndex;
	else if (continent1Name == "Asia") continent1Index = asiaIndex;
	else continent1Index = africaIndex;
}
var continent1AnimalNames = continentAnimalNames[continent1Index];
var continent1AnimalShortNames = continentAnimalShortNames[continent1Index];

// Start a new Game
var game = new Game();
var totalAnimationTime = 0;
var qAPair;

// Adjust all the objects on window resize
$(window).resize(function(){
	FixBodySize();
	Destroy(game);
	Setup(game);
	PutAnimalsInZoo(game.zoo0Animals, false);
	PutAnimalsInZoo(game.zoo1Animals, true);
});


FixBodySize();
Setup(game);
AddMessage(game.player0.name + ", please choose an animal to capture by clicking on the animal image");

/* This function is called when an animal is selected by the 
 * player to capture
 */
function AnimalSelected(player, animal){

	var nextPlayer = game.player0;
	if (nextPlayer == player) nextPlayer = game.player1;

	var message = nextPlayer.name + "'s turn";
	if (nextPlayer.currentAnimal == null) message = nextPlayer.name + ", please choose an animal to capture by clicking on the animal image";

	UpdatePlayerAnimal(player, animal.csvPath);

	player.animalSelected = true;
	player.visitedCheckpoints = new Array();
	player.currentCheckpoint = null;
	player.fleeCount = 0;
	AddMessage(message);
	Proceed();
}

/* Switches players and updates question and answers */
function Proceed()
{
	if (totalAnimationTime == 0)
	{
		var player = game.player0;
		if (game.right) player = game.player1;

		var currentMap = '#leftMap';
		if (game.right) currentMap = '#rightMap';

		var nextMap = '#rightMap';
		if (game.right) nextMap = '#leftMap';
		
		if (game.gameOver)
		{
			AddMessage("Game Over! " + game.winner.name + " won the game!");
		}
		else if (player.animalSelected)
		{
			game.right = !game.right;
			$(currentMap).css('background-color', mapDarkBackgroundColor);
			$(nextMap).css('background-color', mapBackgroundColor);

			var player = game.player0;
			if (game.right) player = game.player1;
			UpdateQuestion();

			var message = player.name +  "'s turn";
			if (player.spin && !game.gameOver) 
			{
				message += "<br/>Please spin the Spinner by clicking 'Spin'";
				$('#spinnerSection').animate({scrollTop: GetPanelHeight()}, spinnerSectionAnimationTime);
			}
			AddMessage(message);
		}
		else
		{
			AddMessage(player.name + ", please choose an animal to capture by clicking on the animal image");
		}
		if (ai && game.right) AIMove();
	}
}

/* Called when animal is captured by the player */
function AnimalCaptured(player, animal){

	totalAnimationTime = 500;

	var xDeviation = GetMapWidth() * playerPlaceholderXDeviation;
	var yDeviation = GetMapHeight() * playerPlaceholderYDeviation;
	
	player.animalsCaptured.push(animal);
	player.captured = true;
	// Move Player placeholder to the captured animal's image
	player.placeHolder.animate(totalAnimationTime).move(animal.image.cx() + xDeviation, animal.image.cy() + yDeviation);
	player.possiblePaths = null;

	setTimeout(function(){
		totalAnimationTime = 0;
		AddInfoText();
		AddMessage(player.name + " captured " + animal.name);
	}, totalAnimationTime);
}

/* Called when animal is transported to the zoo by the player */
function AnimalTransported(player, animal){

	totalAnimationTime = 250;

	var startPosition = game.leftStartPosition;
	if (game.right) startPosition = game.rightStartPosition;

	var continent = player.continent;

	var xDeviation = GetMapWidth() * playerPlaceholderXDeviation;
	var yDeviation = GetMapHeight() * playerPlaceholderYDeviation;

	player.placeHolder.animate(totalAnimationTime).move(startPosition.x + xDeviation, startPosition.y + yDeviation);
	player.currentAnimal = null;
	player.currentCheckpoint = null;
	player.animalSelected = false;
	player.captured = false;
	player.move1 = true;
	player.move2 = true;
	player.move3 = true;
	
	var zooAnimals = game.zoo0Animals;
	if (player.right) zooAnimals = game.zoo1Animals;

	zooAnimals.push(animal);

	PutAnimalInZoo(animal, player.right, zooAnimals.length - 1);
	animal.transported = true;
	ShadowAnimalImage(animal);

	setTimeout(function(){
		totalAnimationTime = 0;
		AddInfoText();
		AddMessage(player.name + " transported " + animal.name + " to the zoo!");
	}, totalAnimationTime);

	if (player.animalsCaptured.length == 3) {
		game.gameOver = true;
		game.winner = player;
	}
}

/* Called when the player's answer is correct 
 * Moves the player to ahead and displays the appropriate info
 */
 // Feature #6029:  Changed function to pass dial response text based on dial is physical game.
 // Added variable "responseText" that will contain the text read in from the csv files.
 // It defaults to blank; a blank value will cause the function to acts as it originally did and
 // just use the response "Correct Answer!".
function CorrectAnswerMove(responseText = "")
{
	if (totalAnimationTime == 0)
	{
		var player = game.player0;
		if (game.right) player = game.player1;

		// Feature #6029:  Main changes made to change output message displayed in message box.  
		var message = responseText;
		if (message == "")
			message = "Correct Answer!";
		
		message += "<br/>Check out more info in the answer section<br/>Click on 'Proceed' to continue";

		if (player.move1 || player.move2 || player.move3)
		{
			if (player.move1)
			{
				MovePlayer(player, player.checkpoints[0]);
				player.move1 = false;
			} 
			else if (player.move2)
			{
				MovePlayer(player, player.checkpoints[1]);
				player.move2 = false;
			}
			else if (player.move3)
			{
				MovePlayer(player, player.checkpoints[2]);
				player.move3 = false;
			}
			
			setTimeout(function()
								{
									totalAnimationTime = 0;
									AddInfoText();
									AddMessage(message);
								}, 
								totalAnimationTime);
		}
		else if (player.captured)
			AnimalTransported(player, player.currentAnimal);
		else 
		{
			if (player.currentCheckpoint.capture && player.currentCheckpoint.animal == player.currentAnimal)
			{
				AnimalCaptured(player, player.currentAnimal);
			} 
			else
			{
				var paths = GetPossiblePaths(player, player.steps);
				player.possiblePaths = paths;
				if (paths.length == 1)
				{
					var path = paths[0];
					//Task #6089 put MovePlayer after animation so that hazard text would supersede answer response text.
					setTimeout(function()
										{
											totalAnimationTime = 0;
											AddInfoText();
											AddMessage(message);
										},
										totalAnimationTime);
					MovePlayer(player, path[path.length - 1]);
				} 
				else 
				{
					for (var i = 0; i < player.possiblePaths.length; i++)
					{
						SelectCheckpoint (player.possiblePaths[i][player.possiblePaths[i].length - 1]);
					}

					AddMessage("Click on one of the highlighted checkpoints to move player");
				}
			}	
		}
	}
}

/* Called when the player's answer is wrong 
 * Moves the player to backwards and displays the appropriate info
 */
 // Feature #6029:  Changed function to pass dial response text based on dial is physical game.
 // Added variable "responseText" that will contain the text read in from the csv files.
 // It defaults to blank; a blank value will cause the function to acts as it originally did and
 // just use the response "Wrong Answer!".
function WrongAnswerMove(responseText = "")
{
	if (totalAnimationTime == 0)
	{
		var player = game.player0;
		if (game.right) player = game.player1;

		var message = responseText;
		if (message == "")
			message = "Wrong Answer!";

		message += "<br/>Check out more info in the answer section<br/>Click on 'Proceed' to continue";

		//Task #6089 put MovePlayer (if statement) after animation so that hazard text would supersede answer response text.
		// CAPTURE ISSUE --> wrong capture should be back 2!
		setTimeout(function()
							{
								totalAnimationTime = 0;
								AddMessage(message);
								AddInfoText();
							},
							totalAnimationTime);

		if (!player.move1 && !player.move2 && !player.move3 && !player.captured)
		{
			player.steps = -1;
			MovePlayer(player, player.visitedCheckpoints[player.visitedCheckpoints.length - 1]);
		}
	}
}

/* Updates the global variable qAPair */
function UpdateQuestion()
{
	var player = game.player0;
	if (game.right) player = game.player1;

	if (player.animalSelected)
	{
		if (player.spin)
		{
			qAPair = new Question("", "", "");
		} 
		else 
		{
			var questionType = startQuestion;
			if (player.visitedCheckpoints.length > 2) questionType = onTrailQuestion;
			if (player.currentCheckpoint != null && player.currentCheckpoint.capture && 
				player.currentCheckpoint.animal == player.currentAnimal) questionType = captureQuestion;
			if (player.captured) questionType = transportQuestion;

			qAPair = GetNextQuestion(questionType, game.right);
		}
		
		AddQuestionText();
		AddAnswerText();
	}
}

/* Adds the message in the message section of the board
 * Parameter types: (String)
 */
function AddMessage(message)
{
	var div = document.getElementById('messageBoxContent');
	div.style.fontSize = GetMapWidth() * messageFontScale;
	div.innerHTML = '<center>' + message + '</center>';
	game.currentMessage = message;
}

/* Adds the question in the question section of the game */
function AddQuestionText()
{
	if (qAPair != null)
	{	
		var question = qAPair.question;
		document.getElementById('questionHeader').style.fontSize = GetMapWidth() * headerFontScale;
		var div = document.getElementById('questionContent');
		div.style.fontSize = GetMapWidth() * textFontScale;
		
		// Feature #6029:  Render footprint
		game.footprints.clear();

		if(/Footprints_/.test(question))
		{
			div.style.height = '50%';

			var image;
			var player = game.player0;
			if (game.right) player = game.player1;

			var width = GetMapWidth() * 0.90;
			var height = width/9;
			
			if (/Footprints_yes/.test(question))
			{
				image = game.footprints.image(player.currentAnimal.footprintYesImgPath, width, height);
				game.svgObjects.push(image);
				question = question.replace("Footprints_yes","");

			}
			else if (/Footprints_no/.test(question))
			{
				image = game.footprints.image(player.currentAnimal.footprintNoImgPath,width,height);
				game.svgObjects.push(image);
				question = question.replace("Footprints_no","");
			}
		}

		div.innerHTML = question;
		game.currentQuestion = question;
	}
}

/* Adds the answer in the answer section of the game */
function AddAnswerText()
{
	if (qAPair != null)
	{
		var answerHeader = document.getElementById('answerHeader');
		answerHeader.innerHTML = "Answer";
		answerHeader.style.fontSize = GetMapWidth() * headerFontScale;

		var answer = qAPair.answer;

		var div = document.getElementById('answerContent');
		div.style.fontSize = GetMapWidth() * textFontScale;
		div.innerHTML = answer;
		// Feature #6029:  Need to change this as the variables "correctYesHTML", and "correctNoHTML" are no longer used.
		// Removed:
		//if ((answer == correctYesHTML || answer == correctNoHTML)) SetYesNoButtonStyle();
		if (/yesButton/.test(answer)) SetYesNoButtonStyle();
		game.currentAnswer = answer;
	}		
}

/* Adds the info text in the answer section of the game */
function AddInfoText()
{
	if (qAPair != null)
	{
		var answerHeader = document.getElementById('answerHeader');
		answerHeader.style.fontSize = GetMapWidth() * headerFontScale;
		answerHeader.innerHTML = "Information";

		var info = qAPair.info;

		if (info == null || info == "") info = "<br>There is no additional information available.";
		
		var player = game.player0;
		if (game.right) player = game.player1;

		var div = document.getElementById('answerContent');
		div.innerHTML = '<div style="width:100%; height:80%;">'+ info + '</div>' + proceedButtonHTML;

		SetProceedButtonStyle();
	}
}

/* Fixes the size of every element in the body when window is resized */
function FixBodySize(){
	SetBodyStyle();
	SetBorderRadius();
	SetMinHeights();
	SetTextSizes();
	SetZooSectionBorders();
}

/* Removes the element from the list
 * Parameter types: (list of object, object)
 * Return type: object
 */
function Remove(list, element){
	var index = list.indexOf(element);
	if (index > -1){
		list.splice(index, 1);
	}
	return element;
}

/* Task #6088:  Set zoo story popup iframe visibility */
function ShowZooStoryPopup(showStory, storyName)
{
	var storyPath = './Resources/zooStories/' + storyName + '.html';
	if (showStory)
	{
		document.getElementById("story").src = storyPath;
		document.getElementById("storyPopup").style.visibility = "visible";
	}
	else
		document.getElementById("storyPopup").style.visibility = "hidden";
}
