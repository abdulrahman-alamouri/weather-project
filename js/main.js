document.querySelector("#copyright-year").textContent = new Date().getFullYear();

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "city_coordinates.csv",
        dataType: "text",
        success: function(data) {processCSVData(data);}
    });
});

function processCSVData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    for (var i=0; i<lines.length; i++) {
        $('#floatingSelect').append($('<option>', {
            value: 'lat:'+lines[i][0]+',lot:'+lines[i][1]+'',
            text: lines[i][2]+','+lines[i][3]
        }));
    }
}

$(document).ready(function () {
    $('#floatingSelect').change(function (){
        var value = $("#floatingSelect option:selected").val();
        var data = value.split(',');
        var lon = data[0].split(':')[1];
        var lat = data[1].split(':')[1];
        $.ajax({
            type: "GET",
            url: "http://www.7timer.info/bin/api.pl?lon="+lon+"&lat="+lat+"&product=civillight&output=json",
            dataType: "json",
            success: function(data) {processjsonData(data);}
        });
    });
});


function processjsonData(data) {
    $("body").removeClass("auto-height"); 
    $('#content-row').empty();

    var arrayData = data.dataseries;

    const arraynames = {
        clear:"Clear", pcloudy:"Partly Cloudy", cloudy:"Cloudy",
        mcloudy:"Very Cloudy", fog:"Foggy", lightrain:"Light rain or showers",
        oshower:"Occasional showers", ishower:"Isolated showers", lightsnow:"Light or occasional snow",
        rain:"Rain", snow:"Snow", rainsnow:"Mixed",
        tstorm:"Thunderstorm possible", tsrain:"Thunderstorm", windy:"Windy"};

    for (var i = 0; i < arrayData.length; i++) {
        var date = arrayData[i].date.toString();
        date = date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6,8);
        var htmlString =             
                    '<div class="col-md-8 col-lg-6 col-xl-3 mt-3">'+
                        '<div class="card">'+
                            '<div class="card-body p-4">'+
                                '<div class="d-flex">'+
                                    '<h6 class="flex-grow-1">'+date+'</h6>'+
                                '</div>'+

                                '<div class="d-flex flex-column text-center mt-3 mb-2">'+
                                    '<h6 class="display-4 mb-0 font-weight-bold temperature">'+ (arrayData[i].temp2m.max+arrayData[i].temp2m.min)/2 +'°C</h6>'+
                                    '<span class="small w-text">'+arraynames[arrayData[i].weather]+'</span>'+
                                '</div>'+

                                '<div class="d-flex align-items-center">'+
                                    '<div class="flex-grow-1 w-detill">'+
                                        '<div><i class="fas fa-wind fa-fw"></i>wind:<span class="ms-1">'+ arrayData[i].wind10m_max +'km/h</span></div>'+
                                        '<div><i class="fas fa-High fa-fw"></i>High:<span class="ms-1">'+ arrayData[i].temp2m.max +'</span></div>'+
                                        '<div><i class="fas fa-Low fa-fw"></i>Low:<span class="ms-1">'+ arrayData[i].temp2m.min +'</span></div>'+
                                    '</div>'+

                                    '<div class="box-image"><img src="images/'+arrayData[i].weather+'.png" width="100px"></div>'+
                                '</div>'+

                            '</div>'+
                        '</div>'+
                    '</div>';
        $('#content-row').append( htmlString);
        $("body").addClass("auto-height"); 
    }
}

$(document).on({
    ajaxStart: function(){
        $("body").addClass("loading"); 
    },
    ajaxStop: function(){ 
        $("body").removeClass("loading"); 
    }    
});



