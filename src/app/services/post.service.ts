
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PostService {

    private pageSize = new BehaviorSubject<any>(null);
    private pageIndex = new BehaviorSubject<any>(null);
    private postSource = new BehaviorSubject<any>(null);
    selectedPost$: Observable<any> = this.postSource.asObservable();

    constructor() { }

    setPost(post: any): void {
        this.postSource.next(post);
    }

    clearPost(): void {
        this.postSource.next(null);
    }

    setPageSize(pageSize: any) {
        this.pageSize.next(pageSize);
    }

    getPageSize() {
        return this.pageSize.value;
    }

    setPageIndex(pageIndex: any) {
        this.pageIndex.next(pageIndex);
    }

    getPageIndex() {
        return this.pageIndex.value;
    }
}