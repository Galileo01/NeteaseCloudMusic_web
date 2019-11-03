$(function () {

    //获取元素，定义变量
    let $audio = $('audio');//获取媒体
    console.log($audio[0]);

    let $play = $('.play-button');//获取 控制部分的 播放按键
    let $rotate = $('.rotate');//获取旋转img元素
    let $gan = $('.gan');
    let $commentsUl = $('.comments');
    let $disinput = $('.disinput');
    let $inputWapper = $('.input-wapper');//输入外壳
    let $inputClose = $('.input-close');
    let $textarea = $('#comment-input');//输入文本的文本域
    let $subBtn = $('.submit-comment');//评论的提交按钮
    let $next = $('.next');
    let $pre = $('.pre');
    let $playBg = $('.play-bg');//高斯模糊的背景
    //对象定义
    //当前用户的信息，id。头像地址
    let user = {
        id: 'admin',
        headHref: 'http://p4.music.126.net/_aHAAUPp3feRCjUvqZFZ-w==/109951164425666779.jpg?param=50y50',
    };

 
    //存储  播放模式   的图标地址
    let playMod = [{
        text: "单曲循环",
        url: "url(images/play-one.svg)"
    }, {
        text: "随机播放",
        url: "url(images/play-random.svg)"
    }, {
        text: "顺序播放",
        url: "url(images/play-shunxu.svg)"
    }, {
        text: "列表播放",
        url: "url(images/play-liebiao.svg)"
    }];

    let $mod = $('.mod');
    console.log(localStorage.getItem('songIndex'));//获取本地存储的当前播放的歌曲下标
    let $modText = $('.mod-text');

    let $songName = $('.songName')//存储当前歌名的p标签

    //保存当前的歌曲信息,

    let currentSon = null;


    //如果当前页面不存在 songIndex 的本地存储，就复制 0
    if(!localStorage.getItem('songIndex'))
    localStorage.setItem('songIndex',0);//设置当前的歌曲  0

    if(!localStorage.getItem('mod'))
    localStorage.setItem('mod',0);


    let songlist = null;//歌单
    let $tatalTime = $('.totalTime');//存储当前歌曲总时长的span标签
    let $currentTime = $('.currentTime');//获取存储当前播放时间的span


    //歌词滚动要用到的jq对象
    let curPTime = 0;
    let preTime = 0;
    let $geci = $('.geci');



    //处理播放模式的切换
    $mod.on('click', function () {
        let index =localStorage.getItem('mod');// 获取模式
        console.log(index);
        //切换模式
        index = index == 3 ? 0 : ++index;//已经为3 ，就赋值为0

        $(this).css('background', playMod[index].url);
       localStorage.setItem('mod',index);//设置新的模式
        console.log(playMod[index].url);

        //文字改变值，之后淡入淡出
        $modText.text(playMod[index].text).fadeIn(500).delay(500).fadeOut(500);

    });

    //底部进度条的元素获取   ,要用到的元素 

    let $pLine = $('.process-line');//进度条红色元素
    let $pDot = $('.process-dot');//进度小点
    let $pBar = $('.process-bar');//进度背景 
    let $content = $('.content');

    /*播放音乐的点击事件
    /响应包括
    1.播放音乐
    2.更改 旋转动画的状态
    3.拨片的旋转*/
    $play.on('click', function () {
        //判断当前媒体的状态，若没有状态或为  ‘paused’
        if (!$rotate.css('webkitAnimationPlayState') || $rotate.css('webkitAnimationPlayState') == "paused") {
            $audio[0].play();//转为原生DOM对象 ，播放音乐
            $rotate.css('webkitAnimationPlayState', 'running');
            $(this).css('background-image', 'url(images/stop.svg)');
        }
        else if ($rotate.css('webkitAnimationPlayState') == "running") {
            $audio[0].pause();
            $rotate.css('webkitAnimationPlayState', 'paused');
            $(this).css('background-image', 'url(images/play.svg)');


        }
        $gan.toggleClass('rotated');//切换杆的旋转状态
    });

    //加载歌曲列表
    getList();
    function getList() {
        $.ajax({
            url: "songlist.json",
            datetype: "json",
            type: "GET",
            success: function (response) {
                songlist = response;
                console.log(response);
                let songIndex = parseInt(localStorage.getItem('songIndex'));
                currentSon = songlist[songIndex];

                //加载完 歌曲列表后  再根据当前 的歌曲加载audio 资源
                loadAudia();
            }
            , error: function (xhr) {
                console.log("列表获取失败", xhr.status);
            }
        });
    }
  




    //页面加载，自动调用
   //  loadAudia();

    //获取歌曲的所有信息
    function loadAudia() {
        console.log(currentSon);


        $songName.text(currentSon.name);//载入歌曲名称
        $audio.prop('src', currentSon.audioSrc);//载入歌曲资源
        $tatalTime.text(currentSon.totalTimeStr);//更改 总时间span
        let index=localStorage.getItem('mod');
        $mod.css('background', playMod[index].url);


        $rotate.css('background-image', `url(${currentSon.imgSrc})`);//获取新的旋转不见图片
        // console.log($audio.prop('src'));
        // console.log(currentSon);
        $playBg.css('background-image', `url(${currentSon.imgSrc})`);//更改高斯模糊的背景


        //页面第一次 加载或点击更改 旋转状态，和按钮背景
        $rotate.css('webkitAnimationPlayState', 'running');
        $play.css('background-image', 'url(images/stop.svg)');
        $gan.addClass('rotated');//切换杆的旋转状态


        //更改style标签的内容
        $('style').html(`.play-bg::before{
            background-image:url(${currentSon.imgSrc});
        }`);
        //载入歌词
        getLrc();

        //载入评论
        $.ajax({
            type: "GET",
            url: currentSon.commentSrc,
            dataType: 'json',
            success: function (response) {
                //不用将返回的json字符串转化为数组对象，方法内部自动转换,传入的response即为对象
                $commentsUl.html("");
                response.forEach(getComment);

            },
            error: function (xhr) {
                console.log(`AJAX请求错误 ${xhr.status}`);
            }

        });

    }




    //定义 添加评论到页面的函数
    function getComment(value) {
        let $li = $('<li>');
        let $img = $('<img>');
        let $div = $('<div>');
        let $p1 = $('<p>');
        let $a = $('<a>');
        let $pt = $('<p>');


        $div.addClass('ps-wapper');
        $a.addClass('id');
        $a.prop('href', '#');
        $a.html(value.id);
        $pt.addClass('cmt-time');
        $img.prop('src', value.headHref);
        $pt.html(value.time);

        $p1.append($a);
        $p1.append(`:${value.words}`);//模板字符串
        $div.append($p1);
        $div.append($pt);
        $li.append($img);
        $li.append($div);
        $commentsUl.append($li);

    }

    //评论框的显示
    $disinput.on('focus', function () {
        $inputWapper.css('display', 'block');
        $(this).prop('disabled', true);
        //使该 文本框不能输入，舍弃它，以免光标还在disinput上
        $textarea.focus();//自动获得鼠标，直接可输入
    });

    $inputClose.on('click', function () {
        $inputWapper.css('display', 'none');
        $textarea.val('');
        $disinput.prop('disabled', false);
        //使disinput 更够再次被点击
    });


    $subBtn.on('click', function () {
        let newComment = $textarea.val();
        if (!newComment) {
            alert('评论为空')
        }
        else {

            insert(newComment);
            $textarea.val('');
            $inputWapper.css('display', 'none');
            $disinput.prop('disabled', false);
            //
        }
    });

    //定义 新评论的插入函数
    function insert(newComment) {
        let $li = $('<li>');
        let $img = $('<img>');
        let $div = $('<div>');
        let $p1 = $('<p>');
        let $a = $('<a>');
        let $pt = $('<p>');
        let date = new Date();

        let dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
        //模板字符串
        $div.addClass('ps-wapper');
        $a.addClass('id');
        $a.prop('href', '#');
        $a.html(user.id);
        $pt.addClass('cmt-time');
        $img.prop('src', user.headHref);
        $pt.html(dateStr);

        $p1.append($a);
        $p1.append(`:${newComment}`);//模板字符串
        $div.append($p1);
        $div.append($pt);
        $li.append($img);
        $li.append($div);
        $commentsUl.prepend($li);//在最前面插入 新的li 

    }

    //获取歌词所要调用的函数

    //在获得歌词的过程中要用到的全局变量
    let pArrs = [...document.querySelector('.geci').querySelectorAll("p")];// 使用扩展运算符 将 获取到的NOdeList 扩展为 一个数组


    //应该赋给它一个初值，以免由于ajax请求的异步，在后面$audio触发timeupdata时pArrs.find 报错



    function getLrc() {
        //获取歌词json 转过来的 对象
        $geci.html('');//每次重新加载歌词之前都要清理之前的歌词
        let lrcArrs = null;
        $.ajax({
            type: "GET",
            url: currentSon.lrcSrc,
            dataType: "json",//规定返回的数据为json，
            success: function (response) {
                lrcArrs = response;
                //   console.log(lrcArrs);
                //获取成功，添加到页面
                if (lrcArrs) {
                    lrcArrs.forEach(function (value, index) {
                        let temp = value.substring(value.indexOf('[') + 1, value.indexOf("]"));
                        let tempTime = parseInt(temp.split(':')[0]) * 60 + parseFloat(parseFloat(temp.split(':')[1]).toFixed());//toFixed 方法返回字符串
                        let lrc = value.substring(value.indexOf(']') + 1, value.length);

                        let $p = $('<p>');
                        $p.html(lrc);

                        //Jq.data()只能获取属性，不能设置
                        $p[0].setAttribute("data-time", `${tempTime}`);
                        $p[0].setAttribute("data-index", `${index}`);
                        $geci.append($p);
                        //    console.log($p[0]);

                    });
                    pArrs = [...document.querySelector('.geci').querySelectorAll("p")];//从新获取p标签 的数组
                    curPTime = 0;
                    preTime = 0;
                    //console.log(pArrs);

                }

            },
            error: function (xhr) {
                console.log('请求失败', xhr.status);
            }
        });


    }

    //歌曲切换 下一首

    $next.on('click', function () {
        let songIndex = parseInt(localStorage.getItem('songIndex'));
        console.log(songIndex);
        let next = 0;
        let mod = $mod.data("modindex");
        mod= localStorage.getItem('mod');
        console.log("mod", $mod.data("modindex"));
        // console.log($mod);


        let flag = true;//标记是否要切换下一首，用于处理   顺序模式下  已经播放到列表 songlist 最后一首
        if (mod == 0)//单曲模式
        {
            next = songIndex;
        }
        else if (mod == 1)//随机模式
        {

            next = Math.floor(Math.random() * 4);//0 -3 随机数

        }
        else if (mod == 2)//循环模式
        {
            if (songIndex == songlist.length - 1)//当前歌曲是最后一首歌
            {
                flag = false;//播放到最后一首 。停止一首歌的  加载，停止播放
            }
            else {
                next = songIndex + 1;
            }

        }
        else if (mod == 3)//列表模式
        {
            if (songIndex == songlist.length - 1)//当前歌曲是最后一首歌
            {
                next = 0;
            }
            else {
                next = songIndex + 1;
            }
        }

        if (flag)//当不是顺序模式，或顺序模式下没有播放到下一首
        {
            currentSon = songlist[next];

            loadAudia();
            localStorage.setItem('songIndex', next);
        }
    });


    //上一首
    $pre.on('click', function () {
        let songIndex = parseInt(localStorage.getItem('songIndex'));
        console.log(songIndex);
        if (songIndex == 0)//当前歌曲是最后一首歌
        {
            pre = songlist.length - 1;
        }
        else {
            pre = songIndex - 1;
        }
        //注意localstrage 获取的是字符串   不能直接加1
        currentSon = songlist[pre];

        loadAudia();
        localStorage.setItem('songIndex', pre);
    });

    //监听 Audio 的timeupdata 事件

    /*依次完成的动作包括：
    1.歌词的滚动
    2.当前播放时间的更改 -----  current
    4.进度条的推进
    
    */
    //Jquery的on 方法不支持timeupdata事件

    $audio[0].addEventListener("timeupdate", function () {
        console.log(this.volume);

        // console.log(this.duration);
        let timeFixed = this.currentTime.toFixed(0);//秒数不保留小数 
        // console.log(timeFixed);


        //更改当前显示的播放时间
        let currentTStr = Math.floor(timeFixed / 60) + ":" + timeFixed % 60;
        $currentTime.text(currentTStr);




        //当播放到底
        if (this.currentTime >= this.duration) {
            //直接调用 next按钮的点击事件
             $next.click();
        }


        //进度条的移动
        let duration = this.duration;
        let rate = timeFixed / duration;//四舍五入，取最近的整数
        let width = Math.round(rate * 584);
        // console.log(rate,width);

        $pLine.css('width', width);
        $pDot.css('left', width - 7);






        //歌词滚动
        curPTime = parseInt(this.currentTime.toFixed());
        if (Math.abs(curPTime - preTime) >= 3)//当拖动进度条时 相邻两次事件触发的时间差，较大
        {
            pArrs.forEach(value => {
                value.className = "";//去除拖动前 所有p标签的样式
            });
        }
        preTime = curPTime;

        pArrs.find((value, index) => {//由于ajax的异步，没有初值的情况下，可能会报错
            //  console.log("datatime"+value.dataset.time);   
            //console.log(value.dataset.index);
            // console.log(value);

            if (value.dataset.time == curPTime) {
                // console.log(value.dataset.index);
                let playIndex = value.dataset.index;//得到匹配的歌词的index

                $geci[0].style.marginTop = `-${playIndex * 20}px`;//使歌词向下滑动
                // console.log(geci.style.marginTop);
                if (index - 1 > 0) {
                    pArrs[index - 1].className = "";
                }

                value.classList.add("highlight");

                // console.log(value.innerHTML);
                setTimeout(() => {

                }, 1000);
                return true;//退出循环，不接受返回值
            }

        })

    }, false);


    //进度条的  点击改变当前播放时间
    $pBar.on('click', function (e) {
        let leftOfBar = $(this).offset().left;//获取整个进度条距离左侧的距离
        let leftOfLine = $pLine.offset().left;

        console.log(leftOfBar, leftOfLine, e.clientX);
        let newWidth = Math.floor(e.clientX - 100 - 20 - 40 - 20 - $content.offset().left);
        /*
        100  :control-btns 宽度及其 margin-left
        20   process-wapper 的padding
        40 ：span 的宽度
        $content.offset().left  ：整个播放器距离 做左边的距离
        */

        console.log(newWidth);
        $pLine.css('width', newWidth);
        $pDot.css('left', newWidth - 7);
        let rate = newWidth / 584;
        let currentTime = Math.round($audio[0].duration * rate);
        $audio[0].currentTime = currentTime;
    })

    let $vOfBar = $('.vo-bar');
    let $vOfLine = $('.vo-line');
    let $vOfDot = $('.vo-dot');



    $vOfBar.on('click', function (e) {
        let leftOfBar = $(this).offset().left;
        let leftOfLine = $vOfLine.offset().left;
        let newWidth = e.clientX - $content.offset().left - 100 - 20 - 684 - 25.4 - 5;// 获得鼠标点击在bar 的先等会位置

        /*
         100  :control-btns 宽度及其 margin-left
        20   process-wapper 的padding
        40 ：span 的宽度
        $content.offset().left  ：整个播放器距离 做左边的距离
        25.4: 10 +14.4 v-icon 的宽度和 margin

         */
        console.log(newWidth);
        $vOfLine.css('width', newWidth);
        $vOfDot.css('left', newWidth - 7);
        let rate = newWidth / parseInt($(this).css('width'));//
        //$(this).css('width')   方法返回一个带有px 的字符串
        console.log($audio[0]);


        $audio[0].volume = rate;
        console.log(typeof $audio[0].volume, "rate" + rate);


    })


    //TODO: 完成歌曲列表的显示与改变
    let $listIcon = $('.list-icon');
    let $list = $('.list');
    $listIcon.on("click", function () {
        $list.toggleClass("none")
    });
    let $lClose=$('.list .header .close');
    $lClose.on('click',function(){
        $list.addClass('none');
    })



    $('.wapper').mCustomScrollbar();
})