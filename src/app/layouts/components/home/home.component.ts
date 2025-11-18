import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import {
    CarouselCaptionComponent,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ThemeDirective
} from '@coreui/angular';
import { ReactiveFormsModule, FormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { scaleFadeIn500ms } from '@vex/animations/scale-fade-in.animation';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WebServiceService } from 'src/app/services/web-service.service';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { AppFunctionService } from 'src/app/services/app-function.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PostService } from 'src/app/services/post.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
// @ts-ignore
import * as AOS from 'aos';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { FafoService } from '@vex/services/fafo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ServiceItem {
    id: string;
    icon?: string; // optional mat-icon name or svg
    img: string;
    title_vi: string;
    title_jp: string;
    desc_vi: string;
    desc_jp: string;
}
@Component({
    selector: 'vex-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    animations: [scaleFadeIn500ms],
    imports: [RecaptchaV3Module, RouterModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatOptionModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatButtonModule, MatIconModule, CommonModule, ThemeDirective, CarouselComponent, CarouselIndicatorsComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselCaptionComponent, CarouselControlComponent]
})
export class HomeComponent {
    constructor(
        private store: Store,
        private loader: LoadingBarService,
        private webService: WebServiceService,
        private readonly accessInfo: AccessInfoService,
        private appFunction: AppFunctionService,
        private paginator: MatPaginatorIntl,
        private router: Router,
        private postService: PostService,
        private fb: FormBuilder,
        private recaptchaV3Service: ReCaptchaV3Service,
        private scrollDispatcher: ScrollDispatcher,
        private snackBar: MatSnackBar,
        private fafoService: FafoService) {

        this.partnerForm = this.fb.group({
            companyName: ['', Validators.required],
            contactPerson: ['', Validators.required],
            email: ['', [Validators.required, this.emailValidator.bind(this)]],
            cooperationType: ['', Validators.required],
            message: ['', Validators.required]
        });

        this.inquiryForm = this.fb.group({
            name: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', [Validators.required, this.emailValidator.bind(this)]],
            inquiryType: ['', Validators.required],
            message: ['', Validators.required]
        });

        AOS.init({
            duration: 800,     // thời gian animation (ms)
            offset: 100,       // khoảng cách bắt đầu hiệu ứng
            once: true,        // chỉ chạy 1 lần khi scroll xuống
            easing: 'ease-in-out'
        });
    }

    emailValidator(control: FormControl): ValidationErrors | null {
        return this.isEmailValid(control.value) ? null : { invalidEmail: true };
    }

    isEmailValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
            ;
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        // Lắng nghe sự kiện scroll của CDK
        this.scrollDispatcher.scrolled().subscribe(() => {
            AOS.refresh();
        });
    }

    // Palette từ logo
    primary = '#C8102E';
    accent = '#F4A300';

    services: ServiceItem[] = [
        {
            id: 'study',
            icon: 'school',
            img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80&auto=format&fit=crop',
            title_vi: 'Hỗ trợ du học sinh',
            title_jp: '留学生支援',
            desc_vi: 'Đón sân bay, nhập cảnh, thủ tục cư trú, SIM, ngân hàng, tìm nhà, việc làm thêm.',
            desc_jp: '空港対応・入国手続き・在留手続き・SIM・銀行・住まい探し・アルバイト支援。'
        },
        {
            id: 'realestate',
            icon: 'home',
            img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80&auto=format&fit=crop',
            title_vi: 'Bất động sản',
            title_jp: '不動産サポート',
            desc_vi: 'Giới thiệu, ký hợp đồng và quản lý nhà ở / ký túc xá.',
            desc_jp: '物件紹介・契約・管理（寮・賃貸）。'
        },
        {
            id: 'parttime',
            icon: 'work',
            img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80&auto=format&fit=crop',
            title_vi: 'Việc làm thêm',
            title_jp: 'アルバイト紹介',
            desc_vi: 'Giới thiệu việc part-time phù hợp, hỗ trợ phiên dịch khi phỏng vấn.',
            desc_jp: '留学生向けアルバイト紹介・面接通訳。'
        },
        {
            id: 'career',
            icon: 'business_center',
            img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1400&q=80&auto=format&fit=crop',
            title_vi: 'Việc làm chính thức',
            title_jp: '就職 (Shūshoku)',
            desc_vi: 'Hỗ trợ tìm việc sau tốt nghiệp, chuẩn bị hồ sơ, phỏng vấn.',
            desc_jp: '卒業後の就職支援・書類・面接対策。'
        },
        {
            id: 'sim',
            icon: 'smartphone',
            img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80&auto=format&fit=crop',
            title_vi: 'SIM & Dịch vụ cuộc sống',
            title_jp: 'SIM・生活サポート',
            desc_vi: 'Đăng ký SIM, Internet, thẻ ngân hàng, dịch thuật hồ sơ, hướng dẫn cuộc sống.',
            desc_jp: 'SIM・インターネット・銀行口座・翻訳・生活ガイド。'
        }
    ];

    goContact() {
        this.router.navigate(['/contact']);
    }

    // Nếu cần hành động khi click service card
    openService(id: string) {
        // cho demo hiện popup console
        console.log('Open service', id);
    }

    partnerForm: FormGroup;
    onSubmitPartnerForm() {

        this.recaptchaV3Service.execute('sendContact')
            .subscribe((token) => {
                if (token != null && token != undefined && token.includes("Invalid site key")) {
                    token = "Captcha error";
                }

                if (this.partnerForm.valid) {
                    this.callRegistPartnerRequest(token).subscribe({
                        next: (successful: any) => {
                            if (successful == "1") {
                                this.partnerForm.reset();
                                this.snackBar.open("Send information successful", 'Close', {
                                    duration: 3000,
                                    verticalPosition: 'top',
                                    horizontalPosition: 'right',
                                });
                                this.fafoService.triggerScrollToTop();
                            } else {
                                this.snackBar.open("Send information failed", 'Close', {
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

    callRegistPartnerRequest(token: string) {
        const request = {
            accessInfo: this.accessInfo.getAll(),
            companyName: this.partnerForm.get('companyName')?.value,
            contactPerson: this.partnerForm.get('contactPerson')?.value,
            message: this.partnerForm.get('message')?.value,
            email: this.partnerForm.get('email')?.value,
            cooperationType: this.partnerForm.get('cooperationType')?.value,
            token: token
        };

        return this.webService.callWs('partnerRequest', request).pipe(
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

    inquiryForm: FormGroup;
    onSubmitInquiryForm() {

        this.recaptchaV3Service.execute('sendContact')
            .subscribe((token) => {
                if (token != null && token != undefined && token.includes("Invalid site key")) {
                    token = "Captcha error";
                }

                if (this.inquiryForm.valid) {
                    this.callRegistInquiryRequest(token).subscribe({
                        next: (successful: any) => {
                            if (successful == "1") {
                                this.inquiryForm.reset();
                                this.snackBar.open("Send information successful", 'Close', {
                                    duration: 3000,
                                    verticalPosition: 'top',
                                    horizontalPosition: 'right',
                                });
                                this.fafoService.triggerScrollToTop();
                            } else {
                                this.snackBar.open("Send information failed", 'Close', {
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

    callRegistInquiryRequest(token: string) {
        const request = {
            accessInfo: this.accessInfo.getAll(),
            name: this.inquiryForm.get('name')?.value,
            phone: this.inquiryForm.get('phone')?.value,
            message: this.inquiryForm.get('message')?.value,
            email: this.inquiryForm.get('email')?.value,
            inquiryType: this.inquiryForm.get('inquiryType')?.value,
            token: token
        };

        return this.webService.callWs('sendInfoRequest', request).pipe(
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

    phoneNumberValidator(control: FormControl): ValidationErrors | null {
        return this.isPhoneNumberValid(control.value) ? null : { invalidPhoneNumber: true };
    }

    isPhoneNumberValid(phoneNumber: string): boolean {
        // Định dạng số điện thoại Nhật Bản
        const jpPhoneRegex = /^(\+81|0)(\d{1,4})(\d{1,4})(\d{4})$/;
        // Định dạng số điện thoại Việt Nam
        const vnPhoneRegex = /^(\+84|0)(3|5|7|8|9)(\d{8})$/;

        return jpPhoneRegex.test(phoneNumber) || vnPhoneRegex.test(phoneNumber);
    }

    partnerLogos: string[] = [
        'https://cdn-icons-png.flaticon.com/512/5968/5968267.png', // Toyota
        'https://cdn-icons-png.flaticon.com/512/5969/5969053.png', // Honda
        'https://cdn-icons-png.flaticon.com/512/5968/5968997.png', // Sony
        'https://cdn-icons-png.flaticon.com/512/5968/5968975.png', // Panasonic
        'https://cdn-icons-png.flaticon.com/512/5969/5969052.png', // Mitsubishi
        'https://cdn-icons-png.flaticon.com/512/882/882747.png',   // Rakuten
        'https://cdn-icons-png.flaticon.com/512/5969/5969027.png', // Softbank
        'https://cdn-icons-png.flaticon.com/512/882/882702.png',   // Japan Airlines
        'https://cdn-icons-png.flaticon.com/512/882/882748.png',   // Fujitsu
        'https://cdn-icons-png.flaticon.com/512/882/882732.png',   // Dentsu
        'https://cdn-icons-png.flaticon.com/512/882/882726.png',   // NEC
        'https://cdn-icons-png.flaticon.com/512/882/882724.png'    // Toshiba
    ];

    newsList = [
        {
            titleEn: 'New Scholarship Program for Vietnamese Students 2025',
            titleJp: 'ベトナム人留学生向け奨学金プログラム2025開始',
            description: 'VIJP has partnered with Japanese universities to launch a new scholarship initiative supporting outstanding Vietnamese students in Japan.',
            date: new Date('2025-10-05'),
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
            slug: 'vietnamese-scholarship-2025'
        },
        {
            titleEn: 'Cooperation Agreement with Tokyo Real Estate Group',
            titleJp: '東京不動産グループとの業務提携を締結',
            description: 'VIJP expands housing support network for international students by collaborating with Tokyo Real Estate Group.',
            date: new Date('2025-09-22'),
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
            slug: 'tokyo-real-estate-cooperation'
        },
        {
            titleEn: 'Career Orientation Seminar Held in Osaka',
            titleJp: '大阪でキャリアセミナーを開催',
            description: 'More than 100 students participated in the career guidance seminar organized by VIJP and local recruitment partners in Osaka.',
            date: new Date('2025-08-18'),
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80',
            slug: 'osaka-career-seminar'
        }
    ];

    albumCategories = [
        { key: 'students', name: 'Học sinh nhập cảnh / 留学生入国' },
        { key: 'partnerships', name: 'Lễ hợp tác / 協力セレモニー' },
        { key: 'activities', name: 'Hoạt động tại VN & JP / 活動風景' },
        { key: 'office', name: 'Văn phòng & đội ngũ / オフィス・スタッフ' }
    ];

    activeAlbum = 'students';

    galleryImages: { [key: string]: string[] } = {
        students: [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
            'https://images.unsplash.com/photo-1558021211-6d1403321394?w=900&q=80',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
            'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=900&q=80',
            'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?w=900&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80'
        ],
        partnerships: [
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80',
            'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=900&q=80',
            'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?w=900&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80'
        ],
        activities: [
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80'
        ],
        office: [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
            'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=900&q=80',
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80',
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80'
        ]
    };

    scrollToContact(): void {
        const el = document.getElementById('contact');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
