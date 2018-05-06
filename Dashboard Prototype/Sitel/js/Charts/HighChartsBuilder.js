﻿$(function () {
    /// Stage 1 : get data from the server.
    //$.ajax({
    //    type: "POST",
    //    url: "Default.aspx/GetChartData",
    //    data: '{chartNum:0}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: OnSuccessDrawChart,
    //    failure: function (response) {
    //        alert("failure : " + response.status);
    //    },
    //    error: function (response) {
    //        alert("error : " + response.status);
    //    }
    //});
    $.ajax({
        type: "GET",
        url: "Sitel/js/data.csv",
        data: '',
        dataType: "text",
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
        // Gender is the innermost series. In this case it's gender and it's quantitative measurement on Y axis is the Headcount.
        var typeofresponse = typeof response;
        if (typeofresponse === "string") {
            var result = $.csv.toObjects(response);
            for (d in result) {
                result[d].Headcount = +result[d].Headcount;
            }
            var data = crossfilter(result);
        } else {
            var data = crossfilter(response.d);
        }

        var genderDimension = data.dimension(function (d) { return d.Gender; });
        var genderGroup = genderDimension.group().reduceSum(function (d) { return d.Headcount; });
        var genders = genderGroup.all();

        // xAxis is whatever data you need populated on the xAxis. It's like a groupBy in SQL. In this case it's role.
        var Role = data.dimension(function (d) { return d.Role; }).group().all();
        var RoleWithgenderDimension = data.dimension(function (d) {
            return JSON.stringify({ Role: d.Role, gender: d.Gender });
        });

        var RoleWithgendersGroup = RoleWithgenderDimension.group().reduceSum(function (d) { return d.Headcount; });
        RoleWithgendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var RoleWithgenders = RoleWithgendersGroup.all();

        // Chart 1
        var years = data.dimension(function (d) { return d.YearOfBirth; }).group().all();
        var YobWithGenderDimension = data.dimension(function (d) {
            return JSON.stringify({ year: d.YearOfBirth, gender: d.Gender });
        });

        // Chart 2
        var YobWithGendersGroup = YobWithGenderDimension.group().reduceSum(function (d) { return d.Headcount; });
        YobWithGendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var YobWithGenders = YobWithGendersGroup.all();

        // Chart 3
        var DeptDimension = data.dimension(function (d) { return d.Department });
        var DeptGroup = DeptDimension.group().reduceSum(function (d) { return d.Headcount; }).all();
        var DeptLabels = [];
        DeptGroup.map(function (d) { DeptLabels.push(d.key) });

        var DsgnWDeptDimension = data.dimension(function (d) {
            return JSON.stringify({ designation: d.Role, department: d.Department });
        });
        var DsgnWDeptGroup = DsgnWDeptDimension.group().reduceSum(function (d) { return d.Headcount; });
        var DsgnWDept = DsgnWDeptGroup.all();
        var size = DsgnWDept.length;

        for (w in DsgnWDept) {
            var y = fillArrayWithNumbers(size);
            y.splice(w, 1, DsgnWDept[w].value);
            DsgnWDept[w] = {
                name: JSON.parse(DsgnWDept[w].key).department,
                data: y
            };
        }

        var stringDsgnWDept = JSON.stringify(DsgnWDept);
        function fillArrayWithNumbers(n) {
            var arr = Array.apply(null, Array(n));
            return arr.map(function (x, i) { return 0 });
        }
        var stop = [];
        //// Stage: Transform to Highcharts Compatible data structures.
        var gender = [];
        var genderPlotData = [];
        var yobWithGenderPlotData = [];
        var RoleWithGenderPlotData = [];
        var DsgnWDeptPlotData = [];

        for (g in genders) {
            gender.push(genders[g].key);

            var temp1 = [];
            YobWithGenders.filter(function (d) {
                var mygender = d.key
                if (gender[g] == mygender.gender) { temp1.push([mygender.year, d.value]); }
            });
            yobWithGenderPlotData.push(temp1);

            var temp2 = [];
            RoleWithgenders.filter(function (d) {
                var myRole = d.key;
                if (gender[g] == myRole.gender) { temp2.push([myRole.Role, d.value]); }
            });
            RoleWithGenderPlotData.push(temp2);
        }

        var yearLabels = convertGroup2XAxisCategoryLabels(years);
        var RoleLabels = convertGroup2XAxisCategoryLabels(Role);

        function convertGroup2XAxisCategoryLabels(TheCrossfilterGroupArray) {
            var XAxisCategoryLabelsArray = [];
            TheCrossfilterGroupArray.forEach(function (d) { XAxisCategoryLabelsArray.push(d.key); });
            return XAxisCategoryLabelsArray;
        }



        //Chart 1: Year of Birth vs Gender
        var dvChart1 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'dvChart1',
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
                pointFormat: '{point.y:,.0f} {series.name} employees.'
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
                }
            }
        });
        //Chart 2: Gender vs Designations Column Type w Multiple Series
        var dvChart2 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'dvChart2',
                height: 400,
                zoomType: 'x'
            }
            , title: {
                text: ''
            }
            , series: []
            , xAxis: {
                title: 'Roles',
                allowDecimals: false,
                categories: RoleLabels,
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
                pointFormat: '{point.y:,.0f} {series.name} employees.'
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
                }
            }
        });
        //Chart 3: Designations(Roles) vs Departments Stacked Column Type
        var dvChart3 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'dvChart3',
                height: 400,
                zoomType: 'x'
            }
            , title: {
                text: ''
            }
            , series: DsgnWDept
            , xAxis: {
                title: 'Roles',
                allowDecimals: false,
                categories: DeptLabels,
            }
            , yAxis: {
                min: 0,
                title: {
                    text: 'Headcount'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
            }
            , tooltip: {

                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} pax</b></td></tr>',
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
        //Chart 4: Ages vs Departments
        var dvChart4 = new Highcharts.Chart({
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
                title: 'Roles',
                allowDecimals: false,
                categories: RoleLabels,
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
                '<td style="padding:0"><b>{point.y} pax</b></td></tr>',
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
        for (g in genders) {
            dvChart1.addSeries({
                name: gender[g],
                data: yobWithGenderPlotData[g]
            });
            dvChart2.addSeries({
                name: gender[g],
                data: RoleWithGenderPlotData[g]
            });

            dvChart4.addSeries({
                name: gender[g],
                data: RoleWithGenderPlotData[g]
            });
        }

        genderDimension.dispose();
        genderGroup.dispose();
        RoleWithgenderDimension.dispose();
        YobWithGenderDimension.dispose();



        // Not used.
        //let unique = [...new Set(myArray)]; 
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        // Not used.
        function flattenObject(ob) {
            var toReturn = {};
            for (var i in ob) {
                if (!ob.hasOwnProperty(i)) continue;
                if ((typeof ob[i]) == 'object') {
                    var flatObject = flattenObject(ob[i]);
                    for (var x in flatObject) {
                        if (!flatObject.hasOwnProperty(x)) continue;
                        toReturn[i + '.' + x] = flatObject[x];
                    }
                } else {
                    toReturn[i] = ob[i];
                }
            }
            return toReturn;
        }

    }
});
