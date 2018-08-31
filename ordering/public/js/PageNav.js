(function(){
	window.PageNav = PageNav;
 
		function PageNav(params){
			//自己的盒子
			this.$box = $("#" + params.boxid);
			this.$leftBtn = null;
			this.$rightBtn = null;
			this.$ellipsis1 = null;
			this.$ellipsis2 = null;
			this.$btn1 = null;
			this.$btn2 = null;
			this.$btn3 = null;
			this.$btn4 = null;
			this.$btn5 = null;
			this.$btn6 = null;
			this.$btn7 = null;
			//定死一个页数，页数从1开始
			if(!params.pageAmount || typeof params.pageAmount != "number"){
				throw new Error("必须传入pageAmount参数，且为数字");
				return;
			}
			this.pageAmount = params.pageAmount;
			//当前页
			this.page = params.nowpage || 1;
			//脏标记，默认是false，一旦调用过gotoPage就会变为true
			this.flag = false;
			//用户的委托的函数
			this.fn = params.change;
			//初始化
			this.init();
			//程序开始的时候，默认要调用一次gotoPage，以显示最初的第1页
			this.gotoPage(this.page);
			//绑定监听
			this.bindEvent();
		}
		PageNav.prototype.init = function(){
			this.$leftBtn = $("<a href='javascript:;'></a>").addClass("cBtn").html("上一页").appendTo(this.$box);
			this.$btn1 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$ellipsis1 = $("<a href='javascript:;'></a>").addClass("ellipsis").html("...").appendTo(this.$box);
			this.$btn2 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$btn3 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$btn4 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$btn5 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$btn6 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$ellipsis2 = $("<a href='javascript:;'></a>").addClass("ellipsis").html("...").appendTo(this.$box);
			
			this.$btn7 = $("<a href='javascript:;'></a>").addClass("nBtn").appendTo(this.$box);
			this.$rightBtn = $("<a href='javascript:;'></a>").addClass("cBtn").html("下一页").appendTo(this.$box);

		}
		PageNav.prototype.gotoPage = function(number){
			//【第1步：更改信号量】
			if(number >= 1 && number <= this.pageAmount){
				this.page = number;
			}else{
				throw new Error("传入的number不在区间内");
				return;
			}

			//【第2步，决定显示和隐藏和innerHTML】
			if(this.pageAmount <= 7){
				this.$ellipsis1.hide();
				this.$ellipsis2.hide();

				//决定上一页下一页隐藏
				if(this.page == 1){
					this.$leftBtn.hide();
					this.$rightBtn.show();
				}else if(this.page == this.pageAmount){
					this.$leftBtn.show();
					this.$rightBtn.hide();
				}else{
					this.$leftBtn.show();
					this.$rightBtn.show();
				}

				this.$box.find(".nBtn:lt(" + this.pageAmount + ")").show();
				this.$box.find(".nBtn:gt(" + (this.pageAmount - 1) + ")").hide();

				this.$btn1.html(1).attr("data-number",1);
				this.$btn2.html(2).attr("data-number",2);
				this.$btn3.html(3).attr("data-number",3);
				this.$btn4.html(4).attr("data-number",4);
				this.$btn5.html(5).attr("data-number",5);
				this.$btn6.html(6).attr("data-number",6);
				this.$btn7.html(7).attr("data-number",7);

				this.$box.find("a.nBtn").eq(this.page - 1).addClass("cur").siblings().removeClass("cur");
				 
			}else if(this.page < 5){
				//让第1个省略号隐藏
				this.$ellipsis1.hide();
				this.$ellipsis2.show();
				//改变HTML
				this.$btn1.show().html(1).attr("data-number",1);
				this.$btn2.show().html(2).attr("data-number",2);
				this.$btn3.show().html(3).attr("data-number",3);
				this.$btn4.show().html(4).attr("data-number",4);
				this.$btn5.show().html(5).attr("data-number",5);
				this.$btn6.show().html(6).attr("data-number",6);
				this.$btn7.show().html(this.pageAmount).attr("data-number",this.pageAmount);
				//决定cur
				this.$box.find("a.nBtn").eq(this.page - 1).addClass("cur").siblings().removeClass("cur");
				//决定上一页下一页隐藏
				if(this.page == 1){
					this.$leftBtn.hide();
					this.$rightBtn.show();
				}else{
					this.$leftBtn.show();
					this.$rightBtn.show();
				}
			}else if(this.page <= this.pageAmount - 4){
				//让省略号隐藏显示
				this.$ellipsis1.show();
				this.$ellipsis2.show();
				//改变HTML
				this.$btn1.show().html(1).attr("data-number",1);
				this.$btn2.show().html(this.page - 2).attr("data-number",this.page - 2);
				this.$btn3.show().html(this.page - 1).attr("data-number",this.page - 1);
				this.$btn4.show().html(this.page).attr("data-number",this.page);
				this.$btn5.show().html(this.page + 1).attr("data-number",this.page + 1);
				this.$btn6.show().html(this.page + 2).attr("data-number", this.page + 2);
				this.$btn7.show().html(this.pageAmount).attr("data-number",this.pageAmount);
				//决定cur
				this.$btn4.addClass("cur").siblings().removeClass("cur");

				//决定上一页下一页隐藏
				this.$leftBtn.show();
				this.$rightBtn.show();
			}else{
				//让省略号隐藏显示
				this.$ellipsis1.show();
				this.$ellipsis2.hide();
				//改变HTML
				this.$btn1.html(1).attr("data-number",1);
				this.$btn2.hide();
				this.$btn3.html(this.pageAmount - 4).attr("data-number",this.pageAmount - 4);
				this.$btn4.html(this.pageAmount - 3).attr("data-number",this.pageAmount - 3);
				this.$btn5.html(this.pageAmount - 2).attr("data-number",this.pageAmount - 2);
				this.$btn6.html(this.pageAmount - 1).attr("data-number",this.pageAmount - 1);
				this.$btn7.html(this.pageAmount).attr("data-number",this.pageAmount);
				//决定cur
				this.$box.find("a.nBtn").eq(this.page - this.pageAmount - 1).addClass("cur").siblings().removeClass("cur");

				//决定上一页下一页隐藏
				if(this.page == this.pageAmount){
					this.$leftBtn.show();
					this.$rightBtn.hide();
				}else{
					this.$leftBtn.show();
					this.$rightBtn.show();
				}
			}

			//【第3步，执行用户委托的函数】
			if(this.flag){
				this.fn(this.page);
			}
			this.flag = true;
		}

		PageNav.prototype.bindEvent = function(){
			var self = this;
			$(".nBtn").click(function(){
				var i = parseInt($(this).attr("data-number"));
				self.gotoPage(i);
			});

			this.$leftBtn.click(function(){
				var i = self.page - 1;
				 
				self.gotoPage(i);
			});

			this.$rightBtn.click(function(){
				var i = self.page + 1;
				self.gotoPage(i);
			});
		}

})();