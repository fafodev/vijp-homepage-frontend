import { Component } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';

@Component({
    selector: 'vex-link',
    standalone: true,
    imports: [NgFor, NgIf],
    templateUrl: './link.component.html',
    styleUrl: './link.component.scss',
    animations: [scaleFadeIn500ms]
})
export class LinkComponent {
    links: any = [
        {
            "title": "外国人技能実習機構",
            "description": "(Organization for Technical Intern Training)",
            "url": "https://www.otit.go.jp"
        },
        {
            "title": "法務省",
            "description": "(Ministry of Justice)",
            "url": "http://www.moj.go.jp"
        },
        {
            "title": "厚生労働省",
            "description": "(Ministry of Health, Labour and Welfare)",
            "url": "https://www.mhlw.go.jp/index.html"
        },
        {
            "title": "JITCO",
            "description": "(Japan International Trainee & Skilled Worker Cooperation Organization)",
            "url": "https://www.jitco.or.jp"
        },
        {
            "title": "Philippine Embassy Tokyo",
            "description": "",
            "url": "https://tokyo.philembassy.net"
        },
        {
            "title": "Philippine Overseas Labor Office Tokyo",
            "description": "",
            "url": "https://polotokyo.dole.gov.ph"
        },
        {
            "title": "Philippine Consulate General Osaka",
            "description": "",
            "url": "https://osakapcg.dfa.gov.ph"
        },
        {
            "title": "Philippine Overseas Labor Office Osaka",
            "description": "",
            "url": "http://poloosaka.dole.gov.ph"
        },
        {
            "title": "多々一時金",
            "description": "(Lumpsum payment)",
            "url": "https://www.nenkin.go.jp/international/english/lumpsum/lumpsum.html"
        },
        {
            "title": "ONLINE PAOS",
            "description": "",
            "url": "https://docs.google.com/forms/d/e/1FAIpQLSdEAgiGv5FjchqKlYOKv2VqvumtJeClHGw7eH0WGnmZa00tjA/viewform"
        },
        {
            "title": "在東京タイ王国大使館",
            "description": "",
            "url": "http://site.thaiembassy.jp/th"
        },
        {
            "title": "タイ王国大使館労働担当官事務所",
            "description": "",
            "url": "https://japan.mol.go.th"
        },
        {
            "title": "タイ王国大阪総領事館",
            "description": "",
            "url": "http://www.thaiconsulate.jp/th/wwwj"
        },
        {
            "title": "バンコック銀行",
            "description": "",
            "url": "https://www.bangkokbank.com/en/International-Banking-Japanese-Customer"
        }
    ];

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
        this.appFunction.getListFormItemNm("link").subscribe({
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
