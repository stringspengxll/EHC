$(function () {
    GetUserMineData();
});

function GetUserMineData() {
    Ajax("/home", null, function (data) {
        var coinMoney = data.ReceiptAdvance;
        var mineNum = data.ActivateMineNum;
        var hashrate = data.Hashrate;
        var mineList = data.MineList;
            $("#spMineNum").text(mineNum);
            $("#spHashrate").text(hashrate);
        $("#spMoney").text(coinMoney);
        LoadMineData(mineList);
        if (data.length == 0) {
            $(".kj_mylist").append('<p class="kj_btn"><button class="btn_home">暂无矿机开采</button></p>');
        }
    }, function () {
        $(".kj_mylist").append('<p class="kj_btn"><button class="btn_home">暂无矿机开采</button></p>');
    });
}

function LoadMineData(data) {
        if (data != null) {
            var trHtml = '<div class="mykj_bar"><img src="{img}" alt="" class="icon_kj" />' +
                '<ul class="c_list">' +
                '<li><h3>{name}</h3></li>' +
                '<li>产币：<span class="blue">{nownum}EHC</span> / {totalnum}HTC</li>' +
                '<li>开启时间：{begintime}</li>' +
                '<li>结束时间：{endtime}</li>' +
                '<li>矿机状态：<a class="{stateclass}" href="javascript:void(0);">{state}</a>{jhbtn}</li>' +
                '</ul>' +
                '<div class="skill">' +
                '<div class="skillbar html">' +
                ' <div class="filled" data-width="{jindu}%" style="width: {jindu}%;"></div>' +
                '<span class="percent">{jindu}%</span>' +
                '</div></div><a class="r_link" href="mymineinfo.html?id={id}"><i class="forward"></i></a></div>';
            for (var i = 0; i < data.length; i++) {
               
                var nowSection = (new Date().getTime() - new Date(new Date(data[i].start_time.replace('T', ' ').replace(/-/g, '/')).Format("yyyy-MM-dd hh:mm:ss")).getTime()) / 1000;
           
                var jindu = (parseFloat(nowSection) / parseFloat(data[i].output_time) * 100).toFixed(2);
                jindu = jindu < 0 ? 0 : jindu;
                jindu = jindu > 100 ? 100 : jindu;
                var nowOutPutNum = (parseFloat(data[i].output_num) * jindu / 100).toFixed(2);
                nowOutPutNum = nowOutPutNum < 0 ? 0 : nowOutPutNum;
                nowOutPutNum = parseFloat(nowOutPutNum) > parseFloat(data[i].output_num) ? data[i].output_num : nowOutPutNum;
                var newHtml = trHtml.replace("{img}", imgWeb + data[i].mine_pic);
                var state = data[i].is_activation == "1" ? (new Date(data[i].end_time.replace('T', ' ').replace(/-/g, '/')) <= new Date() ? "已结束" : "运行中") : "未激活";
                var stateclass = data[i].is_activation == "1" ? (new Date(data[i].end_time.replace('T', ' ').replace(/-/g, '/')) <= new Date() ? "" : "blue") : "red";
                var jhhtml = (data[i].is_activation == "1") ? "" : '<a class="btn_red ml" href="javascript:JiHuo({id});" style="line-height: 1;">激活</a>';
                jhhtml = new Date(data[i].end_time.replace('T', ' ').replace(/-/g, '/')) <= new Date() ? '<a class="btn_red ml" href="javascript:JiHuo({id});" style="line-height: 1;">激活</a>' : jhhtml;
                newHtml = newHtml.replace("{name}", data[i].minename);
                newHtml = newHtml.replace("{nownum}", nowOutPutNum);
                newHtml = newHtml.replace("{totalnum}", data[i].output_num);
                newHtml = newHtml.replace("{begintime}", new Date(data[i].start_time.replace('T', ' ').replace(/-/g, '/')).Format("yyyy-MM-dd hh:mm:ss"));
                newHtml = newHtml.replace("{endtime}", new Date(data[i].end_time.replace('T', ' ').replace(/-/g, '/')).Format("yyyy-MM-dd hh:mm:ss"));
                newHtml = newHtml.replace("{state}", state);
                newHtml = newHtml.replace("{stateclass}", stateclass);
                newHtml = newHtml.replace("{jhbtn}", jhhtml);
                newHtml = newHtml.replace(/{jindu}/g, jindu);
                newHtml = newHtml.replace(/{id}/g, data[i].ID);
                $(".kj_mylist").append(newHtml);
            }
        }
}

function JiHuo(id) {
    Ajax("/UserActivationMine", { UserMineID: id }, function (data) {
        var msg = "矿机激活失败";
        if (data == "1") {
            msg = "激活成功";
        }
        else if (data == "2") {
            msg = "赠送矿机不能激活";
        }
        else if (data == "3") {
            msg = "矿机收益待结算中，请稍候";
        }
        else if (data == "4") {
            msg = "矿机运行中，无法激活";
        }
        else if (data == "5") {
            msg = "用户互通币不够激活";
        }
        layer.open({
            content: msg
            , btn: '我知道了',
            yes: function (index) {
                layer.close(index);
                if (data == "1") {
                    window.location.href = "mymine.html";
                }
            }
        });
    }, function () { });
}