
var btc_exchange = 0;
var objDropload;
var typeID = 1;
var divID = "divSCBuy";
$(function () {
    LoadData();

    $(".order_tab a").click(function () {
        typeID = $(this).index() + 1;
        console.log(typeID);
        $(".order_tab").find(".current").removeClass("current");
        $(this).addClass("current");
        LoadData();
        $(".order_list").hide();
        $(".order_list").eq($(this).index()).show();
    });

    CloseOrder();
    ConfirmOrder();
 
    $(document).on("click", ".upimg", function () {
        var mineID = $(this).attr("value");
        layer.open({
            type: 1
            , content: '<iframe src="uploadPayImg.html?id=' + mineID+'" style="width:100%;height:100%;border-width:0px;"></iframe>'
            , anim: 'up'
            , style: 'position:fixed; bottom:0; left:0; width: 100%; height: 150px; padding:10px 0; border:none;'
        });
    });
    
});

function CloseOrder() {
   
    $(document).on("click", ".closeorder", function () {
        var id = $(this).attr("value");
        layer.open({
            content: '确认取消该订单吗？'
            , btn: ['确定', '取消']
            , yes: function (index) {
              
                Ajax("/CancelTradeOrder", { TradeID: id }, function (data) {
                    var msg = "交易取消失败，请稍后重试";
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
                                window.location.href = "nowOrder.html";
                            }
                            layer.close(index);
                        }
                    });
                }, function () { });

            }
        });
            });
}


function ConfirmOrder() {
    $(document).on("click", ".confirm", function () {
        var mineID = $(this).attr("value");
        layer.open({
            type: 1
            , content: '<iframe src="confirmOrder.html?id=' + mineID + '" style="width:100%;height:100%;border-width:0px;"></iframe>'
            , anim: 'up'
            , style: 'position:fixed; bottom:0; left:0; width: 100%; height: 200px; padding:10px 0; border:none;'
        });
    });
}


var scBuyPage = 1, scSellPage = 1, gdBuyPage = 1, gdSellPage = 1, pageNum = 1;

function LoadData() {
   
    switch (typeID) {
        case 1:
            divID = "divSCBuy";
            pageNum = scBuyPage;
            break;
        case 2:
            divID = "divSCSell";
            pageNum = scSellPage;
            break;
        case 3:
            divID = "divGDBuy";
            pageNum = gdBuyPage;
            break;
        case 4:
            divID = "divGDSell";
            pageNum = gdSellPage;
            break;
    }

    //// 每页展示10个
    var size = 10;
    //// dropload
    //objDropload = $('#' + divID).dropload({
    //    scrollArea: window,
    //    loadDownFn: function (me) {
    //        Ajax("/GetTradeOrderList", { TradeType: typeID, PageNum: pageNum,Size:size }, function (data) {
    //            var jsonData = data;
    //            var arrLen = jsonData.length;
    //            if (arrLen > 0) {
    //                switch (typeID) {
    //                    case 1:
    //                        scBuyPage++;
    //                        break;
    //                    case 2:
    //                        scSellPage++;
    //                        break;
    //                    case 3:
    //                        gdBuyPage++;
    //                        break;
    //                    case 4:
    //                        gdSellPage++;
    //                        break;
    //                }
    //                pageNum++;
    //                if (arrLen != size) {
    //                    // 锁定
    //                    me.lock("up");
    //                }
    //            }
    //            else {
    //                // 锁定
    //                me.lock("up");
    //                if (pageNum == 1) {
    //                    me.noData();
    //                }
    //            }
    //            me.resetload();

    //            LoadMineData(jsonData);
    //        }, function () {
    //            // 即使加载出错，也得重置
    //            me.resetload();
    //            });
            
    //    }
    //});

    Ajax("/GetTradeOrderList", { TradeType: typeID, PageNum: pageNum, Size: size }, function (data) {
        var jsonData = data;
        var arrLen = jsonData.length;
        if (arrLen > 0) {
            switch (typeID) {
                case 1:
                    scBuyPage++;
                    break;
                case 2:
                    scSellPage++;
                    break;
                case 3:
                    gdBuyPage++;
                    break;
                case 4:
                    gdSellPage++;
                    break;
            }
        }
        LoadMineData(jsonData);
    }, function () {
   
    });
}


function LoadMineData(data) {
    if (data != null) {
        var trHtml = '<div class="order_txtcon">' +
            ' <ul class="list">' +
            '<li>订单编号：{orderno}</li>' +
            '<li><span class="mr">买入数量：{num}</span><span class="mr">单价：￥{price}</span><span class="mr">总价：￥{totalmoney}</span></li>' +
            '<li>买入时间：{buytime}</li>' +
            '<li>{mmname}姓名：{sellname}	</li>' +
            '<li>{mmname}手机号：{mobile}</li>' +
            '<li>{mmname}支付宝账号：{sellzfb}</li>' +
            '<li style="display:{showwxcode}">{mmname}微信收款码：<div><img style="width:80px;height:80px;" src="{wxcode}" class="showimg"  /></div></li>' +
            '<li style="display:{showzfjt}">支付截图：<div><img style="width:80px;height:80px;" src="{zfimg}" class="showimg" /></div></li>' +
            '<li>订单状态：{state}</li>' +
            '</ul>{payhtml}</div>';
        for (var i = 0; i < data.length; i++) {
            var mobile = data[i].order_mobile;
            var mmname = "买方";
            var sellname = data[i].user_name;
            var alipay_account = data[i].gd_alipay_account;
            var wxCode = data[i].gd_weixin_QRcode;
            if (typeID == 1 || typeID == 3) {
                mmname = "卖方";
            }
            if (typeID == 3 || typeID == 4) {
                mobile = data[i].trade_mobile;
                sellname = data[i].trade_user_name;
                alipay_account = data[i].alipay_account;
                wxCode = data[i].weixin_QRcode;
            }
           
            var totalMoney = (parseFloat(data[i].unit_price) * parseFloat(data[i].trade_num));
            var totalMoneyM = (totalMoney / 7).toFixed(2);
            //var btbMoney = parseFloat(btc_exchange) * parseFloat(data[i].unit_price);
          //  mobile = mobile.substring(0, 3) + "****" + mobile.substring(8, 11);
           // alipay_account = alipay_account.substring(0, 3) + "****" + alipay_account.substring(alipay_account.length - 4, alipay_account.length);

            var status = data[i].order_status;
            var paystatus = data[i].is_trade_pay;
            var statusHtml = '<span>已付款</span>';

            var payHtml = '<div class="order_btn">';
            if (status == 0) {
                if (paystatus == 0) { //未支付
                    if (typeID == 1 || typeID == 3) {
                        payHtml += '<button type="button" class="f12 btn_tr_gray upimg" value="' + data[i].ID + '">上传支付截图</button>';
                        payHtml += '<button type="button" class="f12 btn_tr_red closeorder" value="' + data[i].ID + '">撤销订单</button>';
                        statusHtml = '<span class="red">未支付 （提交订单5分钟内未上传截图将取消订单）</span>';
                    }
                    else {
                        payHtml += '<button type="button" class="f12 btn_tr_red closeorder" value="' + data[i].ID + '">撤销订单</button>';
                        statusHtml = '<span class="red">未支付</span>';
                    }
                }
                else {
                    if (data[i].order_status == 0 && (typeID == 2 || typeID == 4)) {
                        payHtml += '<button type="button" class="f12 btn_tr_gray confirm" value="' + data[i].ID + '">确认</button>';
                    }
                }
            }
            else {
                statusHtml = status == 1 ? '<span>已完成</span>' :'<span>已取消</span>';
            }
            payHtml += '</div>';

            var newHtml = trHtml.replace("{mobile}", mobile);
            newHtml = newHtml.replace("{num}", GetDecimalSub(data[i].trade_num,8));
            newHtml = newHtml.replace("{showwxcode}", wxCode!=""?"":"none");
            newHtml = newHtml.replace("{price}", GetDecimalSub(data[i].unit_price,2));
            newHtml = newHtml.replace("{totalmoney}", GetDecimalSub(totalMoney,2));
            newHtml = newHtml.replace("{totalmoneym}", GetDecimalSub(totalMoneyM,2));
            newHtml = newHtml.replace("{buytime}", new Date(data[i].created_date.replace('T', ' ').replace(/-/g, '/')).Format('yyyy-MM-dd hh:mm:ss'));
            newHtml = newHtml.replace("{sellname}", sellname);
            newHtml = newHtml.replace("{orderno}", data[i].order_no);
            newHtml = newHtml.replace("{sellzfb}", alipay_account,0);
            newHtml = newHtml.replace("{wxcode}", wxCode);
            
            newHtml = newHtml.replace("{state}", statusHtml);
            newHtml = newHtml.replace("{payhtml}", payHtml);
            newHtml = newHtml.replace(/{id}/g, data[i].ID);
            newHtml = newHtml.replace(/{mmname}/g, mmname);
            newHtml = newHtml.replace(/{zfimg}/g, data[i].pay_img);
            newHtml = newHtml.replace("{showzfjt}", data[i].pay_img == null?"none":"");
            $("#" + divID).append(newHtml);
        }
    }
}

$(document).ready(function () {
    $(".mask_x").click(function () {
        $(".mask_box").hide();
    });

    $(document).on("click", ".showimg", function () {
        $(".big_pic").attr("src", $(this).attr("src"));
        $("#divBigImg").show();
    });
})
