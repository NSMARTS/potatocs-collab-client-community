import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
// import { MediaObserver, MediaChange } from '@angular/flex-layout';
// import { Subscription } from 'rxjs';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
    // mediaSub: Subscription;
    public isNavbarOnTop: boolean;

    constructor(
        // public mediaObserver: MediaObserver
    ) {

    }

    ngOnInit(): void {
        // this.mediaSub = this.mediaObserver.media$.subscribe(
        //     (result: MediaChange) => {
        //         console.log(result.mqAlias);
        //     },
        // );

        this.isNavbarOnTop = true;
    }

    ngOnDestroy(): void {
        // this.mediaSub.unsubscribe();
    }

    /**
	 * scroll event ���
	 * https://stackoverflow.com/questions/41304968/how-to-get-on-scroll-events ����
	 * navbar�� ���� ���� ���� ���� ����� ����
	 * �Ʒ��� �������� ������ ������
	 */
	@HostListener('window:scroll', ['$event'])
	onScroll(ev) {
		if (window.scrollY === 0) {
			this.isNavbarOnTop = true;
		} else {
			this.isNavbarOnTop = false;
		}
	}
}
