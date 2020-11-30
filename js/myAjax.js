function obj2str(obj){
	obj.t = new Date().getDate();
	var res = [];
	for(var key in obj){
		res.push(key+'='+obj[key]);
	}
	return res.join('&');
}

function myAjax(url,obj,success,error,timeout){
	//将传入的参数转化成浏览器识别的url参数形式
	var str = obj2str(obj);
	//第一步,创建一个异步对象
	var xmh,timer;
	if(window.XMLHttpRequest){
		xmh = new XMLHttpRequest();
	}else{
		xmh = new ActiveXObject('Microsof.XMLHTTP');
	}
	//第二步，设置请求方式和请求地址
	xmh.open('GET ',url+'?'+str,true);
	//第三步，向服务器发送请求
	xmh.send();
	//第四步+第五步，监听请求状态，并在回调函数中处理服务器的响应
	xmh.onreadystatechange = function(ev){
		if(xmh.readyState === 4){
			clearInterval(timer);//请求成功的话就不要开启定时器了
			console.log('请求发送成功')
			if(xmh.status>=200 && xmh.status<=300 || xmh.status === 304){
				success(xmh);
				console.log('服务器成功响应')
			}else{
				error(xml);
				console.log('服务器未响应')
			}
		}
	}
	if(timeout){
		timer = setInterval(function(){
				xmh.abort();
				clearInterval(timer);
		},timeout)
	}
}

/* 这仅仅是按照Ajax官方步骤进行简单的封装,然后考虑一些兼容性处理问题
1.IE5/6识别不了异步对象XMLHttpRequest;
2.IE浏览器认为一个url对应一个数据,不是获取服务器实时更新的数据;
3.网络请求超时的处理
4.响应成功和响应失败的回调 
5.请求的url带参数的问题*/