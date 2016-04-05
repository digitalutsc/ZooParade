/* Authors: Luis Eduardo Munoz Alvarado, Roleen Nunes
 * Emails: luis.munozalvarado@mail.utoronto.ca, roleen.nunes@mail.utoronto.ca
 * 
 * Deals with the Questions and Answers for Zoo Parade Game
 */

// Question Sets to be used by players in the game
var player0QuestionSet = new QuestionSet();
var player1QuestionSet = new QuestionSet();

/* Updates the the player question set of the player when player
 * chooses a new animal
 * Parameter types: (Player, string)
 */
function UpdatePlayerAnimal(player, animalCSVPath)
{
	// Bug #6028 -- Question set needs to be properly cleared when a new animal is being chosen.
	// Not ding so was resulting in previous animal questions being available for subsequent 
	// questions.
	/* Removed:
	var playerQuestionSet = player0QuestionSet;
	if (player.right) playerQuestionSet = player1QuestionSet;
	*/
	var playerQuestionSet;
	if (player.right) 
	{
		player1QuestionSet = new QuestionSet();
		playerQuestionSet = player1QuestionSet;
	}
	else
	{
		player0QuestionSet = new QuestionSet();
		playerQuestionSet = player0QuestionSet;
	}

	// Bug #6028 removed
	//playerQuestionSet = new QuestionSet();
	
	var fileContent = ReadFile(animalCSVPath);
	ProcessCSV(fileContent, player.right);
}

/* Reads the csv string and stores the questions in the questions array
 * Parameter types: (String, boolean)
 */
function ProcessCSV(results, right)
{	
	var rows = results.split('\n');
	var playerQuestionSet = player0QuestionSet;
	if (right) playerQuestionSet = player1QuestionSet;

	for (var i = 1; i < rows.length; i++)
	{
		var row = rows[i].split(',');

		// Feature #6029:  Changed processing to include response text as displayed on the number dial in the physical game.
		// Feature #6088:  Changed processing to include story intro text and the zoo story name
		if (row[binaryIndex] != "" && row[typeIndex] != "" && row[questionIndex] != "" && (row[choicesIndex] != "" || row[correctIndex] != "") && (row[rightResponseIndex] != "" || row[wrongResponseIndex] != ""))
		{
			var question = row[questionIndex];
			var answer = "<br/>";

			if (row[binaryIndex].trim() == "TRUE")
			{
				if (row[correctIndex].trim() == "TRUE")
					// Removed for Feature #6029:
					// answer = correctYesHTML;
					answer = '<center> <div id="yesButton" onclick="CorrectAnswerMove(\'' + row[rightResponseIndex] + '\')">Yes</div><div id="noButton" onclick="WrongAnswerMove(\'' + row[wrongResponseIndex] + '\')">No</div> </center>';
				else
					// Removed for Feature #6029:
					// answer = correctNoHTML;
					answer = '<center> <div id="yesButton" onclick="WrongAnswerMove(\'' + row[wrongResponseIndex] + '\')">Yes</div><div id="noButton" onclick="CorrectAnswerMove(\'' + row[rightResponseIndex] + '\')">No</div> </center>';
					
			} 
			else
			{
				var choices = row[choicesIndex].split("/");
				var responses = row[rightResponseIndex].split("/");						// Feature #6029:  Added responses also parsed by '/' on the csv
				var correctAnswer = row[correctIndex].trim();
				
				for (var j = 0; j < choices.length; j++)
				{
					var label = choices[j].trim();
					var action = "WrongAnswerMove('" + responses[j].trim() + "')";		// Feature #6029:  Add responses to action.
					if (label == correctAnswer)
						action = "CorrectAnswerMove('" + responses[j].trim() + "')";
					
					answer += '<div class="mcqOption" cursor="pointer" onClick="' + action + '"><center>' + label + '</center></div><br/>';
				}
			}

			var info = "";
			if ((row.length > infoIndex) && (row[infoIndex] != "" && row[zooStoryIndex] != "" && row[zooStoryLinkTextIndex]))
			{
				info = "<br>" + row[infoIndex] + "<br><br><a href=\"#\" onClick=\"ShowZooStoryPopup(true,'" + row[zooStoryIndex] + "'); return false;\">" + row[zooStoryLinkTextIndex] + "</a>";
			}

			var questionObject = new Question(question, answer, info);

			if (row[typeIndex] == startQuestion) 
				playerQuestionSet.start.push(questionObject);
			else if (row[typeIndex] == onTrailQuestion) 
				playerQuestionSet.onTrail.push(questionObject);
				// add logic for footprint question
			else if (row[typeIndex] == captureQuestion) 
				playerQuestionSet.capture.push(questionObject);
			else if (row[typeIndex] == transportQuestion) 
				playerQuestionSet.transport.push(questionObject);
		}
	}
}

/* Takes in the type of question desired.
 * Returns an array with a random object, with a question, of the requested 
 * question type that has not already been used.
 * Parameter types: (String, boolean)
 * Return type: (array of object)
 */
function GetNextQuestion(questionType, right)
{
	var playerQuestionSet = player0QuestionSet;
	if (right) playerQuestionSet = player1QuestionSet;

	var question = GetQuestion(playerQuestionSet, questionType);

	return question;
}

/* Takes in the animal in order to get the questions related to it.
 * Reads the contents of the file and converts it to a string.
 * Parameter type: (string)
 */
function ReadFile(path)
{
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", path, false);
	txtFile.send(null);
	return txtFile.responseText;
}