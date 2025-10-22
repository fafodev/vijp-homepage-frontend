import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'vex-pdfviewer',
    standalone: true,
    imports: [],
    templateUrl: './pdfviewer.component.html',
    styleUrl: './pdfviewer.component.scss'
})
export class PdfviewerComponent {
    pdfSafeSrc: SafeResourceUrl;

    constructor(
        public dialogRef: MatDialogRef<PdfviewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string },
        private sanitizer: DomSanitizer
    ) {
        // Sử dụng DomSanitizer để xử lý URL an toàn
        this.pdfSafeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(data.pdfUrl);
    }

    close(): void {
        this.dialogRef.close();
    }
}
