var phone = document.querySelector('.phone');
var pwd = document.querySelector('.pwd');
var loginbtn = document.querySelector('.loginbtn');

// 给登录按钮注册事件
loginbtn.onclick = function() {
    var phoneNum = phone.value;
    var password = pwd.value;
    // var that = this;
    var response;
    var data;
    
    // 设置给ajax发送的参数格式
    params = 'http://127.0.0.1:3000/login/cellphone' + 
    '?phone=' + phoneNum + '&password=' + password;
    // console.log(phoneNum, password);
    // 发送ajax请求
    // 1. 创建xhr对象
    var xhr = new XMLHttpRequest();
    // 2. 初始化，设置请求方法和url
    xhr.open('POST', params);
    // 设置请求头
    // xhr.setRequestHeader('Content-Type','')
    // 3. 发送 通过send()发送参数给服务器
    xhr.send();
    //4. 事件绑定 处理服务端返回的结果
    xhr.onreadystatechange = function() {

        // 判断（服务器返回了所有结果）
        if (xhr.readyState == 4) {
            // 判断相应代码：200 404 403 401 500
            // 2开头都表示成功
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.status);// 状态码
                // console.log(xhr.statusText);// 状态字符串
                // console.log(xhr.getAllResponseHeaders());// 所有响应头
                // console.log(xhr.response);// 响应体

                // 解析响应体中的json数据
                response = xhr.responseText;
                data = JSON.parse(response);
                console.log("ajax返回的json数据：", data);
                var code = data.code;
                // 判断是否登录成功
                if (code != 200) {
                    alert("用户名或者密码错误！");
                    return;
                }
                // 以字符串格式在localStorage中存储返回的用户数据
                var user = JSON.stringify(data);
                // 设置localStorage
                window.localStorage.setItem('user', user);
                // 将localStorage传递到index页面
                location.href = 'index.html';
            }
            
            
            // console.log(data.account);
        }
        
    }
    
    // console.log(aresponse);
    // data = JSON.parse(xhr.response);
    // console.log(data);
    // console.log(data.account);
    // console.log(data.profile.nickname);
    

}

