/* Author: Roleen Nunes
 * Email: roleen.nunes@mail.utoronto.ca
 *
 * The game player AI for single player game 
 */

var ai = true;

/* Makes the move for the AI
 * Note: This is called when ai is true and the 
 * right player (player1) is playing
 */
function AIMove()
{
	totalAnimationTime = 1000;

	setTimeout(function()
						{
							totalAnimationTime = 0;
							var player = game.player1;

							if (player.currentAnimal == null)
							{
								// Choose an animal to capture
								var animals = new Array();
								for (var i = 0; i < player.continent.animals.length; i++)
								{
									if (player.animalsCaptured.indexOf(player.continent.animals[i]) == -1)
										animals.push(player.continent.animals[i]);
								}

								AnimalImageClickFunction(animals[Math.floor(Math.random() * animals.length)]);
							} 
							else if (player.move1 || player.move2 || player.move3 || (!player.currentCheckpoint.redS && !player.currentCheckpoint.greenS))
							{
								var rand = Math.floor(Math.random() * 9);
								if (rand <= 7)
								{
									// Correct Answer Move
									CorrectAnswerMove();

									setTimeout(function()
														{
															if (player.possiblePaths != null && player.possiblePaths.length > 1)
															{
																// Choose a path
																AIChoosePath();
															}
														}, 
														totalAnimationTime);
										
								} 
								else 
								{
									// Wrong Answer Move
									WrongAnswerMove();
								}
							} 
							else if (player.currentCheckpoint.redS || player.currentCheckpoint.greenS)
							{
								// Disable the spin button for the player
								document.getElementById("spinButtonGroup").setAttribute("onclick","");

								// Spin the spinner
								totalAnimationTime = spinnerSectionAnimationTime * 1.2;
								setTimeout(function()
													{
														totalAnimationTime = 0;
														Spin();
														// Wait for the spinner to stop spinning
														totalAnimationTime = spinnerAnimationTime + 1000;
														setTimeout(function()
																			{
																				totalAnimationTime = 0;
																				AIChoosePath();
																				document.getElementById("spinButtonGroup").setAttribute("onclick","Spin()");
																			}, 
																			totalAnimationTime);

													}, 
													totalAnimationTime);
							}
						}, 
						totalAnimationTime);
}

/* Chooses the path for the AI to move along when there are
 * multiple paths
 */
function AIChoosePath()
{
	var player = game.player1;
	var paths = player.possiblePaths;
	var path;
	var checkpoint;

	var rejectedPath = -1;
	var hazardPath = -1;

	if (paths.length == 1)
	{
		path = paths[0];
		checkpoint = path[path.length - 1];
	} 
	else 
	{
		for (var i = 0; i < paths.length; i++)
		{
			var cp = paths[i][paths[i].length - 1];
			if (cp.capture && (cp.animal == player.currentAnimal))
			{
				path = paths[i];
				break;
			} 
			if (cp.hazard) hazardPath = i;
			else 
			{
				// Remove the path if player passes by the target animal
				for (var j = 0; j < paths[i].length - 1; j++)
				{
					if (paths[i][j].animal == player.currentAnimal)
					{
						rejectedPath = i;
						break;
					}
				}
			}
		}

		var rPath;
		if (rejectedPath != -1) var rPath = Remove(paths, paths[rejectedPath]);

		var hPath;
		if(hazardPath != -1) var hPath = Remove(paths, paths[hazardPath]);

		if (path == null) path = paths[Math.floor(Math.random() * paths.length)];
		checkpoint = path[path.length - 1];

		if(rPath != null) paths.push(rPath);
		if (hPath != null) paths.push(hPath);
	}
	
	MovePlayer(player, checkpoint);

	setTimeout(function()
						{
							totalAnimationTime = 0;
							Proceed();
						}, 
						totalAnimationTime);
}