
var btc_exchange = 0;
$(function () {
    Ajax("/GetExchangeRate", null, function (data) {
        btc_exchange = data.btc_exchange;
        LoadMineData();
    }, function () { });


    $("#btnSearch").click(function () {
        LoadMineData();
    });
});


function LoadMineData() {
    $("#divOrderList").html("");
   var userMobile = $.cookie('userMobile');
    var mobile = $("#searchKey").val();
    Ajax("/GetEntryOrderList", { OrderType: 1, Mobile: mobile }, function (data) {
        if (data != null) {
            var trHtml = '<div class="trade_bar">' +
                ' <img src="images/user_img.jpg" alt="" class="trade_user_img" />' +
                '<ul class="c_list">' +
                ' <li><h3>{mobile}</h3></li>' +
                '<li>数量：{num}</li>' +
                ' <li>单价：<strong class="blue">￥{price}</strong></li>' +
                ' <li>总价：￥{totalmoney}</li>' +
                '</ul>' +
                '<ul class="r_list">{button}</ul>' +
                '</div>';
            for (var i = 0; i < data.length; i++) {
                var mobile = data[i].mobile;
                var buttonHtml = '<li><a class="btn_red f14" href="sellOut.html?id={id}&n={num}&p={price}">卖给ta</a></li>';
                if (userMobile == mobile && parseFloat(data[i].order_num)>0) {
                    buttonHtml = '<li><a class="btn_red f14" href="javascript:CloseOrder({id});">撤销</a></li>';
                }
                var totalMoney = (parseFloat(data[i].unit_price) * parseFloat(data[i].order_num));
                var totalMoneyM = (totalMoney / 7);
                var btbMoney = parseFloat(btc_exchange) * parseFloat(data[i].unit_price);
                mobile = mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
                var newHtml = trHtml.replace("{mobile}", mobile);
                newHtml = newHtml.replace("{button}", buttonHtml);
                newHtml = newHtml.replace(/{num}/g, GetDecimalSub(data[i].order_num,8));
                newHtml = newHtml.replace(/{price}/g, GetDecimalSub(data[i].unit_price, 2));
                newHtml = newHtml.replace("{btc}", btbMoney);
               
                newHtml = newHtml.replace("{totalmoney}", GetDecimalSub(totalMoney,2));
                newHtml = newHtml.replace("{totalmoneym}", GetDecimalSub(totalMoneyM,2));
                newHtml = newHtml.replace(/{id}/g, data[i].ID);
                $("#divOrderList").append(newHtml);
            }
        }
    }, function () {

    });
}

function CloseOrder(id) {
    layer.open({
        content: '确认取消该交易吗？'
        , btn: ['确定', '取消']
        , yes: function (index) {
            Ajax("/CancelEntryOrder", { ID: id }, function (data) {
                var msg = "取消交易失败，请稍后重试";
                if (data == "1") {
                    msg = "取消交易成功";
                }
                else if (data == "2") {
                    msg = "取消的交易不存在";
                }
                else if (data == "3") {
                    msg = "交易取消失败，交易已完成或已取消";
                }
                layer.open({
                    content: msg
                    , btn: '我知道了',
                    yes: function (index) {
                        if (data == "1") {
                            window.location.href = "buyOrder.html";
                        }
                        layer.close(index);
                    }
                });

            }, function () { });
        }
    });
}