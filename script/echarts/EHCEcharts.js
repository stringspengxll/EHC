
var app = {};
option = null;
var rateData =[];


$(function () {
    LoadExchangeRateReportData();
});

function LoadExchangeRateReportData() {
    Ajax("/GetExchangeRateReport", { RowNum:7}, function (data) {
        if (data.ExchangeRateReportList.length > 0) {
            for (var i = 0; i < data.ExchangeRateReportList.length; i++) {
                rateData.push({ name: new Date(data.ExchangeRateReportList[i].updated_date).Format("yyyy-MM-dd"), value: [new Date(data.ExchangeRateReportList[i].updated_date).Format("yyyy/MM/dd"), data.ExchangeRateReportList[i].cny_exchange] });
            }
            ShowEchart();
        }
        else {
            $("#echarts").hide();
        }
    }, function () {
        $("#echarts").hide();
        });
}

function ShowEchart() {
    option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: true
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: true
            }
        },
        series: [{
            name: '',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: rateData
        }]
    };

    var dom = document.getElementById("echarts");

    var myChart = echarts.init(dom);
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}