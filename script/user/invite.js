$(function () {
    Ajax("/GetUserInfo", null, function (data) {
        if (data != null) {
            $("#imgQRCode").attr("src", data.QR_code);
            var linkUrl = webUrl + "/user/register.html?m=" + data.mobile;
            $("#pLinkUrl").text(linkUrl);
            $("#btnCopy").attr("data-clipboard-text", linkUrl);

          
        }
    }, function () {

        });

    var btn = document.getElementById('btnCopy');
    var clipboard = new ClipboardJS(btn);//实例化

    //复制成功执行的回调，可选
    clipboard.on('success', function (e) {
        layer.open({
            content: '复制成功'
            , btn: '我知道了'
        });
    });
});