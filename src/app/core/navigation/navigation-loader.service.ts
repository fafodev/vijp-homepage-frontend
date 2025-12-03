import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationLoaderService {
    private readonly _items: BehaviorSubject<NavigationItem[]> =
        new BehaviorSubject<NavigationItem[]>([]);

    get items$(): Observable<NavigationItem[]> {
        return this._items.asObservable();
    }

    set items(items: NavigationItem[]) {
        this._items.next(items);
    }

    constructor(private readonly layoutService: VexLayoutService) {
        this.loadNavigation();
    }

    loadNavigation(): void {
        this._items.next([
            {
                type: 'link',
                label: '会社案内',
                label2: 'About Us',
                route: () => this.scrollToHome(),
            },
            {
                type: 'link',
                label: '留学生支援事業',
                label2: 'Student Support Business',
                route: () => this.scrollToCard1(),
            },
            {
                type: 'link',
                label: '不動産事業',
                label2: 'Real Estate Business',
                route: () => this.scrollToCard2(),
            },
            {
                type: 'link',
                label: '人材紹介事業',
                label2: 'Recruitment Services',
                route: () => this.scrollToCard3(),
            },
            {
                type: 'link',
                label: '通信関係及び生活支援事業',
                label2: 'Telecommunication and Lifestyle Support Services',
                route: () => this.scrollToCard4(),
            }
        ]);
    }

    

    scrollToHome(): void {
        const el = document.getElementById('about');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    scrollToCard1(): void {
        const el = document.getElementById('card1');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    scrollToCard2(): void {
        const el = document.getElementById('card2');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    scrollToCard3(): void {
        const el = document.getElementById('card3');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    scrollToCard4(): void {
        const el = document.getElementById('card4');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    
}
