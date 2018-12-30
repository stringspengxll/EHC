

var cny_exchange = 0;
$(function () {
    Ajax("/GetExchangeRate", null, function (data) {
        cny_exchange = data.cny_exchange;
        LoadUserData();
    }, function () { });

    var btn = document.getElementById('btnCopy');
    var clipboard = new ClipboardJS(btn);//实例化

    //复制成功执行的回调，可选
    clipboard.on('success', function (e) {
        layer.open({
            content: '复制成功'
            , btn: '我知道了'
        });
    });

    Ajax("/GetUserInfo", null, function (data) {

        $("#hUserName").html(data.real_name);
        $("#spMobile").html(data.mobile);
        $(".bag_num").html(data.user_code);
        $("#btnCopy").attr("data-clipboard-text", data.user_code);
        
    }, function () {

        });


    Ajax("/GetCustomerService", null, function (data) {
        if (data != "") {
            $("#aQQ").attr("href","http://wpa.qq.com/msgrd?v=3&uin="+data+"&site=qq&menu=yes").attr("target","_blank");
        }
    }, function () {

    });

    Sign();

    $("#liLoginOut").click(function () {
        Ajax("/logout", null, function (data) {
            window.location.href = "login.html";
        }, function () {

        });

    });
});

var isSign = false;
function Sign() {
    Ajax("/CheckSignIn", null, function (data) {
        if (data) {
            //$("#btnSign").addClass("btn_gray").removeClass("btn_red").text("已签到");
            $("#btnSign").text("已签到");
            isSign = true;
        }
    }, function () {
        });

    $("#btnSign").click(function () {
        if (isSign) {
            return false;
        }
        Ajax("/AddSignIn", null, function (data) {
            var message = "签到成功";
            if (data == 2) {
                message = "今日已签到过";
            }
            else {
                isSign = true;
                $("#btnSign").addClass("btn_gray").removeClass("btn_red").text("已签到");
            }
            layer.open({
                content: message
                , btn: '我知道了'
            });
        }, function () {
            layer.open({
                content: "签到失败"
                , btn: '我知道了'
            });
        });
    });


}

function LoadUserData() {
    Ajax("/home", null, function (data) {
        
        var coinMoney = data.CoinMoney == null ? 0 : data.CoinMoney;
        var totalMoney = GetDecimalSub(parseFloat(coinMoney) * parseFloat(cny_exchange),2);
        var hashrate = GetDecimalSub(data.Hashrate,8);
        $("#sTotalMoney").html(totalMoney);
        $("#sHashrate").html(hashrate);
        $("#sBTC").html(GetDecimalSub(coinMoney,8));
    }, function () {

    });
}


