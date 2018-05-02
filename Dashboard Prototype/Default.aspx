<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Dashboard_Prototype.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
    <link href="Sitel/bootstrap/css/yeti_bootstrap.css" rel="stylesheet" />

    <!--[if lt IE 9]>
    <script src="https://code.highcharts.com/modules/oldie.js"></script>
    <![endif]-->
</head>
<body class="container">
    <form id="form1" runat="server">
        <!-- Trigger the modal with a button -->
        <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">About App</button>
        <div class="row">
            <div class="col-lg-6">
                <div class="card border-primary mb-3">
                    <div class="card-header">Year of Birth vs Gender</div>
                    <h4 class="card-title"></h4>
                    <div id="dvChart1" class="card-body">
                    </div>
                </div>
            </div>
            <!--Year of Birth vs Gender-->
            <div class="col-lg-6">
                <div class="card border-warning mb-3">
                    <div class="card-header">Gender vs Designations</div>
                    <h4 class="card-title"></h4>
                    <div id="dvChart2" class="card-body">
                    </div>
                </div>
            </div>
            <!--Gender vs Designations-->
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card border-danger mb-3">
                    <div class="card-header">Designations vs Departments</div>
                    <h4 class="card-title"></h4>
                    <div  id="dvChart3"  class="card-body">
                </div>
                </div>                
            </div>
            <!--Designations vs Departments-->
            <div class="col-lg-6">
                <div class="card border-success mb-3">
                    <div class="card-header">Ages vs Departments</div>
                    <h4 class="card-title"></h4>
                    <div id="dvChart4" class="card-body">
                </div>
                </div>                
            </div>
            <!--Ages vs Departments-->
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
                            <hr class="my-4" />
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

        <script src="Sitel/js/crossfilter.js"></script>
        <%--<script src="https://code.highcharts.com/highcharts.js"></script>--%>
        <script src="Sitel/js/highcharts/highcharts.js"></script>

        <%-- <script src="https://code.highcharts.com/modules/sunburst.js"></script>--%>
        <%--<script src="https://code.highcharts.com/modules/exporting.js"></script>--%>
        <%--<script src="https://code.highcharts.com/modules/drilldown.js"></script>--%>
        <%--<script src="Sitel/js/highcharts/modules/data.js"></script>--%>
        <%-- <script src="Sitel/js/highcharts/modules/drilldown.js"></script>--%>
        <%--<script src="https://code.highcharts.com/modules/export-data.js"></script>--%>

        <script src="Sitel/js/Charts/HighChartsBuilder.js"></script>
    </form>
    <script>

</script>
</body>
</html>
