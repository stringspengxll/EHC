var tradeID = 0;
$(function () {
    tradeID = GetQueryString("id");

    UploadImg();
    $("#btnSubmit").click(function () {
        Submit();
    });

  
});

function Submit() {
    var pay_img = $("#pay_img").val();
    if (pay_img == "") {
        layer.open({
            content: '请上传支付截图'
            , btn: '我知道了'
        });
        return;
    }
    Ajax("/UploadPayImg", { TradeID: tradeID, Base64Img: pay_img }, function (data) {
        var msg = "上传支付凭证失败，请稍后重试";
        var retCode = data.RetCode;
        if (retCode == "1") {
            msg = "上传支付凭证成功";
        }
        else if (retCode == "2") {
            msg = "交易单不存在";
        }
        else if (retCode == "3") {
            msg = "交易已完成或已取消";
        }
        else if (retCode == "4") {
            msg = "非法的操作";
        }
        layer.open({
            content: msg
            , btn: '我知道了',
            yes: function (index) {
                if (retCode == "1") {
                    window.parent.location.href = "nowOrder.html";
                }
                layer.close(index);
            }
        });

    }, function () { });
}

function UploadImg() {
    


    document.querySelector('#fileImg').addEventListener('change', function () {
        var that = this;
        lrz(that.files[0], {
            width: 1024, 
                before: function () {
                },
                fail: function (err) {
                },
                always: function () {
                }
        })
            .then(function (rst) {
                var img = new Image(),
                    div = document.createElement('div'),
                    p = document.createElement('p'),
                    sourceSize = toFixed2(that.files[0].size / 1024),
                    resultSize = toFixed2(rst.base64Len / 1024),
                    scale = parseInt(100 - (resultSize / sourceSize * 100));
                img.width = 80;
                img.height = 80;
                p.style.fontSize = 13 + 'px';
                p.style.width = 100;
                p.style.height = 100;
                div.appendChild(img);
                div.appendChild(p);

                img.onload = function () {
                  
                    document.querySelector('#imgShow').appendChild(div);
                };

                img.src = rst.base64;
                $("#pay_img").val(rst.base64);
                return rst;
            });
    });
}

function toFixed2(num) {
    return parseFloat(+num.toFixed(2));
}


String.prototype.render = function (obj) {
    var str = this, reg;

    Object.keys(obj).forEach(function (v) {
        reg = new RegExp('\\!\\{' + v + '\\}', 'g');
        str = str.replace(reg, obj[v]);
    });

    return str;
};


function fireEvent(element, event) {
    var evt;

    if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    }
    else {
        // 其他标准浏览器使用dispatchEvent方法
        evt = document.createEvent('HTMLEvents');
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
    }
}


function demo_report(title, src, size) {
    // var img = new Image();
    var img = new Image(),
        size = (size / 1024).toFixed(2) + 'KB';
    img.width = 80;
    img.height = 80;
    img.src = typeof src === 'string' ? src : URL.createObjectURL(src);
    
    $("#imgShow").html(img);


}