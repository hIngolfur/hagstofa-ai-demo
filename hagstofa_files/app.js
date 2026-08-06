/**
 * Hagstofa 1.0
 * @copyright Hagstofa (c) 2013
 */
var Application = function () {

    // scope (used internaly)
    var app = {};

    // modules
    // -----------
    app.modules = {

        init: function () {
            this.iCheck();
            this.offcanvas.init(); // this is mobile sidenavigation
            this.print();
            this.megamenu(); // this is statistics navigation
            this.tableCleaner();
            this.tabcontrol();
            this.validation();
            this.releasesFilter();
            this.mobile();
            this.calculator();
            this.moment();
            this.frontpageBoxes.init();
        },








        frontpageBoxes: {

            init: function () {

                var me = this;
                $(".keyfigures").on("click", function () {
                    ga('send', 'event', { eventCategory: 'Lykiltölur', eventAction: 'smellur', eventLabel: 'Lykiltölur' });
                });
                $(".frettirogtilkynningar").on("click", function () {
                    ga('send', 'event', { eventCategory: 'Fréttir', eventAction: 'smellur', eventLabel: 'Forsíða - Box label' });
                });
                $(".birtingaraetlun").on("click", function () {
                    ga('send', 'event', { eventCategory: 'Fréttir', eventAction: 'smellur', eventLabel: 'Forsíða - Birtingaráætlun - Box label' });
                });

                $(".track .visitala").on("click", function () {
                    ga('send', 'event', { eventCategory: 'Lykiltölur', eventAction: 'smellur', eventLabel: 'talnaefni/efnahagur/verdlag - vísitala' });
                });

                $(window).on('load', function () {
                    me.resize();
                });

                $(window).on("resize", function () {
                    me.resize();
                });

            },

            resize: function () {
                // Let's match heights of elements on frontpage & fix chart heights & widths
                var releaseCalendarHeight = $('.widget-birtingar').height();
                $('.frontpage-chart').css('min-height', releaseCalendarHeight);

                $('.chart').each(function (index) {
                    var width = $(this).parent().width();
                    var chart = $(this).highcharts();

                    if (chart) {
                        if (chart.chartWidth > width + 1 || chart.chartWidth < width - 1) {
                            chart.setSize(width, null, doAnimation = true);
                        }
                    }
                });

                var articleListHeight = $('.article-list-frontpage').closest('.min-height').outerHeight();
                $('.lykiltolur').closest('.min-height').css('min-height', articleListHeight);

                var keyfigureHeight = $('.lykiltolur').closest('.min-height').outerHeight();
                $('.article-list-frontpage').closest('.min-height').css('min-height', keyfigureHeight);
            }
        },

        iCheck: function () {

            $('input').icheck({
                checkboxClass: 'icheckbox_minimal',
                radioClass: 'iradio_minimal'
            });

        },
        moment: function () {

            var lang = $('body').attr('data-lang');

            if (lang == "EN") {
                moment.locale('en');
            } else {
                moment.locale('is');
            }


        },

        mobile: function () {
            if ($(window).width() < 992) {
                $('.fiveColumn > div > .simple ').each(function () {
                    if ($(this).children().length == 0) {
                        $(this).parent().hide();
                    }
                });
            }
        },

        tabcontrol: function () {

            $('.tabcontrol').each(function () {

                var tabcontrol = this,
                    hash = window.location.hash;

                $(tabcontrol).on('click', '.tabs .tab a', function (e) {

                    e.preventDefault();

                    var link = ($(this).attr('href')).replace('#', '');

                    // hide tab and remove current state
                    $(tabcontrol).find('> .tabs > .tab.active, .tabpane.active').removeClass('active');
                    $(tabcontrol).find('.tabpane#' + link).addClass('active');

                    // make clicked tab as current
                    $(this).parent('.tab').addClass('active');
                });

                // check for hash tag and make current
                if (hash !== '') {
                    $(tabcontrol).find('a[href=' + hash + ']').trigger('click');
                }
            });

        },

        offcanvas: {

            init: function () {

                var me = this;

                $('html').on('click', '.menu-toggle, .canvas-open .body-slide', function (e) {

                    e.preventDefault();

                    $('body').toggleClass('canvas-open');

                });

                $('.offcanvas .offcanvas-subopen').on('click', function (e) {

                    e.preventDefault();

                    $(this).parent().parent().addClass('open');

                    $(this).parents('ul').addClass('back');
                });

                $('.offcanvas .offcanvas-subback').on('click', function (e) {

                    e.preventDefault();

                    $(this).closest('.open').removeClass('open');
                    $(this).closest('.back').removeClass('back');

                });

                $('.offcanvas').show().css('display', 'flex');

                $(window).on('load', function () {
                    me.resize();
                });

                $(window).on('resize', function () {
                    me.resize();
                });

            },

            resize: function () {

                var height = 0;
                var windowHeight = $(window).height();
                var headerHeight = 79; // it's actually 80 but we -1px to remove bleedthrough
                var bottomButtonsHeight = 112; // we could select the element and
                // find the height instead of magic number, more flexible for changes...

                $('.offcanvas').css('height', windowHeight - headerHeight - bottomButtonsHeight);

            }

        },

        print: function () {

            $('.print-button, .social-print a').on('click', function (e) {

                e.preventDefault();

                window.print()

            });

        },

        megamenu: function () {

            $('main').append($('<div/>').addClass('nav-overlay').on('click', function () {

                var nav = $('.statistic-navigation nav');

                nav.find('> ul > li').removeClass('active');

                // remove active state
                $('.nav-overlay').removeClass('active');
            }));

            $('section.search').on('click', function () {
                var nav = $('.statistic-navigation nav');

                nav.find('> ul > li').removeClass('active');

                $('.nav-overlay').removeClass('active');
            });

            $('.statistic-navigation nav > ul > li > a').on('click', function (e) {

                e.preventDefault();

                if (!$(this).parent().hasClass('active')) {
                    $('.nav-overlay').addClass('active');
                    $('.statistic-navigation nav > ul > li').removeClass('active');
                } else {
                    $('.nav-overlay').removeClass('active');
                }

                $(this).parent().toggleClass('active');

            });

        },

        tableCleaner: function () {

            $('table').each(function (i, v) {

                $(this).addClass('table').removeAttr('width').removeAttr('bgcolor').removeAttr('height').removeAttr('style').removeAttr('align').find('tr,td,th,tbody,tfoot').removeAttr('width').removeAttr('height').removeAttr('style').removeAttr('bgcolor').find('font').removeAttr('size').removeAttr('face');

            });

        },
        tableResponsive2: function () {

            $("body:not(.table-resp) .table").on('click', function () {

                $('.table-wrapper').remove();
                $('body').addClass('table-resp');
                $('body').append('<div class="table-wrapper"></div>');
                $(this).clone().appendTo(".table-wrapper");

            });

            $("body").on('click', '.table-wrapper', function () {

                $('body').removeClass('table-resp');
                $(this).remove();

            });

        },

        breakpoints: function () {
            var bsc = $('body').bsClasses();
        },

        releasesFilter: function () {

            var dataUrl = $('#dataUrl').val();
            var culture = $('body').attr('data-lang');

            if (window.location.hash) {
                // Fragment exists
                var catString = window.location.hash.replace('#', '');
                var cat = catString.split(';');

                for (var i = 0; i < cat.length; i++) {
                    $('input[name=' + '"' + cat[i] + '"' + ']').prop("checked", true);
                }
                filter();
            }

            $('.releases-actions input[type=checkbox]').on('change', function () {
                filter();
            });

            function filter() {
                arr = [];

                $(".releases-actions input[type=checkbox]:checked").each(function () {

                    arr.push($(this).val());

                });
            };
        },
        validation: function () {
            function isValidEmailAddress(emailAddress) {
                var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                return pattern.test(emailAddress);
            }

            $("#alert").hide();

            $("#iCal").on('click', function () {


                if (!isValidEmailAddress($("#email").val())) {
                    document.getElementById('email').setCustomValidity('Netfang ekki af réttu formi');
                    $("#alert").show();
                }

                if (!$("#email").val()) {
                    document.getElementById('email').setCustomValidity('Þessi reitur má ekki vera tómur');
                    $("#alert").show();
                }
            });


        },

        calculator: function () {

            var d = new Date();
            var currentYear = d.getFullYear();
            // Filling in *old* year dropdown values, for years since 1939. Auto-starting with selecting last year
            for (var i = 1939; currentYear >= i; i++) {
                if (i === currentYear - 1) {
                    $('#price-calculator #old-year').append('<option value="' + i + '" selected>' + i + '</option>');
                } else {
                    $('#price-calculator #old-year').append('<option value="' + i + '">' + i + '</option>');
                }
            }
            // Filling in *new* year dropdown values, for years since 1939.
            // Defaults will be set based on latest available data after data loads
            for (var j = 1939; currentYear >= j; j++) {
                $('#price-calculator #new-year').append('<option value="' + j + '">' + j + '</option>');
            }

            $("#do-math").on('click', function () {

                calc();

            });
            if ($("#price-calculator").length) {

                $('.currency-change').hide();

                // Here used to be a call to Umbraco API, we replace it...
                // So code here should have similar functionality as in Umbraco's PPICalcController.cs
                var pxUrl = '//px.hagstofa.is/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01002.px';
                var pxJson = '{"query":[' +
                        '{"code":"Vísitala","selection":{"filter":"item","values":["CPI"]}},' +
                        '{"code":"Grunnur","selection":{"filter":"item","values":["B1939"]}}' +
                    '],"response":{"format":"csv"}}';
                var data = {
                    years: []
                };
                var availableData = {}; // Move availableData to outer scope
                var updateMonthAvailability; // Declare function in outer scope
                var latestOriginalData = { year: 1939, month: 0, yearIndex: 0, monthIndex: 0 }; // Move to outer scope
                // TODO: Remove next line, unless in debug mode:
                // console.log('Loading data from PX...');
                $.post(pxUrl, pxJson)
                    .done(function (rawPxData) {
                        // TODO: Remove next line, unless in debug mode:
                        // console.log('Fully loaded data from PX...');

                        // We split into array based on new-lines in the CSV
                        var dataByLines = rawPxData.split('\n');
                        // We remove first row which is the column-names row:
                        dataByLines.shift();
                        if (dataByLines[dataByLines.length - 1] === '') {
                            // Removing last row if it's empty:
                            dataByLines.pop();
                        }
                        var lastValue = '';
                        // latestOriginalData is now in outer scope

                        $(dataByLines).each(function (index, value) {
                            var dataInLine = value.split(','); // Split the CSV (comma-separated variable)
                            var startYear = 1939; // First year in data
                            var time = dataInLine[0].replace(/"/g, ''); // "yyyyMmm" string format of time, i.e. "2019M01"
                            var year = parseInt(time.split('M')[0]);
                            var month = parseInt(time.split('M')[1]) - 1; // Convert to 0-based month index
                            // For the array indices we change the years so year 1939 is year zero, 1940 year 1, 1941 year 2, etc.:
                            var yearsFromStart = year - startYear;

                            var consumerPriceIndex = dataInLine[1];

                            function isNumeric(n) {
                              // simple & good enough implementation for here:
                              return !isNaN(parseFloat(n)) && isFinite(n);
                            }

                            if (isNumeric(consumerPriceIndex)) {
                                // This code-block here is executed only in months with valid numeric values for the index.
                                // Explanation: Some years the consumerPriceIndex was only calculated four times a year,
                                // In those cases the months where it was not calculated have '.' or '"."' in the CSV, instead of a numeric value.
                                // For our calculations we need to replace the empty values with the most recent previously valid value
                                // which we will store in lastValue. We get it like this since the CSV data is in ascending order of year/month:
                                lastValue = consumerPriceIndex;

                                // Track this as the latest original data point
                                latestOriginalData = {
                                    year: year,
                                    month: month,
                                    yearIndex: yearsFromStart,
                                    monthIndex: month
                                };

                                // Track that this year/month has original data
                                availableData[year + '_' + month] = true;
                            }
                            // We check if data.years[yearsFromStart] already exists, if not then we create it & fill with an object with name like 1998, and a months array:
                            data.years[yearsFromStart] = data.years[yearsFromStart] || { name: year, months: [] };
                            data.years[yearsFromStart].months.push({ value: lastValue }); // We always put in lastValue as this month's value
                        });

                        // Define function to update month dropdown based on data availability
                        updateMonthAvailability = function(yearSelector, monthSelector, explicitYear) {
                            var selectedYear = explicitYear || $(yearSelector).val();

                            $(monthSelector + ' option').each(function() {
                                var monthValue = parseInt($(this).val());
                                var dataKey = selectedYear + '_' + (monthValue - 1); // Convert 1-based HTML to 0-based for data lookup

                                if (availableData[dataKey]) {
                                    $(this).prop('disabled', false);
                                } else {
                                    $(this).prop('disabled', true);
                                }
                            });
                        };

                        // Populate new year dropdown based on available data
                        for (var j = 1939; j <= latestOriginalData.year; j++) {
                            $('#price-calculator #new-year').append('<option value="' + j + '">' + j + '</option>');
                        }

                        // Set smart defaults based on latest available data instead of calendar dates
                        if (latestOriginalData.year > 1939) {
                            $('#price-calculator #new-year').val(latestOriginalData.year);
                            $('#price-calculator #new-month').val(latestOriginalData.month + 1); // Convert 0-based to 1-based
                        } else {
                            // Fallback to previous behavior if no data found (should not happen)
                            $('#price-calculator #new-year').val(currentYear);
                            $('#price-calculator #new-month').val(d.getMonth() + 1); // Convert 0-based to 1-based
                        }

                        // TODO: move all these price calculator things to a new JavaScript file, and have app.js as it was with the Umbraco API call,
                        // so that we can deploy Njóla Django solution independently of this JavaScript code
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    });

                var culture = $('body').attr('data-lang').toLowerCase();

                $("#use-old-kronur").on("change", function () {
                    calc();
                });

                $(".currency-change").hide();
                $("#old-year").on("change", function () {

                    var newYear = $('#new-year option:selected').val();
                    var oldYear = $('#old-year option:selected').val();

                    if (oldYear < 1981) {
                        $('.currency-change').show();
                    }
                    else
                    {
                        $('.currency-change').hide();
                    }

                    // Update month availability when year changes
                    if (updateMonthAvailability) {
                        updateMonthAvailability('#price-calculator #old-year', '#price-calculator #old-month');
                    }
                });

                $("#new-year").on("change", function () {
                    // Update month availability when year changes
                    if (updateMonthAvailability) {
                        updateMonthAvailability('#price-calculator #new-year', '#price-calculator #new-month');
                    }
                });
                function addCommas(nStr,marker) {
                    nStr += '';
                    x = nStr.split('.');
                    x1 = x[0];
                    x2 = x.length > 1 ? '.' + x[1] : '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + marker + '$2');
                    }
                    return x1 + x2;
                }
                function calc() {
                    var useOldCurrency = $('#use-old-kronur').is(':checked');
                    var oldMonth = $('#old-month option:selected').val();
                    var oldYear = $('#old-year option:selected').val();

                    var newMonth = $('#new-month option:selected').val();
                    var newYear = $('#new-year option:selected').val();

                    var monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var monthsIS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Ágú', 'Sep', 'Okt', 'Nóv', 'Des'];

                    var oldYearIndex = oldYear-1939;
                    var newYearIndex = newYear - 1939;
                    var newMonthIndex = newMonth - 1;
                    var oldMonthIndex = oldMonth - 1;

                    var oldIndex = data.years[oldYearIndex].months[oldMonthIndex].value;
                    var newIndex = data.years[newYearIndex].months[newMonthIndex].value;

                    var percentage = (newIndex - oldIndex) / oldIndex;


                    var percentageText = (percentage * 100).toFixed(1);


                    var oldValue = parseFloat($("#old-val").val());

                    var newValue = Math.round(((oldValue * percentage) + oldValue) * 100) / 100;

                    if (oldYear < 1981 && !useOldCurrency) {
                        newValue /= 100;
                    }
                    if (culture !== "is") {
                        if (newYear < 1981) {
                            newValue = newValue.toFixed(2);
                        }
                        else
                        {
                            newValue = newValue.toFixed(0);
                        }
                        newValue = newValue.toString().replace(",", ".");
                        newValue = addCommas(newValue, ",");
                        percentageText = percentageText.toString().replace(",", ".");
                        percentageText = addCommas(percentageText,",") + "% increase";

                    }
                    else
                    {
                        if (oldYear < 1981) {
                            newValue = newValue.toFixed(2);
                        }
                        else {
                            newValue = newValue.toFixed(0);
                        }
                        newValue = newValue.toString().replace(".", ",");
                        newValue = addCommas(newValue, ".");
                        percentageText = percentageText.toString().replace(".", ",");
                        percentageText = addCommas(percentageText,".") + "% hækkun";
                    }
                    $('#new-val').val(newValue + " kr.");
                    $('.result').text(percentageText);




                    var chartData = [];
                    var xAxisLabels = [];
                    var interval = Math.round((newYearIndex - oldYearIndex) / 1.5)+1;


                    for(var i = oldYearIndex; i<=newYearIndex;i++)
                    {



                        for (var k = 0; k < 12; k ++) {
                            if(i == oldYearIndex)
                            {

                                if((k>=oldMonthIndex))
                                {

                                    var oldIndex = data.years[oldYearIndex].months[oldMonthIndex].value;
                                    var newIndex = data.years[i].months[k].value;
                                    var percentageChange = (newIndex - oldIndex) / oldIndex;
                                    percentageChange = percentageChange * 100;

                                    chartData.push(percentageChange);
                                    if (culture === "is") {
                                        xAxisLabels.push(data.years[i].name + " " + monthsIS[k]);
                                    }
                                    else {
                                        xAxisLabels.push(data.years[i].name + " " + monthsEN[k]);
                                    }

                                    if (oldYearIndex == newYearIndex && k == newMonthIndex) {
                                        break;
                                    }
                                }
                            }
                            else if(i < newYearIndex ) {
                                var oldIndex = data.years[oldYearIndex].months[oldMonthIndex].value;
                                var newIndex = data.years[i].months[k].value;
                                var percentageChange = (newIndex - oldIndex) / oldIndex;
                                percentageChange = percentageChange * 100;

                                chartData.push(percentageChange);
                                if (culture === "is") {
                                    xAxisLabels.push(data.years[i].name + " " + monthsIS[k]);
                                }
                                else {
                                    xAxisLabels.push(data.years[i].name + " " + monthsEN[k]);
                                }

                            }
                            else if(i == newYearIndex &&  k <=newMonthIndex)
                            {

                                var oldIndex = data.years[oldYearIndex].months[oldMonthIndex].value;
                                var newIndex = data.years[i].months[k].value;
                                var percentageChange = (newIndex - oldIndex) / oldIndex;
                                percentageChange = percentageChange * 100;

                                chartData.push(percentageChange);
                                if (culture === "is") {
                                    xAxisLabels.push(data.years[i].name + " " + monthsIS[k]);
                                }
                                else {
                                    xAxisLabels.push(data.years[i].name + " " + monthsEN[k]);
                                }
                            }

                        }

                    }
                    $('#index').highcharts({
                        chart: {
                            type: 'line',
                            zoomType: 'x'

                        },
                        title: {
                            text: (culture === 'is' ? 'Verðlagsbreyting' : 'Price Index')
                        },
                        subtitle: {
                            text: data.years[oldYearIndex].name + (culture === 'is' ? ' til ' : ' to ') + data.years[newYearIndex].name
                        },
                        xAxis: {
                            categories: xAxisLabels,//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            tickInterval: interval,


                        },
                        yAxis: {

                            title: {
                                text: (culture === 'is' ? 'Verðlags ' : 'Pricing ') + '%'
                            },
                            labels: {
                                format: "{value} %"
                            }

                        },
                        tooltip: {


                            pointFormat: (culture === 'is' ? 'Verðlagsbreyting' : 'Price Index') + " : {point.y:.2f} %"
                        },
                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false,

                                    format: "{y:.2f} %",

                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: (culture === 'is' ? 'Verðlagsbreyting' : 'Price Index'),
                            data: chartData,//[7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                            marker: {
                                enabled: false
                            }


                        }]
                    });






                }


                $('#new-year').on('change', function () {
                    disableFutureMonths('#new-year', '#new-month');
                });

                $('#old-year').on('change', function () {
                    disableFutureMonths('#old-year', '#old-month');
                });

                function disableFutureMonths(selectorYear, selectorMonth) {

                    var el = $(selectorYear);
                    var selectedYear = el.val();

                    // First, update based on data availability
                    if (updateMonthAvailability) {
                        updateMonthAvailability(selectorYear, selectorMonth);
                    } else {
                        // Fallback: enable all options first
                        $(selectorMonth).children().prop('disabled', false);
                    }

                    // Then apply future month restrictions only for current year
                    var d = new Date();
                    var currYear = d.getFullYear();
                    var currMonth = d.getMonth();

                    if (selectedYear === currYear.toString()) {
                        $(selectorMonth).children().each(function () {
                            var monthValue = parseInt($(this).val()) - 1; // Convert to 0-based
                            var dataKey = selectedYear + '_' + monthValue;

                            // Only disable if month is in the future AND has no data
                            if (monthValue > currMonth && !availableData[dataKey]) {
                                $(this).prop('disabled', 'disabled');
                            }
                        });
                    }

                }

                disableFutureMonths('#new-year', '#new-month');

                // Trigger year change event to properly initialize month availability
                // This simulates the manual year change that fixes the issue
                setTimeout(function() {
                    var currentNewYear = $('#price-calculator #new-year').val();
                    var currentOldYear = $('#price-calculator #old-year').val();

                    // Temporarily change to a different year and back to trigger the change event
                    if (currentNewYear) {
                        var tempYear = parseInt(currentNewYear) - 1;
                        $('#price-calculator #new-year').val(tempYear).trigger('change');
                        setTimeout(function() {
                            $('#price-calculator #new-year').val(currentNewYear).trigger('change');

                            // After year change completes, set the correct month selection
                            setTimeout(function() {
                                if (latestOriginalData.year > 1939) {
                                    $('#price-calculator #new-month').val(latestOriginalData.month + 1); // Convert 0-based to 1-based
                                }
                            }, 50);
                        }, 50);
                    }

                    // Do the same for old year
                    if (currentOldYear) {
                        var tempYear = parseInt(currentOldYear) - 1;
                        $('#price-calculator #old-year').val(tempYear).trigger('change');
                        setTimeout(function() {
                            $('#price-calculator #old-year').val(currentOldYear).trigger('change');
                        }, 100);
                    }
                }, 200);

            }

            /*            function calcInflation(oldPPI, newPPI) {
                            return Math.round((oldPPI === newPPI ? 0 : (newPPI - oldPPI) / oldPPI) * 100);
                        }*/

        }

    };

    app.forms = {

        init: function () {
            this.publication.init();
            $("#successMsg").hide();
        },

        publication: {

            init: function () {
                this.onSubmit();
                this.priceChange();
            },

            onSubmit: function () {

                var me = this;

                $('.publication-item form').on('submit', function (e) {
                    e.preventDefault();

                    var $form = $(this);

                    $form.find('.alert').remove();

                    if (me.validate($form)) {
                        var fd = new FormData($form[0]);

                        $.ajax({
                            type: $form.attr('method'),
                            dataType: 'json',
                            url: $form.attr('action'),
                            data: fd,
                            processData: false,  // tell jQuery not to process the data
                            contentType: false,
                            complete: function (data) {

                                $form.append('<div class="alert alert-success">Takk fyrir.</div>');
                                $form[0].reset();
                            }
                        });
                    }

                });
            },

            validate: function ($form) {

                var v = true;

                $form.find('.mandatory input, .mandatory textarea, .mandatory select').each(function () {

                    $(this).removeClass('error');

                    if ($(this).val() == '') {
                        v = false;
                        $(this).addClass('error');
                    }

                });

                return v;

            },

            priceChange: function () {
                $('.publication-item .price-input').on('keyup', function () {

                    var qty = $(this).val();
                    var val = $(this).attr('data-val');
                    var lang = $(this).attr('data-lang');

                    var total = parseInt(qty) * parseInt(val);

                    if (lang == "IS") {
                        total = total + " kr.";
                    }

                    $('.publication-item .total-price').text(total);

                });
            }

        }

    };
    app.table = {
        init:function()
        {
            $("article > table").addClass("pxtable");
            $("span[class='firstrow']").parent().addClass("firstrow");
            $("span[class='title']").parent().parent().addClass("title");
            $("article > table.pxtable tr td:first-of-type").addClass("stub1");

        }
    }
    app.utility = {

        removeHash: function () {
            var scrollV, scrollH, loc = window.location;
            if ("pushState" in history)
                history.pushState("", document.title, loc.pathname + loc.search);
            else {
                // Prevent scrolling by storing the page's current scroll offset
                scrollV = document.body.scrollTop;
                scrollH = document.body.scrollLeft;

                loc.hash = "";

                // Restore the scroll offset, should be flicker free
                document.body.scrollTop = scrollV;
                document.body.scrollLeft = scrollH;
            }
        }

    };

    /* Name search start */
    /* Name search end */


    // initializer
    // -----------
    app.initialize = (function () {

        // global methods
        app.modules.init();
        app.forms.init();
        app.table.init();
        // app.nameSearch.init();
        // globalize scope
        Application = app;

    }());
};

// Run application once document is ready:
$(Application);

$(".box-title").click
$(window).on('load', function () {
    // Checks all tables, except the .search-table(s) in employee-listing page
    // You may need to be more restrictive.
    $('table:not(.search-table)').each(function () {
        var element = $(this);
        // Create the wrapper element
        var scrollWrapper = $('<div />', {
            'class': 'scrollable',
            'html': '<div />' // The inner div is needed for styling
        }).insertBefore(element);
        // Store a reference to the wrapper element
        element.data('scrollWrapper', scrollWrapper);
        // Move the scrollable element inside the wrapper element
        element.appendTo(scrollWrapper.find('div'));
        // Check if the element is wider than its parent and thus needs to be scrollable
        if (element.outerWidth() > element.parent().outerWidth()) {
            element.data('scrollWrapper').addClass('has-scroll');
        }
        // When the viewport size is changed, check again if the element needs to be scrollable
        $(window).on('resize orientationchange', function () {
            if (element.outerWidth() > element.parent().outerWidth()) {
                element.data('scrollWrapper').addClass('has-scroll');
            } else {
                element.data('scrollWrapper').removeClass('has-scroll');
            }
        });
    });

    $('#stats-detail-tabs a').on("click", function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
});

/*
  ======================================================================
  JavaScript for Scrollable Tabs
  ======================================================================
*/

$(document).ready(function() {

  // Select the elements we'll be working with
  var wrapper = $('.nav-tabs-wrapper');
  var leftArrow = $('.left-arrow');
  var rightArrow = $('.right-arrow');
  var scrollAmount = 250; // The distance to scroll on each arrow click

  // IMPORTANT: If the wrapper doesn't exist on the page, stop running the script
  if (wrapper.length === 0) {
    return;
  }

  // --- Click Handlers for Arrows ---
  rightArrow.on('click', function() {
    wrapper.animate({ scrollLeft: wrapper.scrollLeft() + scrollAmount }, 300);
  });

  leftArrow.on('click', function() {
    wrapper.animate({ scrollLeft: wrapper.scrollLeft() - scrollAmount }, 300);
  });


  // --- Function to Show/Hide Arrows Intelligently ---
  function toggleArrows() {
    // Always show arrows regardless of screen size
    var maxScroll = wrapper[0].scrollWidth - wrapper[0].clientWidth;
    var currentScroll = wrapper.scrollLeft();

    // If content doesn't overflow, hide both arrows
    if (wrapper[0].scrollWidth <= wrapper[0].clientWidth) {
      leftArrow.hide();
      rightArrow.hide();
      return;
    }
    
    // Hide LEFT arrow if scrolled to the beginning
    currentScroll <= 0 ? leftArrow.hide() : leftArrow.show();
    
    // Hide RIGHT arrow if scrolled to the end
    currentScroll >= maxScroll - 1 ? rightArrow.hide() : rightArrow.show();
  }

  // --- Event Listeners ---
  // Run the check function whenever the user scrolls or resizes the window
  wrapper.on('scroll', toggleArrows);
  $(window).on('resize', toggleArrows);

  // Run the check once on page load to set the initial state
  toggleArrows();
});
