var pin;
var spinnerBoard;

/* Creates the Spinner object */
function CreateSpinner(){

	var theGuy = SVG('theGuy');
	var image = theGuy.image('Resources/Images/theGuy.png', GetPanelHeight() * 0.8, GetPanelHeight() * 0.8);
	image.cx(GetMiddleWidth() * 0.47);
	image.cy(GetPanelHeight() * 0.46);
	game.svgObjects.push(image);

	spinnerBoard = game.spinner.image('Resources/spinner.png', GetPanelHeight() * spinnerBoardWidthScale, 
					GetPanelHeight() * spinnerBoardHeightScale);
	FixSpinnerBoardPosition();
	game.svgObjects.push(spinnerBoard);


	pin = game.spinner.image('Resources/pin.png', GetPanelHeight() * pinWidthScale, GetPanelHeight() * pinHeightScale);
	pin.cx(pin.cx() + GetPanelHeight() * pinCXDeviation);
	pin.cy(pin.cy() + GetPanelHeight() * pinCYDeviation);
	game.svgObjects.push(pin);
	var pinCenter = GetPinCenter();

	CreateSpinButton();

	var center = GetSpinnerBoardCenter();
	pin.transform({rotation: prevAngle, cx: center.x, cy: center.y});
}

/* Creates the spin button for the spinner */
function CreateSpinButton(){
	var buttonWidth = GetPanelHeight() * spinButtonWidthScale;
	var buttonHeight = GetPanelHeight() * spinButtonHeightScale;

	var buttonPosition = GetButtonPosition();
	var spinButton = document.getElementById("spinButton");
	spinButton.setAttributeNS(null, 'x', buttonPosition.x);
	spinButton.setAttributeNS(null, 'y', buttonPosition.y);
	spinButton.setAttributeNS(null, 'rx', GetPanelHeight() * spinButtonRXScale);
	spinButton.setAttributeNS(null, 'ry', GetPanelHeight() * spinButtonRYScale);
	spinButton.setAttributeNS(null, 'width', buttonWidth);
	spinButton.setAttributeNS(null, 'height', buttonHeight);
	spinButton.setAttributeNS(null, 'fill', darkBackgroundColor);
	
	var spinButtonText = document.getElementById("spinButtonText");
	spinButtonText.setAttribute('text-anchor', "middle");
	spinButtonText.setAttribute('x', buttonPosition.x + buttonWidth * spinButtonTextXScale);
	spinButtonText.setAttribute('y', buttonPosition.y + buttonHeight * spinButtonTextYScale);
	spinButtonText.setAttribute('font-family', fontFamily);
	spinButtonText.setAttribute('font-size', GetMapWidth() * 0.04);
}


/* Spins the Spinner pin */
function Spin(){
	var right = game.right;
	var player = game.player0;
	if (right) player = game.player1;

	if (right == player.right && player.spin){
		var center = GetSpinnerBoardCenter();
		pin.transform({rotation: prevAngle, cx: center.x, cy: center.y});

		var index = Math.floor(Math.random() * angles.length);
		var angle = angles[index];
		var magnitude = 360 * (Math.floor(Math.random() * 7) + 3);
		var direction = [1, -1][Math.floor(Math.random() * 2)];
		pin.animate(2000).rotate(magnitude * direction + angle + pinAngleDeviation, center.x , center.y);
		prevAngle = angle + pinAngleDeviation;

		player.steps = greenNumbers[index];
		if (player.currentCheckpoint.redS) player.steps = redNumbers[index];
		player.spin = false;

		setTimeout(function(){
			var paths = GetPossiblePaths(player, player.steps);
			player.possiblePaths = paths;
			for(var i = 0; i < paths.length; i++){
				var path = paths[i];
				SelectCheckpoint(path[path.length - 1]);
				AddMessage("Click on one of the highlighted checkpoints to move player");
			}
		}, 2000);
	} else {
		AddMessage("You can use the spinner only at a Spin checkpoint");
	}	
}

/* Returns the coordinates of the center of the spinner image
 * Return type: dictionary
 */
function GetSpinnerBoardCenter(){
	return ({'x': spinnerBoard.cx(), 'y': spinnerBoard.cy()});
}

/* Returns the coordinates of the center of the pin image
 * Return type: dictionary
 */
function GetPinCenter(){
	var center = GetSpinnerBoardCenter();
	return ({'x': center.x + GetPanelHeight() * pinCenterXScale, 'y': center.y + GetPanelHeight() * pinCenterYScale});
}

/* Returns the position coordinates of the position of the spin button
 * Return type: dictionary
 */
function GetButtonPosition(){
	return ({'x': GetPanelHeight() * spinButtonXScale, 'y': GetPanelHeight() * spinButtonYScale});
}

/* Fixes the position of the spinner board */
function FixSpinnerBoardPosition(){
	var x = spinnerBoard.cx() + GetPanelHeight() * spinnerBoardXScale;
	var y = spinnerBoard.cy() + GetPanelHeight() * spinnerBoardYScale;
	spinnerBoard.cx(x);
	spinnerBoard.cy(y);
}






