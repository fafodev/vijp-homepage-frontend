import { Component } from '@angular/core';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { NgIf } from '@angular/common';

@Component({
    selector: 'vex-bussiness-introduction',
    standalone: true,
    imports: [NgIf],
    templateUrl: './bussiness-introduction.component.html',
    styleUrl: './bussiness-introduction.component.scss',
    animations: [scaleFadeIn500ms]
})
export class BussinessIntroductionComponent {
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    constructor(
        private store: Store,
        private appFunction: AppFunctionService) {
    }

    ngOnInit(): void {
        // Theo dõi sự thay đổi của language
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);

        this.currentLanguage$.subscribe(language => {
            this.fnGetFormItemNm();
        });
    }
    fnGetFormItemNm() {
        this.formItemNmLoaded = false;
        this.appFunction.getListFormItemNm("business_introduction").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                    this.formItemNmLoaded = true;
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
