import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/shared/search.service.service';
const searchForm = new FormGroup({
  accountId: new FormControl('', [Validators.required, Validators.minLength(4)]),
  searchBy: new FormControl('', [Validators.required]),
  searchType: new FormControl('EQUALS', [Validators.required]),
});
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  searchForm: FormGroup = searchForm;
  placeholder: string = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router, private searchService: SearchService) {}

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm() {
    this.searchForm.patchValue(
      {
        accountId: '',
        searchBy: '',
        searchType: 'EQUALS',
      },
      {
        emitEvent: false,
      },
    );
  }

  search() {
    this.searchService.setAccountId(this.searchForm.get('accountId').value);
    this.toggle();
    this.router.navigate([
      '/main',
      'search-result',
      this.searchForm.get('accountId').value,
      this.searchForm.get('searchBy').value,
      this.searchForm.get('searchType').value,
    ]);
  }

  toggle() {
    this.toggleSidebar.emit();
  }

  onChangeSearchBy(val: string) {
    if (val == 'ACCOUNT_ID') {
      this.placeholder = 'Search by Account ID';
    } else if (val == 'ESTIMATION_NO') {
      this.placeholder = 'Search by Estimation No.';
    } else if (val == 'WORKORDER_NO') {
      this.placeholder = 'Search by Work Order No.';
    }else if (val == 'REFERENCE_NO') {
      this.placeholder = 'Search by Case ID';
    }
    else if (val == 'INDENT_NO') {
      this.placeholder = 'Search by Request No.';
    }
  }
}
