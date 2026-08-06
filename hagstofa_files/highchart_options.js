Highcharts.getDefaultColors = function () { return ['#093271', '#0094c3', '#8bbe01', '#99c2e0', '#cce1ef', '#666666', '#858585', '#a3a3a3', '#c2c2c2', '#e0e0e0', '#014475', '#346991', '#678fac', '#0d0d0d', '#262626', '#404040']; };

Highcharts.language = function () {

    if ($('#culture').val() == 'en') {

        Highcharts.setOptions({
            lang: { decimalPoint: '.', thousandsSep: ',', numericSymbols: ['K', 'M'], downloadSVG: 'Download as SVG', downloadPNG: 'Download as PNG', downloadJPEG: 'Download as JPEG', downloadPDF: 'Download as PDF', resetZoom: 'Zoom out', printChart: 'Print chart', contextButtonTitle: 'Export chart' },
            exporting: { buttons: { contextButton: { align: 'left' } } },
            chart: { zoomType: 'xy', margin: [50, 50, 100, 80] },
            yAxis: { opposite: true },
            credits: { enabled: false }
        });
    } else {

        Highcharts.setOptions({
            lang: { decimalPoint: ',', thousandsSep: '.', numericSymbols: [' þús', ' mill'], downloadSVG: 'Hlaða niður SVG', downloadPNG: 'Hlaða niður PNG', downloadJPEG: 'Hlaða niður JPEG', downloadPDF: 'Hlaða niður PDF', resetZoom: 'Til baka', printChart: 'Prenta graf', contextButtonTitle: 'Viltu hlaða niður grafi' },
            exporting: { buttons: { contextButton: { align: 'left' } } },
            chart: { zoomType: 'xy', margin: [50, 50, 100, 80] },
            yAxis: { opposite: true },
            credits: { enabled: false }
        });
    }

};

Highcharts.apiRender = function (query, container, width, height) {

    var q = replaceAll("&quot", '"', query);


    var json = JSON.parse(q);
    var basePath = "//px.hagstofa.is"
    //var basePath = "http://haxdev2:8080";
    //json.url = replaceAll("pxis/api/v1/is", "/pxweb/api/v1/is", json.url);
    //json.url = replaceAll("pxen/api/v1/en", "/pxweb-en/api/v1/en", json.url);

    json.url = replaceAll("pxweb/api/v1/is/", "/pxis/api/v1/is", json.url);
    json.url = replaceAll("pxweb-en/api/v1/en/", "/pxen/api/v1/en", json.url);

    json.url = basePath + json.url;
    if (json.graphOptions.autoUpdateYears) {
        updateQuery(json.url, json.graphOptions.yearsToGet, function (years) {


            for (var i = 0; i < json.query.query.length; i++) {

                if (json.query.query[i].code == "Ár") {
                    json.query.query[i].selection.values = years;

                }
            }
            Highcharts.apiCreateChart(json.query, json.xAxis, json.url, container, json.yAxis, json.subcat, json.interval, json.type, json.graphOptions, width, height);
        });
    }
    else {
        Highcharts.apiCreateChart(json.query, json.xAxis, json.url, container, json.yAxis, json.subcat, json.interval, json.type, json.graphOptions, width, height);
    }
}

function updateQuery(url, range, callback) {
    $.ajax({
        url: url, success: function (result) {
            for (var i = 0; i < result.variables.length; i++) {
                if (result.variables[i].text == "Ár") //TODO: no hardcoding!
                {
                    var length = result.variables[i].values.length;

                    var years = result.variables[i].values.slice(length - range, length);

                    callback(years);
                }
            }
        }
    });
}
function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

Highcharts.apiCreateChart = function (query, category, url, container, series, subCat, interval, type, options, width, height) {

    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(query),


        success: function (json) {

            var data = json["dataset"]["value"];
            var categories = [];
            var tmp;
            var dimension = json["dataset"]["dimension"];
            var seriesTest;
            var seriesTest2 = [];
            var subCatTmp = [];
            var subCatTmpArr = [];
            for (var key in dimension) {
                if (key == category) {
                    tmp = dimension[key]["category"]["label"];
                }
                if (key == series) {
                    seriesTest = dimension[key]["category"]["label"];
                }
                if (key == subCat) {
                    subCatTmp = dimension[key]["category"]["label"];
                }
            }
            if (series != null) {
                $.each(seriesTest, function (i, val) {
                    seriesTest2.push(val);

                });
            }

            $.each(tmp, function (i, val) {
                if (subCat != null) {

                    $.each(subCatTmp, function (i, subVal) {
                        categories.push(val + " " + subVal);
                    });
                }
                else {
                    categories.push(val);
                }
            });




            dataSetCount = data.length / categories.length;
            var tmpData = [];
            var tmpDatax = [];
            var dataset = [];
            if (options.fix) {
                for (var i = 0; i < dataSetCount; i++) {
                    tmpData[i] = [];
                }
                for (var i = 0; i < data.length; i += dataSetCount) {
                    for (var k = 0; k < dataSetCount; k++) {
                        tmpData[k].push(data[i + k]);

                    }

                }
                for (var i = 0; i < tmpData.length; i++) {
                    dataset.push({ showInLegend: options.showInLegend, name: seriesTest2[i], data: tmpData[i] });
                }


            }
            else {
                for (var i = 0; i < dataSetCount; i++) {


                    tmpData = data.slice(i * categories.length, i * categories.length + categories.length);
                    tmpData2 = { showInLegend: options.showInLegend, name: seriesTest2[i], data: tmpData };
                    dataset.push(tmpData2);



                }
            }

            newdata = [];

            if (options.order != null && options.order.value > 0) {
                for (var i = 0; i < dataset[0].data.length; i++) {
                    newdata.push({ name: categories[i], data: dataset[0].data[i] });
                }
                if (options.order.value === 1) {
                    newdata.sort(function (a, b) {
                        return parseFloat(a.data) - parseFloat(b.data);
                    });
                }
                else {
                    newdata.sort(function (a, b) {
                        return parseFloat(b.data) - parseFloat(a.data);
                    });
                }

                for (var i = 0; i < newdata.length; i++) {

                    categories[i] = newdata[i].name;

                    dataset[0].data[i] = newdata[i].data;
                }
            }
            label = json["dataset"]["label"];


            options.colors = Highcharts.getDefaultColors();
            Highcharts.language();
            if (height != '') {
                options.chart.height = height;
            }

            if (width != '') {
                options.chart.width = width;
            }

            if(!options.hasOwnProperty('decimalPlaces')) {
                options.decimalPlaces = 0;
            }
            Highcharts.apiRenderChart(container, dataset, categories, label, interval, type, options);

            $(window).resize();

        },
        error: function (data) {

        }
    });
}

Highcharts.apiRenderChart = function (container, data, categoriesdata, label, interval, type, options) {
    $(function () {

        $("#" + container).highcharts({
            colors: options.colors,
            chart: {
                marginRight: options.marginRight,
                marginLeft: options.marginLeft,
                marginTop: options.marginTop,
                marginBottom: options.marginBottom,
                type: type,
                height: options.height,
                width: options.width


            },
            title: {
                text: options.title,
                x: -20 //center

            },
            subtitle: {
                text: options.subTitle,
                x: -20
            },
            xAxis: {
                categories: categoriesdata,
                tickInterval: interval,
                title: {
                    text: options.xAxisName
                }
            },
            yAxis: [{
                title: {
                    text: ""
                },
                min: options.lowestValue,
                title: {
                    text: options.yAxisName
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }],
            tooltip: {
                valueSuffix: options.valueSuffix,
                // we've already set options.decimalPlaces to 0 if it didn't exist so:
                valueDecimals: options.decimalPlaces
            },
            legend: {
                layout: options.legend.layout.value,
                align: options.legend.position.value,
                verticalAlign: options.legend.verticalAlign.value,
                borderWidth: options.legend.borderWidth,

            },
            credits: {
                enabled: false
            },

            series: data
        });
    });
}
Highcharts.render = function (path, container, width, height, definition) {

    var options = Highcharts.getDefaultPieOptions();

    $.ajax({
        url: definition,
        success: function (data) {
            options = data;
            //options.xAxis = {};
            options.xAxis.data = [];
            options.series = [];
        },
        error: function (a, b, c) {
        },
        complete: function () {

            options.colors = Highcharts.getDefaultColors();

            options.chart.renderTo = container;

            if (height != '') {
                options.chart.height = height;
            }

            if (width != '') {
                options.chart.width = width;
            }
            Highcharts.language();


            $.get(path, function (data) {
                // Split the lines

                options.xAxis.categories = [];
                var lines = data.split('\n');

                // Iterate over the lines and add categories or series
                $.each(lines, function (lineNo, line) {
                    var items = line.split(',');

                    // header line containes categories
                    if (lineNo == 0) {
                        $.each(items, function (itemNo, item) {
                            if (itemNo > 0) {
                                options.xAxis.categories.push(item);
                            }

                        });

                    }

                        // the rest of the lines contain data with their name in the first
                        // position
                    else {
                        var series = {
                            data: []
                        };


                        if (options.chart.type === 'pie') {
                            var label = '';
                            $.each(items, function (itemNo, item) {

                                if (itemNo == 0) {
                                    series.name = item;
                                } else {

                                    if (isNaN(item)) {
                                        //category
                                        label += item;
                                    } else {
                                        //[category , data]
                                        series.data.push([label, parseFloat(item)]);
                                        label = '';
                                    }
                                }

                            });

                        } else {
                            $.each(items, function (itemNo, item) {
                                if (item.length > 0) {
                                    if (itemNo == 0) {
                                        series.name = item;
                                    } else {
                                        series.data.push(parseFloat(item));
                                    }
                                }
                            });
                        }
                        if (series.data.length > 0) {
                            options.series.push(series);
                        }

                    }


                });

                var chart = new Highcharts.Chart(options);

            });

        },
        dataType: "json"
    });

};

Highcharts.getDefaultSplineOptions = function () {
    return {
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        chart: {
            shadow: false,
            defaultSeriesType: 'spline',
            reflow: false
        },
        loading: {
            labelStyle: {
                top: '45%'
            },
            hideDuration: 1000,
            showDuration: 1000
        },
        legend: {
            enabled: true,
            labelFormatter: function (serie) {
                return this.name;
            }
        },
        xAxis: {
            tickmarkPlacement: 'on',
            title: { enabled: false },
            labels: {
                x: 0,
                y: 25,
                formatter: function () {
                    return this.value;
                },
                style: {
                    color: '#999999'
                }
            },
            data: []
        },
        credits: {
            enabled: false
        },
        yAxis: {
            endOnTick: true,
            min: 0,
            max: 5,
            title: { text: '' },
            labels: {
                formatter: function () {
                    return yAxisLabels[this.value];
                }
            }
        },
        series: [],
        plotOptions: {
            series: {
                animation: true
            },
            spline: {
                lineWidth: 3,
                marker: {
                    enabled: false,
                    lineWidth: 1,
                    lineColor: '#666666',
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5
                        }
                    }
                }
            }
        }
    };
};

Highcharts.getDefaultPieOptions = function () {
    return {
        legend: {
            labelFormatter: function () {
                return this.name + " - " + this.y + " %";
            },
            itemStyle: { paddingBottom: '10px' },
            verticalAlign: 'bottom',
            borderWidth: 0,
            layout: 'vertical',
            align: 'right',
            borderRadius: 5,
            y: -100,
            x: 10
        },
        title: {
            align: 'right', text: '', margin: 10, style: { fontSize: '1.3em', color: '#757575', fontFamily: 'MetroMedium, sans-serif' }
        },
        subtitle: {
            text: ''
        },
        chart: {
            backgroundColor: '#ffffff',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            defaultSeriesType: 'pie'
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
            }
        },
        xAxis: {
            labels: {
                formatter: function () {
                    return '';
                }
            },
            data: []
        },
        series: [],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                innerSize: 180
            },
            series: {
                shadow: false,

                dataLabels: {
                    enabled: true,
                    crop: false,
                    distance: 15,
                    x: 5,
                }
            }
        },
        credits: {
            enabled: false
        }
    };
};

Highcharts.getDefaultColumnOptions = function () {
    return {
        chart: {
            defaultSeriesType: 'column'
        },
        legend:
        {
            labelFormatter: function () {
                return this.name;
            },
            itemStyle: {
                color: '#333',
                font: 'normal 0.8em "Arial", Verdana, sans-serif'
            },
            borderWidth: 0,
            symbolWidth: 10,
            verticalAlign: 'middle',
            layout: 'vertical',
            align: 'right'
        },
        title: {
            text: ''
        },
        plotOptions: {
            column: {
                borderWidth: 0
            }
        },
        xAxis: {
            labels: {
                formatter: function () {
                    return '';
                }
            },
            data: []
        },
        credits: {
            enabled: false
        },
        series: []
    };
};

Highcharts.translateMonthToIcelandic = function (month) {

    var monthNames;

    if ($('#culture').val() == 'en') {
        monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    } else {
        monthNames = ["Jan", "Feb", "Mar", "Apr", "Maí", "Jún", "Júl", "Ágú", "Sep", "Okt", "Nóv", "Des"];
    }

    if ((month.length != 2) || (month.substring(0, 1) == '%'))
        return '';
    if (month.substring(0, 1) == '0')
        month = month.substring(1, 2);
    var imonth = parseInt(month) - 1;
    return monthNames[imonth];
};

function merge_options(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}



