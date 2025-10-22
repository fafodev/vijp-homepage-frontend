import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    valueChangesSubject = new BehaviorSubject<string>('');
    valueChanges$ = this.valueChangesSubject.asObservable();

    submitSubject = new Subject<string>();
    submit$ = this.submitSubject.asObservable();

    isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    // BehaviorSubject để lưu search results
    private searchResultSubject = new BehaviorSubject<any[]>([]); // Default là mảng rỗng
    searchResult$ = this.searchResultSubject.asObservable(); // Observable để lắng nghe thay đổi

    // Hàm để set thông tin search result
    setSearchResult(searchResult: any[]): void {
        if (!Array.isArray(searchResult)) {
            console.warn('searchResult should be an array, resetting to an empty array');
            this.searchResultSubject.next([]);
        } else {
            this.searchResultSubject.next(searchResult);
        }
    }

    // Hàm để get thông tin search result
    getSearchResult(): any[] {
        return this.searchResultSubject.value; // Lấy giá trị hiện tại từ BehaviorSubject
    }

    constructor() { }
}
