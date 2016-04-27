<!-- 
Author: Roleen Nunes
Email: roleen.nunes@mail.utoronto.ca

Zoo Parade Game
-->

<html>
<head>
	<title>Zoo Parade</title>
	<link rel="stylesheet" type="text/css" href="style.css" />

	<?php
	$playerNamePHP = isset($_POST["PlayerName"]) ? $_POST["PlayerName"] : '';
	$continentPHP = isset($_POST["continent"]) ? $_POST["continent"] : '';
	?>

	<script type="text/javascript">
		var passedPlayerName = "<?php echo $playerNamePHP; ?>";
		var passedContinent = "<?php echo $continentPHP; ?>";
	</script>

	<script src="jquery.js"></script>
	<script src="svg.js"></script>
	<script src="config.js"></script>
	<script src="styleSettings.js"></script>
	
	<script src="question.js"></script>
	<script src="questionSet.js"></script>
	<script src="animal.js"></script>
	<script src="player.js"></script>
	<script src="checkpoint.js"></script>
	<script src="continent.js"></script>
	<script src="spinner.js"></script>
	<script src="game.js"></script>
	<script src="ai.js"></script>
	
</head>
<body id="body">
	<svg id="leftMap"></svg>
	<div id="center">
		<div id="zoo">
			<div id="zooHeader"><center>Zoo</center></div>
			<svg id="zoo0"></svg>
			<svg id="zoo1"></svg>
		</div>
		<div id="messageBox"><div id="messageBoxContent"></div></div>
	</div>
	<svg id="rightMap"></svg>
	<div id="question">
		<center>
			<font id="questionHeader">Question</font>
			<div id="questionContent"></div>
			<svg id="footprints"></svg>
		</center>
	</div>
	<div id="spinnerSection">
		<svg id="theGuy" width=100% height=100%></svg>
		<svg id="spinner">
			<g id="spinButtonGroup" class="button" cursor="pointer" onclick="Spin()">
			  <rect id="spinButton" cursor="pointer" />
			  <text id="spinButtonText">SPIN</text>
			</g>
		</svg>
	</div>
	<div id="answer">
		<center>
			<font id="answerHeader">Answer</font></center>
			<div id="answerContent"></div>
		</center>
	</div>
	
	<!-- Task #6130:  Add an info button that will open the instructions in a separate window -->
	<div id="infoDiv">
		<svg id="infoButton"></svg>
	</div>
	
	<!-- Issue #6088 added iframe to show zoo stories -->
	<div id="storyPopup">
		<input id="storyClose" type="button" onClick="ShowZooStoryPopup(false,'');" value="X"></input>
		<iframe id="story">
			<p>Your browser does not support iframes.</p>
		</iframe>
	</div>
	
	<script src="qA.js"></script>
	<script src="main.js"></script>

</body>
</html>