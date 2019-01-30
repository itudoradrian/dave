function setForms() {

    let liList = '';
    const ulElem = document.getElementById('formList');
    formNames.forEach(form => {

        liList += `<li><a name="${form}">${form}</a></li>`;
    });
    ulElem.insertAdjacentHTML('afterbegin', liList);

}
function decryptJSON(enJSON) {


    let jsonData = [{
        'username': 'leo',
        'email': 'lebranco@srl.co',
        'telefon': '0342131231',
    },
    {
        'username': 'leo',
        'email': 'lebranco@srl.co',
        'telefon': '0342131231',
    },
    {
        'username': 'leo',
        'email': 'lebranco@srl.co',
        'telefon': '0342131231',
    }];
    return jsonData;
}
function setTableView(name) {


    let enJSON = formsData.filter(form => {

        if (form['name'] == name) {
            return true;
        }
        return false;
    }).map(entry => {

        return entry.enJSON;
    });

    if (enJSON.length) {

        jsonData = decryptJSON(enJSON);
        const keys = Object.keys(jsonData[0]);
        //console.log(keys);
        let table = '<table>'
        let tableHead = '<thead><tr>'
        let tableBody = '<tbody>'

        keys.forEach(key => {

            tableHead += `<th>${key}</th>`

        });
        tableHead += '</tr></thead>';
        table += tableHead;
        jsonData.forEach(entry => {

            let tableRow = '<tr>'
            Object.values(entry).forEach(dataValue => {
                let tableRecord = `<td>${dataValue}</td>`;
                tableRow += tableRecord;
            });
            tableRow += '</tr>'
            tableBody += tableRow;
        });

        tableBody += '</tbody>'
        table += tableBody;
        document.getElementById('displayTable').insertAdjacentHTML('afterbegin', table);
        routes.changeRoute('/formdisplay');
    }
    else {
        console.log('Sorry no data');
    }
}

function setFormViews() {
    const liElements = document.querySelectorAll('#formList li a');
    console.log(liElements);
    liElements.forEach(el => {

        el.addEventListener('click', async e => {

            if (e.target.nodeName == 'A') {

                setTableView(el['name']);

            }
        });
        
    });
}
