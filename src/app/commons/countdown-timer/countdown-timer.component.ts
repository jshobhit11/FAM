import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  // @Input() duration: number = 3600;
  // remainingTime: number;
  // private countdownTimerRef: any;
  constructor() {}
 // constructor(private router: Router) {}
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }
  // ngOnInit(): void {
  //   this.remainingTime = this.duration;
  //   this.startTimer();
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       this.resetTimer();
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.clearTimer();
  // }

  // private resetTimer(): void {
  //   this.remainingTime = this.duration;
  // }

  // private startTimer(): void {
  //   this.countdownTimerRef = setInterval(() => {
  //     if (this.remainingTime > 0) {
  //       this.remainingTime--;
  //     } else {
  //       this.remainingTime = 0;
  //       this.clearTimer();
  //       this.router.navigate(['/']);
  //     }
  //   }, 1000);
  // }

  // private clearTimer(): void {
  //   clearInterval(this.countdownTimerRef);
  // }

  // formatTime(time: number): string {
  //   const minutes: number = Math.floor(time / 60);
  //   const seconds: number = time % 60;
  //   const min = minutes < 10 ? `0${minutes}` : minutes;
  //   const sec = seconds < 10 ? `0${seconds}` : seconds;
  //   return `${min} : ${sec}`;
  // }
}
