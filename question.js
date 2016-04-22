/* Authors: Luis Eduardo Munoz Alvarado, Roleen Nunes
 * Emails: luis.munozalvarado@mail.utoronto.ca, roleen.nunes@mail.utoronto.ca
 *
 * Question Class
 */

/* Initializer for a Question object 
 * Parameter types: (string, string, string, boolean, string)
 * Task #6076:  Added multiChoice and anwerButton values to be accessed by ai module.
 */
function Question(question, answer, info, multiChoice, answerButtonID)
{
	this.question = question;
	this.answer = answer;
	this.info = info;
	this.multiChoice = multiChoice;
	this.answerButtonID = answerButtonID;
}