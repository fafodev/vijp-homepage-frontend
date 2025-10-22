import { Injectable } from '@angular/core';
import { IObjectString } from '../app.interface';
import { NavigationLoaderService } from '../core/navigation/navigation-loader.service';
import { NavigationItem } from '../core/navigation/navigation-item.interface';
import * as Const from '../app.const';
import { WebServiceService } from './web-service.service';
import { AccessInfoService } from './access-info.service';
import { catchError, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppFunctionService {

    constructor(
        private navigationLoaderService: NavigationLoaderService,
        private webService: WebServiceService,
        private readonly accessInfo: AccessInfoService
    ) {
    }

    reloadListFunction(language: string): void {
        
    }

    getListFunction(language: string): any {
        
    }

    getListFormItemNm(screenId: string) {
        return of([])
    }
}
