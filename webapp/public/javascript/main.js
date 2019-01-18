
function fetchJsScript(resourceName){

    jsResource = `/javascript/${resourceName}.js`;
    fetch(jsResource).then(function (res) {

        return res.text();

    }).then((jsRes) => {

        const indexScript = document.createElement('script');
        indexScript.innerText = jsRes;
        document.querySelector('body').appendChild(indexScript);
    });
}
function fetchHTMLPage(resourceName) {

    htmlResource = `/views/${resourceName}.html`;

    fetch(htmlResource).then(function (res) {

        if (res.status === 200) {

            return res.text();
        }
        console.log('Looks like there was a problem. Status Code: ' +
            res.status);
        return;

    }).then((htmlText) => {

        //Get document Parser to create the DOM for the fetched html page
        const parser = new DOMParser();
        const fetchedHTMLPage = parser.parseFromString(htmlText, "text/html");
        //Get the inner div from the fetched page and its appended to the targetDiv
        const view = fetchedHTMLPage.querySelector('#view');
        view.setAttribute('class','passive');
        view.setAttribute('id',`${resourceName}View`);
        document.querySelector('#displayView').appendChild(view);
        console.log(view);
        
    })
}

function init(){

    
    fetchHTMLPage('index');
    fetchHTMLPage('formdisplay');
    fetchHTMLPage('landing');
    fetchHTMLPage('login');
    fetchHTMLPage('registerform');
    fetchHTMLPage('statistics');
    let currentView = document.getElementById('indexView');
    console.log(currentView);
    
}
const targetDiv = document.querySelector('#displayView');
init();

