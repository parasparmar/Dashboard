//Ages vs Departments
$(function () {
    /// Stage 1 : get data from the server.
    $.ajax({
        type: "POST",
        //type: "GET",
        url: "Default.aspx/GetChartData",
        //url: "Sitel/js/data.csv",
        data: '{chartNum:0}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccessDrawChart,
        failure: function (response) {
            alert("failure : " + response.status);
        },
        error: function (response) {
            alert("error : " + response.status);
        }
    });
    /// Stage 2 : on successfull server response vegin drawing the chart.
    function OnSuccessDrawChart(response) {
        // Stage: Slice and Dice
        // splitBy is the innermost series. In this case it's gender and it's quantitative measurement on Y axis is the Headcount.
        var data = crossfilter(response.d);
        var splitByDimension = data.dimension(function (d) { return d.Gender; });
        var splitByGroup = splitByDimension.group().reduceSum(function (d) { return d.HeadCount; });
        var splitBys = splitByGroup.all();

        // xAxis is whatever data you need populated on the xAxis. It's like a groupBy in SQL. In this case it's role.
        var xAxis = data.dimension(function (d) { return d.Role; }).group().all();
        var xAxisWithsplitByDimension = data.dimension(function (d) {
            return JSON.stringify({ xAxis: d.Role, splitBy: d.Gender });
        });
        var xAxisWithsplitBysGroup = xAxisWithsplitByDimension.group().reduceSum(function (d) { return d.HeadCount; })
        xAxisWithsplitBysGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var xAxisWithsplitBys = xAxisWithsplitBysGroup.all();

        // Stage: Transform to Highcharts Compatible data structures.
        var splitBy = [];
        var splitByPlotData = [];
        for (g in splitBys) {
            splitBy.push(splitBys[g].key);
            var temp = [];
            xAxisWithsplitBys.filter(function (d) {
                var mysplitBy = d.key;
                if (splitBy[g] == mysplitBy.splitBy) { temp.push([mysplitBy.year, d.value]); }
            });
            splitByPlotData.push(temp);
        }
        var xAxisLabels = [];
        xAxis.forEach(function (d) { xAxisLabels.push(d.key); });

        // Stage : Chart Builder
        var DvChart4 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'dvChart4',
                height: 400,
                zoomType: 'x'
            }
            , title: {
                text: ''
            }
            , series: []
            , xAxis: {
                title: 'Year of Birth',
                allowDecimals: false,
                categories: xAxisLabels,
            }
            , yAxis: {
                title: {
                    text: 'Headcount'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            }
            , tooltip: {

                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} pax</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            }
            , plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            }
        });

        // Stage : Series Insertion
        for (g in splitBys) {
            DvChart4.addSeries({
                name: splitBy[g],
                data: splitByPlotData[g]
            });
        }
        splitByDimension.dispose();
        splitByGroup.dispose();
        xAxisWithsplitByDimension.dispose();

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
});

//roles vs Departments
$(function () {
    /// Stage 1 : get data from the server.
    $.ajax({
        type: "POST",
        //type: "GET",
        url: "Default.aspx/GetChartData",
        //url: "Sitel/js/data.csv",
        data: '{chartNum:0}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccessDrawChart,
        failure: function (response) {
            alert("failure : " + response.status);
        },
        error: function (response) {
            alert("error : " + response.status);
        }
    });
    /// Stage 2 : on successfull server response vegin drawing the chart.
    function OnSuccessDrawChart(response) {
        var data = crossfilter(response.d);
        var genderDimension = data.dimension(function (d) { return d.Gender; });
        var genderGroup = genderDimension.group().reduceSum(function (d) { return d.HeadCount; });
        var genders = genderGroup.all();
        var role = data.dimension(function (d) { return d.Role; }).group().all();
        var RoleWithGenderDimension = data.dimension(function (d) {
            return JSON.stringify({ role: d.Role, gender: d.Gender });
        });
        var RoleWithGendersGroup = RoleWithGenderDimension.group().reduceSum(function (d) { return d.HeadCount; })
        RoleWithGendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var RoleWithGenders = RoleWithGendersGroup.all();
        var gender = [];
        var genderPlotData = [];
        for (g in genders) {
            gender.push(genders[g].key);
            var temp = [];
            RoleWithGenders.filter(function (d) {
                var myGender = d.key;
                if (gender[g] == myGender.gender) { temp.push([myGender.year, d.value]); }
            });
            genderPlotData.push(temp);
        }
        var yearLabels = [];
        role.forEach(function (d) { yearLabels.push(d.key); });

        var DvChart2 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'dvChart3',
                height: 400,
                zoomType: 'x'
            }
            , title: {
                text: ''
            }
            , series: []
            , xAxis: {
                title: 'Year of Birth',
                allowDecimals: false,
                categories: yearLabels,
            }
            , yAxis: {
                title: {
                    text: 'Headcount'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            }
            , tooltip: {
                
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} pax</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            }
            , plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            }
        });
        for (g in genders) {
            DvChart2.addSeries({
                name: gender[g],
                data: genderPlotData[g]
            });
        }
        genderDimension.dispose();
        genderGroup.dispose();
        RoleWithGenderDimension.dispose();

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
});