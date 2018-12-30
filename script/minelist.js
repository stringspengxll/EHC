$(function () {
    LoadMineData();
    $(document).on("click", ".buymine", function () {
        var mineID = $(this).attr("value");
        var canBuy = $(this).attr("canBuy");
        if (canBuy == 0) {
            layer.open({
                content: '抱歉，当前矿机暂未开放购买'
                , btn: '我知道了'
            });
            return false;
        };

        //询问框
        layer.open({
            content: '确认购买该矿机吗？'
            , btn: ['确定', '取消']
            , yes: function (index) {
                Ajax("/UserBuyMine", { MineID: mineID }, function (data) {
                    var msg = "购买失败，请稍后重试";
                    if (data == "1") {
                        msg = "购买成功";
                    }
                    else if (data == "2") {
                        msg = "购买失败，已达到限购数";
                    }
                    else if (data == "3") {
                        msg = "赠送矿机不能购买";
                    }
                    else if (data == "4") {
                        msg = "互通币余额不足";
                    }
                    else if (data == "5") {
                        msg = "矿机不可购买";
                    }
                    layer.open({
                        content: msg
                        , btn: '我知道了',
                        yes: function (index) {
                            if (data == "1") {
                               window.location.href = "user/mymine.html";
                            }
                            layer.close(index);
                        }
                    });
                }, function () { });
               
            }
        });
    });

});

function LoadMineData() {
    Ajax("/GetMineAndNum", null, function (data) {
        if (data != null) {
            data = eval('(' + data + ')');
           
            var trHtml = '<div class="kj_bar"><img src="{img}" alt="" class="icon_kj" />' +
                '<ul class="c_list">' +
                '<li><h3>{name}</h3></li>' +
                '<li>总产量数：{money}EHC' +
                '<li>开采周期：{day}天</li>' +
                '<li>{tipname}{totalnum}台，剩余{havenum}台可购</li>' +
                '</ul>' +
                '<ul class="r_list">' +
                '<li class="mb"><span class="blue"><strong>{price}</strong>EHC</span>/台</li>' +
                '<li style="{canbuy}"><button class="btn_blue f12 buymine" value="{id}" canBuy={canbuy}>{buyname}</button></li>' +
                '</ul>' +
                '</div>';
            for (var i = 0; i < data.length; i++) {
                if (data[i].is_give_away == 1) { //不显示赠送
                    continue;
                }
                var tipName = data[i].is_give_away == 1 ? "总赠送" : "限购";
                var totalNum = data[i].restrict_num == null ? "0" : data[i].restrict_num;
                var haveNum = parseInt(totalNum) - (data[i].num == null ? 0 : parseInt(data[i].num));
    haveNum = parseInt(haveNum) < 0 ? 0 : haveNum;
            var newHtml = trHtml.replace("{img}",imgWeb+data[i].mine_pic);
            newHtml = newHtml.replace("{name}", data[i].mine_name);
            newHtml = newHtml.replace("{money}", data[i].output_num);
                newHtml = newHtml.replace("{day}", (parseInt(data[i].output_time) / 60 / 60 / 24).toFixed(0));
                newHtml = newHtml.replace("{totalnum}", totalNum);
                newHtml = newHtml.replace("{havenum}", haveNum);
                newHtml = newHtml.replace("{canbuy}", haveNum>0?"":"display:none;");
                newHtml = newHtml.replace(/{price}/g, data[i].mine_price);
                newHtml = newHtml.replace(/{canbuy}/g, data[i].is_buy);
                newHtml = newHtml.replace(/{buyname}/g, data[i].is_buy==1?"购买":"暂未开放");
                newHtml = newHtml.replace("{tipname}", tipName);
            newHtml = newHtml.replace(/{id}/g, data[i].ID);
            $(".kj_main").append(newHtml);
        }
    }
}, function () {

});
}