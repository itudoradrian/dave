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
        document.body.insertAdjacentElement('beforebegin', view);
    })
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
    function navigate(event) {
        event.preventDefault();
        var route = event.target.attributes[0].value;
        routes.changeRoute(route);

    }
    links.forEach(function (lk) {
        lk.addEventListener('click', navigate);
    });
    
    
    window.addEventListener('popstate', e => {
        e.preventDefault();
        routes.navigation(window.location.pathname);
    });
    
    const session = localStorage.getItem('logged');
    if(!session)
    {
        localStorage.setItem('logged',false);
        routes.setView('/landing');
    }

    if(session === 'false')
    {
        routes.changeRoute('/landing');
    }
    else
    {
        routes.setView(window.location.pathname);
    }
   
}
var routes = new Router([{
    path: '/',
    name: 'index'
}, {

    path: '/formdisplay',
    name: 'formdisplay'
}, {

    path: '/registerform',
    name: 'registerform'

}, {

    path: '/statistics',
    name: 'statistics'
},{
    
    path: '/login',
    name: 'login'
},{
    
    path: '/landing',
    name: 'landing'
}
], window.location.pathname);
init();
/*
async function start()
{
    await fetchHTMLPage('landing');
    await fetchHTMLPage('login');
    loginRoutes = new Router([{
        
        path: '/login',
        name: 'login'
    },{
        
        path: '/landing',
        name: 'landing'
    }],window.location.pathname);

    const session = localStorage.getItem('logged');
    if(!session)
    {
        localStorage.setItem('logged',false);
        loginRoutes.setView('/login');
    }

    if(session === 'false')
    {
        //console.log('nothing');
        loginRoutes.setView('/landing');
    }
    else
    {
        init();
    }
    
}
start();*/