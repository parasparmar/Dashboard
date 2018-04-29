


$(function () {
    $.ajax({
        type: "POST",
        url: "Default.aspx/GetChartData",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccessDrawDvChart2,
        failure: function (response) {
            alert(response.d);
        },
        error: function (response) {
            alert(response.d);
        }
    });




    function OnSuccessDrawDvChart2(response) {

        //YearOfBirth,
        //Gender,
        //Department,
        //Role,
        //Level,
        //HeadCount


        var data = crossfilter(response.d);
        var all = data.groupAll();
        //var yobDimension = data.dimension(function (d) { return d.YearOfBirth; })
        var genderDimension = data.dimension(function (d) { return d.Gender; });
        //var roleDimension = data.dimension(function (d) { return d.role; });

        //var departmentDimension = data.dimension(function (d) { return d.Department; });
        //var levelDimension = data.dimension(function (d) { return d.Level; });

        var genderGroup = genderDimension.group();
        var genders = genderGroup.all();
        var genderLabel = [];
        var genderCount = [];

        for (var g in genders) {
            genderLabel.push(genders[g].key);
            genderCount.push(genders[g].value);            
        }


        createHighCharts();

        function createHighCharts() {
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
                , series: [{
                    name: 'Gender',
                    data: genderCount
                }]
                , xAxis: {
                    title: 'Gender',
                    allowDecimals: false,
                    categories: genderLabel
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
        }
    }




});



