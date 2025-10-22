import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessIntroductionComponent } from './bussiness-introduction.component';

describe('BussinessIntroductionComponent', () => {
    let component: BussinessIntroductionComponent;
    let fixture: ComponentFixture<BussinessIntroductionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BussinessIntroductionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BussinessIntroductionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
