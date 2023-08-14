// 显示用户昵称，若未登录则显示“未登录”
var nickName = document.getElementById('nickName');
// 获取用户头像元素
var userPhoto = document.querySelector('.touxiang');
// 获取首页搜索框
var searchInput = document.getElementById('searchInput')
// 获取搜索框的按钮
var searchbtn = document.getElementById('searchbtn');
// 获取html中展示歌曲信息的所有li
var songItems = document.getElementsByClassName('songItem');
var songList = document.querySelector('.songList');
// 获取正在播放的歌曲的歌名、歌手和专辑图dom
var songNamePlaying = document.getElementById('songNamePlaying');
var singerPlaying = document.getElementById('singerPlaying');
var albumPhoto = document.getElementById('albumPhoto');
var lyricShow = document.querySelector('.lyricShow');

// 歌词面板一开始设置窗口滚动为flase
lyricShow.setAttribute('ifScroll', 'false');
// 自动判断是否已经有用户登录
window.onload = function() {
    var userString = window.localStorage.getItem('user');
    if (userString == null) {
        console.log("用户未登录");
        return;
    } else {
        // var nickName = account.nickname;
        // 将json字符串转换为json格式数据
        var user = JSON.parse(userString);
        console.log("已获取localStroage中的user", user);
        // 获取用户的profile
        var profile = user.profile;
        console.log(profile);
        nickName.innerHTML = profile.nickname;
        // 显示用户头像
        console.log(userPhoto);
        userPhoto.src = profile.avatarUrl;
    }
}

// 给搜索按钮注册事件
searchbtn.onclick = function() {
    // 调用searchSongs方法
    searchSongs(searchInput.value, '0');
}

// 将毫秒换算成分秒,省略毫秒
function formatDuration(mss) {
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds; 
    return minutes + ':' + seconds;
}

// 将毫秒换算成分秒,精确到毫秒且保留两位
function formatDurationMS(mss) {
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    var ms = parseInt((mss % 1000) / 10);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds; 
    ms = ms < 10 ? '0' + ms : ms; 
    return minutes + ':' + seconds + '.' + ms;
}

// 向服务器获取指定歌曲id的url
function getSongURL(sid) {
    // 设置给ajax发送的参数格式
    params = 'http://127.0.0.1:3000/song/url?id=' + sid;
    // console.log(phoneNum, password);
    // 发送ajax请求
    // 1. 创建xhr对象
    var xhr = new XMLHttpRequest();
    // 2. 初始化，设置请求方法和url
    xhr.open('GET', params);
    // 设置请求头
    // xhr.setRequestHeader('Content-Type','')
    // 3. 发送 通过send()发送参数给服务器
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // 判断相应代码：200 404 403 401 500
            // 2开头都表示成功
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.status);// 状态码
                //4. 事件绑定 处理服务端返回的结果
                // 判断相应代码：200 404 403 401 500
                var response = xhr.responseText;
                var data = JSON.parse(response);
                console.log("返回url中的数据：", data);
                var songURL = data.data[0].url;
                console.log("歌曲的url为：", songURL);
                // 把链接添加到播放区域进行播放
                var musicPlayingSource = document.getElementById('nowPlaying');
                var playbtn = document.getElementById('playbtn');
                // 将source中的src设置为返回的歌曲url
                musicPlayingSource.src = songURL;
                // 设置自动播放
                musicPlayingSource.autoplay = true;
                musicPlayingSource.play();
                // 将歌曲的playingFlag属性设置为'true'
                musicPlayingSource.setAttribute('playingFlag', 'true');
                // 给播放源设定当前歌曲的id
                musicPlayingSource.setAttribute('songID', sid);
                // 更改播放按钮的图标
                playbtn.innerHTML = '';
                // 初始化播放进度条，从0开始播放
                var playBar = document.querySelector('.processAll');
                var processNow = document.querySelector('.processNow');
                var circle = document.getElementById('circle');
                circle.style.left = 0;
                processNow.style.width = 0;
                // console.log(musicPlayingSource);
            }
            
        }
    }
}

// 为播放按钮注册点击事件
var playbtn = document.getElementById('playbtn');
var musicPlayingSource = document.getElementById('nowPlaying');
playbtn.onclick = function() {
    var playFlag = musicPlayingSource.getAttribute('playingFlag');
    if (playFlag === 'true') {
        playbtn.innerHTML = '';
        musicPlayingSource.pause();
        musicPlayingSource.setAttribute('playingFlag', 'false');
    } else {
        playbtn.innerHTML = '';
        musicPlayingSource.play();
        musicPlayingSource.setAttribute('playingFlag', 'true');
    }
}

// 播放进度条点击
// 获取进度条和小圆点的dom
var playBar = document.querySelector('.processAll');
var processNow = document.querySelector('.processNow');
var circle = document.getElementById('circle');
// 鼠标点击进度条，返回点击位置相对于进度条dom的x坐标，歌曲的当前位置随之改变
playBar.onclick = function() {
    var evt = window.event || evt;
    var mousex;//鼠标的x坐标
    // getBoundingClientRect().left返回当前元素左上角相对浏览器视窗的位置
    var thisX = document.querySelector('.process').getBoundingClientRect().left;
    console.log("clientX的值为：" + evt.clientX + "thisX的值为：" + thisX);
    // 计算鼠标相对于进度条的x坐标
    // 注意这里不要直接取evt.offsetX作为x的坐标，因为点击小圆点时会出现bug
    mousex=evt.clientX - thisX;
    console.log("鼠标点击的x坐标为：", mousex);
    circle.style.left = mousex + 'px';
    // 更改当前已播放的进度条长度
    processNow.style.width = mousex + 'px';

    // 更改音频的播放时间位置
    // 将当前播放置为鼠标的位置
    var place = mousex/document.querySelector(".processAll").offsetWidth*musicPlayingSource.duration;
    console.log("place的位置为：", place);
    musicPlayingSource.currentTime = place;
}

// 歌曲进度条拖拽效果
var dragFlag = false;   // 标识是否拖拽小圆点
var dragX;      // 存放拖拽的长度, 用于改变歌曲当前位置
// 小圆点添加鼠标点击监听
circle.addEventListener('mousedown', function(e) {
    dragFlag = true;    // 表示开始拖拽
    console.log('我点击了');
    console.log(e.clientX);
});

// 添加鼠标移动监听
window.addEventListener('mousemove', function(e) {
    // 判断是否点击了小圆点
    if (!dragFlag) {
        return;
    }            
    // 计算拖拽的长度，进度条的长度随之变化
    var mousex;//鼠标的x坐标
    // getBoundingClientRect().left返回当前元素左上角相对浏览器视窗的位置
    var thisX = document.querySelector('.process').getBoundingClientRect().left;
    console.log("clientX的值为：" + e.clientX + "thisX的值为：" + thisX);
    // 计算鼠标相对于进度条的x坐标
    // 注意这里不要直接取evt.offsetX作为x的坐标，因为点击小圆点时会出现bug
    mousex=e.clientX - thisX;
    console.log("鼠标拖拽到了：", mousex);

    // 判断拖拽长度是否超过了进度条长度，或者拖拽小于0
    var barWidth = playBar.clientWidth;     // 获取进度条总长度
    if (mousex <= barWidth && mousex >= 0) {
        dragX = mousex;
        // 改变小圆点的位置
        circle.style.left = mousex + 'px';
        // 更改当前已播放的进度条长度
        processNow.style.width = mousex + 'px';

        
    }
    if (mousex < 0) {
        processNow.style.width = '0px';
        circle.style.left = '0px';
        dragX = 0;
    }
    if (mousex > barWidth) {
        processNow.style.width = barWidth + 'px';
        circle.style.left = barWidth + 'px';
        dragX = barWidth;
    }
    circle.style.left = mousex + 'px';
    // 更改当前已播放的进度条长度
    processNow.style.width = mousex + 'px';

    
    
});

// 注册鼠标弹起监听，表示拖拽结束
window.addEventListener('mouseup', function() {
    // 判断是否处于小圆点拖拽状态
    if (!dragFlag) {    // 没在拖拽
        return;
    }
    dragFlag = false;    // 改变标识位，说明拖拽结束
    console.log('拖拽结束了');

    // 更改音频的播放时间位置
    // 将当前播放置为鼠标的位置
    var place = dragX/document.querySelector(".processAll").offsetWidth*musicPlayingSource.duration;
    console.log("place的位置为：", place);
    musicPlayingSource.currentTime = place;
});


// 为音频添加timeupdate事件，使进度条自动变化
musicPlayingSource.addEventListener("timeupdate", function() {
    // 计算小圆圈应要滑动到的位置
    var mousex = musicPlayingSource.currentTime/musicPlayingSource.duration * document.querySelector(".processAll").offsetWidth;
    circle.style.left = mousex + 'px';
    // 更改当前已播放的进度条长度
    processNow.style.width = mousex + 'px';
    // console.log(mousex);

    // 设置歌词自动滚动
    // 获取并遍历当前所有存放歌词的p，并找到currentTime对应的歌词
    var lyricPs = document.querySelectorAll('.lyricP');
    var duration;
    for (var i = 0; i < lyricPs.length; i++) {
        // 获取歌词的duration
        duration = lyricPs[i].getAttribute('duration');
        // 找到歌词的判断条件：currentTime位于两句歌词的中间，则令前一句歌词为当前指定的歌词
        if (i < lyricPs.length-1 && musicPlayingSource.currentTime >= duration && musicPlayingSource.currentTime < lyricPs[i+1].getAttribute('duration')) {
            // 判断用户是否在滚动歌词，若没有，则自动滚动
            if (lyricShow.getAttribute('ifScroll') == 'false') {
                lyricShow.scrollTo(0, lyricPs[i].offsetTop-335);    // 滚动到该歌词
            }
            // 更改当前歌词样式，使之高亮，同时让其他歌词保持普通样式
            for (var j = 0; j < lyricPs.length; j++) {
                lyricPs[j].style.fontWeight = 'normal';
                lyricPs[j].style.fontSize = '16px';
            }
            lyricPs[i].style.fontWeight = 'bold';
            lyricPs[i].style.fontSize = '18px'; 
            break;
        }
        else if (i == lyricPs.length-1) {
            // 说明已经到最后一句歌词
            if (lyricShow.getAttribute('ifScroll') == 'false') {
                lyricShow.scrollTo(0, lyricPs[i].offsetTop-335);    // 滚动到该歌词
            }
            for (var j = 0; j < lyricPs.length; j++) {
                lyricPs[j].style.fontWeight = 'normal';
                lyricPs[j].style.fontSize = '16px';
            }
            lyricPs[i].style.fontWeight = 'bold';
            lyricPs[i].style.fontSize = '18px';  
        }
    }
    
});

// 给分页注册事件
var fenyeLis = document.getElementById('fenye').querySelectorAll('li');
// 给1-3页按钮注册事件
for (var i = 1; i < fenyeLis.length-1; i++) {
    // 设置鼠标经过按钮变成灰色
    fenyeLis[i].onmouseover = function() {
        this.style.backgroundColor = '#F4F4F4';
    }
    // 鼠标离开按钮变成白色
    fenyeLis[i].onmouseout = function() {
        this.style.backgroundColor = '#fff';
    }
    // 点击按钮进行分页
    fenyeLis[i].onclick = function() {
        // 本质上还是搜索歌曲
        searchSongs(songList.getAttribute('keywords'), this.getAttribute('index'));
        // 使其他的页码按钮变为白色，选中的按钮设为红色
        // selectPageStyle(Number(this.getAttribute('index')));
    }
}

// 给上一页和下一页按钮注册事件
var prePage = document.getElementById('prePage');
var nextPage = document.getElementById('nextPage');
prePage.onclick = function() {
    // 获取当前的页数
    var page = songList.getAttribute('page');
    console.log('the page is ', page);
    if (page == '0')
        return;
    else {
        page = String(Number(page)-1);
        // 更新当前页数
        songList.setAttribute('page', page);
        searchSongs(songList.getAttribute('keywords'), page);
    }
}

nextPage.onclick = function() {
    // 获取当前的页数
    var page = songList.getAttribute('page');
    console.log('the page is ', page);
    if (page == '2')
        return;
    else {
        page = String(Number(page)+1);
        // 更新当前页数
        songList.setAttribute('page', page);
        searchSongs(songList.getAttribute('keywords'), page);
    }
}

// 封装搜索歌曲的函数
function searchSongs(keywords, offset) {
    /*
        keywords: 搜索关键字
        offset: 分页
    */
    //获取输入搜索框的内容
    // var searchText = searchInput.value;
    console.log(keywords);
    // 设置给ajax发送的参数格式
    params = 'http://127.0.0.1:3000/search?keywords=' + keywords + '&offset=' + offset;
    // console.log(phoneNum, password);
    // 发送ajax请求
    // 1. 创建xhr对象
    var xhr = new XMLHttpRequest();
    // 2. 初始化，设置请求方法和url
    xhr.open('GET', params);
    // 设置请求头
    // xhr.setRequestHeader('Content-Type','')
    // 3. 发送 通过send()发送参数给服务器
    xhr.send();
    //4. 事件绑定 处理服务端返回的结果
    
    xhr.onreadystatechange = function() {
        // 判断（服务器返回了所onreadystatechange有结果）
        if (xhr.readyState == 4) {
            // 判断相应代码：200 404 403 401 500
            // 2开头都表示成功
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.status);// 状态码
                // console.log(xhr.statusText);// 状态字符串
                // console.log(xhr.getAllResponseHeaders());// 所有响应头
                // console.log(xhr.response);// 响应体

                // 解析响应体中的json数据
                var response = xhr.responseText;
                var data = JSON.parse(response);
                var songs = data.result.songs;
                console.log("ajax返回的歌曲json数据：", songs);
                // 以字符串格式在localStorage中存储返回的用户数据
                // var songString = JSON.stringify(songs);
                // 设置localStorage
                window.localStorage.setItem('songs', songs);
                // var code = data.code;
                console.log("localstorage中获取的数据：", songs);
                document.querySelector('.show').style.display = 'block';
                document.querySelector('.nav').style.display = 'block';
                songList.style.display = 'block';
                lyricShow.style.display = 'none';
                // 设置songList中的page和keywords属性
                songList.setAttribute('page', offset);
                songList.setAttribute('keywords', keywords);
                // 选定页数按钮，设置样式
                selectPageStyle(Number(offset));
                // 遍历songs中的歌曲
                for (var i = 0; i < songs.length && i < songItems.length; i++) {
                    // 往每个songitem中的span中放入歌曲信息
                    var spans = songItems[i].getElementsByTagName('span');
                    songItems[i].querySelector('.songNum').innerHTML = i + 1;
                    // 点击下载
                    songItems[i].querySelector('.songDownload').firstElementChild.herf = '#';
                    // 存放歌曲名
                    songItems[i].querySelector('.songName').innerHTML = songs[i].name; 
                    // 存放歌手名
                    songItems[i].querySelector('.singerName').innerHTML = songs[i].artists[0].name;
                    // 专辑名
                    songItems[i].querySelector('.albumName').innerHTML = songs[i].album.name;
                    // 时长
                    songItems[i].querySelector('.songTime').innerHTML = formatDuration(songs[i].duration);
                    // 为每个li设置一个歌曲id的属性，这样每个li可以通过歌曲id获取歌曲的url
                    songItems[i].setAttribute('songId', songs[i].id);
                    // 为每个li设置一个专辑id的属性，这样每个li可以通过专辑id获取专辑信息
                    songItems[i].setAttribute('albumID', songs[i].album.id);
                    // var albumid = songs[i].album.id;
                    // console.log('the albumid is:', albumid);
                    // // 为songItems中每个歌曲li注册点击播放事件
                    songItems[i].ondblclick = function() {
                        // 注意这里不可以写成getSongURL(songs[i].id)
                        getSongURL(this.getAttribute('songId'));
                        console.log('我点击了！');
                        // 更改当前播放的歌名、歌手和专辑图
                        songNamePlaying.innerHTML = this.querySelector('.songName').innerHTML;
                        singerPlaying.innerHTML = this.querySelector('.singerName').innerHTML;
                        setAlbum(this.getAttribute('albumID'));
                        // 给当前播放歌曲设置专辑名属性
                        musicPlayingSource.setAttribute('albumName', this.querySelector('.albumName').innerHTML);
                        console.log('当前歌曲的专辑名为：', musicPlayingSource.getAttribute('albumName'));
                    }
                }
                
            }
            
            
        }
        
    }
}

// 选中当前页码按钮使其变为红色，并保持其他页码按钮的样式不变
function selectPageStyle(page) {
    // 使其他的页码按钮变为白色，选中的按钮设为红色
    for (var i = 1;i < fenyeLis.length-1;i++) {
        fenyeLis[i].style.backgroundColor = '#fff';
        // 鼠标经过按钮变成灰色
        fenyeLis[i].onmouseover = function() {
            this.style.backgroundColor = '#F4F4F4';
        }
        // 鼠标离开按钮变成白色
        fenyeLis[i].onmouseout = function() {
            this.style.backgroundColor = '#fff';
        }
    }
    // 令选中的分页按钮在鼠标经过和离开时依旧保持红色
    fenyeLis[page+1].style.backgroundColor = '#EC4141';
    fenyeLis[page+1].onmouseover = function() {
        this.style.backgroundColor = '#EC4141';
    }
    fenyeLis[page+1].onmouseout = function() {
        this.style.backgroundColor = '#EC4141';
    }  
}

// 封装在播放区设置专辑图函数
function setAlbum(albumID) {
    // 设置给ajax发送的参数格式
    params = 'http://127.0.0.1:3000/album?id=' + albumID;
    // console.log(phoneNum, password);
    // 发送ajax请求
    // 1. 创建xhr对象
    var xhr = new XMLHttpRequest();
    // 2. 初始化，设置请求方法和url
    xhr.open('GET', params);
    // 设置请求头
    // xhr.setRequestHeader('Content-Type','')
    // 3. 发送 通过send()发送参数给服务器
    xhr.send();
    //4. 事件绑定 处理服务端返回的结果
    
    xhr.onreadystatechange = function() {
        // 判断（服务器返回了所onreadystatechange有结果）
        if (xhr.readyState == 4) {
            // 判断相应代码：200 404 403 401 500
            // 2开头都表示成功
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.status);// 状态码
                // console.log(xhr.statusText);// 状态字符串
                // console.log(xhr.getAllResponseHeaders());// 所有响应头
                // console.log(xhr.response);// 响应体

                // 解析响应体中的json数据
                var response = xhr.responseText;
                var albumData = JSON.parse(response);
                // console.log('the albumid in the searchFunction is ', albumID);
                console.log(albumData);
                // 更改播放区的专辑图片
                albumPhoto.src = albumData.album.picUrl;
                
            }
        }
           
    }
}

// 展示歌曲歌词
function showLyric(sid) {
    params = 'http://127.0.0.1:3000/lyric?id=' + sid;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', params);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = xhr.responseText;
                var lyricData = JSON.parse(response);
                console.log(lyricData);
                var lyrics = lyricData.lrc.lyric;
                // console.log(lyrics);
                // 生成的最后一行为空
                var lyricArray = lyrics.split('\n');
                // console.log(lyricArray);
                // 如果最后一个元素内容为空，则删除
                if (lyricArray[lyricArray.length-1] == '') {
                    console.log('最后一个元素为空');
                    lyricArray.pop();
                }
                // 先清除歌词面板中原来的内容
                document.querySelector('.lyricBanner').innerHTML = '';
                // 在最上方创建h1存放歌名
                var songNameH = document.createElement('h1');
                songNameH.innerHTML = document.getElementById('songNamePlaying').innerHTML;
                document.querySelector('.lyricBanner').appendChild(songNameH);
                // 歌名下方存放歌手和专辑名
                var singerAlbum = document.createElement('p');  // 创建元素
                singerAlbum.className = 'singerAlbum';
                var saContents = document.getElementById('singerPlaying').innerHTML + ' - ' + musicPlayingSource.getAttribute('albumName');
                singerAlbum.innerHTML = saContents;
                document.querySelector('.lyricBanner').appendChild(singerAlbum);
                // 遍历歌词
                for (var i = 0; i < lyricArray.length; i++) {
                    // console.log(lyricArray[i]);
                    // 获取歌词时间和内容
                    var lyricTime = lyricArray[i].substring(lyricArray[i].indexOf('[')+1, lyricArray[i].indexOf(']'));
                    var lyricContent = lyricArray[i].substring(lyricArray[i].indexOf(']')+1);
                    console.log(lyricTime, lyricContent);
                    // 创建新的p标签，用于存放歌词
                    var newP = document.createElement('p');
                    newP.className = 'lyricP';
                    newP.innerHTML = lyricContent;
                    document.querySelector('.lyricBanner').appendChild(newP);
                    // 为每个歌词p设置时间、歌词和duration属性
                    newP.setAttribute('time', lyricTime);
                    newP.setAttribute('lyric', lyricContent);
                    newP.setAttribute('duration', formateLyricTimeToDuration(lyricTime));
                    // console.log(newP.offsetLeft + '\t' + newP.offsetTop);
                }
                // 设置盒子可见并隐藏其他盒子
                document.querySelector('.lyricShow').style.display = 'block';
                document.querySelector('.nav').style.display = 'none';
                document.querySelector('.show').style.display = 'none';
                // 测试
                // var bottomP = document.createElement('p');
                // bottomP.innerHTML = '我是底部';
                // bottomP.className = 'lyricP';
                // document.querySelector('.lyricBanner').appendChild(bottomP);
                // 坐标-335能在中间显示
                // lyricShow.scrollTo(0, 1300-335);
                // 为每句歌词添加点击监听事件，歌词被点击后跳到音乐对应的时间
                var lyricPs = document.querySelector('.lyricBanner').querySelectorAll('.lyricP');
                for (var i = 0; i < lyricPs.length; i++) {
                    console.log(lyricPs[i].getAttribute('lyric'), lyricPs[i].getAttribute('time') + '\t' + lyricPs[i].getAttribute('duration'));
                    // console.log(lyricPs[i].offsetLeft + '\t' + lyricPs[i].offsetTop);
                    lyricPs[i].addEventListener('click', function() {
                        console.log('歌词被点击了');
                        // 获取歌词对应的时间段
                        var lyricDuration = this.getAttribute('duration');
                        musicPlayingSource.currentTime = lyricDuration;
                    });
                }
                // // 为每句歌词添加点击监听事件，歌词被点击后跳到音乐对应的时间
                // var lyricPLists = document.querySelectorAll('.lyricP');
                // console.log('歌词列表为：', lyricPLists);
                // for (var i = 0; i < lyricPLists.length; i++) {
                    
                // }
            }
        }
    }

}

// 把歌词的时间格式转换为duration
function formateLyricTimeToDuration(lyricTime) {
    var minutes = lyricTime.substring(0, lyricTime.indexOf(':'))
    var seconds = lyricTime.substring(lyricTime.indexOf(':')+1, lyricTime.indexOf('.'))
    var ms = lyricTime.substring(lyricTime.indexOf('.')+1);
    var duration =  Number(Number(minutes) * 60 + Number(seconds)) + '.' + ms;
    // console.log(duration);
    return duration;
    
}

// 给正在播放的专辑图注册点击事件
albumPhoto.onclick = function() {
    // 获取正在播放的歌曲的id
    var playingID = musicPlayingSource.getAttribute('songID');
    showLyric(playingID);

}

// 测试滚动条滚动监听
var scrollTop = 0;
var interval = null;
lyricShow.addEventListener('scroll', function(e) {
    // 将ifScroll设置为'true'
    lyricShow.setAttribute('ifScroll', 'true');
    console.log(lyricShow.scrollTop + '\t' + scrollTop);
    if (interval == null) { // 未发起时，启动定时器
        interval = setInterval('jdugeScroll()', 3000);
    }
    scrollTop = lyricShow.scrollTop;    
    
});

// 该函数判断歌词面板中否在滚动
function jdugeScroll() {
    console.log('data in the fn' + lyricShow.scrollTop + '\t' + scrollTop);
    if (scrollTop == lyricShow.scrollTop) {
        console.log('停止滚动了');
        // 将ifScroll设置为'false'
        lyricShow.setAttribute('ifScroll', 'false');
        clearInterval(interval);
        interval = null;
    }
}

