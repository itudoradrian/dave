function handleResponse(res) {

    if (res.status === 200) {

        return res.text();
    }
    console.log('Looks like there was a problem. Status Code: ' +
        res.status);
    return;

}

async function fetchHTMLPage(resourceName) {

    htmlResource = `/views/${resourceName}.html`;
    await fetch(htmlResource).then(handleResponse).then(function (htmlText) {

        //Get document Parser to create the DOM for the fetched html page
        const parser = new DOMParser();
        const fetchedHTMLPage = parser.parseFromString(htmlText, "text/html");

        //Get the inner div from the fetched page and its appended to the targetDiv
        const view = fetchedHTMLPage.querySelector('#view');
        view.setAttribute('id', `${resourceName}View`);
        view.addEventListener('viewChange', () => {

            console.log('View Changed');
            if (routes.currentPath != '/registerform') {
                document.getElementById('displayCode').innerHTML = '';
            }
            if (routes.currentPath != '/formdisplay') {
                document.getElementById('displayTable').innerHTML = '';
            }
        });
        document.body.insertAdjacentElement('beforebegin', view);
    })
}
function navigate(event) {
    event.preventDefault();
    var route = event.target.attributes[0].value;
    routes.changeRoute(route);

}
async function init() {

    await fetchHTMLPage('index');
    await fetchHTMLPage('formdisplay');
    await fetchHTMLPage('landing');
    await fetchHTMLPage('login');
    await fetchHTMLPage('registerform');
    await fetchHTMLPage('statistics');
    await setAuth();

    var links = Array.from(document.querySelectorAll('[route]'));
    links.forEach(function (lk) {
        lk.addEventListener('click', navigate);
    });


    window.addEventListener('popstate', e => {
        e.preventDefault();
        routes.navigation(window.location.pathname);
    });

    const session = localStorage.getItem('logged');
    if (!session) {
        localStorage.setItem('logged', false);
        routes.setView('/landing');
    }

    if (session === 'false') {
        routes.changeRoute('/landing');
    }
    else {
        routes.setView(window.location.pathname);
    }
    
}

init();