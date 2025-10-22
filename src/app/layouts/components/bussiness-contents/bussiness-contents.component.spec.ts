import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessContentsComponent } from './bussiness-contents.component';

describe('BussinessContentsComponent', () => {
    let component: BussinessContentsComponent;
    let fixture: ComponentFixture<BussinessContentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BussinessContentsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BussinessContentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
