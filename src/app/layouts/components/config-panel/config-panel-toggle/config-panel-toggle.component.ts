import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FafoService } from '@vex/services/fafo.service';

@Component({
    selector: 'vex-config-panel-toggle',
    templateUrl: './config-panel-toggle.component.html',
    styleUrls: ['./config-panel-toggle.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class ConfigPanelToggleComponent implements OnInit {
    @Output() openConfig = new EventEmitter();

    constructor(private fafoService: FafoService) {

    }

    ngOnInit() { }


    scrollToTop() {
        this.fafoService.triggerScrollToTop()
    }

}
