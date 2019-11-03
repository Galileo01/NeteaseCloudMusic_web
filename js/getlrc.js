//总结:
//注：自定义的以data—  开头的属性，储存在dataset 中


let lrc=document.querySelector("#lrc").innerText;
let lrcArrs=lrc.split("\n");
// let pArrs=[];
let geci=document.querySelector('.geci');
lrcArrs.forEach(function(value,index){
    lrcArrs[index]=value.trim();//去掉字符串两边的空格
});
console.log(lrcArrs);


//解析字符串，并动态创建 p标签，添加到页面当中
lrcArrs.forEach(function(value,index){
    let temp=value.substring(value.indexOf('[')+1,value.indexOf("]"));
    let tempTime=parseInt(temp.split(':')[0])*60+parseFloat(parseFloat(temp.split(':')[1]).toFixed());//toFixed 方法返回字符串
    let lrc=value.substring(value.indexOf(']')+1,value.length);
    // pArrs.push({
    //     time:tempTime,//ES6 对象属性的新特性，可以是变量，同名的直接省略
    //     lrc
    // });

    //添加到 html 页面在中
    let p=document.createElement("p");
    p.innerHTML=lrc;
    p.setAttribute("data-time",`${tempTime}`);
    p.setAttribute("data-index",`${index}`);
    geci.appendChild(p);
});



let pArrs=[...document.querySelector('.geci').querySelectorAll("p")];// 使用扩展运算符 将 获取到的NOdeList 扩展为 一个数组
let curPTime=0;
let preTime=0;
let audio=document.querySelector("audio");
audio.addEventListener("timeupdate",function(){//播放位置 改变触发事件
    // console.log( this.currentTime.toFixed());
   curPTime =parseInt(this.currentTime.toFixed());
    if(Math.abs(curPTime-preTime)>=3)//当拖动进度条时 相邻两次事件触发的时间差，较大
    {
        pArrs.forEach(value=>{
            value.className="";//去除拖动前 所有p标签的样式
        });
    }
   preTime=curPTime;
pArrs.find((value,index)=>{
    // console.log("datatime"+value.dataset.time);   
    
    if(value.dataset.time==curPTime)
    {
        // console.log(value.dataset.index);
       let  playIndex=value.dataset.index;//得到匹配的歌词的index

        geci.style.marginTop=`-${playIndex*20}px`;//使歌词向下滑动
        // console.log(geci.style.marginTop);
        if(index-1>0)
        {
            pArrs[index-1].className="";
        }
        
        value.classList.add("highlight");
        
        // console.log(value.innerHTML);
        setTimeout(() => {
            
        }, 1000);
        return true;//退出循环，不接受返回值
    }
  
})

},false);

