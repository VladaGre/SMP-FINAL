

var sign = document.querySelector(".sign_buttons span");
var reg = document.querySelector(".new_account");

var signSubmit = document.getElementById("sign");
var regSubmit = document.getElementById("reg");

var signForm = document.querySelector(".sign_in");
var regForm = document.querySelector(".registration");

// проверка на наличие данного логина в базе
function check() {
	var data = "login=" + document.querySelector("input[name='login']").value;
	var xhr = new XMLHttpRequest();
	xhr.open("post",'check.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
		if ( xhr.readyState == 4 && xhr.status == 200 ) {
			var fatal = document.getElementById("fatal");
			
			if (xhr.responseText == "In use") {
				fatal.textContent = "Этот логин уж используется";
			} else {
				fatal.textContent = "";
			}
		}
	}
	xhr.send(data);
}

reg.onclick = function() {
	signForm.style.display = "none";
	regForm.style.display = "block";

	reg.style.display = "none";
	signSubmit.style.display = "none";
	sign.style.display = "block";
	regSubmit.style.display = "block";

}

sign.onclick = function() {
	signForm.style.display = "block";
	regForm.style.display = "none";

	reg.style.display = "block";
	regSubmit.style.display = "none";
	sign.style.display = "none";
	signSubmit.style.display = "block";
}