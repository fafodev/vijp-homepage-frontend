import { Component } from '@angular/core';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { PostService } from 'src/app/services/post.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'vex-post-detail',
    standalone: true,
    imports: [NgIf, NgFor, MatIconModule, MatButtonModule],
    templateUrl: './post-detail.component.html',
    styleUrl: './post-detail.component.scss',
    animations: [scaleFadeIn500ms]
})
export class PostDetailComponent {
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;
    post: any = {};
    imageList: any = [];

    constructor(
        private store: Store,
        private appFunction: AppFunctionService,
        private postService: PostService,
        private router: Router) {
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
        this.appFunction.getListFormItemNm("post-detail").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                    this.formItemNmLoaded = true;
                } else {
                    console.error('Không có dữ liệu nào được trả về từ API.');
                }

                this.postService.selectedPost$.subscribe({
                    next: (post: any) => {
                        if (!post) {
                            this.router.navigate(["/home"]);
                        } else {
                            this.post = post;

                            this.post.IMAGE_URL.split(',').forEach((image: any) => {
                                if (image.trim().length === 0) {
                                    return;
                                } else {
                                    let imgUrl = this.post.ID + "/" + image.trim();
                                    this.imageList.push(imgUrl);
                                }
                            });
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
    goBack() {
        this.router.navigate(["/news"]);
    }
}
