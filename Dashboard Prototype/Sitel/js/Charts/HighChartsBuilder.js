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
            var cf = crossfilter(result);
        } else {
            var cf = crossfilter(response.d);
        }

        // Chart 1 : Date of Birth & Headcount Dimensions and Groups
        var YearOfBirthDimension = cf.dimension(function (d) { return d.YearOfBirth; });
        var YearOfBirthGroup = YearOfBirthDimension.group().reduceSum(function (d) { return d.Headcount; });
        var YearOfBirths = YearOfBirthGroup.all();
        var YearOfBirthLabels = convertGroup2XAxisLabels(YearOfBirths);

        // Chart 2 : Gender & Headcount Dimensions and Groups
        var genderDimension = cf.dimension(function (d) { return d.Gender; });
        var genderGroup = genderDimension.group().reduceSum(function (d) { return d.Headcount; });
        var genders = genderGroup.all();
        var genderLabels = convertGroup2XAxisLabels(genders);

        // Chart 3 : Designation/Role & Headcount Dimensions and Groups
        // xAxis is whatever data you need populated on the xAxis. It's like a groupBy in SQL. In this case it's role.
        var RoleDimension = cf.dimension(function (d) { return d.Role; });
        var RoleGroup = RoleDimension.group().reduceSum(function (d) { return d.Headcount; });
        var Roles = RoleGroup.all();
        var RoleLabels = convertGroup2XAxisLabels(Roles);

        // Chart 4 : Department & Headcount Dimensions and Groups
        var DeptDimension = cf.dimension(function (d) { return d.Department });
        var DeptGroup = DeptDimension.group().reduceSum(function (d) { return d.Headcount; });
        var Depts = DeptGroup.all();
        var DeptLabels = convertGroup2XAxisLabels(Depts);

        // Stage: Transform to Highcharts Compatible data structures.        
        function convertGroup2XAxisLabels(TheCrossfilterGroupArray) {
            var XAxisCategoryLabelsArray = [];
            TheCrossfilterGroupArray.forEach(function (d) { XAxisCategoryLabelsArray.push(d.key); });
            return XAxisCategoryLabelsArray;
        }

        function convertor(CFGroup, Labels) {
            var SeriesData = [];
            var data = [];
            
            for (l in Labels) {
                var h = findWithAttr(CFGroup, 'key', Labels[l]);

                if (h > -1) {
                    data[h] = [Labels[h], CFGroup[h].value];
                }
                SeriesData[h] = { name: Labels[h],data: data[h] }
            }
            return SeriesData;
        }

        function findWithAttr(array, attr, value) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        //Chart 1: Year of Birth
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
            , series: convertor(YearOfBirths, YearOfBirthLabels)
            , xAxis: {
                title: 'Year of Birth',
                allowDecimals: false,
                categories: YearOfBirthLabels,
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
            , series: convertor(genders, genderLabels)
            , xAxis: {
                title: 'Roles',
                allowDecimals: false,
                categories: genderLabels,
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
            , series: convertor(Roles, RoleLabels)
            , xAxis: {
                title: 'Roles',
                allowDecimals: false,
                categories: RoleLabels,
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
            , series: convertor(Depts, DeptLabels)
            , xAxis: {
                title: 'Roles',
                allowDecimals: false,
                categories: DeptLabels,
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
    }
});
