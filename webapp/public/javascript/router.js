class Router {
    constructor(routesList, path) {
        this.routes = routesList;
        this.currentPath = path;
    }
    setView(path) {
        //console.log(path.slice(0));
        const result = this.routes.filter(route => path == route.path);
        let viewId = document.getElementById(`${result[0].name}View`);
        viewId.removeAttribute('class');
        viewId.dispatchEvent(viewChange);
    }
    changeRoute(route) {
        var routeInfo = this.routes.filter(function (r) {
            return r.path === route;
        })[0];

        const result = this.routes.filter(route => this.currentPath == route.path);
        let viewId = document.getElementById(`${result[0].name}View`);
        viewId.setAttribute('class', 'passive');

        if (!routeInfo) {
            window.history.pushState({}, '', 'error')
            this.currentPath = '/error';

        }
        else {

            //console.log(window.history);
            let viewId = document.getElementById(`${routeInfo.name}View`);
            viewId.removeAttribute('class');
            this.currentPath = routeInfo.path;
            window.history.pushState({}, '', routeInfo.path);
            viewId.dispatchEvent(viewChange);
        }

    }
    navigation(route) {
        const result = this.routes.filter(route => this.currentPath == route.path);
        let viewId = document.getElementById(`${result[0].name}View`);
        viewId.setAttribute('class', 'passive');
        

        var routeInfo = this.routes.filter(function (r) {
            return r.path === route;
        })[0];
        let viewId2 = document.getElementById(`${routeInfo.name}View`);
        viewId2.removeAttribute('class');
        this.currentPath = routeInfo.path;
        window.history.replaceState({}, '', routeInfo.path);
        viewId.dispatchEvent(viewChange);
    }
}