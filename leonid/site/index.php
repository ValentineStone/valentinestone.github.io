<html>
	<head>
		<title>Leonid Fine Art</title>
		
		<!--<script type="text/javascript">
			function my_resize_function() {
				var h = window.innerHeight;
				var w = window.innerWidth;
				if (h/w > 0.85) {
					document.getElementById("header_image").style.width = '100%';
				} else {
					document.getElementById("header_image").style.width = '33%';
				}
			}
		</script>-->
	</head>
	<!--<body onresize="my_resize_function()">
			<div align="center"> <img id="header_image" src="header.png" width="33%" onload="my_resize_function()"> </div>
			
			<h1> <?php echo $_GET['p']; ?> </h1>
			<p style="font-size: 15pt;">
				<?php echo nl2br( file_get_contents($_GET['p']. '.php') ); ?>
			</p>
			
	</body>-->
	<body>
		<iframe
			id="links_iframe"
			name="links_iframe"
			src="links.php"
			style="position:fixed; top:0px; left:0px; width:20%; height:100%;"
		></iframe>
		<iframe
			id="page_iframe"
			name="page_iframe"
			src="page.php?p=<?php echo $_GET['p']; ?>"
			style="position:fixed; top:0px; right:0px; width:79.3%; height:100%;"
		></iframe>
	</body>
</html>