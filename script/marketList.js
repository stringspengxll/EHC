
$(function () {
    LoadMarketData();
    setInterval(LoadMarketData, 1000 * 20);
});

function LoadMarketData() {
    $("#tbMarketData").find("tr[id!='trHead']").remove();
    Ajax("/GetMarketInfoList", null, function (data) {
        if (data != null) {
            var cla = "hq_up";
            var trHtml = '<tr><td>{name}</td>' +
                '<td>{biaozhi}</td>' +
                '<td><b class="blue">{money}</b></td>' +
                '<td><span class="{class}">{rate_down}</span></td></tr >';
            for (var i = 0; i < data.length; i++) {
                if (data[i].rate_down.substring(0, 1) == "-") {
                    cla = "hq_down";
                }
                var newHtml = trHtml.replace("{name}", data[i].coin_name);
                newHtml = newHtml.replace("{biaozhi}", data[i].coin_name.toUpperCase());
                newHtml = newHtml.replace("{money}", data[i].cny_exchange);
                newHtml = newHtml.replace("{rate_down}", data[i].rate_down);
                newHtml = newHtml.replace("{class}", cla);
                $("#tbDataList").append(newHtml);
            }
        }
    }, function () {

    });
}