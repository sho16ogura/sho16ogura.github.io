(function (global){
    let utils = {};

    const homeHtml = "../pages/home_snippet.html";
    const readerHtml = "../pages/csv_reader_snippet.html";
    const displayOptionHtml = "../pages/display_option_snippet.html";
    const displayGraphHtml = "../pages/display_graph_snippet.html";
    const docHtml = "../pages/doc_snippet.html";
    const aboutHtml = "../pages/about_snippet.html";

    let fileRecords = new Array();  //record csv data as Object format for each

//---------home_snippet.html-------------

    document.addEventListener("DOMContentLoaded", (event)=>{
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(request){
                document.querySelector("#main-content").innerHTML = request.responseText;
            }
        );
    });

//---------csv_reader_snippet.html-------------
    utils.loadUploadSection = () => {
        $ajaxUtils.sendGetRequest(
            readerHtml,
            function(request){
                document.querySelector("#main-content").innerHTML = request.responseText;
            }
        );
    };
    
    utils.uploadCSV =  (files)=>{
        console.log("called", files);
        if (!files) {
            return;
        }

        for(var f=0;f<files.length; f++){
            const reader = new FileReader();

            
            reader.onload = function (event) {
                var csv = event.target.result;
                var record = new Array();
                var tableheads = new Array();
                var rows = csv.split('\n');
                

                tableheads =rows[0].split(',');

                
                //console.log(record)
                //console.log(rows);
                
                

                for (var i = 1; i < rows.length; i++) {
                    var cells = rows[i].split(',');
                    record[i] = new Object();
                    
                    for (var k = 0; k < cells.length; k++) {
                        record[i][tableheads[k]] = cells[k];
                    }
                }

                fileRecords.push(record);
                console.log(fileRecords);
            };
            
            reader.readAsText(files[f]);
        }

        document.getElementById("next-display-option").hidden = false;
        document.getElementById("display-option-navbar").hidden = false;
        
    };

//---------display_option.html------------------
    utils.loadDisplayOptionSection = () => {
        $ajaxUtils.sendGetRequest(
            displayOptionHtml,
            function(request){
                document.querySelector("#main-content").innerHTML = request.responseText;
            }
        );
    }

//---------display_graph_snippet.html-------------

    utils.loadDisplayGraphSection = () => {
        $ajaxUtils.sendGetRequest(
            displayGraphHtml,
            function(request){
                document.querySelector("#main-content").innerHTML = request.responseText;
            }
        );
    };

    utils.displayGraph = () => {
            
        var label = new Array();
        for (var i = 0; i<fileRecords.length; i++){
            var onelabel = fileRecords[i][1]["Name"];
            var twolabel = fileRecords[i][2]["Name"];
            for(var j=0;j<onelabel.length;j++){
                if(j==onelabel.length-1){
                    onelabel = onelabel.substring(0,j)+"*";
                    break;
                }
                if(onelabel.charAt(j)!=twolabel.charAt(j)) {
                    onelabel = onelabel.substring(0,j)+"*"+onelabel.substring(j+1);
                    break;
                }
                
            }

            label[i] = onelabel;
        }

        var txtinput = document.getElementById('displayattr').value;
        
        var topicBegin = 0
        var topicBeginLock = false;
        var data = new Array();
        for (var l=0; l<txtinput.length; l++){
            if (txtinput.charAt(l)==','){
                data.push({topic: txtinput.substring(topicBegin,l)});
                topicBegin = l+1;
                topicBeginLock = false;
            }
            else if (txtinput.charAt(l)==" " && topicBeginLock == false){
                topicBegin += 1
            }
            else{
                topicBeginLock = true;
            }
        }
        data.push({topic: txtinput.substring(topicBegin)});
        console.log(data);

        
        for (var d = 0; d<data.length; d++){
            var numarr = new Array();
            for (var i = 0; i<fileRecords.length; i++){
                numarr[i] = 0;
                for (var j = 0; j<fileRecords[i].length-2; j++){
                    numarr[i] +=  Number(fileRecords[i][j+1][data[d].topic]);
                }
            }

            Object.assign(data[d], { numarr: numarr })
        }

        console.log(data);
        
        createChart(label, data);
    };

    //create graph on canvas in html
    function createChart(labels,data){
        const ctx = document.getElementById('myChart');
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // JS - Destroy exiting Chart Instance to reuse <canvas> element
        let chartStatus = Chart.getChart("myChart"); // <canvas> id
        if (chartStatus != undefined) {
        chartStatus.destroy();
        }
        //-- End of chart destroy  
        var chartdata = new Array(); 
        for (var d=0;d<data.length;d++){
            chartdata[d] = {
                                label: data[d].topic,
                                data: data[d].numarr
                            };
        }

    
        new Chart(ctx, {
            type: 'bar',
            data: {
                    labels:labels,
                    datasets: chartdata
            },
            options: {
                    scales: {
                        y: {
                                beginAtZero: true
                        }
                    }
            }
        });
    }

//----------document.html------------------
    utils.loadDocSection = () => {
        $ajaxUtils.sendGetRequest(
            docHtml,
            function(request){
                document.querySelector("#main-content").innerHTML = request.responseText;
            }
        );
    };

//----------about.html------------------

utils.loadAboutSection = () => {
    $ajaxUtils.sendGetRequest(
        aboutHtml,
        function(request){
            document.querySelector("#main-content").innerHTML = request.responseText;
        }
    );
};


    global.$utils = utils;
})(window);


