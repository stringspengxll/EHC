$(function () {
    $("#btnSubmit").click(function () {
        
        var num = $("#order_num").val();
        var pay_pwd = $("#pay_pwd").val();
        var type = /^(\-|\+)?\d+(\.\d+)?$/;
        var re = new RegExp(type);
        if (num.match(re) == null || num=="0") {
            layer.open({
                content: '请输入正确的数量'
                , btn: '我知道了'
            });
            return;
        }
        if (pay_pwd=="") {
            layer.open({
                content: '请输入支付密码'
                , btn: '我知道了'
            });
            return;
        }
        $("#btnSubmit").text("提交中").attr("disabled", "disabled");
        Ajax("/AddEntryOrder", { CoinMoneyNum: num, PayPwd: pay_pwd, OrderType: 1 }, function (data) {
            var msg = "挂单失败，请稍后重试";
            if (data == "1") {
                msg = "挂单成功";
            }
            else if (data == "2") {
                msg = "算力不足无法挂单交易";
            }
            else if (data == "3") {
                msg = "挂单互通币超出自身";
            }
            else if (data == "5") {
                msg = "支付密码错误";
            }
            layer.open({
                content: msg
                , btn: '我知道了',
                yes: function (index) {
                    layer.close(index);
                    if (data == "1") {
                        window.location.href = "buyOrder.html";
                    }
                }
            });
            $("#btnSubmit").text("确认发布").removeAttr("disabled"); 
        }, function () { $("#btnSubmit").text("确认发布").removeAttr("disabled"); });
    });
});