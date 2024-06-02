/**
 * @jest-environment jsdom
 */



//const { default: test } = require('node:test');
test('update array',()=>{
    document.body.innerHTML = `
        <input type="file" id="file-input" accept=".csv" webkitdirectory multiple>
    `;

    require('../graph_generator');

 
    const file_input = document.getElementById('file-input');
    const choose_file_btn = document.getElementById('choose-file-btn');

    file_input.click();

    expect(file_input.files[0].name).toEqual('AT-A1.csv');
    expect(file_input.files[1].name).toEqual('AT-A2.csv');
    expect(file_input.files[2].name).toEqual('AT-ASE1.csv');


});