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
        // Gender is the innermost series. In this case it's gender and it's quantitative measurement on Y axis is the Headcount.
        var data = crossfilter(response.d);
        var genderDimension = data.dimension(function (d) { return d.Gender; });
        var genderGroup = genderDimension.group().reduceSum(function (d) { return d.HeadCount; });
        var genders = genderGroup.all();

        // xAxis is whatever data you need populated on the xAxis. It's like a groupBy in SQL. In this case it's role.
        var Role = data.dimension(function (d) { return d.Role; }).group().all();
        var RoleWithgenderDimension = data.dimension(function (d) {
            return JSON.stringify({ Role: d.Role, gender: d.Gender });
        });
        var RoleWithgendersGroup = RoleWithgenderDimension.group().reduceSum(function (d) { return d.HeadCount; })
        RoleWithgendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var RoleWithgenders = RoleWithgendersGroup.all();

        var years = data.dimension(function (d) { return d.YearOfBirth; }).group().all();
        var YobWithGenderDimension = data.dimension(function (d) {
            return JSON.stringify({ year: d.YearOfBirth, gender: d.Gender });
        });

        var YobWithGendersGroup = YobWithGenderDimension.group().reduceSum(function (d) { return d.HeadCount; })
        YobWithGendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var YobWithGenders = YobWithGendersGroup.all();

        // Stage: Transform to Highcharts Compatible data structures.
        var gender = [];
        var genderPlotData = [];
        var yobWithGenderPlotData = [];
        var RoleWithGenderPlotData = [];

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

        var yearLabels = [];
        years.forEach(function (d) { yearLabels.push(d.key); });

        var RoleLabels = [];
        Role.forEach(function (d) { RoleLabels.push(d.key); });
        
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
        //Chart 2: Gender vs Designations
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
                title: 'Year of Birth',
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
        //Chart 3: Designations(Roles) vs Departments
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
            , series: []
            , Role: {
                title: 'Year of Birth',
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
                title: 'Year of Birth',
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
        for (g in genders) {
            dvChart1.addSeries({
                name: gender[g],
                data: yobWithGenderPlotData[g]
            });
            dvChart2.addSeries({
                name: gender[g],
                data: RoleWithGenderPlotData[g]
            });
            dvChart3.addSeries({
                name: gender[g],
                data: genderPlotData[g]
            });
            dvChart4.addSeries({
                name: gender[g],
                data: genderPlotData[g]
            });
        }

        genderDimension.dispose();
        genderGroup.dispose();
        RoleWithgenderDimension.dispose();
        YobWithGenderDimension.dispose();
    }
});
