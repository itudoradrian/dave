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
function generateCode(userId, rsaKey, aes, formName) {
    let codeTag = '<code>';
    codeTag += `
    function convertStringToArrayBufferView(str) {
        var bytes = new Uint8Array(new ArrayBuffer(str.length));
        for (var iii = 0; iii < str.length; iii++) {
            bytes[iii] = str.charCodeAt(iii);
        }
        return bytes;
    }
    function convertArrayBufferViewtoString(buffer) {
        var str = "";
        for (var iii = 0; iii < buffer.byteLength; iii++) {
            str += String.fromCharCode(buffer[iii]);
        }
        return str;
    }
    async function encryptData(){
        const publicKey = ${rsaKey};
        const aesKey = ${aes};
        let ${formName} = document.getElementById('${formName}');
        ${formName}.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formValues = {};
            const elemArray = Array.from(${formName}.elements);
            elemArray.filter(el => el.type == 'text').map(elem => {
                formValues[elem.name] = elem.value;
            });
            ${formName}.reset();
            let plainJSON = JSON.stringify(formValues);
            let cryptoKeyAES = null;
            let cryptoKeyRSA = null;
            let enJSON = null;
            await window.crypto.subtle.importKey(
                "jwk",
                aesKey,
                {   
                    name: "AES-CTR",
                },
                true, 
                ["encrypt", "decrypt"]
            )
                .then(function (key) {
                
                    cryptoKeyAES = key;
                    console.log('AES IMPORT SUCCES');
                })
                .catch(function (err) {
                    console.log(err);
                });
            let JSONtoCrypt = convertStringToArrayBufferView(plainJSON);
            await window.crypto.subtle.encrypt(
                {
                    name: "AES-CTR",
                    counter: new Uint8Array(16),
                    length: 128, 
                },
                cryptoKeyAES,
                JSONtoCrypt
            )
                .then(function (encrypted) {
                    enJSON = convertArrayBufferViewtoString(new Uint8Array(encrypted));
                    console.log('AES ENCRYPT SUCCES');
                })
                .catch(function (err) {
                    console.log(err);
                });
                let aesToCrypt = convertStringToArrayBufferView(JSON.stringify(aesKey));
                console.log(aesToCrypt);
                console.log(aesKey);
                console.log(JSON.stringify(aesKey));
                let cryptedAES = null;
                await window.crypto.subtle.importKey(
                    "jwk",
                    publicKey,
                    {
                        name: "RSA-OAEP",
                        hash: { name: "SHA-256" },
                    },
                    true,
                    ["encrypt"]
                )
                    .then(function (publicKey) {
                        cryptoKeyRSA = publicKey;
                        console.log('RSA IMPORT SUCCES');
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                await window.crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP",
                    },
                    cryptoKeyRSA,
                    aesToCrypt
                )
                    .then(function (encrypted) {
                        
                        cryptedAES = convertArrayBufferViewtoString(new Uint8Array(encrypted));
                        console.log('RSA ENCRYPT SUCCES');
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                    console.log(cryptedAES);
            let dto = {uid:'${userId}', name: '${formName}', aes: cryptedAES, data: enJSON };
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function (event) {
                document.getElementById('serverResponse').innerHTML = this.responseText
            });
            xhr.addEventListener('error', function (event) {
                document.getElementById('serverResponse').innerHTML = 'Error at send';
            });
            xhr.open("POST", '/dataTransfer', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(dto));
        });
    }
    encryptData();`;
    codeTag += '</code>';
    return codeTag;
}
function setFormViews() {
    const liElements = document.querySelectorAll('#formList li a');
    //console.log(liElements);
    liElements.forEach(el => {

        el.addEventListener('click', async e => {

            if (e.target.nodeName == 'A') {

                setTableView(el['name']);

            }
        });

    });
}
