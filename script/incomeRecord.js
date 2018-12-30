var pageNum = 1;
$(function () {
    LoadData();
});

function LoadData() {
    // 每页展示10个
    var size = 10;
    // dropload
    objDropload = $('#divDataList').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            Ajax("/GetIncomeConsumption", {PageNum: pageNum, Size: size }, function (data) {
                var jsonData = data;
                var arrLen = jsonData.length;
                if (arrLen > 0) {
                    pageNum++;
                    if (arrLen != size) {
                        // 锁定
                        me.lock();
                    }
                }
                else {
                    // 锁定
                    me.lock("up");
                    if (pageNum == 1) {
                        me.noData();
                    }
                }
                me.resetload();

                LoadMineData(jsonData);
            }, function () {
                // 即使加载出错，也得重置
                me.resetload();
            });

        }
    });
}


function LoadMineData(data) {
    if (data != null) {
        var trHtml = '<div class="kj_infobar">' +
            '<ul class="c_list">' +
            '<li><h3>{name}</h3></li>' +
            '<li>{date}</li>' +
            '</ul>' +
            '<div class="r_list">' +
            '<span class="{class}">{num}HTC</span>' +
            '</div></div>';
        for (var i = 0; i < data.length; i++) {
            var newHtml = trHtml;
            newHtml = newHtml.replace("{name}", data[i].description.split('-')[0]);
            newHtml = newHtml.replace("{class}", parseFloat(data[i].new_coin_money) > parseFloat(data[i].old_coin_money)?"red":"green");
            newHtml = newHtml.replace("{num}", GetDecimalSub((parseFloat(data[i].new_coin_money) - parseFloat(data[i].old_coin_money)),8));
            newHtml = newHtml.replace("{date}", new Date(data[i].created_date.replace('T', ' ').replace(/-/g, '/')).Format('yyyy-MM-dd hh:mm:ss'));
            $("#divDataList").append(newHtml);
        }
    }
}