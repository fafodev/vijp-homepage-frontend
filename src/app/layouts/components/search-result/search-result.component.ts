import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SearchService } from '../toolbar/search/search.service';
import { Router } from '@angular/router';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { NgIf, NgFor } from '@angular/common';
import * as Const from '../../../app.const';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from 'src/app/services/post.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { WebServiceService } from 'src/app/services/web-service.service';

@Component({
    selector: 'vex-search-result',
    standalone: true,
    imports: [NgIf, NgFor, MatIconModule],
    templateUrl: './search-result.component.html',
    styleUrl: './search-result.component.scss',
    animations: [scaleFadeIn500ms]
})
export class SearchResultComponent {
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;
    searchResult: any = [];
    basePath: string = "";

    constructor(
        private store: Store,
        private accessInfo: AccessInfoService,
        private webService: WebServiceService,
        private appFunction: AppFunctionService,
        private searchService: SearchService,
        private postService: PostService,
        private router: Router) {
    }
    ngOnInit(): void {
        // Theo dõi sự thay đổi của language
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);

        this.currentLanguage$.subscribe(language => {
            this.fnGetFormItemNm();
        });

        this.basePath = Const.fullPath;
    }

    fnGetFormItemNm() {
        this.formItemNmLoaded = false;
        this.appFunction.getListFormItemNm("search-result").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                    this.formItemNmLoaded = true;
                } else {
                    console.error('Không có dữ liệu nào được trả về từ API.');
                }

                this.searchService.searchResult$.subscribe({
                    next: (searchResult: any) => {
                        if (!searchResult || searchResult.length == 0) {
                            this.router.navigate(["/home"]);
                        } else {
                            this.searchResult = searchResult;
                        }
                    },
                    error: (error: any) => {
                        console.error('Đã xảy ra lỗi khi tải danh sách:', error);
                    }
                })
            },
            error: (error: any) => {
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }

    linkToDetail(search: any) {
        if (search) {
            // Link to POST
            if (search.TYPE_SEARCH == "2") {
                this.fnGetListNews(search.ID);
            } else {
                if (search.FRAGMENT) {
                    this.router.navigate(["/" + search.LINK], { fragment: search.FRAGMENT });
                } else {
                    this.router.navigate(["/" + search.LINK])
                }
            }
        }
    }

    fnGetListNews(postId: any) {
        const request = {
            accessInfo: this.accessInfo.getAll(),
            postId: postId
        };

        this.webService.callWs('getPostId', request).subscribe({
            next: (data: any) => {
                if (data && data.post) {
                    this.postService.setPageIndex(0);
                    this.postService.setPageSize(5);
                    this.postService.setPost(data.post);
                    this.router.navigateByUrl("/post-detail");
                } else {
                    this.router.navigateByUrl("/home");
                }
            },
            error: (error: any) => {
                console.error('Đã xảy ra lỗi khi tải danh sách:', error);
            },
        });
    }
}
