/* Authors: Luis Eduardo Munoz Alvarado, Roleen Nunes
 * Emails: luis.munozalvarado@mail.utoronto.ca, roleen.nunes@mail.utoronto.ca
 *
 * Question Class
 */

/* Initializer for a Question object 
 * Parameter types: (string, string, string, boolean, string, int)
 * Task #6076:  Added multiChoice and anwerButton values to be accessed by ai module.
 * Task #6122:  Added steps that a wrong answer would penalise a player.
 */
function Question(question, answer, info, multiChoice, answerButtonID, wrongSteps)
{
	this.question = question;
	this.answer = answer;
	this.info = info;
	this.multiChoice = multiChoice;
	this.answerButtonID = answerButtonID;
	this.wrongSteps = wrongSteps;
}