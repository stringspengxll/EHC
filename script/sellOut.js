var orderID = 0;
$(function () {
    orderID = GetQueryString("id");
    $("#txtTotalNum").val(GetQueryString("n"));
    $("#txtUnitPrice").val(GetQueryString("p"));

    $("#btnSubmit").click(function () {
        SubmitData();
    });
});

function SubmitData() {
    var totalNum = $("#txtTotalNum").val();
    var price = $("#txtUnitPrice").val();
    var sellNum = $("#txtNum").val();
    var payPwd = $("#txtPayPwd").val();
    var type = /^(\-|\+)?\d+(\.\d+)?$/;
    var re = new RegExp(type);
    if (sellNum.match(re) == null || sellNum == "0") {
        layer.open({
            content: '请输入正确的卖出数量'
            , btn: '我知道了'
        });
        return;
    }
    if (parseFloat(sellNum) <0) {
        layer.open({
            content: '卖出数量必须大于0'
            , btn: '我知道了'
        });
        return;
    }

    if (parseFloat(sellNum) > parseFloat(totalNum)) {
        layer.open({
            content: '卖出数量不能大于可卖数量'
            , btn: '我知道了'
        });
        return;
    }
    if (payPwd == "") {
        layer.open({
            content: '请输入支付密码'
            , btn: '我知道了'
        });
        return;
    }
    $("#btnSubmit").text("提交中").attr("disabled", "disabled");
    Ajax("/AddTradeOrder", { EntryID: orderID, CoinMoneyNum: sellNum, PayPwd: payPwd }, function (data) {
        var msg = "交易失败，请稍后重试";
        if (data == "1") {
            msg = "交易成功";
        }
        else if (data == "2") {
            msg = "挂单不存在";
        }
        else if (data == "3") {
            msg = "挂单已禁用";
        }
        else if (data == "4") {
            msg = "挂单已撤消";
        }
        else if (data == "5") {
            msg = "挂单已售完";
        }
        else if (data == "6") {
            msg = "挂单剩余数不足";
        }
        else if (data == "7") {
            msg = "支付密码错误";
        }
        else if (data == "8") {
            msg = "不能自己购买或售出自己的挂单";
        }
        else if (data == "9") {
            msg = "余额不足以扣除交易税";
        }
        else if (data == "10") {
            msg = "交易者余额不足以交易";
        }
        layer.open({
            content: msg
            , btn: '我知道了',
            yes: function (index) {
                layer.close(index);
                if (data == "1") {
                    window.location.href = "nowOrder.html";
                }
            }
        });
        $("#btnSubmit").text("确认出售").removeAttr("disabled"); 
    }, function () { $("#btnSubmit").text("确认出售").removeAttr("disabled");  });
}