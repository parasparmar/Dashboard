<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Dashboard_Prototype.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
    
    <link href="Sitel/css/AdminLTE.min.css" rel="stylesheet" />
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/sunburst.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
<%--    <script src="Sitel/js/d3.js"></script>
    <script src="Sitel/js/dc.js"></script>
    <link href="Sitel/css/dc.css" rel="stylesheet" />

    <script src="Sitel/js/crossfilter.js"></script>
    <script src="Sitel/js/colorbrewer.js"></script>--%>

    

    <!--[if lt IE 9]>
    <script src="https://code.highcharts.com/modules/oldie.js"></script>
    <![endif]-->
</head>
<body>
    <form id="form1" runat="server">        
        <h2>Sitel CWFM Umang as well as the Malad location operates under a non-discriminatory & diversity friendly employment policy. All data seen below is primarily for a dashboard prototype that is under active development.</h2>
        

        <div class="row">
            <div class="col-md-12">
                <div class="box box-primary box-solid">
                    <div class="box-header">Age Groups vs Gender</div>
                    <div class="box-body">
                        <h4 class="box-title"></h4>
                        <p class="box-text">
                            
                        </p>
                        <div id="dvChart1" style="height: 400px">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="box box-primary box-solid">
                    <div class="box-header with-border">Gender vs Designations</div>
                    <div class="box-body">
                        <h4 class="box-title"></h4>
                        <p class="box-text">
                        </p>
                        <div id="dvChart2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box box-primary box-solid">
                    <div class="box-header with-border">Designations vs Departments</div>
                    <div class="box-body">
                        <h4 class="box-title"></h4>
                        <p class="box-text">
                        </p>
                        <div id="dvChart3">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="box box-primary box-solid">
                    <div class="box-header with-border"></div>
                    <div class="box-body">
                        <h4 class="box-title"></h4>
                        <p class="box-text">
                        </p>
                        <div id="dvChart4">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="Sitel/js/dvchart1.js"></script>
    </form>
</body>
</html>
