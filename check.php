<?php 
	// проверка на наличие логина в БД
	$con = new MongoClient();
	$col = $con-> memotes-> users;
	$person = $col -> findOne( array("login" => $_POST["login"]));
	
	if ( empty($person["login"]) ) {
		echo "Ok";
	} else {
		echo "In use";
	}

	$con->close();
?>