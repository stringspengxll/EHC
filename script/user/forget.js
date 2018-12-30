$(function () {
    $(".question").hide();
    $("#txtMobile").blur(function () {
        LoadData();
    });

    $("#btnSubmit").click(function () {
        Submit();
    });
});

var mobileValidate = /^1[3456789]\d{9}$/;
function LoadData() {
    var mobile = $("#txtMobile").val();
    if (mobile == "") {
        layer.open({
            content: '请输入手机号码'
            , btn: '我知道了'
        });
        return false;
    }
    if (!mobileValidate.test(mobile)) {
        layer.open({
            content: '请输入正确的手机号码'
            , btn: '我知道了'
        });
        return false;
    }

    $("#liTip").show();
    Ajax("/GetUserQuestionByPwd", { mobile: mobile }, function (data) {
        if (data.length > 1) {
            $("#txtQestion1").val(data[0]);
            $("#txtQestion2").val(data[1]);
            $(".question").show();
        }
        else {
            layer.open({
                content: '您没有设置找回问题'
                , btn: '我知道了'
            });
        }
        $("#liTip").hide();
      
     
    }, function () {
        $("#liTip").hide();
        layer.open({
            content: '问题加载失败'
            , btn: '我知道了'
        });
    });
}

function Submit() {
    var question1 = $("#txtQestion1").val();
    var ask1 = $("#txtAsk1").val();
    var question2 = $("#txtQestion2").val();
    var ask2 = $("#txtAsk2").val();
    var mobile = $("#txtMobile").val();

    if (mobile == "") {
        layer.open({
            content: '请输入手机号码'
            , btn: '我知道了'
        });
        return false;
    }
    if (!mobileValidate.test(mobile)) {
        layer.open({
            content: '请输入正确的手机号码'
            , btn: '我知道了'
        });
        return false;
    }
    if (question1 == "") {
            layer.open({
                content: '请输入问题1'
                , btn: '我知道了'
            });
            return false;
        }
    if (ask1 == "") {
            layer.open({
                content: '请输入答案1'
                , btn: '我知道了'
            });
            return false;
        }
    if (question2 == "") {
        layer.open({
            content: '请输入问题2'
            , btn: '我知道了'
        });
        return false;
    }
    if (ask2 == "") {
        layer.open({
            content: '请输入答案2'
            , btn: '我知道了'
        });
        return false;
    }
    $("#btnSubmit").text("提交中").attr("disabled", "disabled");


    Ajax("/CheckUserQA", { mobile: mobile, q1: question1, a1: ask1, q2: question2, a2: ask2 }, function (data) {
        var error = "获取失败";
        var retCode = data.RetCode;
        switch (retCode) {
                case 1:
                error = "获取成功：您的密码是：" + data.LoginPwd;
                    break;
                case 2:
                error = "第一题问题或答案错误";
                    break;
                case 3:
                error = "第二题问题和答案错误";
                    break;
            }
            if (error != "") {
                layer.open({
                    content: error
                    , btn: '我知道了'
                    , yes: function (index) {
                        if (retCode == 1) {
                            window.location.href = "login.html";
                        }
                        layer.close(index);
                    }
                });
                $("#btnSubmit").text("获取").removeAttr("disabled");
            }
    }, function () { $("#btnSubmit").text("获取").removeAttr("disabled"); });
       

    
}


function Ajax(postUrl, postData, sucFun, errFun) {
    $.ajax({
        type: "post",
        url: postUrl,
        contentType: "application/json",
        data: JSON.stringify(postData),
        dataType: "json",
        success: function (data) {
            sucFun(data);
        },
        error: function () {
            errFun();
        }
    });
}