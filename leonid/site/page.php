<html>
	<body>
			<h1> <?php echo $_GET['p']; ?> </h1>
			<p style="font-size: 15pt;">
				<?php echo nl2br( file_get_contents($_GET['p']. '.php') ); ?>
			</p>
			
	</body>
</html>