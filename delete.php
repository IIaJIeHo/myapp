<?php
if(isset($_POST) == true){
	unlink(''.$_POST['filename']);
 	echo $_POST['filename'];
}
?>