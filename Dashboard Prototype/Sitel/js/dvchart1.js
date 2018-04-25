    $(function (){
        $.ajax({
            type: "POST",
            url: "Default.aspx/GetDvChart1Data",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccessDrawDvChart1,
            failure: function (response) {
                alert(response.d);
            },
            error: function (response) {
                alert(response.d);
            }
        });
  

    function OnSuccessDrawDvChart1(response){
        var data = response.d;
        var male=[];
        var female=[];
        var not_specified=[];
        var headcount=[];
        var yearofbirth = [];
        for(var d in data){            
            male.push(data[d].Male);
            female.push(data[d].Female);
            not_specified.push(data[d].Not_Specified);
            yearofbirth.push(data[d].YearOfBirth);            
        }
        createHighCharts();
    
        function createHighCharts(){
            var chart = new Highcharts.Chart({
    chart: {
            type:'area',
            renderTo: 'dvChart1',
            height: '100%'
        }
    , title: {
            text: 'Year vs Gender'
        }        
    , series: [{
        type: "area",
        name: 'Male',
        data: male,
        dataLabels: { format: '{point.name}'}
        }, {
        type: "area",
        name: 'Female',
        data: female,
        dataLabels: {format: '{point.name}'},
        }, {
        type: "area",
        name: 'Not_Specified',
        data: not_specified,
        dataLabels: {format: '{point.name}'},
        }]
           
    , xAxis: {
    allowDecimals: false,
    categories: yearofbirth,
    labels: {
      formatter: function () {
        return this.value; // clean, unformatted number for year
      }
    }
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
        pointFormat: '{point.y:,.0f} {series.name} employees'
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



