/* 移动端屏幕适配常用方案有两种,一种是简单适配方案,一种是通用适配方案
无论是哪种适配方案利用的原理都是一样的,只不过前者无需考虑设备像素比(DPR)
而后者需要考虑设备像素比,因为在高清屏下1dpr可能等于两个像素 */

//简单适配方案
var ratio = 18.75; //一般来说设定系数是为了方便px与rem的换算,750的设计稿系数一般都为18.75
var viewWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth; //不同浏览器获取视口宽度的方式不同,||运算符就是做了兼容性处理
document.documentElement.style.fontSize = viewWidth/ratio+'px'; //规定1rem=?px
//缺点:每次视口宽度改变都要手动刷新页面才能看到变化,利用js函数化编程
px2rem();//项目打开就单位转化
window.addEventListener('resize',px2rem);//监测到屏幕尺寸变化就重新执行函数
function px2rem(){
	var ratio = 18.75;
	var viewWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;
	document.documentElement.style.fontSize = viewWidth/ratio + 'px';
}
//还是有缺陷,该方法只在当前html代码中有效,如果其他的页面也需要做页面适配呢?更好的方案是将代码抽离出来封装为一个js文件。
//js文件是抽离出来了,由于js不像java一样方法前可以加private,public等访问限定修饰符,所以就存在这样一个问题,多个js变量
//命名相同的问题和我们设置的一些参数(如：ratio)可以被随意修改的问题。
//如果不考虑代码复用性差的问题(因为我们还是希望一些变量是可以共享的)，一种好的解决方案就是匿名函数闭包来解决，
//所谓闭包的本质就是一个立即执行函数
(function(){
	vpx2rem();//项目打开就单位转化
	window.addEventListener('resize',px2rem);//监测到屏幕尺寸变化就重新执行函数
	function px2rem(){
	var ratio = 18.75;
	var viewWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;
	document.documentElement.style.fontSize = viewWidth/ratio + 'px';
}
})();



//通用适配方案,这是一种应用更为广泛的适配的方案,毕竟随着技术的发展,给用户更好的体验已经成为前端开发人员的共识,
//简单适配方案在高清的屏幕下存在1px边框的问题,给用户不好的体验
//通用适配方案就是在做移动端屏幕适配的时候将设备的dpr考虑进去,在单位转化的同时考虑屏幕的缩放,主要利用meta标签中的一些缩放属性


//对多次用到的数据再赋值,避免每次都写的大长
var docEl = document.documentElement;
//通过Css3新增的属性选择选择带viewport的meta标签
var viewPortEl = document.querySelector("meta[name='viewport']");
//获取设备的dpr
var dpr = window.devicePixelRatio || 1; //获取不到时默认为1
//对dpr做简单处理,因为设备dpr不一定为整数,为了方便计算我们忽略小数部分
dpr = dpr >= 3 ? 3 : (dpr >= 2 ? 2 : 1);
//为了方便操作将dpr设置为自定义属性
docEl.setAttribute('data-dpr',dpr);
//计算出不同dpr下的缩放比
var scale = 1/dpr;
//存放缩放语句
var content = 'width=device-width,initial-scale='+scale+',user-scale=no,maximum-scale=1,minimum-scale=1';
//为了防止用户恶意的缩放,通常要设置一个最大/小宽度
var maxWidth = 540;
var minWidth = 320;
docEl.setAttribute('max-width',maxWidth);
docEl.setAttribute('min-width',minWidth);
//判断mate标签中是否有viewport属性,没有就创建
if(viewPortEl){
	viewPortEl.setActive('content',content);
}else{
	viewPortEl = document.createElement('meta');
	viewPortEl.setAttribute('name','viewport');
	viewPortEl.setAttribute('content',content);
	document.head.appendChild(viewPortEl);
}
px2rem();//项目打开就单位转化
window.addEventListener('resize',px2rem);//监测到屏幕尺寸变化就重新执行函数
function px2rem(){
	var ratio = 18.75;
	var viewWidth = document.documentElement.getBoundingClientRect().width || window.innerWidth;
	document.documentElement.style.fontSize = viewWidth/ratio + 'px';
}

//为了防止你们看不懂贴出meta标签内容
//<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scale=no,maximum-scale=1,minimum-scale=1">