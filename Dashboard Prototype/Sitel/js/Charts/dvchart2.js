// Create the chart
Highcharts.chart('dvChart2', {
    chart: {
        type: 'column',
        events: {
            drilldown: function (e) {
                if (!e.seriesOptions) {
                    var chart = this,
                        drilldowns = {
                            'Female': {
                                name: 'Female',
                                data: [
                                    ['Analyst', 1],
                                    ['Primary Scheduler', 9],
                                    ['Real- Time Analyst', 13],
                                    ['Secondary Scheduler', 1],
                                    ['WF Planner', 1]
                                ]
                            },
                            'Male': {
                                name: 'Male',
                                data: [
                                    ['Analyst', 6],
                                    ['Mgr I Workforce Mgmt', 16],
                                    ['Mgr II Workforce Mgmt', 7],
                                    ['Officer', 1],
                                    ['Primary Scheduler', 15],
                                    ['Real-Time Analyst', 62],
                                    ['Secondary Scheduler', 13],
                                    ['Sr Mgr Workforce Mgmt', 1],
                                    ['Sr. Analyst', 5],
                                    ['Sr. Officer', 1],
                                    ['Sr. Software Developer', 2],
                                    ['WF Planner', 21],
                                ]
                            },
                            'Not_Specified': {
                                name: 'Not_Specified',
                                data: [
                                    ['Not_Specified', 5],
                                    ['Analyst', 10],
                                    ['Mgr I Workforce Mgmt', 3],
                                    ['Mgr II Workforce Mgmt', 1],
                                    ['Primary Scheduler', 2],
                                    ['Real-Time Analyst', 22],
                                    ['Secondary Scheduler', 8],
                                    ['Site Director', 1],
                                    ['Sr Mgr Workforce Mgmt', 1],
                                    ['Sr. Analyst', 1],
                                    ['Sr. Software Developer', 12],
                                    ['WF Planner', 13]
                                ]
                            }
                        },
                        series = drilldowns[e.point.name];
                    // Show the loading label
                    chart.showLoading('Calling Home...');
                    setTimeout(function () {
                        chart.hideLoading();
                        chart.addSeriesAsDrilldown(e.point, series);
                    }, 1000);
                }

            }
        }
    },
    title: {
        text: ''
    },
    xAxis: {
        type: 'category'
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
            }
        }
    },

    series: [{
        name: 'Headcount',
        colorByPoint: true,
        data: [{
            name: 'Female',
            y: 25,
            drilldown: true
        }, {
            name: 'Male',
            y: 150,
            drilldown: true
        }, {
            name: 'Not_Specified',
            y: 79,
            drilldown: true
        }]
    }],

    drilldown: {
        series: []
    }
});
