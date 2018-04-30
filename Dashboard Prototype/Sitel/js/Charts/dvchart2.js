$(function () {
    /// Stage 1 : get data from the server.
    $.ajax({
        type: "POST",
        //type: "GET",
        url: "Default.aspx/GetChartData",
        //url: "Sitel/js/data.csv",
        data: '{chartNum:2}',
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
        var years = data.dimension(function (d) { return d.YearOfBirth; }).group().all();
        var YobWithGenderDimension = data.dimension(function (d) {
            return JSON.stringify({ year: d.YearOfBirth, gender: d.Gender });
        });
        var YobWithGendersGroup = YobWithGenderDimension.group().reduceSum(function (d) { return d.HeadCount; })
        YobWithGendersGroup.all().forEach(function (d) { d.key = JSON.parse(d.key); });
        var YobWithGenders = YobWithGendersGroup.all();
        var gender = [];
        var genderPlotData = [];
        for (g in genders) {
            gender.push(genders[g].key);
            var temp = [];
            YobWithGenders.filter(function (d) {
                var myGender = d.key;
                if (gender[g] == myGender.gender) { temp.push([myGender.year, d.value]); }
            });
            genderPlotData.push(temp);
        }
        var yearLabels = [];
        years.forEach(function (d) { yearLabels.push(d.key); });

        var DvChart2 = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'DvChart2',
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
        for (g in genders) {
            DvChart2.addSeries({
                name: gender[g],
                data: genderPlotData[g]
            });
        }
        genderDimension.dispose();
        genderGroup.dispose();
        YobWithGenderDimension.dispose();
        
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
});