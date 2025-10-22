import { ChangeDetectorRef, Component } from '@angular/core';
import {
    FormControl,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { NgIf } from '@angular/common';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FafoService } from '@vex/services/fafo.service';

@Component({
    selector: 'vex-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    animations: [fadeInUp400ms, scaleFadeIn500ms],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatCheckboxModule,
        NgIf,
        RecaptchaV3Module
    ]
})
export class ContactComponent {
    listFormItemNm: any = [];
    formItemNmLoaded = false;
    currentLanguage$: Observable<string> | undefined;
    infoSended = false;

    form: UntypedFormGroup = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, this.emailValidator.bind(this)]],
        message: ['', [Validators.required]]
    });

    emailValidator(control: FormControl): ValidationErrors | null {
        return this.isEmailValid(control.value) ? null : { invalidEmail: true };
    }

    phoneNumberValidator(control: FormControl): ValidationErrors | null {
        return this.isPhoneNumberValid(control.value) ? null : { invalidPhoneNumber: true };
    }

    isEmailValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
            ;
    }
    isPhoneNumberValid(phoneNumber: string): boolean {
        // Định dạng số điện thoại Nhật Bản
        const jpPhoneRegex = /^(\+81|0)(\d{1,4})(\d{1,4})(\d{4})$/;
        // Định dạng số điện thoại Việt Nam
        const vnPhoneRegex = /^(\+84|0)(3|5|7|8|9)(\d{8})$/;

        return jpPhoneRegex.test(phoneNumber) || vnPhoneRegex.test(phoneNumber);
    }

    inputType = 'password';
    visible = false;

    constructor(
        private router: Router,
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private appFunction: AppFunctionService,
        private splashScreenService: SplashScreenService,
        private store: Store,
        private webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private snackBar: MatSnackBar,
        private fafoService: FafoService
    ) { }

    ngOnInit(): void {
        // Theo dõi sự thay đổi của language
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);

        this.currentLanguage$.subscribe(language => {
            this.fnGetFormItemNm();
        });
    }

    send() {
        this.recaptchaV3Service.execute('sendContact')
            .subscribe((token) => {
                if (token != null && token != undefined && token.includes("Invalid site key")) {
                    token = "Captcha error";
                }

                if (this.form.valid) {
                    this.callRegistInfo(token).subscribe({
                        next: (successful: any) => {
                            if (successful == "1") {
                                this.fafoService.triggerScrollToTop();
                                this.infoSended = true;
                            } else {
                                this.infoSended = false;
                                this.snackBar.open(this.listFormItemNm[11], 'Close', {
                                    duration: 3000,
                                    verticalPosition: 'top',
                                    horizontalPosition: 'right',
                                });
                            }
                        },
                        error: (error: any) => {
                            console.error('Đã xảy ra lỗi khi tải danh sách:', error);
                        },
                    });
                }
            });
    }

    callRegistInfo(token: string) {
        const request = {
            accessInfo: this.accessInfo.getAll(),
            name: this.form.get('name')?.value,
            email: this.form.get('email')?.value,
            message: this.form.get('message')?.value,
            token: token
        };

        return this.webService.callWs('registinfo', request).pipe(
            map((data: any) => {
                if (data && data.successful) {
                    return data.successful;
                }
            }),
            catchError((error) => {
                console.error('Lỗi xảy ra:', error);
                return of([]); // Trả về một danh sách rỗng nếu có lỗi
            })
        );
    }

    toggleVisibility() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
            this.cd.markForCheck();
        } else {
            this.inputType = 'text';
            this.visible = true;
            this.cd.markForCheck();
        }
    }

    fnGetFormItemNm() {
        this.formItemNmLoaded = false;
        this.appFunction.getListFormItemNm("contact").subscribe({
            next: (listFormItemNm: any) => {
                if (listFormItemNm) {
                    this.listFormItemNm = listFormItemNm;
                    this.formItemNmLoaded = true;
                    this.splashScreenService.hide();
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
