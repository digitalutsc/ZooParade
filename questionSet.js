/* Authors: Luis Eduardo Munoz Alvarado, Roleen Nunes
 * Emails: luis.munozalvarado@mail.utoronto.ca, roleen.nunes@mail.utoronto.ca
 *
 * QuestionSet Class
 */

/* Initializer for a QuestionSet object */
function QuestionSet()
{
	this.start = new Array();
	this.onTrail = new Array();
	this.capture = new Array();
	this.transport = new Array();

	this.startUsed = new Array();
	this.onTrailUsed = new Array();
	this.captureUsed = new Array();
	this.transportUsed = new Array();
}


/* Returns a question of the given question type from the 
 * given question set
 * Parameter Types: (QuestionSet, int)
 * Return Type: Question
 */
function GetQuestion(questionSet, questionType)
{
	var questions = questionSet.start;
	var questionsUsed = questionSet.startUsed;

	if (questionType == onTrailQuestion)
	{
		questions = questionSet.onTrail;
		questionsUsed = questionSet.onTrailUsed;
	}
	else if (questionType == captureQuestion)
	{
		questions = questionSet.capture;
		questionsUsed = questionSet.captureUsed;
	}
	else if (questionType == transportQuestion)
	{
		questions = questionSet.transport;
		questionsUsed = questionSet.transportUsed;
	}

	if (questions.length == 0) 
		while (questionsUsed.length != 0) 
			questions.push(questionsUsed.pop());

	var index = Math.floor(Math.random() * questions.length);
	var question = questions[index];
	questionsUsed.push(question);
	Remove(questions, question);
	// footprint picture processing?

	return question;
}