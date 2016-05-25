<?php  
	if ($_POST['purpose'] == "name") { // достаем из ПОСТ-запроса поле "цель"
		$con = new MongoClient();	// создаем объект подключения к БД
		$col = $con ->  memotes -> users;	// переходим в БД memotes, коллекцию users
		$person = $col -> findOne(array("_id"=>new MongoId($_COOKIE['id'])));	// находим пользователя по _id

		if ($person["hash"] === $_COOKIE['hash'])	// сравниваем текущий hash с сохраненным
			echo $person["name"];					// и возвращаем имя во фронт-енд
		$con -> close();	// завершение соединения с БД
	}

	if ($_POST['purpose'] == "auth") {
		if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])) {// проверка, установлены ли куки
			$con = new MongoClient();
			$col = $con -> memotes -> users;
			$person = $col -> findOne(array("_id"=>new MongoId($_COOKIE['id'])));
			if ($person["hash"] === $_COOKIE['hash'])	// делаем то же, что и выше
				echo "ok";								// возвращаем ок в случае успеха
			else
				echo "no cookie";						// и "нет" в случае, если куков нет
		}
		else
			echo "no cookie";
	}
	
	if ($_POST["purpose"] == "exit") {	
		setcookie("id", "", time()-3600);	// удаление куков
		setcookie("hash", "",time()-3600);
		echo "Done!";
	}

	if ($_POST["purpose"] == "newNote") {
		$con = new MongoClient();
		$col = $con ->  memotes ->  records;	// подключение к коллекции заметок
		$data = array( 
    		"id" => $_COOKIE['id'], 
    		"Title" => $_POST['name'],
    		"Note" => $_POST["descript"],
    		"Dates" => $_POST["date"]
			);
		$col -> insert($data);	// функция добавления заметок
		echo "ok";
		$con -> close();	// завершение соединения с БД
	}

	if ($_POST["purpose"] == "deleteNote") {
		$con = new MongoClient();
		$col = $con -> memotes -> records;
		$person = $col -> findOne(array("Title" => $_POST["Title"], "Note" => $_POST["Note"], "Dates" => $_POST["Dates"]));	// поиск по заголовку и тексту
		if ($person["id"] == $_COOKIE['id']) {
			$col -> remove(array("Title" => $_POST["Title"], "Note" => $_POST["Note"], "Dates" => $_POST["Dates"]), array('justOne' => true));	// функция удаления заметки из БД
			echo "ok";
		}
	}

	if ($_POST["purpose"] == "import") {
		$con = new MongoClient;
		$colk = $con ->  memotes ->  records;
		$col = $con ->  memotes ->  users;
		$person = $col -> findOne(array("_id"=>new MongoId($_COOKIE['id'])));
		if ($person["hash"] == $_COOKIE["hash"]) {

			$notes = $colk -> find(array("id"=>$_COOKIE["id"]));	// нахождение всех заметок пользователя
			echo json_encode(iterator_to_array($notes));	// отправка объекта со всеми заметками
		}
		else
			echo "fail";	
	}

	if ($_POST["purpose"] == "studing") {	// проверка на значение поля "studing"

		$con = new MongoClient;
		$col = $con ->  memotes ->  users;
		$person = $col -> findOne(array("_id"=>new MongoId($_COOKIE['id'])));
		
		if ($person["studing"] == "yes") {
			echo "yes";
		} else {
			echo "no";
		}
	}

	if ($_POST["purpose"] == "deleteStuding") {
		$con = new MongoClient;
		$col = $con ->  memotes ->  users;

		$col ->  update(array("_id" => new MongoId($_COOKIE['id'])), array('$set' => array("studing"=>"no")),array("upsert" => true));	// обновления поля "studing" у конкретного пользователя
	}
?>