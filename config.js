/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca
 *
 * Contains all the configurations for Zoo Parade Game
 */


// Indices of the continents
var northAmericaIndex = 0;
var southAmericaIndex = 1;
var asiaIndex = 2;
var africaIndex = 3;

var continentNames = ["North America", "South America", "Asia", "Africa"];
var continentAnimalNames = [["Moose", "Grizzly Bear", "Big Horn"], 
							 ["Jaguar", "Tapir", "Capuchin Monkey"], 
							 ["Indian Rhinoceros", "Indian Elephant", "Bengal Tiger"], 
							 ["Lion", "Giraffe", "Zebra"]];
var continentAnimalShortNames = [["Moose", "Grizzly", "Bighorn"], 
								  ["Jaguar", "Tapir", "Capuchin"], 
								  ["Rhinoceros", "Elephant", "Tiger"], 
								  ["Lion", "Giraffe", "Zebra"]];

var binaryIndex = 0;
var typeIndex = 1;
var questionIndex = 2;
var choicesIndex = 3;
var correctIndex = 4;
var rightResponseIndex = 5;				// Feature #6029:  Added right/wrongResponseIndex for importing dial response text from csv files.
var wrongResponseIndex = 6;
var infoIndex = 7;

var startQuestion = 1;
var onTrailQuestion = 2;
var captureQuestion = 3;
var transportQuestion = 4;


var minScreenWidthScale = 0.96;		// Restrict horizontal scaling
var minScreenHeightScale = 0.8;		// Restrict vertical scaling

// Map Scales
var mapScale = 0.097;
var mapScaleX = 0.097;
var mapScaleY = 0.078;
var mapWidthScale = 0.34;
var mapHeightScale = 0.65;
var middleSectionWidthScale = 0.25;
var panelHeightScale = 0.27;
var spinnerSectionHeightDeviation = 1.16;

// Spinner Board Scales
var spinnerBoardWidthScale = 0.75;
var spinnerBoardHeightScale = 0.75;
var spinnerBoardXScale = 0.05;
var spinnerBoardYScale = 0.03;

// Spinner Pin Scales
var pinWidthScale = 0.4;
var pinHeightScale = 0.4;
var pinCXDeviation = 0.245;
var pinCYDeviation = 0.236;
var pinCenterXScale = 0.008;
var pinCenterYScale = 0.005;

// Spinner Button Scales
var spinButtonXScale = 0.97;
var spinButtonYScale = 0.25;
var spinButtonRXScale = 0.1;
var spinButtonRYScale = 0.1;
var spinButtonWidthScale = 0.35;
var spinButtonHeightScale = 0.2;
var spinButtonTextXScale = 0.5;
var spinButtonTextYScale = 0.6;

var moveHorizontal = 0;			// Move the maps horizontally
var moveVertical = 0;			// Move the maps vertically

// Relative position of all the checkpoints
var positions = [[2, 1.2], [3, 1.2], 
			[4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2.5],
			[4, 3], [4.7, 3.2], [9.5, 3.3],
			[4, 4], [5.4, 3.7], [6.5, 4], [7.3, 3.7], [8.2, 3.8], [9.5, 4.2],
			[5.7, 4.5],
			[4, 5.3], [5.3, 5.5], [7.3, 5.5], [8.2, 5.1], [9.5, 5.3],
			[4.2, 6.6], [5, 6.8], [6.1, 6.8], [9.5, 6.5],
			[4.3, 7.6], [5.1, 7.7], [6.2, 7.9], [7.3, 7.2], [8.3, 7.1],[9.5, 7.5],
			[4.4, 8.4], [5.3, 8.6], [9.4, 8.4],
			[4, 9.5], [5, 9.5], [6, 9.5], [7, 9.5], [8, 9.5], [9, 9]];

// Booleans representing the capture point status of every checkpoint
var capturePoints = [false, false, false, false, false, true, false, false, false, false, 
					false, false, true, false, false, false, false, false, true, false, 
					true, false, false, false, false, false, true, false, false, false, 
					false, false, false, false, false, false, false, false, true, false, 
					false, false];

// Booleans representing the greenS point status of every checkpoint
var greenSPoints = [false, false, false, false, false, false, false, false, false, false, 
					true, false, false, false, true, false, false, false, false, false, 
					false, false, false, false, true, false, false, false, false, true, 
					false, false, false, true, false, false, false, false, false, false, 
					false, true];

// Booleans representing the redS point status of every checkpoint
var redSPoints = 	[false, false, true, false, false, false, false, false, false, false, 
					false, false, false, false, false, true, false, false, false, false, 
					false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false, false, false, false, false, false, 
					false, false];

// Booleans representing the hazard point status of every checkpoint
var hazardPoints = [false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false, false, false, false, false, true, 
					false, false, false, false, false, false, false, false, false, false, 
					true, false, false, false, false, false, false, false, false, false, 
					false, false];

// All the edges in the maps
var pathEdges = [[0 ,1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
				[7, 10], [10, 16], [16, 22], [22, 26], [26, 32], [32, 35], [35, 41],
				[41, 40], [40, 39], [39, 38], [38, 37], [37, 36], [36, 33], [33, 27],
				[27, 23], [23, 18], [18, 11], [11, 8], [8, 2], [8, 9], [9, 12], [12, 17],
				[17, 13], [13, 14], [14, 15], [15, 16], [27, 24], [24, 19], [19, 17], 
				[33, 28], [28, 25], [25, 20], [20, 21], [21, 16], [37, 34], [34, 29], 
				[29, 30], [30, 31], [31, 32]];

// Relative positions of the red arrow
var arrowPolygonCoordinates = [[-5,5], [-5,10], [20,10], [20,12], [24,7.5], [20,3], [20,5]];

var arrowXDeviation = -0.19;
var arrowYDeviation = 0.005;

var checkpointSize = 0.045;				// Size of normal checkpoints
var specialCheckpointSize = 0.06;		// Size of special checkpoints
var checkpointTextYScale = -0.5;		// Y scale of special checkpoints text
var checkpointTextSize = 0.7;	// Size of special checkpoints text 
var edgeWidth = 0.013;					// Width of the lines joining checkpoints

// Animal capture points indices
var animal0Checkpoints = [5, 20];
var animal1Checkpoints = [18, 26];
var animal2Checkpoints = [12, 38];

// Deviation of Animals from Capture Checkpoints
var a0C0XDeviation = 0.019;
var a0C0YDeviation = 0.056;

var a0C1XDeviation = - 0.04;
var a0C1YDeviation = - 0.055;

var a1C0XDeviation = 0.05;
var a1C0YDeviation = -0.07;

var a1C1XDeviation = -0.06;
var a1C1YDeviation = -0.06;

var a2C0XDeviation = 0.01;
var a2C0YDeviation = -0.065;

var a2C1XDeviation = 0.01;
var a2C1YDeviation = -0.065;

var created = false;	// Boolean representing the map created


// Continent name variables
var continentNameSize = 0.7;
var continentNameX = 0.63;
var continentNameY = 0.02;

// Spinner variables
var prevAngle = -147;
var pinAngleDeviation = -147;
//var angles = [0, 0, 54, 54, 90, 126, 126, 180, 180, 234, 234, 306, 306, 270];
// LW - changed angles to allow better viewing of spinner numbers
var angles = [15, 15, 69, 69, 97, 141, 141, 195, 195, 249, 249, 321, 321, 277];
var redNumbers = [5, 5, 6, 6, 3, 4, 4, 5, 5, 4, 4, 6, 6, 3];
var greenNumbers = [2, 2, 1, 1, 4, 3, 3, 2, 2, 3, 3, 1, 1, 4];

// Text variables
var fontFamily = 'Courier';

// Color variables
var mapBackgroundColor = '#FFFF66';
var mapDarkBackgroundColor = '#BABA4B';
var darkBackgroundColor = '#4A2500';
var continentNameColor = 'red';
var checkpointColor = 'green';
var redSPointColor = 'red';
var greenSPointColor = 'green';
var capturePointColor = 'red';
var hazardPointColor = '#2595BA';
var checkpointLetterColor = "white";


// Player Placeholder Variables
var playerPlaceHolderScale = 0.65;
var playerPlaceHolderXScale = -0.002;
var playerPlaceHolderYScale = -0.011;
var playerMoveSpeed = 1500;
var playerPlaceholderXDeviation = -0.033;
var playerPlaceholderYDeviation = -0.045;

// Question Answer div variables
var correctYesHTML = '<center> <div id="yesButton" onclick="CorrectAnswerMove()">Yes</div>' + 
						'<div id="noButton" onclick = "WrongAnswerMove()">No</div> </center>';

var correctNoHTML = '<center> <div id="yesButton" onclick="WrongAnswerMove()">Yes</div>' + 
						'<div id="noButton" onclick = "CorrectAnswerMove()">No</div> </center>';

var proceedButtonHTML = '<center><div id="proceedButton" onclick="Proceed()">Proceed</div></center>' 

var headerFontScale = 0.05;
var textFontScale = 0.03;
var messageFontScale = 0.04;
var zooHeaderFontScale = 0.12;

var spinnerAnimationTime = 2000;
var spinnerSectionAnimationTime = 1000;