// Simple Hash-based Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    route(path, handler) {
        this.routes[path] = handler;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const handler = this.routes[hash] || this.routes['404'];
        
        if (handler) {
            handler();
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

const router = new Router();
window.router = router; // Make globally accessible for onclick handlers

