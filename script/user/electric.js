$(function () {
    GetConfig();
    Submit();
});
var minMoney = 0;
function GetConfig() {
    Ajax("/GetElectricConfig", null, function (data) {
        minMoney = data.MinMoney;
        $("#spTip").text("转换" + data.MinMoney + "ETH起（手续费" + data.ServiceCharge +"ETH）");
    }, function () { });
}

function Submit()
{
    $("#btnSubmit").click(function () {
        var userCode = $("#txtUserCode").val();
        var money = $("#txtMoney").val();
        var otherCoinName = $("#selOtherCoinName").find("option:selected").val();
        var payPwd = $("#txtPayPwd").val();
        var type = /^(\-|\+)?\d+(\.\d+)?$/;
        if (userCode == "") {
            layer.open({
                content: '请输入账户'
                , btn: '我知道了'
            });
            return false;
        }
        if (money == "") {
            layer.open({
                content: '请输入转换金额'
                , btn: '我知道了'
            });
            return false;
        }
        if (money.match(type) == null || money == "0") {
            layer.open({
                content: '请输入正确的转换金额'
                , btn: '我知道了'
            });
            return;
        }
  
        if (payPwd == "") {
            layer.open({
                content: '请输入支付密码'
                , btn: '我知道了'
            });
            return false;
        }
        if (otherCoinName == "") {
            layer.open({
                content: '请输入转换币名'
                , btn: '我知道了'
            });
            return false;
        }

        $("#btnSubmit").text("提交中").attr("disabled", "disabled");
        Ajax("/AddEHC2OtherCoin", { OtherCoinName: otherCoinName, UserCode: userCode, Money: money, PayPwd: payPwd }, function (data) {
            var error = "";
            switch (data.RetCode) {
                case 1:
                    error = "申请成功，预计兑换" + GetDecimalSub(data.ResultMoney,8) + "个" + otherCoinName + "币";
                    break;
                case 2:
                    error = "未查询到该币种的汇率";
                    break;
                case 3:
                    error = "汇款人余额不足";
                    break;
                case 4:
                    error = "转账金额错误";
                    break;
                case 5:
                    error = "支付密码错误";
                    break;
                case 6:
                    error = "未查询到互通币的汇率";
                    break;
                case 7:
                    error = "低于最小兑换值";
                    break;
            }
            if (error != "") {
                layer.open({
                    content: error
                    , btn: '我知道了'
                    , yes: function (index) {
                        if (data.RetCode == 1) {
                            window.location.href = "me.html";
                        }
                        layer.close(index);
                    }
                });
            }
        }, function () { });
        $("#btnSubmit").text("转账").removeAttr("disabled");


    });
}