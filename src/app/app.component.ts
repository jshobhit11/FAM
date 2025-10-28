//import { Component } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Estimates';
}




// @Component({
//   selector: 'app-root',
//   // template: `
//   //   <div *ngIf="loading">Checking app version...</div>

//   // `

//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent implements OnInit {
//   loading = true;
//   appCode = 2;
//   currentVersion = 100001;

//   constructor(private versionService: VersionService, private router: Router) { }

//   ngOnInit() {
//     this.versionService.validateApp(this.appCode, this.currentVersion).subscribe((res: any) => {
//       if (res.status === 'success') {
//         console.log('Version matched');
//         this.router.navigate(['/auth/login']);
//       } else {
//         alert(res.body);
//       }
//       this.loading = false;
//     }, error => {
//       alert('Server not reachable. Please try again later.');
//       this.loading = false;
//     });
//   }
// }

// // export class AppComponent {
// //   loading = false;
// //   appCode: number | null = null;
// //   currentVersion: number | null = null;
// //   message: string = '';

// //   constructor(private versionService: VersionService, private router: Router) { }

// //   checkVersion() {
// //     if (!this.appCode || !this.currentVersion) {
// //       this.message = '⚠️ Please enter both App Code and Version.';
// //       return;
// //     }

// //     this.loading = true;
// //     this.message = 'Checking version...';

// //     this.versionService.validateApp(this.appCode, this.currentVersion).subscribe({
// //       next: (res: any) => {
// //         this.loading = false;
// //         if (res.status === 'success') {
// //           this.message = '✅ Version matched. Redirecting...';
// //           setTimeout(() => this.router.navigate(['/main']), 1000);
// //         } else {
// //           this.message = '❌ ' + res.body;
// //         }
// //       },
// //       error: (err) => {
// //         this.loading = false;
// //         this.message = '🚫 Server not reachable. Please try again later.';
// //         console.error(err);
// //       }
// //     });
// //   }
// // }