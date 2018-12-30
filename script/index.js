$(function () {
    UserIsSetGetPwdQuestion();
    Ajax("/home", null, function (data) {
        var bannerPath = data.DynamicGraphPath;
        var coinMoney = data.ReceiptAdvance;
        var mineNum = data.ActivateMineNum;
        var hashrate = data.Hashrate;
        if (bannerPath != "") {
            $("#imgBanner").attr("src", imgWeb + bannerPath);
         
        }
        $("#spMineNum").text(mineNum);
        $("#spHashrate").text(hashrate);
        $("#spMoney").text(coinMoney);
        if (mineNum == 0) {
            $(".btn_home").text("暂无矿机开采");
        }
    }, function () {
        window.location.href = "/user/login.html";
    });
    LoadMarketData();
    setInterval(LoadMarketData, 1000 * 20);
});


function UserIsSetGetPwdQuestion() {
    Ajax("/GetIsOpenNoticeAndContent", null, function (data) {
        data = eval("("+data+")");
        if (data.isopen == "1") {
            //获取保存提示内容
            var cookieContent = $.cookie('noticecontent');
            if (cookieContent != data.content) {
                //保存提示内容，避免重复提示
                $.cookie('noticecontent', data.content, { expires: 1, path: '/' });
                layer.open({
                    content: data.content
                    , btn: '知道了'
                });
            }
        }
    }, function () { });
}

function LoadMarketData() {
    $("#tbMarketData").find("tr[id!='trHead']").remove();
    Ajax("/GetMarketInfoList", null, function (data) {
        if (data != null) {
            var len = data.length > 4 ? 5 : data.length;
            var cla = "hq_up";
            var trHtml = '<tr><td> <img src="images/bi/{img}.png"  class="icon_c" />{name}</td>' +
                '<td>{biaozhi}</td>' +
                '<td><b class="blue">{money}</b></td>' +
                '<td><span class="{class}">{rate_down}</span></td></tr >';
            for (var i = 0; i < len; i++) {
                if (data[i].rate_down.substring(0,1)=="-") {
                    cla = "hq_down";
                }
                var newHtml = trHtml.replace("{name}", data[i].coin_name);
                newHtml = newHtml.replace("{biaozhi}", data[i].coin_name.toUpperCase());
                newHtml = newHtml.replace("{img}", data[i].coin_name);
                newHtml = newHtml.replace("{money}", data[i].cny_exchange);
                newHtml = newHtml.replace("{rate_down}", data[i].rate_down);
                newHtml = newHtml.replace("{class}", cla);
                $("#tbMarketData").append(newHtml);
            }
        }
    }, function () {

    });
}