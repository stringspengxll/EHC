$(function () {
    $("#mobile_phone").val($.cookie('userMobile'));
    $("#btnLogin").click(function () {
        Login();
    });
    $("#mobile_phone").blur(function () {
        codeIsShow = false;
        ShowCode();
    });
    $("#password").blur(function () {
        codeIsShow = false;
        ShowCode();
    });

    $("#imgCode").click(function () {
        codeIsShow = false;
        ShowCode();
    });

    
}); 


function Login() {
   
    var loginName = $("#mobile_phone").val();
    var loginCode = $("#rcode").val();
    var loginPwd = $("#password").val();
    var mobileValidate = /^1\d{10}$/;
    if (loginName == "") {
        layer.open({
            content: '请输入手机号码'
            , btn: '我知道了'
        });
        return false;
    }
    if (!mobileValidate.test(loginName)) {
        layer.open({
            content: '请输入正确的手机号码'
            , btn: '我知道了'
        });
        return false;
    }
    if (loginCode == "") {
        layer.open({
            content: '请输入图片验证码'
            , btn: '我知道了'
        });
        return false;
    }
    if (loginPwd == "") {
        layer.open({
            content: '请输入密码'
            , btn: '我知道了'
        });
        return false;
    }
    $("#btnLogin>a").html("登录中...").attr("disabled","disabled");
    $.ajax({
        type: "post",
        url: "/login/",
        contentType: "application/json",
        data: JSON.stringify({ "strUser": loginName, "strPwd": loginPwd,"strVerifyCode":loginCode}),
        dataType: "json",
        success: function (data, textStatus, request) {
            var error = "";
            switch (data) {
                case 1:
                    error = "帐号不存在";
                    break;
                case 2:
                    error = "密码不正确";
                    break;
                case 3:
                    error = "账户被禁用";
                    break;
                case 8:
                    error = "用户名或密码不能为空";
                    break;
                case 4:
                    error = "用户名格式错误";
                    break;
                case 5:
                    error = "密码格式错误,只能是小写字母或数字和-";
                    break;
                case 6:
                    error = "验证码错误";
                    break;
                case 7:
                    error = "验证码过期，请重新刷新验证码";
                    break;
            }
            if (error != "") {
                layer.open({
                    content: error
                    , btn: '我知道了'
                });
                codeIsShow = false;
                ShowCode();
            }
            else {
                var ticket = request.getResponseHeader("Ticket");
                //保存ticket
                $.cookie('userTicket', ticket, { expires: 1, path: '/' });
                $.cookie('userMobile', loginName, { expires: 1, path: '/' });
                window.location.href = "/index.html";
            }
            $("#btnLogin>a").text("登录").removeAttr("disabled");
        },
        error: function () {
            codeIsShow = false;
            ShowCode();
            layer.open({
                content: '登录失败，请稍后重试'
                , btn: '我知道了'
            });
            $("#btnLogin>a").text("登录").removeAttr("disabled");
        }
    });
  
}


var codeIsShow = false;
function ShowCode() {
    if (codeIsShow) {
        return;
    }
    var loginName = $("#mobile_phone").val();
    var loginPwd = $("#password").val();

    if (loginName != "" && loginPwd != "") {
        $.ajax({
            type: "post",
            url: "/VerifyCode/",
            contentType: "application/json",
            data: JSON.stringify({ "strUser": loginName, "strPwd": loginPwd  }),
            dataType: "json",
            success: function (data) {
                codeIsShow = true;
                $("#imgCode").attr("src","data:image/gif;base64,"+ data);
                $("#liCode").show();
            },
            error: function () {
              
            }
        });
    }
}

window.onload = function () {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

