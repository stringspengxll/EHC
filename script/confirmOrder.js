var tradeID = 0;
$(function () {
    tradeID = GetQueryString("id");
    
    $("#btnSubmit").click(function () {
        Submit();
    });

  
});

function Submit() {
    var payPwd = $("#pay_pwd").val();
    if (payPwd == "") {
        layer.open({
            content: '请输入支付密码'
            , btn: '我知道了'
        });
        return;
    }
    Ajax("/ConfirmPay", { TradeID: tradeID, PayPwd: payPwd }, function (data) {
        if (data == "1") {
            msg = "已确认支付";
        }
        else if (data == "2") {
            msg = "确认失败，该交易单不存在";
        }
        else if (data == "3") {
            msg = "确认失败，交易已完成或已取消";
        }
        else if (data == "4") {
            msg = "非法的操作";
        }
        else if (data == "5") {
            msg = "支付密码错误";
        }
        layer.open({
            content: msg
            , btn: '我知道了',
            yes: function (index) {
                if (data == "1") {
                    window.parent.location.href = "nowOrder.html";
                }
                layer.close(index);
            }
        });

    }, function () { });
}
