(function(){
	var $inputEmail = $("#inputEmail");
	var $submitbtn = $("#submitbtn");
	var $inputPassword1 = $("#inputPassword1");
	var $inputPassword2 = $("#inputPassword2");
	var $strengthbox = $("#strengthbox");

	//验证email的正则表达式
	function checkEmail(){
		//得到email地址
		var email = $inputEmail.val();
		//正则验证
		if(!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]{2,}$/.test(email)){
			//没有通过正则验证
			//框框变红
			//动态上一个提示文字
			$inputEmail.addClass('is-invalid');
			$inputEmail.siblings("div.invalid-feedback").remove();
			$inputEmail.after("<div class='invalid-feedback'>请输入正确的Email地址</div>");
			return false;
		}

		//当正则通过的时候，发Ajax请求验证用户名是否被占用
		$.ajax({
			"type" : "CHECKOUT" , 
			"url" : "/regist" ,
			"data" : {
				email : email
			},
			"success" : function(data){
				if(data.result != 0){
					$inputEmail.addClass('is-invalid');
					$inputEmail.siblings("div.invalid-feedback").remove();
					$inputEmail.after("<div class='invalid-feedback'>Email地址已经被占用</div>");
				}else{
					$inputEmail.addClass('is-valid');
				}
			}
		});

		return true;
	}


	//验证密码
	function checkPassword(){
		var password1 = $inputPassword1.val();
		//先验证密码长度，6~16位
		if(!(password1.length >= 6 && password1.length <= 16)){
			$inputPassword1.addClass('is-invalid');
			$inputPassword1.siblings("div.invalid-feedback").remove();
			$inputPassword1.after("<div class='invalid-feedback'>密码长度必须是6~16位</div>");
			return false;
		}

		//验证密码的合法性
		if(/[^0-9a-zA-Z\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\<\>\,\>\?\/\\]/g.test(password1)){
			$inputPassword1.addClass('is-invalid');
			$inputPassword1.siblings("div.invalid-feedback").remove();
			$inputPassword1.after("<div class='invalid-feedback'>密码只能是数字、小写字母、大写字母、符号</div>");
			return false;
		}

		return true;
	}

	//密码强度验证
	function checkPasswordStrength(){
		var password1 = $inputPassword1.val();
		$strengthbox.show();
		//密码强度的验证
		//基础0分，有小写字母、数字、大写字母、符号各加1分。
		var score = 0;
		if(/[0-9]/g.test(password1)){
			score ++;
		}
		if(/[a-z]/g.test(password1)){
			score ++;
		}
		if(/[A-Z]/g.test(password1)){
			score ++;
		}
		if(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\<\>\,\>\?\/\\]/g.test(password1)){
			score ++;
		}
		//让他们显示颜色
		$(".strengthgrid").css("background-color","#eee");
		$(".strengthgrid:lt(" + score + ")").each(function(){
			$(this).css("background-color" , $(this).data("color"));
		});
		 
		return score;
	}


	//【事件监听】
	//当光标离开email框的时候
	$inputEmail.blur(function(){
		//验证Email
		checkEmail();
	});

	//当email框得到焦点的时候
	$inputEmail.focus(function(){
		//框框去掉红色，去掉后面的提示文字
		$inputEmail.removeClass('is-invalid').removeClass('is-valid').next("div.invalid-feedback").remove();
	});

	//当光标离开密码框的时候
	$inputPassword1.blur(function(){
		//验证密码
		if(checkPassword()){
			//验证密码强度
			if(checkPasswordStrength() >= 3){
				$inputPassword1.addClass('is-valid');
				$strengthbox.hide();
			}else{
				$inputPassword1.addClass('is-invalid');
				$inputPassword1.siblings("div.invalid-feedback").remove();
				$inputPassword1.after("<div class='invalid-feedback'>密码强度不够</div>");
			}
		}
	});

	//当密码框得到焦点的时候
	$inputPassword1.focus(function(){
		//框框去掉红色，去掉后面的提示文字
		$inputPassword1.removeClass('is-invalid').removeClass('is-valid').next("div.invalid-feedback").remove();
	});

	//当密码框实时输入的时候
	$inputPassword1.bind("input",function(){
		var password1 = $inputPassword1.val();
		if(password1.length >= 6 && password1.length <= 16){
			checkPasswordStrength();
		}else{
			$strengthbox.hide();
		}
	});

	//点击提交按钮之后做的事情
	$submitbtn.bind("click",function(){
		var email = $inputEmail.val();
		var password1 = $inputPassword1.val();
		var password2 = $inputPassword2.val();

		//验证Email地址之后验证密码的强度
	 
		if(checkEmail() && checkPassword()){
		 
			if(checkPasswordStrength() < 3){
				alert("密码强度不够！");
				return;
			} 

			if(password1 != password2){
				alert("两次输入的密码不相同！");
				return;
			}

			//发出请求 
			$.post("/regist" , {
				email : email,
				password1 : password1,
				password2 : password2
			},function(data){
				if(data.result == 1){
					alert("注册成功！请登录！");
					window.location = "/login";
				}else if(data.result == -1){
					alert("服务器错误，请稍后再试");
				}else if(data.result == -2){
					alert("用户名被占用");
				}
			});
		}
	});
})();