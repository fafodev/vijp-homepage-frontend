import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreenService } from './services/splash-screen.service';

@Component({
    selector: 'vex-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
    constructor(private splashScreenService: SplashScreenService) {
    }


    ngAfterViewInit() {
        this.splashScreenService.hide();
    }
}
