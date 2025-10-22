import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SplashScreenService {
    private splashScreenId = 'vex-splash-screen';

    /**
     * Hiển thị splash screen
     */
    show(): void {
        const splashScreen = document.getElementById(this.splashScreenId);
        if (splashScreen) {
            splashScreen.style.display = 'flex';
            splashScreen.style.opacity = '1';
        }
    }

    /**
     * Ẩn splash screen
     */
    hide(): void {
        const splashScreen = document.getElementById(this.splashScreenId);
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 100); // Thời gian cho hiệu ứng mờ dần
        }
    }
}