
            //# dc.js Getting Started and How-To Guide
            'use strict';

            /* jshint globalstrict: true */
            /* global dc,d3,crossfilter,colorbrewer */

            // ### Create Chart Objects

            // Create chart objects associated with the container elements identified by the css selector.
            // Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or
            // filtered by other page controls.

            var moveChart = dc.lineChart('#monthly-move-chart');
            var volumeChart = dc.barChart('#monthly-volume-chart');
            var Opportunity_Percentages = dc.bubbleChart('#Opportunity_Percentages_Chart');
            var nasdaqCount = dc.dataCount('.dc-data-count');
            var nasdaqTable = dc.dataTable('.dc-data-table');
            var barSiteChart = dc.barChart('#monthly-site-chart');
            var barAccChart = dc.barChart('#monthly-account-chart');

            // ### Anchor Div for Charts
            /*
             // A div anchor that can be identified by id
             <div id='your-chart'></div>
             // Title or anything you want to add above the chart
             <div id='chart'><span>Days by Gain or Loss</span></div>
             // ##### .turnOnControls()

             // If a link with css class `reset` is present then the chart
             // will automatically hide/show it based on whether there is a filter
             // set on the chart (e.g. slice selection for pie chart and brush
             // selection for bar chart). Enable this with `chart.turnOnControls(true)`

             // dc.js >=2.1 uses `visibility: hidden` to hide/show controls without
             // disrupting the layout. To return the old `display: none` behavior,
             // set `chart.controlsUseVisibility(false)` and use that style instead.
             <div id='chart'>
             <a class='reset'
             href='javascript:myChart.filterAll();dc.redrawAll();'
             style='visibility: hidden;'>reset</a>
             </div>
             // dc.js will also automatically inject the current filter value into
             // any html element with its css class set to `filter`
             <div id='chart'>
             <span class='reset' style='visibility: hidden;'>
             Current filter: <span class='filter'></span>
             </span>
             </div>
             */

            //### Load your data

            //Data can be loaded through regular means with your
            //favorite javascript library
            //
            //```javascript
            //d3.csv('data.csv', function(data) {...};
            //d3.json('data.json', function(data) {...};
            //jQuery.getJson('data.json', function(data){...});
            //```
            d3.csv('js/ndx.csv', function (data) {
                // Since its a csv file we need to format the data a bit.
                var dateFormat = d3.time.format('%m/%d/%Y');
                var numberFormat = d3.format('.2f');

                data.forEach(function (d) {
                    d.dd = dateFormat.parse(d.date);
                    d.month = d3.time.month(d.dd); // pre-calculate month for better performance
                    d.opportunity = +d.opportunity; // coerce to number
                    d.recovery = +d.recovery;
                    d.headcount = +d.headcount;
                    d.opportunity_per = +d.opportunity_per;
                    d.recovery_per = +d.recovery_per;
                    d.headcount_per = +d.headcount_per;
                });



                //### Create Crossfilter Dimensions and Groups

                //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
                var ndx = crossfilter(data);
                var all = ndx.groupAll();

                // Dimension by year Paras 30-11-16: Changed to Opportunity Percentage
                //var regions = ndx.dimension(function (d) {
                //    return 100 * d.opportunity_per; //as that's what we need on the x-axis.
                //});
                var regions = ndx.dimension(function (d) {
                    return d.region;
                });


                // Maintain running tallies by region as filters are applied or removed
                var groupByRegions = regions.group().reduce(
                        /* callback for when data is added to the current filter results */
                                function (p, v) {
                                    ++p.count;
                                    p.opportunity += +v.opportunity / 10000;
                                    p.opportunity_percentage += Math.abs(v.opportunity_per) * 100;
                                    p.headcount += +v.headcount;
                                    return p;
                                },
                                /* callback for when data is removed from the current filter results */
                                        function (p, v) {
                                            --p.count;
                                            p.opportunity -= +v.opportunity / 10000;
                                            p.opportunity_percentage -= Math.abs(v.opportunity_per) * 100;
                                            p.headcount -= +v.headcount;
                                            return p;
                                        },
                                        /* initialize p */
                                                function () {
                                                    return { opportunity: 0, opportunity_percentage: 0, headcount: 0 }
                                                }
                                        );

                // Dimension by full date
                var dateDimension = ndx.dimension(function (d) {
                    return d.dd;
                });

                // Dimension by month
                var moveMonths = ndx.dimension(function (d) {
                    return d.month;
                });

                var OppBySite = ndx.dimension(function (d) {
                    return d.site;
                });

                var OppBySitegroup = OppBySite.group().reduceSum(
                    function (d) { return d.opportunity; }
                    );

                var OppByAcc = ndx.dimension(function (d) {
                    return d.account;
                });

                var OppByAccgroup = OppByAcc.group().reduceSum(
                   function (d) { return d.opportunity; }
                   );

                // Group by total movement within month
                var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
                    return d.opportunity_per;
                });
                // Group by total volume within move, and scale down result
                var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
                    return d.opportunity;
                });
                var indexAvgByMonthGroup = moveMonths.group().reduce(
                        function (p, v) {
                            ++p.days;
                            p.total += v.opportunity;
                            p.avg = p.total;
                            return p;
                        },
                        function (p, v) {
                            --p.days;
                            p.total -= v.opportunity;
                            p.avg = p.total;
                            return p;
                        },
                        function () {
                            return { days: 0, total: 0, avg: 0 };
                        }
                );

                // Create categorical dimension
                var gainOrLoss = ndx.dimension(function (d) {
                    return d.open > d.close ? 'Loss' : 'Gain';
                });
                // Produce counts records in the dimension
                var gainOrLossGroup = gainOrLoss.group();

                // Determine a histogram of percent changes
                var opportunity = ndx.dimension(function (d) {
                    return d.opportunity;
                });
                var opportunityGroup = opportunity.group();

                // Summarize volume by quarter
                var quarter = ndx.dimension(function (d) {
                    var month = d.dd.getMonth();
                    if (month <= 2) {
                        return 'Q1';
                    } else if (month > 2 && month <= 5) {
                        return 'Q2';
                    } else if (month > 5 && month <= 8) {
                        return 'Q3';
                    } else {
                        return 'Q4';
                    }
                });
                var quarterGroup = quarter.group().reduceSum(function (d) {
                    return d.volume;
                });

                // Counts per weekday
                var dayOfWeek = ndx.dimension(function (d) {
                    var day = d.dd.getDay();
                    var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    return day + '.' + name[day];
                });
                var dayOfWeekGroup = dayOfWeek.group();

                //### Define Chart Attributes
                // Define chart attributes using fluent methods. See the
                // [dc.js API Reference](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md) for more information
                //

                //#### Bubble Chart

                //Create a bubble chart and use the given css selector as anchor. You can also specify
                //an optional chart group for this chart to be scoped within. When a chart belongs
                //to a specific group then any interaction with the chart will only trigger redraws
                //on charts within the same chart group.
                // <br>API: [Bubble Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bubble-chart)
                // or filter_bins, or whatever




                var xRange = [0, d3.max(groupByRegions.all(), function (d) {
                    //return Math.round(d.value.opportunity_percentage);
                    return Math.round(d.value.opportunity_percentage) + 10;
                })];

                var yRange = [0, d3.max(groupByRegions.all(), function (d) {
                    //return Math.round(d.value.headcount);
                    return Math.round(d.value.headcount * 1.35);
                })];

                var bubbleRange = [0, d3.max(groupByRegions.all(), function (d) {
                    return d.value.opportunity;
                })];





                Opportunity_Percentages /* dc.bubbleChart('#Opportunity_Percentages_Chart', 'chartGroup') */
                        // (_optional_) define chart width, `default = 200`
                        .width(1214.1)
                        // (_optional_) define chart height, `default = 200`
                        .height(500)
                        // (_optional_) define chart transition duration, `default = 750`
                        .transitionDuration(1500)
                        .margins({ top: 10, right: 50, bottom: 50, left: 50 })
                        .dimension(regions)
                        //The bubble chart expects the groups are reduced to multiple values which are used
                        //to generate x, y, and radius for each key (bubble) in the group
                        .group(groupByRegions)
                        // (_optional_) define color function or array for bubbles: [ColorBrewer](http://colorbrewer2.org/)
                        //.colors(colorbrewer.RdYlGn[9])
                        //(optional) define color domain to match your data domain if you want to bind data or color
                        //.colorDomain([-500, 500])
                        .colors(d3.scale.category10())
                        //##### Accessors

                        //Accessor functions are applied to each value returned by the grouping

                        // `.colorAccessor` - the returned value will be passed to the `.colors()` scale to determine a fill color
                        .colorAccessor(function (d) {
                            return d.value.headcount;
                        })
                        // `.keyAccessor` - the `X` value will be passed to the `.x()` scale to determine pixel location
                        .keyAccessor(function (p) {
                            // Labels on the X-axis
                            return numberFormat(p.value.opportunity_percentage);
                        })
                        // `.valueAccessor` - the `Y` value will be passed to the `.y()` scale to determine pixel location
                        .valueAccessor(function (p) {
                            // Labels on the Y-axis
                            return p.value.headcount;
                        })
                        // `.radiusValueAccessor` - the value will be passed to the `.r()` scale to determine radius size;
                        //   by default this maps linearly to [0,100]
                        .radiusValueAccessor(function (p) {
                            // bubble-radius
                            return p.value.opportunity;
                        })
                        // For large opp values, this constrains a 10% variation in the bubble sizes relative to largest and smallest.
                        .maxBubbleRelativeSize(0.1)
                        //.x(d3.scale.ordinal().domain([0, 10, 20, 30, 40, 50]))
                        .x(d3.scale.linear().domain(xRange))
                        .xUnits(dc.units.linear)
                        .y(d3.scale.linear().domain(yRange))
                        .r(d3.scale.linear().domain(bubbleRange))
                        //##### Elastic Scaling

                        //`.elasticY` and `.elasticX` determine whether the chart should rescale each axis to fit the data.
                        //.elasticY(true)
                        //.elasticX(true)
                        //`.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit
                        //domains as the Accessors.
                        .yAxisPadding(100)
                        .xAxisPadding(5)
                        // (_optional_) render horizontal grid lines, `default=false`
                        .renderHorizontalGridLines(true)
                        // (_optional_) render vertical grid lines, `default=false`
                        .renderVerticalGridLines(true)
                        // (_optional_) render an axis label below the x axis
                        .xAxisLabel('Opportunity % of total')
                        // (_optional_) render a vertical axis lable left of the y axis
                        .yAxisLabel('Headcount')
                        //##### Labels and  Titles

                        //Labels are displayed on the chart for each bubble. Titles displayed on mouseover.
                        // (_optional_) whether chart should render labels, `default = true`
                        .renderLabel(true)
                        .label(function (p) {
                            return p.key + " " + (p.value.headcount) + "pax" + "; Opp : " + Math.floor(p.value.opportunity_percentage) + "% ";
                        })
                        // (_optional_) whether chart should render titles, `default = false`
                        .renderTitle(true)
                        .title(function (p) {
                            return "\n Region : " + p.key + ";\n"
                                    + "Opportunity: " + numberFormat(p.value.opportunity_percentage) + "% of total;\n"
                                    + "HC : " + numberFormat(p.value.headcount) + " pax;\n";
                        })
                //#### Customize Axes

                // Set a custom tick format. Both `.yAxis()` and `.xAxis()` return an axis object,
                // so any additional method chaining applies to the axis, not the chart.
                Opportunity_Percentages.yAxis().tickFormat(function (s) {
                    return s + "";
                })
                Opportunity_Percentages.xAxis().tickFormat(function (s) {
                    return s + "%";
                })

                //#### Stacked Area Chart

                //Specify an area chart by using a line chart with `.renderArea(true)`.
                // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
                // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
                moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
                        .renderArea(true)
                        .width(1214.1)
                        .height(200)
                        .transitionDuration(1000)
                        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
                        .dimension(moveMonths)
                        .mouseZoomable(true)
                        // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
                        .rangeChart(volumeChart)
                        .x(d3.time.scale().domain([new Date(2016, 8, 1), new Date(2016, 12, 31)]))
                        .round(d3.time.month.round)
                        .xUnits(d3.time.months)
                        .elasticY(true)
                        .renderHorizontalGridLines(true)
                        //##### Legend

                        // Position the legend relative to the chart origin and specify items' height and separation.
                        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                        .brushOn(false)
                        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
                        // legend.
                        // The `.valueAccessor` will be used for the base layer
                        .group(indexAvgByMonthGroup, 'Monthly Opportunity $')
                        .valueAccessor(function (d) {
                            return d.value.avg;
                        })
                        // Stack additional layers with `.stack`. The first paramenter is a new group.
                        // The second parameter is the series name. The third is a value accessor.
                        .stack(monthlyMoveGroup, 'Peak Monthly Opportunity $', function (d) {
                            return d.value;
                        })
                        // Title can be called by any stack layer.
                        .title(function (d) {
                            var value = d.value.avg ? d.value.avg : d.value;
                            if (isNaN(value)) {
                                value = 0;
                            }
                            return dateFormat(d.key) + '\n' + numberFormat(value);
                        });


                //#### Range Chart

                // Since this bar chart is specified as "range chart" for the area chart, its brush extent
                // will always match the zoom of the area chart.
                volumeChart.width(1214.1) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
                        .height(40)
                        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
                        .dimension(moveMonths)
                        .group(volumeByMonthGroup)
                        .centerBar(true)
                        .gap(1)
                        .x(d3.time.scale().domain([new Date(2016, 8, 1), new Date(2016, 12, 31)]))
                        .round(d3.time.month.round)
                        .alwaysUseRounding(true)
                        .xUnits(d3.time.months);

                //#### Data Count

                // Create a data count widget and use the given css selector as anchor. You can also specify
                // an optional chart group for this chart to be scoped within. When a chart belongs
                // to a specific group then any interaction with such chart will only trigger redraw
                // on other charts within the same chart group.
                // <br>API: [Data Count Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-count-widget)
                //
                //```html
                //<div class='dc-data-count'>
                //  <span class='filter-count'></span>
                //  selected out of <span class='total-count'></span> records.
                //</div>
                //```

                var runMin = +OppBySite.bottom(1)[0].opportunity;
                var runMax = +OppBySite.top(1)[0].opportunity;


                barSiteChart
                        .width(600)
                        .height(200)
                        .margins({ top: 0, right: 50, bottom: 50, left: 40 })
                        .dimension(OppBySite)
                        .group(OppBySitegroup)
                        .centerBar(true)
                        .gap(1)
                        .barPadding(0.5)
                        .x(d3.scale.ordinal().domain(OppBySite))
                        .y(d3.scale.linear().domain([runMin, runMax]))
                        .xUnits(dc.units.ordinal)
                        .ordering(function (d) { return -d.value; }) // returns descending sort on y axis values 
                        .elasticX(true)
                        .elasticY(true)
                        .transitionDuration(1500)
                        .yAxisLabel('in 1000s')
                        .renderlet(function (chart) {
                            //Check if labels exist
                            chart.selectAll("g.x text")
                           .attr('dx', '-30')
                           .attr('transform', "rotate(-65)");


                            var gLabels = barSiteChart.select(".labels");
                            if (gLabels.empty()) {
                                gLabels = barSiteChart.select(".chart-body").append('g').classed('labels', true);
                            }

                            var gLabelsData = gLabels.selectAll("text").data(barSiteChart.selectAll(".bar")[0]);
                            gLabelsData.exit().remove(); //Remove unused elements
                            gLabelsData.enter().append("text") //Add new elements
                            gLabelsData
                            .attr('text-anchor', 'middle')
                            .attr('fill', 'black')
                            .text(function (d) {
                                return d3.select(d).data()[0].data.value / 1000
                            })
                            .attr('x', function (d) {
                                return +d.getAttribute('x') + (d.getAttribute('width') / 2);
                            })
                            .attr('y', function (d) { return +d.getAttribute('y') + 15; })
                            .attr('style', function (d) {
                                if (+d.getAttribute('height') < 18) return "display:none";
                            });

                        })
                barSiteChart.xAxis().tickFormat(function (s) { return s.substring(0, 10); })
                barSiteChart.yAxis().tickFormat(function (s) { return s / 1000; })



                barAccChart
                        .width(600)
                        .height(200)
                        .margins({ top: 0, right: 50, bottom: 50, left: 40 })
                        .dimension(OppByAcc)
                        .group(OppByAccgroup)
                        .centerBar(true)
                        .gap(1)
                        .barPadding(0.5)
                        .x(d3.scale.ordinal().domain(OppByAcc))
                        .y(d3.scale.linear().domain([runMin, runMax]))
                        .xUnits(dc.units.ordinal)
                        .ordering(function (d) { return -d.value; }) // returns descending sort on y axis values 
                        .elasticX(true)
                        .elasticY(true)
                        .transitionDuration(1500)
                    .yAxisLabel('in 1000s')
                    .renderlet(function (chart) {
                        //Check if labels exist
                        chart.selectAll("g.x text")
                          .attr('dx', '-30')
                          .attr('transform', "rotate(-65)");

                        var gLabels = barAccChart.select(".labels");
                        if (gLabels.empty()) {
                            gLabels = barAccChart.select(".chart-body").append('g').classed('labels', true);
                        }

                        var gLabelsData = gLabels.selectAll("text").data(barAccChart.selectAll(".bar")[0]);

                        gLabelsData.exit().remove(); //Remove unused elements

                        gLabelsData.enter().append("text") //Add new elements

                        gLabelsData
                        .attr('text-anchor', 'middle')
                        .attr('fill', 'black')
                        .text(function (d) {
                            return d3.select(d).data()[0].data.value / 1000
                        })
                        .attr('x', function (d) {
                            return +d.getAttribute('x') + (d.getAttribute('width') / 2);
                        })
                        .attr('y', function (d) { return +d.getAttribute('y') + 15; })
                        .attr('style', function (d) {
                            if (+d.getAttribute('height') < 18) return "display:none";
                        });

                    })
                barAccChart.xAxis().tickFormat(function (s) { return s.substring(0, 10); })
                barAccChart.yAxis().tickFormat(function (s) { return s / 1000; })

                nasdaqCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
                        .dimension(ndx)
                        .group(all)
                        // (_optional_) `.html` sets different html when some records or all records are selected.
                        // `.html` replaces everything in the anchor with the html given using the following function.
                        // `%filter-count` and `%total-count` are replaced with the values obtained.
                        .html({
                            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                                    ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
                            all: 'All records selected. Please click on the graph to apply filters.'
                        });

                //#### Data Table

                // Create a data table widget and use the given css selector as anchor. You can also specify
                // an optional chart group for this chart to be scoped within. When a chart belongs
                // to a specific group then any interaction with such chart will only trigger redraw
                // on other charts within the same chart group.
                // <br>API: [Data Table Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-table-widget)
                //
                // You can statically define the headers like in
                //
                // ```html
                //    <!-- anchor div for data table -->
                //    <div id='data-table'>
                //       <!-- create a custom header -->
                //       <div class='header'>
                //           <span>Date</span>
                //           <span>Open</span>
                //           <span>Close</span>
                //           <span>Change</span>
                //           <span>Volume</span>
                //       </div>
                //       <!-- data rows will filled in here -->
                //    </div>
                // ```
                // or do it programmatically using `.columns()`.

                nasdaqTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
                        .dimension(dateDimension)
                        // Data table does not use crossfilter group but rather a closure
                        // as a grouping function
                        .group(function (d) {
                            var format = d3.format('02d');
                            return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
                        })
                        // (_optional_) max number of records to be shown, `default = 25`
                        .size(10)
                        // There are several ways to specify the columns; see the data-table documentation.
                        // This code demonstrates generating the column header automatically based on the columns.
                        .columns([
                            // Use the `d.date` field; capitalized automatically
                            'date',
                            // Use `d.open`, `d.close`
                            'region',
                            'site',
                            'account',
                            'opportunity',
                            'recovery',
                            'headcount',
                            {
                                label: 'opportunity_per', format: function (d) {
                                    return parseFloat(Math.round(100 * d.opportunity_per)).toFixed(2) + '%'
                                }
                            },
                            {
                                label: 'recovery_per', format: function (d) {
                                    return parseFloat(Math.round(100 * d.recovery_per)).toFixed(2) + '%'
                                }
                            },
                            {
                                label: 'headcount_per', format: function (d) {
                                    return parseFloat(Math.round(100 * d.headcount_per)).toFixed(2) + '%'
                                }
                            }

                        ])

                        // (_optional_) sort using the given field, `default = function(d){return d;}`
                        .sortBy(function (d) {
                            return d.dd;
                        })
                        // (_optional_) sort order, `default = d3.ascending`
                        .order(d3.ascending)
                        // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
                        .on('renderlet', function (table) {
                            table.selectAll('.dc-table-group').classed('info', true);
                        });


                //#### Rendering

                //simply call `.renderAll()` to render all charts on the page
                dc.renderAll();
            });
        