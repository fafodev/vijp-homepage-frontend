import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { PdfviewerComponent } from '../pdfviewer/pdfviewer.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'vex-overview',
    standalone: true,
    imports: [NgIf],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    animations: [scaleFadeIn500ms]
})
export class OverviewComponent {
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    constructor(
        private dialog: MatDialog,
        private store: Store,
        private appFunction: AppFunctionService
    ) {

    }
    licenseDetailShow() {
        this.dialog.open(PdfviewerComponent, {
            width: '80%',
            height: '80%',
            data: { pdfUrl: 'assets/img/license/監理団体の業務の運営に関する規程.pdf' }, // Đường dẫn đến file PDF
            panelClass: 'custom-dialog-container', // Tuỳ chỉnh thêm nếu cần
        });
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
        this.appFunction.getListFormItemNm("overview").subscribe({
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
