(function (global){
    let utils = {};

    const homeHtml = "../pages/home_snippet.html";
    const readerHtml = "../pages/csv_reader_snippet.html";
    const displayOptionHtml = "../pages/display_option_snippet.html";
    const displayGraphHtml = "../pages/display_graph_snippet.html";
    const docHtml = "../pages/doc_snippet.html";
    const aboutHtml = "../pages/about_snippet.html";
    const dataHtml = "../pages/pass-fail_snippet.html";
    const traceReaderHtml = "../pages/trace-reader.html";

    let fileRecords = new Object();  //record csv data as Object format for each

//---------home_snippet.html-------------

    document.addEventListener("DOMContentLoaded", (event)=>{
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;

                document.getElementById("display-option-navbar").hidden = true;
            }
        );
    });

    utils.loadHome = () =>{
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;
            }
        )
    }

//---------csv_reader_snippet.html-------------
    utils.loadUploadSection = () => {
        $ajaxUtils.sendGetRequest(
            readerHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;
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
            let record = new Array();

            reader.onload = function (event) {
                var csv = event.target.result;
                var tableheads = new Array();
                var rows = csv.split('\n');

                tableheads =rows[0].split(',');

                for (var i = 1; i < rows.length; i++) {
                    var cells = rows[i].split(',');
                    record[i] = new Object();
                    
                    for (var k = 0; k < cells.length; k++) {
                        record[i][tableheads[k]] = cells[k];
                    }
                }

                
            };
            
            reader.readAsText(files[f]);
            fileRecords[files[f].name]=record;
            console.log(fileRecords);
        }

        document.getElementById("next-display-option").hidden = false;
        document.getElementById("display-option-navbar").hidden = false;
        
    };

//---------display_option.html------------------
    utils.loadDisplayOptionSection = () => {
        $ajaxUtils.sendGetRequest(
            displayOptionHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;
            }
        );
    }

//---------display_graph_snippet.html-------------

    utils.loadDisplayGraphSection = () => {
        $ajaxUtils.sendGetRequest(
            displayGraphHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;
            }
        );
    };

    

    utils.displayGraph = () => {
        var txtinput = document.getElementById('displayattr').value;       
        var topicBegin = 0
        var topicBeginLock = false;
        var data = new Array();

        for (var l=0; l<txtinput.length; l++){
            if (txtinput.charAt(l)==','){
                data.push({topic: txtinput.substring(topicBegin,l),numarr:new Array()});
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
        data.push({topic: txtinput.substring(topicBegin),numarr:new Array()});
        console.log(data);


        var label = new Array();
        var useFileName = true;
        if (document.getElementById("toggle-xlabel").innerHTML == "use file name for x-axis"){
            useFileName = false;
        }

        for(const[key, value] of Object.entries(fileRecords)){
            if(useFileName){
                label.push(key)
            }
            else{
                var onelabel = value[1]["Name"];
                var twolabel = value[2]["Name"];

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
    
                label.push(onelabel);

            }
            
            console.log(value);

            for (var d = 0; d<data.length; d++){
                var sum = 0;

                for(var v = 1; v<value.length-1; v++){
                    sum += Number(value[v][data[d].topic])
                }

                /*
                for (var i = 0; i<fileRecords.length; i++){
                    numarr[i] = 0;
                    for (var j = 0; j<fileRecords[i].length-2; j++){
                        numarr[i] +=  Number(fileRecords[i][j+1][data[d].topic]);
                    }
                }*/
                data[d].numarr.push(sum)
                console.log(data);
            }
        }

        createChart(label, data);

        document.getElementById("toggle-xlabel").hidden = false;
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

    utils.toggleXlabel = () =>{
        if (document.getElementById("toggle-xlabel").innerHTML =="use test name for x-axis"){
            document.getElementById("toggle-xlabel").innerHTML = "use file name for x-axis";
        }else{
            document.getElementById("toggle-xlabel").innerHTML = "use test name for x-axis";
        }
        
    }

//----------document.html------------------
    utils.loadDocSection = () => {
        $ajaxUtils.sendGetRequest(
            docHtml,
            function(request){
                document.getElementById("main-content").innerHTML = request.responseText;
            }
        );
    };

//----------about.html------------------

utils.loadAboutSection = () => {
    $ajaxUtils.sendGetRequest(
        aboutHtml,
        function(request){
            document.getElementById("main-content").innerHTML = request.responseText;
        }
    );
};
//display-csv-data.html
utils.loadDisplayCSVSection = () => {
    $ajaxUtils.sendGetRequest(
        displayCSVData,
        function(request){
            document.getElementById("main-content").innerHTML = request.responseText;
        }
    );
};

utils.displayCSVData = () => {
    const input = document.querySelector('input[type="file"]');
    const files = input.files;
    if (files.length === 0) {
        alert('Please select a CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const csv = event.target.result;
        const rows = csv.split('\n');
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].split(',');
            const row = document.createElement('tr');
            for (let j = 0; j < cells.length; j++) {
                const cell = document.createElement('td');
                cell.textContent = cells[j];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        document.getElementById('csv-table-container').innerHTML = '';
        document.getElementById('csv-table-container').appendChild(table);
    };

    reader.readAsText(files[0]);
};
//----------pass-fail.html------------------
utils.loadDataSection = () => {
    $ajaxUtils.sendGetRequest(
        dataHtml,
        function (request) {
            document.getElementById("main-content").innerHTML = request.responseText;

            const loadSelection = Object.keys(fileRecords);
            let fileNameForTable = "";
            for(let i=0;i<loadSelection.length;i++){
                fileNameForTable += ("<option>"+loadSelection[i]+"</option>");
            }
        
            document.getElementById("file-name-for-table").innerHTML=fileNameForTable;
            /*
            const input = document.querySelector('input[type="file"]');
            input.addEventListener('change', function (event) {
                const files = event.target.files;
                if (files.length === 0) {
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    var csv = event.target.result;
                    var rows = csv.split('\n');
                    var passColumn = [];
                    var failColumn = [];

                    for (var i = 0; i < rows.length; i++) {
                        var columns = rows[i].split(',');
                        if (i === 0) {
                            var passIndex = columns.findIndex(column => column.trim().toLowerCase() === 'pass');
                            var failIndex = columns.findIndex(column => column.trim().toLowerCase() === 'fail');
                            if (passIndex === -1) {
                                alert('No column labeled "Pass" found in the CSV file.');
                                return;
                            }
                            if (failIndex === -1) {
                                alert('No column labeled "Fail" found in the CSV file.');
                                return;
                            }
                        } else {
                            passColumn.push(columns[passIndex]);
                            failColumn.push(columns[failIndex]);
                        }
                    }

                    // Calculate the number of pass and fail entries
                    var numPass = passColumn.filter(item => item.trim().toLowerCase() === 'pass').length;
                    var numFail = failColumn.filter(item => item.trim().toLowerCase() === 'fail').length;

                    // Display the number of pass and fail entries
                    document.getElementById('pass-data').innerText = `Number of Pass entries: ${numPass}`;
                    document.getElementById('fail-data').innerText = `Number of Fail entries: ${numFail}`;
                };

                reader.readAsText(files[0]);
                
            });
            */
        }
    );
};

utils.displayTable = () =>{
    const targetFileName = document.getElementById("file-name-for-table").value;
    const targetFile = fileRecords[targetFileName];
    const tableHead = Object.keys(targetFile[1]);
    let table = document.getElementById("csv-table-all");
    table.innerHTML="";

    console.log(targetFile)

    let firstRow = table.insertRow()
    for(let th=0; th<tableHead.length;th++){
        let cell = firstRow.insertCell();
        cell.textContent = tableHead[th];
    } 

    for (let i = 1; i<targetFile.length-1; i++){
        let row = table.insertRow();
        for(let th=0; th<tableHead.length;th++){
            let cell = row.insertCell();
            cell.textContent = targetFile[i][tableHead[th]];
            
            console.log(targetFile[i][tableHead[th]]);
        }
    } 


}

//----------trace-reader.html---------------

/*
utils.loadTraceReader = () => {
    $ajaxUtils.sendGetRequest(
        traceReaderHtml,
        function(request){
            document.getElementById("main-content").innerHTML = request.responseText;
        }
    );
};*/

global.$utils = utils;
})(window);