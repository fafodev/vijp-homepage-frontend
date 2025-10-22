import { Component } from '@angular/core';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { PageEvent, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { WebServiceService } from 'src/app/services/web-service.service';
import { NgFor, NgIf } from '@angular/common';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';


export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();
    // Ghi đè hàm rangeLabel
    customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `( ${startIndex + 1}  -  ${endIndex} ) / ${length}`; // Thay "of" bằng "trong"
    };

    return customPaginatorIntl;
}

@Component({
    selector: 'vex-news',
    standalone: true,
    imports: [MatPaginatorModule, NgFor, NgIf],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss',
    animations: [scaleFadeIn500ms],
})
export class NewsComponent {
    length = 0;
    pageSize = 5;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 15];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    pageEvent: PageEvent | undefined;

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;

        this.fnGetListNews();
    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        if (setPageSizeOptionsInput) {
            this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
        }
    }

    listPosts: any = [];
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    constructor(
        private store: Store,
        private appFunction: AppFunctionService,
        private splashScreenService: SplashScreenService,
        private accessInfo: AccessInfoService,
        private webService: WebServiceService,
        private paginator: MatPaginatorIntl,
        private postService: PostService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.pageSize = this.postService.getPageSize() || 5;
        this.pageIndex = this.postService.getPageIndex() || 0;

        // Theo dõi sự thay đổi của language
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);

        this.currentLanguage$.subscribe(language => {
            this.fnGetFormItemNm();
        });

    }
    fnGetFormItemNm() {
        this.formItemNmLoaded = false;
        this.appFunction.getListFormItemNm("news").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                    this.formItemNmLoaded = true;


                    this.paginator.itemsPerPageLabel = this.listFormItemNm[3];
                    this.paginator.nextPageLabel = this.listFormItemNm[4];
                    this.paginator.previousPageLabel = this.listFormItemNm[5];
                    this.paginator.lastPageLabel = this.listFormItemNm[6];
                    this.paginator.firstPageLabel = this.listFormItemNm[7];
                    this.paginator.changes.next();

                    this.fnGetListNews();
                } else {
                    console.error('Không có dữ liệu nào được trả về từ API.');
                }
            },
            error: (error: any) => {
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }

    fnGetListNews() {
        const request = {
            accessInfo: this.accessInfo.getAll(),
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
        };

        this.webService.callWs('getPosts', request).subscribe({
            next: (data: any) => {
                if (data && data.listPosts) {
                    this.length = data.listPostCnt;
                    this.listPosts = data.listPosts;
                }
                this.splashScreenService.hide();
            },
            error: (error: any) => {
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }

    postClick(post: any) {
        this.postService.setPageIndex(this.pageIndex);
        this.postService.setPageSize(this.pageSize);
        this.postService.setPost(post);
        this.router.navigateByUrl("/post-detail");
    }
}

