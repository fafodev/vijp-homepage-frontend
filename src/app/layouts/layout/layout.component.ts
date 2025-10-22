import { Component, ElementRef, ViewChild } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { RouterLink } from '@angular/router';

import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { SidenavComponent } from '../components/sidenav/sidenav.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { QuickpanelComponent } from '../components/quickpanel/quickpanel.component';
import { ConfigPanelToggleComponent } from '../components/config-panel/config-panel-toggle/config-panel-toggle.component';
import { ConfigPanelComponent } from '../components/config-panel/config-panel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { SearchComponent } from '../components/toolbar/search/search.component';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { VexConfig, VexConfigName } from '@vex/config/vex-config.interface';
import { Store } from '@ngrx/store';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'vex-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    imports: [
        BaseLayoutComponent,
        NgIf,
        AsyncPipe,
        SidenavComponent,
        ToolbarComponent,
        FooterComponent,
        QuickpanelComponent,
        ConfigPanelToggleComponent,
        VexSidebarComponent,
        ConfigPanelComponent,
        MatDialogModule,
        MatSidenavModule,
        RouterOutlet,
        SearchComponent,
        VexProgressBarComponent,
        MatIconModule
    ],
    standalone: true
})
export class LayoutComponent {
    @ViewChild('customScrollContainer') customScrollContainer!: ElementRef;
    config$: Observable<VexConfig> = this.configService.config$;
    sidenavCollapsed$: Observable<boolean> = this.layoutService.sidenavCollapsed$;
    sidenavDisableClose$: Observable<boolean> = this.layoutService.isDesktop$;
    sidenavFixedInViewport$: Observable<boolean> =
        this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
    sidenavMode$: Observable<MatDrawerMode> = combineLatest([
        this.layoutService.isDesktop$,
        this.configService.select((config) => config.layout)
    ]).pipe(
        map(([isDesktop, layout]) =>
            !isDesktop || layout === 'vertical' ? 'over' : 'side'
        )
    );
    sidenavOpen$: Observable<boolean> = this.layoutService.sidenavOpen$;
    configPanelOpen$: Observable<boolean> = this.layoutService.configPanelOpen$;
    quickpanelOpen$: Observable<boolean> = this.layoutService.quickpanelOpen$;

    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;

    constructor(
        private readonly layoutService: VexLayoutService,
        private readonly configService: VexConfigService,
        private router: Router,
        private store: Store,
        private webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private appFunction: AppFunctionService,
        private splashScreenService: SplashScreenService
    ) {
        // k_trong set default themes
        this.configService.setConfig(VexConfigName.fafo)
    }

    onSidenavClosed(): void {
        this.layoutService.closeSidenav();
    }

    onQuickpanelClosed(): void {
        this.layoutService.closeQuickpanel();
    }

    linkToContact() {
        this.router.navigateByUrl("/contact");
    }
    linkToNews() {
        this.router.navigateByUrl("/news");
    }
    linkToAccessMap() {
        this.router.navigate(["/overview"], { fragment: 'access-map' });
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
        this.appFunction.getListFormItemNm("layout").subscribe({
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
