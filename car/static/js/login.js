(function(){
	var $loginbtn = $("#loginbtn");
	var $inputEmail = $("#inputEmail");
	var $inputPassword = $("#inputPassword");

	$loginbtn.click(function(){
		var email = $inputEmail.val();
		var password = $inputPassword.val();

		$.post("/login" , {
			"email"  : email,
			"password" : password
		},function(data){
			if(data.result == 1){
				alert("登录成功！");
				window.location = "/";
			}else{
				alert("用户名不存在或密码错误！");
			}
		})
	});
})();