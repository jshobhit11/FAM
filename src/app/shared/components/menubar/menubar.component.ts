import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  isAdmin: boolean = false;
  isHelpDesk: boolean = false;

  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    const userRole = this.authorizationService.getUserRole();
    const userName = this.authorizationService.getUserName();

    const helpDeskUsers = [
      'JYOTI_ALAGAWADI',
      'PARVATHI_P',
      'AKHEELA_JAMAL',
      'RAGHAVENDRA_P1',
      'A_RAHMAN',
      'SAVITA_RAMPUR',
      'NIVEDITA_S',
      'SUHIL_V',
      'DEEPA_MUKENNVAR',
      'SHIVRAJ.D',
    ];

    this.isAdmin = userRole == 'ROLE_ADMIN';
    this.isHelpDesk = userRole == 'ROLE_HELPDESK' || helpDeskUsers.includes(userName);
  }
}
