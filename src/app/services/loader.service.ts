// This service is used to show,hide or update the loader

import { Component, Injectable, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoggerFactory } from '../lib/logger-factory';

const logger = LoggerFactory.getLogger('LoaderService');

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private modalRef: BsModalRef | null = null;

  constructor(private modalService: BsModalService) {}

  private fixModalBackdropBackgroundIssue() {
    // this code fixes problem of showing black screen after closing modal
    // a css has been added for the same in base.css
    const backdropModels = document.getElementsByClassName('modal-backdrop');
    if (backdropModels.length) {
      backdropModels[0].classList.add('hide');
    }
  }

  private removeModalBackdropBackgroundHideClass() {
    // this code fixes problem of showing black screen after closing modal
    // a css has been added for the same in base.css
    const backdropModels = document.getElementsByClassName('modal-backdrop');
    if (backdropModels.length) {
      backdropModels[0].classList.remove('hide');
    }
  }

  public show(message: string = 'Loading...', showSpinner: boolean = true): void {
    this.removeModalBackdropBackgroundHideClass();

    if (this.modalRef !== null) {
      return;
    }

    this.modalRef = this.modalService.show(LoaderComponent, {
      backdrop: 'static',
      keyboard: false,
      animated: false,
      ignoreBackdropClick: true,
    });

    if (showSpinner) {
      this.showSpinner();
    }

    (this.modalRef.content as LoaderComponent).updateMessage(message);

    logger.info('Showing loader with message: ' + message);
  }

  public updateProgress(progress: number): void {
    if (this.modalRef !== null) {
      logger.info('Updating progress to ' + progress);
      (this.modalRef.content as LoaderComponent).updateProgress(progress);
    }
  }

  public hideProgress(): void {
    if (this.modalRef !== null) {
      logger.info('Hiding Progress');
      (this.modalRef.content as LoaderComponent).updateProgress(-1);
    }
  }

  public updateMessage(newMessage: string = 'Loading...'): void {
    if (this.modalRef !== null) {
      logger.info('Updating message to ' + newMessage);
      (this.modalRef.content as LoaderComponent).updateMessage(newMessage);
    }
  }

  public showSpinner() {
    if (this.modalRef !== null) {
      logger.info('Showing spinner');
      (this.modalRef.content as LoaderComponent).showSpinner();
    }
  }

  public hideSpinner() {
    if (this.modalRef !== null) {
      logger.info('Hiding spinner');
      (this.modalRef.content as LoaderComponent).hideSpinner();
    }
  }

  public hide(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.modalRef !== null) {
          logger.info('Hiding loader');
          this.fixModalBackdropBackgroundIssue();
          this.modalRef.hide();
          this.modalRef = null;
          this.removeModalBackdropBackgroundHideClass();
          resolve();
        }
      }, 250);
    });
  }

  public isLoaderShown(): boolean {
    return this.modalRef !== null;
  }
}

@Component({
  template: `
    <div class="modal-body" [ngClass]="{ 'has-spinner': spinner }">
      <div class="spinner" *ngIf="spinner">
        <img src="assets/spinner.gif" />
      </div>
      <div *ngIf="progressValue >= 0">
        <div class="progress">
          <div class="progress-bar" [ngStyle]="{ width: progressValue + '%' }">
            <div class="progress-value">{{ progressValue }}%</div>
          </div>
        </div>
      </div>
      <div class="message">{{ message }}</div>
    </div>
  `,
  styles: [
    '.spinner {margin: 10px auto;width: 50px;height: 40px;text-align: center;font-size: 10px;}',
    '.spinner > img {background-color: #333; width: 40px;}',
    '.has-spinner > .message {text-align:center;}',
    '.progress-title{font-size: 16px;font-weight: 700;color: #333;margin: 0 0 20px;}',
    '.progress{margin-top: 40px; height: 20px;background: #333;border-radius: 0;box-shadow: none;margin-bottom: 30px;overflow: visible;}',
    '.progress .progress-bar{background:#4286f4;position: relative;-webkit-animation: animate-positive 2s;animation: animate-positive 2s;}',
    '.progress .progress-value{display: block;font-size: 18px;font-weight: 500;color: #000;position: absolute;top: -30px;right: -13px;}',
    '.progress .progress-bar:after{content: "";display: inline-block;width: 10px;background: #fff;position: absolute;top: -10px;bottom: -10px;right: -5px;z-index: 1;transform: rotate(35deg);}',
  ],
})
export class LoaderComponent implements OnInit {
  message: string = '';
  spinner: boolean = false;
  showProgress: boolean = false;
  progressValue: number = -1;

  constructor(private bsModalRef: BsModalRef) {}

  public updateMessage(newMessage: string) {
    Promise.resolve(null).then(() => {
      this.message = newMessage;
    });
  }

  public showSpinner() {
    Promise.resolve(null).then(() => {
      this.spinner = true;
    });
  }

  public hideSpinner() {
    Promise.resolve(null).then(() => {
      this.spinner = false;
    });
  }

  public updateProgress(progress: number) {
    if (progress < 0 && progress !== -1) {
      this.progressValue = 0;
    } else if (progress > 100) {
      this.progressValue = 100;
    } else {
      this.progressValue = progress;
    }
  }

  ngOnInit() {
    this.message = 'Loading';
    this.spinner = true;
  }
}
