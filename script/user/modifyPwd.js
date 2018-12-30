$(function () {
    $("#btnSubmit").click(function () {
        var oldPwd = $("#txtOldPwd").val();
        var newPwd = $("#txtNewPwd").val();
        var newPwd2 = $("#txtNewPwd2").val();
        if (oldPwd == "") {
            layer.open({
                content: '请输入旧密码'
                , btn: '我知道了'
            });
            return false;
        }
        if (newPwd == "") {
            layer.open({
                content: '请输入新密码'
                , btn: '我知道了'
            });
            return false;
        }
        if (newPwd != newPwd2) {
            layer.open({
                content: '两次新密码输入不一致'
                , btn: '我知道了'
            });
            return false;
        }
        $("#btnSubmit").text("提交中").attr("disabled", "disabled");
        Ajax("/UpdateLoginPwd", { strOldPwd: oldPwd, strNewPwd: newPwd }, function (data) {
            var error = "";
            switch (data) {
                case 1:
                    error = "更改密码成功";
                    break;
                case 2:
                    error = "旧密码错误";
                    break;
                case 3:
                    error = "用户不存在";
                    break;
            }
            $("#btnRegist").removeAttr("disabled").text("注册");
            if (error != "") {
                layer.open({
                    content: error
                    , btn: '我知道了'
                    , yes:function(index) {
                        if (data == "1") {
                            window.location.href = "me.html";
                        }
                        layer.close(index);
                    }
                });
            }
        }, function () { });
        $("#btnSubmit").text("修改").removeAttr("disabled");


    });
});