<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Dashboard_Prototype.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
    <link href="Sitel/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <!--[if lt IE 9]>
    <script src="https://code.highcharts.com/modules/oldie.js"></script>
    <![endif]-->
</head>
<body>
    <form id="form1" runat="server">
        <!-- Trigger the modal with a button -->
        <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">About App</button>
        <div class="row">
            <div id="chart1" class="col-md-6">
                <div class="box box-solid box-primary">
                    <div class="box-header with-border">
                        <h4 class="box-title">Year of Birth vs Gender</h4>
                    </div>
                    <div class="box-body">

                        <p class="box-text">
                        </p>
                        <div id="dvChart1" style="height: 400px">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box box-solid box-primary">
                    <div class="box-header with-border">                        
                        <h4 class="box-title">Gender vs Designations</h4>
                    </div>
                    <div class="box-body">                        
                        <p class="box-text">
                        </p>
                        <div id="dvChart2" style="height: 400px">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="box box-solid box-primary">
                    <div class="box-header with-border">
                        <h4 class="box-title">Designations vs Departments</h4>
                    </div>
                    <div class="box-body">

                        <p class="box-text">
                        </p>
                        <div id="dvChart3" style="height: 400px">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box box-solid box-primary">
                    <div class="box-header with-border">
                        <h4 class="box-title">Ages vs Departments</h4>
                    </div>
                    <div class="box-body">

                        <p class="box-text">
                        </p>
                        <div id="dvChart4" style="height: 400px">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Project Dashboard Prototype</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="jumbotron">
                            <h1 class="display-3">Hello,</h1>
                            <p class="lead">Sitel CWFM Umang operates under a non-discriminatory & diversity friendly employment policy.</p>
                            <hr class="my-4">
                            <p>Any data seen below is aggregated with due respect to anonymity and non-discrimination in accordance with Sitel Policy.</p>
                            <p>Data seen below is only meant to illustrate a dashboard prototype that is currently under development.</p>
                        </div>
                        <p class="lead">
                            <a class="btn btn-primary btn-lg" href="#chart1" role="button">Proceed</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/sunburst.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/drilldown.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="Sitel/js/Charts/dvchart1.js"></script>
        <script src="Sitel/js/Charts/dvchart2.js"></script>
        <script src="Sitel/js/Charts/dvchart3.js"></script>
        <script src="Sitel/js/Charts/dvchart4.js"></script>

    </form>
    <script>

</script>
</body>
</html>
