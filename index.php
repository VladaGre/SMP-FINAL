<?php

	// функция генерации куков
	function generateCode($length=10) {
		// генерируем строку определенной длины для хэша
	    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789";
	    $code = "";

	    $clen = strlen($chars) - 1;

	    while (strlen($code) < $length) {
	        $code .= $chars[ mt_rand(0, $clen) ];
	    }
	    return $code;
	}

	// регистрация пользователя
	if ( isset($_POST["login"]) && isset($_POST["pass"]) && isset($_POST["name"]) && isset($_POST["surname"]) ) {

		$data = array( 	// добавляем данные в БД
    		"login" => $_POST["login"], 
    		"password" => md5(sha1($_POST["pass"])), 
    		"name" => $_POST["name"],
    		"surname"  => $_POST["surname"],
    		"studing" => "yes"
		);

		$con = new MongoClient();
		$collection = $con ->  memotes -> users;

		$collection -> insert($data);

		$person = $collection -> findOne( array("login" => $_POST["login"]) );
		$hash = md5(generateCode());

		$collection -> update(array("login" => $_POST["login"]), 
							  array('$set' => array("hash" => $hash) ),
							  array("upsert" => true));

		$user_id = $person["_id"];
		setcookie("id", $user_id, time()+3600);
		setcookie("hash", $hash,time()+3600);

		$con -> close();
		header("Location: index.php");
	}

 	if ( isset($_POST["loginSign"]) && isset($_POST["passSign"]) ) {

		$con = new MongoClient();
		$col = $con -> memotes -> users;

		$person = $col -> findOne(array("login"=>$_POST["loginSign"]));

		if ($person["password"] === md5(sha1($_POST["passSign"]))) {

			$hash = md5(generateCode());

			$col  -> update(array("login" => $_POST["loginSign"]),
							array('$set' => array("hash"=>$hash)),
							array("upsert" => true)
			);

			$user_id = $person["_id"];
			setcookie("id", $user_id, time()+3600);
			setcookie("hash", $hash,time()+3600);

			$con -> close();
			header("Location: index.php");
		}
	}

	if ( isset($_COOKIE['id']) && isset($_COOKIE['hash']) ) {
		$con = new MongoClient();
		$col = $con -> memotes -> users;

		$person = $col -> findOne(array("_id" => new MongoId($_COOKIE['id'])));

		if ($person["hash"] === $_COOKIE['hash']) {
			header("Location: main.html");
		}
	}
?>

<!DOCTYPE html>
<html>
<head>
	<title>memotes - твой помощник в важных делах</title>

	<meta charset="utf-8" />
	<link rel="stylesheet" type="text/css" href="styles_index.css"/>
</head>

<body>
	<div class="note">
		<h1>\memotes/</h1>
		<div class="sign_in">
			<!-- форма входа в аккаунт --> 
			<form method="POST">
				<input name="loginSign" type="text" placeholder="логин" autofocus required />
				<input name="passSign" type="password" placeholder="пароль" required />
				<input id="sign" type="submit" value="Войти"/>
			</form>


		</div>

		<div class="registration">
			<!-- форма регистрации --> 
			<form method="POST">
				<input name="name" type="text" placeholder="имя" autofocus required />
				<input name="surname" type="text" placeholder="фамилия" required />
				<input name="login" type="text" placeholder="логин" required onchange="check()" />
				<input name="pass" type="password" placeholder="пароль" required />
				<input id="reg" type="submit" value="Зарегистрироваться"/>
				<div id="fatal"></div>
			</form>
		</div>

		<div class="sign_buttons">
			<span>Войти</span>
			<div class="new_account">Создать аккаунт</div>
		</div>
	</div>

	<script type="text/javascript" src="index.js"></script>
</body>
</html>