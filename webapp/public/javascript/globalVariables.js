const routes = new Router([{
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
}, {

    path: '/login',
    name: 'login'
}, {

    path: '/landing',
    name: 'landing'
}
], window.location.pathname);
var viewChange = new Event('viewChange');
var user;
var formNames;
var formsData = [];

