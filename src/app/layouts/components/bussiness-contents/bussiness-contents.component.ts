import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import {
    CarouselCaptionComponent,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ThemeDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';

@Component({
    selector: 'vex-bussiness-contents',
    standalone: true,
    animations: [scaleFadeIn500ms],
    imports: [CommonModule, ThemeDirective, CarouselComponent, CarouselIndicatorsComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselCaptionComponent, CarouselControlComponent, RouterLink],
    templateUrl: './bussiness-contents.component.html',
    styleUrl: './bussiness-contents.component.scss'
})
export class BussinessContentsComponent {
    slides: any[] = new Array(6).fill({ id: -1, src: '', title: '', subtitle: '' });
    hover = false;
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    constructor(private store: Store,
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
        this.appFunction.getListFormItemNm("business_contents").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;

                    this.slides = [{
                        index: 0,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_01.jpg',
                        title: listFormItemNm[13]
                    }, {
                        index: 1,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_02.jpg',
                        title: listFormItemNm[14]
                    }, {
                        index: 2,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_03.jpg',
                        title: listFormItemNm[15]
                    }, {
                        index: 3,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_04.jpg',
                        title: listFormItemNm[16]
                    }, {
                        index: 4,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_05.jpg',
                        title: listFormItemNm[17]
                    }, {
                        index: 5,
                        showCaption: false,
                        src: './assets/img/bussiness-content/bs-content_06.jpg',
                        title: listFormItemNm[18]
                    }
                    ];

                    setTimeout(() => {
                        this.slides[0]['showCaption'] = true;
                    }, 300)



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

    onItemChange($event: any): void {
        let index = $event % this.slides.length;
        this.slides[$event]['showCaption'] = false;
        setTimeout(() => {
            this.slides[$event]['showCaption'] = true;
        }, 500)
    }


}
