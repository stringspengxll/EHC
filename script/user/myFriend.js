
$(function () {
    LoadData(1);
    LoadData(2);
    $(".trade_tab>a").click(function () {
        var index = $(this).index();
        $(".trade_tab>.current").removeClass("current");
        $(this).addClass("current");
        $(".friend_tab").hide();
        $(".friend_tab").eq(index).show();
    });
});


function LoadData(typeID) {
    var tbID = typeID == 1 ? "tbDirectSubordinate" :"tbIndirectSubordinate";

    Ajax("/GetRecommendUser", { TypeID: typeID }, function (data) {
        if (data != null) {
            var trHtml = '<tr>';
            if (typeID == 2) {
                trHtml += '<td>{inviter_mobile}</td>';
            }
            trHtml +='<td>{invitee_mobile}</td>' +
                '<td>{register_time}</td>' +
                '</tr>';
            for (var i = 0; i < data.length; i++) {
                var inviter_mobile = data[i].inviter_mobile;
                var invitee_mobile = data[i].invitee_mobile;
                var register_time = data[i].register_time;
                inviter_mobile = inviter_mobile.substring(0, 3) + "****" + inviter_mobile.substring(7, 11);
                invitee_mobile = invitee_mobile.substring(0, 3) + "****" + invitee_mobile.substring(7, 11);
                var newHtml = trHtml.replace("{inviter_mobile}", inviter_mobile);
                newHtml = newHtml.replace(/{invitee_mobile}/g, invitee_mobile);
                newHtml = newHtml.replace(/{register_time}/g, new Date(data[i].register_time.replace('T', ' ').replace(/-/g, '/')).Format('yyyy-MM-dd hh:mm:ss'));
                $("#" + tbID).append(newHtml);
            }
        }
    }, function () {

    });
}