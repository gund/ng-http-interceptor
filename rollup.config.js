export default {
    entry: 'dist/index.js',
    dest: 'dist/bundle/ng2-http-interceptor.umd.js',
    format: 'umd',
    moduleName: 'httpInterceptor',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/http': 'ng.http',
        'rxjs/Observable': 'Rx',
        'rxjs/add/observable/of': 'Rx.Observable',
        'rxjs/add/observable/empty': 'Rx.Observable',
        'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'util': 'util'
    }
}
