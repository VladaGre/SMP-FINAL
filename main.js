

var newTitle = document.getElementById("new-title"); 
var newText = document.getElementById("new-text");						
var listNotes = document.querySelector(".list-notes");					
var allTitleNotes = document.querySelectorAll(".list-notes .title");	

existNote(); // достаем заметки из базы

// создаем объект обучения
var enjoyhint_instance = new EnjoyHint({});
var enjoyhint_script_steps = [ // это последовательность обучения с настройками и текстом
	{
		'next .notes': 'Перед вами основной интерфейс MEMOTES',
		'showSkip' : false,
		'nextButton' : {text: "Далее"}
	},
	{
		'key #new-title' : 'Введите заголовок новой заметки и кликните SPACE (пробел)',
		'keyCode' : 32,
		'showSkip' : false
	},
	{
		'key #new-text' : 'Введите текст и добавьте заметку при помощи ENTER',
		'ctrlKey': true,
		'keyCode' : 13,
		'showSkip' : false
	},
	{
		'next .count-point' : 'Как видите, количество заметок изменилось',
		'showSkip' : false,
		'nextButton' : {text: "Далее"}
	},
	{
		'key #new-title' : 'Снова введите какой-нибудь заголовок и кликните ENTER',
		'keyCode' : 13,
		'showSkip' : false
	},
	{
		'click .title' : 'Нажмите на заголовок',
		'showSkip' : false
	},
	{
		'next .list-notes li' : 'Появился текст заметки',
		'showSkip' : false
	},
	{
		'click .edit' : 'Кликните EDIT для редактирования заметки',
		'showSkip' : false
	},
	{
		'next header div' : 'Добавляем изменения, нажав ENTER',
		'showSkip' : false,
		'nextButton' : {text: "Далее"}
	},
	{
		'next .notes': 'MEMOTES станет вашим надежным помощником! Удачи :)',
		'showSkip' : false,
		'nextButton' : {text: "Закрыть"}
	}
];

// проверять куки на наличие каждые 2с
function checkCookie() {
	var xhr = new XMLHttpRequest();
	xhr.open("post",'model.php', true); // отправляем запрос в Модель
	var data = "purpose=auth"; // цель запроса
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 && xhr.status == 200 ) { // если запрос успешен
			if (xhr.responseText =="no cookie")
				location.href = "index.php";	// если нет куков, перенаправляем на страницу входа
		}
	}
	xhr.send(data); // отправка запроса
	setTimeout("checkCookie()", 2000); // перепроверяем куки каждые 2 секунды
}

// получение данных об обучении
function checkStuding() {
	var xhr = new XMLHttpRequest();
	xhr.open("post",'model.php', true);
	var data = "purpose=studing";
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()  {
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			if (xhr.responseText =="yes") {
				deleteStuding();	// обучение происходит только при первом заходе в акк
				enjoyhint_instance.set(enjoyhint_script_steps); // загружаем последовательность шагов
				enjoyhint_instance.run(); // включаем обучение
			}
		}
	}	
	xhr.send(data);
}

// выключение обучения
function deleteStuding() {
	var xhr = new XMLHttpRequest();
	xhr.open("post",'model.php', true);
	var data = "purpose=deleteStuding";
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()  {
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			if (xhr.responseText =="yes") {
			}
		}
	}	
	xhr.send(data);	
}

// отображение имени пользователя
function userName() {
	var xhr = new XMLHttpRequest();
	xhr.open("post",'model.php', true);
	var data = "purpose=name";
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()  {
		if( xhr.readyState == 4 && xhr.status == 200 ) {
			document.getElementById('name').textContent = xhr.responseText; // подгружаем из базы имя пользователя
		}
	}
	xhr.send(data);
}

// подгрузка существующих заметок из БД
function existNote() {

	userName();		// подгружаем имя юзера
	checkStuding();	// проверка обучения
	checkCookie();	// проверка куков
	
	var xhr = new XMLHttpRequest();
	xhr.open("post",'model.php', true);
	var data = "purpose=import";
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()  {
		if( xhr.readyState == 4 && xhr.status == 200 ) {
			for(var s in JSON.parse(xhr.responseText)) {
				var title = JSON.parse(xhr.responseText)[s].Title;
				var note = JSON.parse(xhr.responseText)[s].Note;
				var date = JSON.parse(xhr.responseText)[s].Dates;
				addNote(title, note, date);
			}
		}
	}
	xhr.send(data);	
}

// выход из аккаунта
function exit() {
	var xhr = new XMLHttpRequest();
	var data = "purpose=exit";

	xhr.open("post",'model.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()  {

		if( (xhr.readyState == 4)&&(xhr.status == 200) ) {

			if (xhr.responseText == "Done!") {
				location.href = "index.php";	// выход из акка и перенаправление на страницу входа
			}
		}
	}
	xhr.send(data);
}

function getEditNote() {
	var allEditButtons = document.querySelectorAll("span.edit");
	for (var i = 0; i < allEditButtons.length; i++) {
		allEditButtons[i].onclick = function(event) {
			var title = event.target.parentElement.childNodes[0].textContent;	// получаем заголовок
			var text = event.target.parentElement.parentElement.children[1].textContent;	// получаем текст
			var date = event.target.parentElement.parentElement.children[2].textContent;
			var xhr = new XMLHttpRequest();

			xhr.open("post",'model.php', true);
			var data ="purpose=deleteNote&Title=" + title + "&Note=" + text
						+ "&Dates=" + date;	// прикрепляем текст и заголовок к запросу на сервер
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {

				if ( xhr.readyState == 4 && xhr.status == 200 ) {

					if (xhr.responseText == "ok") {
						newTitle.value = title;		// добавляем заголовок в поле редактирования
						newText.value = text;		// то же проделываем с основным текстом
						event.target.parentElement.parentElement.remove();	// удаляем заметку из базы данных
						getCountNotes();
					}
				}
			}
			xhr.send(data);
		}
	}
}

// удалить заметку при помощи двойного клика
function getRemoveNote() {
	var allTextNotes = document.querySelectorAll(".list-notes .text");
	for (var i = 0; i < allTextNotes.length; i++) {
		allTextNotes[i].ondblclick = function(event) {

			var xhr = new XMLHttpRequest();
			xhr.open("post",'model.php', true);
			var data ="purpose=deleteNote&Title=" + event.target.parentElement.children[0].childNodes[0].data +
					"&Note=" + event.target.textContent
					+ "&Dates=" + event.target.parentElement.children[2].childNodes[0].data;	// цепляем к запросу данные о заметке
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
				if( xhr.readyState == 4 && xhr.status == 200 ) {
					if(xhr.responseText == "ok") {
						event.target.parentElement.remove();	// удаляем из HTML-дерева заметку
						getCountNotes();	// обновляем количество текущих заметок
					}
				}
			}
			xhr.send(data);
		}
	}
}

// переключатель отображения заметок (появление/исчезновение основного текста заметки)
function getTextNote() {
	for (var i = 0; i < allTitleNotes.length; i++) {
		allTitleNotes[i].onclick = function(event) {
			if (event.target.parentElement.children[1].style.display) {
				event.target.parentElement.children[1].style.display = "";
				event.target.parentElement.children[2].style.display = "";
			} else {
				event.target.parentElement.children[1].style.display = "block";
				event.target.parentElement.children[2].style.display = "block";
			}
		}
	}	
}

// обновление количества заметок
function getCountNotes() {
	allTitleNotes = document.querySelectorAll(".list-notes .title");	// получаем массив заголовков заметок
	var countNotes = document.querySelector('.count-point span');

	countNotes.textContent = allTitleNotes.length;	// подгружаем количество заметок в нужное поле HTML

}

// добавление заметки
function addNote(title, note, date=false, s=0) {
	// собираем шаблон заметки
	// выглядит примерно так:
	// <li>
	// 	<div class="title">
	// 		Заголовок
	// 		<span class="edit">edit</span>
	// 	</div>
	// 	<div class="text">
	// 		Текст заметки
	// 	</div>
	// 	<div class="data">
	// 		Время добавления заметки
	// 	</div>
	// </li>

	if (title == "" && note == "") return;

	var t, n;
	if (!date) {
		date = new Date();
		date = date.toString();
		date = date.slice(0, date.indexOf(' GMT'));
		date = "Последнее редактирование: " + date;
	}
	
	var template = document.createElement('li');
	var divTitle = document.createElement('div');
	var divText = document.createElement('div');
	var divDate = document.createElement('div');
	var editButton = document.createElement('span');
	editButton.textContent = "edit";

	t = document.createTextNode(title);
	n =  document.createTextNode(note);
	d =  document.createTextNode(date);

		
    if (note == "\n" || note == "") n = document.createTextNode("Удалить заметку? (двойной клик)");


	editButton.setAttribute('class', 'edit');
	divTitle.setAttribute('class', 'title');
	divText.setAttribute('class', 'text');
	divDate.setAttribute('class', 'date');
	
	divTitle.appendChild(t);
	divTitle.appendChild(editButton);
	divText.appendChild(n);
	divDate.appendChild(d);
	template.appendChild(divTitle);
	template.appendChild(divText);
	template.appendChild(divDate);

	if (s) {	// переключатель s нужен, чтобы отправлять/не отправлять запрос в базу на создание новой заметки

		var xhr = new XMLHttpRequest();
		xhr.open("post",'model.php', true);
		var data = "purpose=newNote&name=" + t.textContent +
					"&descript=" + n.textContent
					+ "&date=" + d.textContent;
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function()  {

			if ( xhr.readyState == 4 && xhr.status == 200 ) {
				if (xhr.responseText == "ok") {
					listNotes.appendChild(template);

					// очищаем поля и обновляем количество текущих заметок
					allTitleNotes = document.querySelectorAll(".list-notes .title");
					getTextNote();
					getRemoveNote();
					getEditNote();
					getCountNotes();

					// переносим фокус на введение заголовка новой заметки
					newTitle.focus();
					return;
				}
			}
		}

		xhr.send(data);
	}

	listNotes.appendChild(template);

	// очищаем поля и обновляем количество текущих заметок
	newTitle.value = "";
	newText.value = "";
	allTitleNotes = document.querySelectorAll(".list-notes .title");
	getTextNote();
	getRemoveNote();
	getEditNote();
	getCountNotes();

	// переносим фокус на введение заголовка нового заметки
	newTitle.focus();
}

// получение доступа к тексту заметки после введения заголовка
newTitle.onclick = function(event) {
	newText.disabled = false;
}

// добавление только заголовка
newTitle.onkeyup = function(event) {
	 if (event.keyCode == 13) {
		addNote(newTitle.value, newText.value, false, 1);	//отслеживание Enter
	}	
}

// добавление заметки с текстом
newText.onkeyup = function(event) {
	 if (event.keyCode == 13) {		//отслеживание Enter
		addNote(newTitle.value, newText.value, false, 1);
	}
}

