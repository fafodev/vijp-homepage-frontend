import {
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { filter } from 'rxjs/operators';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { SearchService } from './search.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngrx/store';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { Router } from '@angular/router';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';

@Component({
    selector: 'vex-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        NgIf,
        AsyncPipe
    ]
})
export class SearchComponent implements OnInit, OnDestroy {
    show$ = this.layoutService.searchOpen$;
    searchCtrl = new UntypedFormControl();
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    @ViewChild('searchInput', { static: true }) input?: ElementRef;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private layoutService: VexLayoutService,
        private searchService: SearchService,
        private store: Store,
        private loader: LoadingBarService,
        private webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private appFunction: AppFunctionService,
        private splashScreenService: SplashScreenService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.searchService.isOpenSubject.next(true);
        this.searchCtrl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => this.searchService.valueChangesSubject.next(value));

        this.show$
            .pipe(
                filter((show) => show),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.input?.nativeElement.focus());

        // Theo dõi sự thay đổi của language
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);

        this.currentLanguage$.subscribe(language => {
            this.fnGetFormItemNm();
        });
    }

    close() {
        this.layoutService.closeSearch();
        this.searchCtrl.setValue(undefined);
        this.searchService.isOpenSubject.next(false);
    }

    search() {
        this.searchService.submitSubject.next(this.searchCtrl.value);

        const request = {
            accessInfo: this.accessInfo.getAll(),
            keyword: this.searchCtrl.value
        };

        this.webService.callWs('fullsearch', request).pipe().subscribe({
            next: (data: any) => {
                if (data && data.listSearchResult) {
                    this.searchService.setSearchResult(data.listSearchResult);
                    this.router.navigate(["/search-result"]);
                    this.close();
                }
            },
            error: (error: any) => {
                this.close();
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }

    ngOnDestroy(): void {
        this.layoutService.closeSearch();
        this.searchCtrl.setValue(undefined);
        this.searchService.isOpenSubject.next(false);
    }

    fnGetFormItemNm() {
        this.formItemNmLoaded = false;
        this.appFunction.getListFormItemNm("search").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                } else {
                    console.error('Không có dữ liệu nào được trả về từ API.');
                }
            },
            error: (error: any) => {
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }
}
