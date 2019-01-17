const htmlDocumentsFetched = {
    'index' : false,
    'formdisplay' : false,
    'landing' : false,
    'login' : false,
    'registerform' : false,
    'statistics' : false,
};

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
function fetchHTMLPage(resourceName, targetDiv) {

    htmlResource = `/views/${resourceName}.html`;
    fetch(htmlResource).then(function (res) {

        if (res.status === 200) {

            return res.text();
        }
        console.log('Looks like there was a problem. Status Code: ' +
            res.status);
        return;

    }).then(function (htmlText) {

        //Get document Parser to create the DOM for the fetched html page
        const parser = new DOMParser();
        const fetchedHTMLPage = parser.parseFromString(htmlText, "text/html");

        //Append the links from the fetched html page because DOM Parser doesn't do that
        const linksToFetch = fetchedHTMLPage.querySelectorAll('link');
        linksToFetch.forEach((link) => {

            document.head.appendChild(link);
        });

        //Get the inner div from the fetched page and its appended to the targetDiv
        const indexView = fetchedHTMLPage.querySelector('#view');
        targetDiv.innerHTML = indexView.innerHTML;

        //Fetch the javaScript file
        fetchJsScript(resourceName);
    })
}

function init(){

    
    fetchHTMLPage('index',targetDiv);
    htmlDocumentsFetched['index'] = true;
}
const targetDiv = document.querySelector('#displayView');
init();

