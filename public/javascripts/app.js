window.onload = function() {
    //聊天内容盒子
    var msgListbox = document.getElementById('content');
    //登录框盒子
    var login = document.getElementById('login');
    //登录按钮对象
    var loginBtn = document.getElementById('loginBtn');
    //发送消息对象
    var sendBtn = document.getElementById('sendBtn');
    //文本域对象
    var textMsg = document.getElementById('textMsg');
    //登录框对象
    var inputLogin = document.getElementById('inputLogin');

    //在线人数对象
    var count = document.getElementById('count');
    //全局socket 对象
    var socket, my;

    //登录操作
    loginBtn.onclick = function() {
        //获取登录框的值
        var username = inputLogin.value;
        //判断用户名长度
        if (username.length > 0) {
            //建立socket 连接
            socket = io.connect('http://www.esayscript.com:5000');
            socket.emit('login', username);
            regsiter(socket);
        } else {
            layer.msg('昵称不正确');
        }
    }

    //发送消息操作
    sendBtn.onclick = function() {
        var msg = textMsg.value;
        if (msg.length > 0) {
            socket.emit('messges', msg);
            var data = {
                username: my,
                data: msg
            }
            append(data, 'my');
            textMsg.value = "";
        } else {
            layer.msg('请输入消息内容！');
        }

    }

    function append(data, classname) {
        var li = document.createElement('li');
        var h3 = document.createElement('h3');
        var p = document.createElement(p);
        h3.innerHTML = data.username;
        p.innerText = data.data;
        li.appendChild(h3);
        li.appendChild(p);
        li.className = classname;
        msgListbox.appendChild(li);

        var h = msgListbox.scrollHeight;
        msgListbox.scrollTop = h;
    }

    function regsiter(socket) {
        socket.on('logined', function(data) {
            layer.msg('该昵称已被其他人使用');
        });
        socket.on('loginSuccess', function(d) {
            my = d;
            socket.on('systemMessage', function(a, b, c) {
                count.innerText = b;
                layer.msg(a + c);
            });
            //监听消息事件
            socket.on('news', function(data) {
                append(data, 'siblings')
                console.log(data);
                //触发服务端事件
                //socket.emit('my other event', Message);
            });
            login.style.display = 'none';
        });
    }
}