document.addEventListener("DOMContentLoaded",
    function(event){

        //const reader = new FileReader();
        var fileRecords = new Array();  //record csv data as Object format for each

        
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

 
        
        //record csv file uploaded into fileRecords
        document.getElementById('file-input').addEventListener('change',function (){
            var files = document.querySelector("#file-input").files;
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
            
        });


//-----------------------------------Buttons-----------------------------------------------------------------------

        
        document.getElementById('choose-file-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevents the default behavior of label click event
            document.getElementById('file-input').click();
        });

        document.getElementById('display-pass-fail-btn').addEventListener('click', function() {
            var fileInput = document.getElementById('file-input');
            if (!fileInput.files[0]) {
                alert('Please select a CSV file.');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(event) {
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
                // Clear pass and fail data sections before displaying the new data
                document.getElementById('pass-data').innerHTML = '';
                document.getElementById('fail-data').innerHTML = '';
                displayColumnData(passColumn, document.getElementById('csv-table-pass'), document.getElementById('pass-data'));
                displayColumnData(failColumn, document.getElementById('csv-table-fail'), document.getElementById('fail-data'));
                // Show the pass and fail data sections
                document.getElementById('pass-data-section').style.display = 'block';
                document.getElementById('fail-data-section').style.display = 'block';
                // Hide the entire file table
                document.getElementById('csv-table-all').style.display = 'none';
            };
            reader.readAsText(fileInput.files[0]);
        });

        document.getElementById('display-all-btn').addEventListener('click', function() {
            var fileInput = document.getElementById('file-input');
            if (!fileInput.files[0]) {
                alert('Please select a CSV file.');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                var csv = event.target.result;
                var rows = csv.split('\n');
                var table = document.getElementById('csv-table-all');
                table.innerHTML = '';
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(',');
                    var row = table.insertRow();
                    for (var k = 0; k < cells.length; k++) {
                        var cell = row.insertCell();
                        cell.textContent = cells[k];
                    }
                }
                table.style.display = 'block';
                // Hide the pass and fail data sections
                document.getElementById('pass-data-section').style.display = 'none';
                document.getElementById('fail-data-section').style.display = 'none';
            };
            reader.readAsText(fileInput.files[0]);
        });

        function displayColumnData(columnData, tableElement, dataElement) {
            tableElement.innerHTML = '';
            var uniqueData = Array.from(new Set(columnData));
            var headerRow = tableElement.insertRow();
            for (var j = 0; j < uniqueData.length; j++) {
                var headerCell = headerRow.insertCell();
                headerCell.textContent = uniqueData[j];
                var cellData = document.createElement('div');
                cellData.textContent = uniqueData[j];
                dataElement.appendChild(cellData);
            }
        }


        document.getElementById("display-pass-fail-graph-button").addEventListener("click",function(){
            var label = new Array();
            var evaluation_number_pass = new Array();
            for (var i = 0; i<fileRecords[fileRecords.length-1].length-2; i++){
                    label[i] = fileRecords[fileRecords.length-1][i+1]["Name"];
                    evaluation_number_pass[i] = fileRecords[fileRecords.length-1][i+1]['Evaluation_NumberPass'];
            }

            var data = [{
                        topic:"Evaluation_NumberPass",
                        numarr: evaluation_number_pass
                    }]

            createChart(label, data);
        });


        document.getElementById("analyze-mult-graphs-button").addEventListener("click", function(){
            
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

            
            var txtinput = document.querySelector("#displayattr").value;
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
        });

        module.exports = fileRecords;
    }


    
);