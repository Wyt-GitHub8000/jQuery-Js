$(function(){
	/* 控制游戏规则的显示与隐藏 */
	$('.rules').click(function(){
		$('.rule').stop().fadeIn(100);
	})
	$('.close').click(function(){
		$('.rule').stop().fadeOut(100);
	})
	
	/* 控制开始游戏按钮与结束界面的显示与隐藏 */
	$('.start').click(function(){
		$(this).stop().fadeOut(100);
		//当开始游戏按钮隐藏后，主界面发生下列变化
		//1.游戏进度条开始逐渐减少
		progressHandler();
		//2.开始灰太狼小灰灰动画
		startWolfAnimation();
	})
	
	/* 监听重新开始按钮的点击 */
	$('.restart').click(function(){
		//遮罩层消失，主页面重新显现
		$('.mask').stop().fadeOut(100);
		//主页面重新现象的同时，发生下列变化
		//1.进度条重新开始减少；
		progressHandler();
		//2.分数重新归零；
		$('.score').text(0);
		//3.动画重新开启
		startWolfAnimation();
	})
	
	
	/* 定义上面用到的各种函数 */
	/* 1.控制进度条的函数 */
	function progressHandler(){
		//设置进度条原始状态
		$('.progress').css({
			width:180
		});
		//通过定时器实现进度条逐渐减少效果
		var timer = setInterval(function(){
			// 思路是设置固定递减值,在当前值的基础上依次递减
			//拿到当前进度条宽度
			var progressWidth = $('.progress').width();
			//设置递减值
			progressWidth-=1;
			// 重新为进度条赋值
			$('.progress').css({
				width:progressWidth
			});
			//思考当进度条走完了怎么办？
			if(progressWidth == 0){
				//1.关闭定时器
				clearInterval(timer);
				//2.显示重新开始界面
				$('.mask').stop().fadeIn(100);
				//3.停止灰太狼小灰灰动画
				stopWolfAnimation();
			}
		},1000)
	}
	
	/* 2.控制狼动画的函数 */
	var wolfTimer; //由于狼动画还要关闭，所以不能将定时器定义在开始动画内部
	function startWolfAnimation(){
		//定义两个数组分别保存灰太狼图片和小灰灰图片
		var wolf_1 = [
			'./img/wolf/h0.png',
			'./img/wolf/h1.png',
			'./img/wolf/h2.png',
			'./img/wolf/h3.png',
			'./img/wolf/h4.png',
			'./img/wolf/h5.png',
			'./img/wolf/h6.png',
			'./img/wolf/h7.png',
			'./img/wolf/h8.png',
			'./img/wolf/h9.png',
		];
		var wolf_2 = [
			'./img/wolf/x0.png',
			'./img/wolf/x1.png',
			'./img/wolf/x2.png',
			'./img/wolf/x3.png',
			'./img/wolf/x4.png',
			'./img/wolf/x5.png',
			'./img/wolf/x6.png',
			'./img/wolf/x7.png',
			'./img/wolf/x8.png',
			'./img/wolf/x9.png',
		];
		//定义一个数组保存所以可能出现的位置
		var arrPos=[
			{left:'100px',top:'115px'},
			{left:'20px',top:'160px'},
			{left:'190px',top:'142px'},
			{left:'105px',top:'193px'},
			{left:'19px',top:'221px'},
			{left:'202px',top:'212px'},
			{left:'120px',top:'275px'},
			{left:'30px',top:'295px'},
			{left:'209px',top:'297px'},
		];
		//创建一个图片节点
		var wolfImage = $("<img src='' class='wolfimage' />");
		//生成一个随机数，用来模拟图片随机出现的位置
		var posIndex = Math.round(Math.random()*8);
		//设置图片的显示位置
		wolfImage.css({
			position: 'absolute',
			left: arrPos[posIndex].left,
			top: arrPos[posIndex].top
		})
		//设置图片类型的随机出现
		var wolfType = Math.round(Math.random()) == 0 ? wolf_1 : wolf_2;
		//设置图片内容
		window.wolfIndex = 0;
		window.wolfIndexEnd = 5;
		wolfTimer = setInterval(function(){
			if(wolfIndex > wolfIndexEnd){
				//当一个狼动画显示完毕时清楚这次显示的图片节点
				wolfImage.remove();
				//关闭当前定时器
				clearInterval(wolfTimer);
				//同时开启下次动画，出现下一个随机位置的随机图片
				startWolfAnimation();
			}
			// 当图片没有出现完,通过定时器不断的出现图片
			wolfImage.attr('src',wolfType[wolfIndex]);
			wolfIndex++;
		},150);
		//图片节点创建一次，显示不同过程中的图片是通过在定时器中修改图片的src属性实现的
		$('.container').append(wolfImage);
		//实现拍打灰太狼的效果，还是通过操作图片实现
		gameRules(wolfImage);
	}
	
	/* 定义灰太狼动画结束函数 */
	function stopWolfAnimation(){
		//动画结束是就是移出最后一张还在页面上的图片
		$('.wolfimage').remove();
		//关闭定时器
		clearInterval(wolfTimer);
	}
	
	/* 定义游戏规则函数,打老爸加十分,打孩子扣十分 */
	function gameRules(image){
		image.one('click',function(){
			//显示得分的那张图片，图片的显示又是通过索引控制的，所以效果的实现就落在了如何修改图片索引
			window.wolfIndex = 5;
			window.wolfIndexEnd = 9;
			//通过当前图片类型判断加分还是减分,图片类型的判断可通过图片的不同路径来区分
			var src=$(this).attr('src');
			var flag=src.indexOf('h')>=0;
				if(flag){
					$('.score').text(parseInt($('.score').text())+10);
				}else{
					$('.score').text(parseInt($('.score').text())-10);
				}
			}
		})
	}
})