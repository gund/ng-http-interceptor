import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTOR_PROVIDER, HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER } from './providers';

/**
 * @module
 * @description
 * Library provides Http Interceptor Service for Angular 2 application
 * By default overrides angular's Http service
 * To keep original Http service use with {@see HttpInterceptorModule.noOverrideHttp()}
 */
@NgModule({
    imports: [HttpModule],
    providers: [HTTP_INTERCEPTOR_PROVIDER]
})
export class HttpInterceptorModule {

    /**
     * Keeps original Http service and adds InterceptableHttp service
     * Requests made by Http service will not be intercepted - only those made by InterceptableHttp
     */
    static noOverrideHttp(): ModuleWithProviders {
        return {
            ngModule: HttpInterceptorNoOverrideModule
        };
    }
}

@NgModule({
    imports: [HttpModule],
    providers: [HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER]
})
export class HttpInterceptorNoOverrideModule { }
