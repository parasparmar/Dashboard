function buildCharts() {
    $.ajax({
        type: "POST",
        //type: "GET",
        url: "Default.aspx/GetChartData",
        //url: "Sitel/js/data.csv",
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

        var data = crossfilter(response.d);
        var all = data.groupAll();
        var yobDimension = data.dimension(function (d) { return d.YearOfBirth; })
        var genderDimension = data.dimension(function (d) { return d.Gender; });
        //var roleDimension = data.dimension(function (d) { return d.role; });

        //var departmentDimension = data.dimension(function (d) { return d.Department; });
        //var levelDimension = data.dimension(function (d) { return d.Level; });
        
        var genderGroup = genderDimension.group().reduceSum(function (d) { return d.HeadCount; });
        var genders = genderGroup.all();
        var yobGroup = yobDimension.group().reduceSum(function (d) {
                for (g in genders) {
                    if (d.Gender == genders[g].key) {
                        return d.HeadCount;
                    }
                }
            });
        var years = yobGroup.all();
        
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
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ],
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



}


$(function () {
    buildCharts();
});



