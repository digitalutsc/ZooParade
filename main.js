var game = new Game();
var totalAnimationTime = 0;
var qAPair;

// Adjust all the objects on window resize
$(window).resize(function(){
	FixBodySize();
	Destroy(game);
	Setup(game);
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
	AddMessage(message);
	Proceed();
}

/* Switches players and updates question and answers */
function Proceed(){
	
	var player = game.player0;
	if (game.right) player = game.player1;

	var currentMap = '#leftMap';
	if (game.right) currentMap = '#rightMap';

	var nextMap = '#rightMap';
	if (game.right) nextMap = '#leftMap';

	if (game.gameOver){
		AddMessage("Game Over! " + game.winner.name + " won the game!");
	} else if (player.animalSelected){
		game.right = !game.right;
		$(currentMap).css('background-color', mapDarkBackgroundColor);
		$(nextMap).css('background-color', mapBackgroundColor);

		var player = game.player0;
		if (game.right) player = game.player1;
		
		UpdateQuestion();
		AddQuestionText();
		AddAnswerText();

		var message = player.name +  "'s turn";
		if (player.spin) {
			message += "<br/>Please spin the Spinner by clicking 'Spin'";
			$('#spinnerSection').animate({scrollTop: GetPanelHeight()}, 1000);
		}
		AddMessage(message);
	} else {
		AddMessage(player.name + ", please choose an animal to capture by clicking on the animal image");
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

	setTimeout(function(){
		AddInfoText();
		AddMessage(player.name + " captured " + animal.name);
	}, totalAnimationTime);
}

function AnimalTransported(player, animal){

	totalAnimationTime = 250;

	var startPosition = game.leftStartPosition;
	if (game.right) startPosition = game.rightStartPosition;

	var xDeviation = GetMapWidth() * playerPlaceholderXDeviation;
	var yDeviation = GetMapHeight() * playerPlaceholderYDeviation;

	player.placeHolder.animate(totalAnimationTime).move(startPosition.x + xDeviation, startPosition.y + yDeviation);
	player.currentAnimal = null;
	player.animalSelected = false;
	player.captured = false;
	player.move1 = true;
	player.move2 = true;
	player.move3 = true;
	

	animal.transported = true;
	ShadowAnimalImage(animal);

	setTimeout(function(){
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
function CorrectAnswerMove(){
	var player = game.player0;
	if (game.right) player = game.player1;

	var message = "Correct Answer!<br/>Check out more info in the answer section<br/>Click on 'Proceed' to continue";
	if (player.move1 || player.move2 || player.move3){
		if (player.move1){
			MovePlayer(player, player.checkpoints[0]);
			player.move1 = false;
		} else if (player.move2){
			MovePlayer(player, player.checkpoints[1]);
			player.move2 = false;
		} else if (player.move3){
			MovePlayer(player, player.checkpoints[2]);
			player.move3 = false;
		}
		setTimeout(function(){
			AddInfoText();
			AddMessage(message);
		}, totalAnimationTime);
	
	} else if (player.captured){
		AnimalTransported(player, player.currentAnimal);

	} else {
		if (player.currentCheckpoint.capture && player.currentCheckpoint.animal == player.currentAnimal){
			AnimalCaptured(player, player.currentAnimal);
		} else {
			var paths = GetPossiblePaths(player, player.steps);
			player.possiblePaths = paths;
			if (paths.length == 1){
				var path = paths[0];
				MovePlayer(player, path[path.length - 1]);
				setTimeout(function(){
					AddInfoText();
					AddMessage(message);
				}, totalAnimationTime);
			} else {
				for (var i = 0; i < player.possiblePaths.length; i++){
					SelectCheckpoint (player.possiblePaths[i][player.possiblePaths[i].length - 1]);
				}
				AddMessage("Click on one of the highlighted checkpoints to move player");
			}
		}
			
	}
}

/* Called when the player's answer is wrong 
 * Moves the player to backwards and displays the appropriate info
 */
function WrongAnswerMove(){
	var player = game.player0;
	if (game.right) player = game.player1;

	var message = "Wrong Answer!<br/>Check out more info in the answer section<br/>Click on 'Proceed' to continue";
	if (!player.move1 && !player.move2 && !player.move3 && !player.captured){
		player.steps = -1;
		MovePlayer(player, player.visitedCheckpoints[player.visitedCheckpoints.length - 1]);
	}

	setTimeout(function(){
		AddMessage(message);
		AddInfoText();
	}, totalAnimationTime);
}

/* Updates the global variable qAPair */
function UpdateQuestion(){

	var player = game.player0;
	if (game.right) player = game.player1;

	if (player.spin){
		qAPair.question = "";
		qAPair.answer = "";
		qAPair.info = "";
	} else {

		var questionType = startQuestion;
		if (player.visitedCheckpoints.length > 2) questionType = onTrailQuestion;
		if (player.currentCheckpoint != null && player.currentCheckpoint.capture && 
			player.currentCheckpoint.animal == player.currentAnimal) questionType = captureQuestion;
		if (player.captured) questionType = tranportationQuestion;

		qAPair = GetNextQuestion(questionType, game.right);
	}
	
	AddQuestionText();
	AddAnswerText();
}



/* Adds the message in the message section of the board
 * Parameter types: (String)
 */
function AddMessage(message){
	var div = document.getElementById('messageBoxContent');
	div.style.fontSize = GetMapWidth() * messageFontScale;
	div.innerHTML = '<center>' + message + '</center>';
	game.currentMessage = message;
}

/* Adds the question in the question section of the game */
function AddQuestionText(){
	var question = qAPair.question;

	document.getElementById('questionHeader').style.fontSize = GetMapWidth() * headerFontScale;

	var div = document.getElementById('questionContent');
	div.style.fontSize = GetMapWidth() * textFontScale;
	div.innerHTML = question;
	game.currentQuestion = question;
}

/* Adds the answer in the answer section of the game */
function AddAnswerText(){
	var answer = qAPair.answer;

	document.getElementById('answerHeader').style.fontSize = GetMapWidth() * headerFontScale;
	var div = document.getElementById('answerContent');
	div.style.fontSize = GetMapWidth() * textFontScale;
	div.innerHTML = answer;
	if ((answer == correctYesHTML || answer == correctNoHTML)) SetYesNoButtonStyle();
	game.currentAnswer = answer;
}

/* Adds the info text in the answer section of the game */
function AddInfoText(){
	
	var info = qAPair.info;

	var player = game.player0;
	if (game.right) player = game.player1;

	if (player.currentAnimal == null) info = "Click <a href='http://google.ca'>here</a> to know more about the transportation";
	else info = "Click <a href='http://google.ca'>here</a> to know more about " + player.currentAnimal.name;

	var div = document.getElementById('answerContent');
	div.innerHTML = '<div style="width:100%; height:80%;">'+ info + '</div>' + proceedButtonHTML;

	SetProceedButtonStyle();

}

/* Fixes the size of every element in the body when window is resized */
function FixBodySize(){
	SetBodyStyle();
	SetBorderRadius();
	SetMinHeights();
	SetQuestionAnswerTextSizes();
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


















