import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Validation,
  Input,
  initTE,
  Datepicker,
  Select,
  Modal,
  Collapse,
} from 'tw-elements';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit, OnDestroy {
  modelCompany: any;
  editCompanyId!: string | undefined;
  companies$?: Observable<any[]>;
  originalCompanies: any[] = [];
  companies: any[] = [];
  addCompanySubscription?: Subscription;
  editCompanySubscription?: Subscription;
  // deleteCompanySubscription?: Subscription;

  constructor( private authService: AuthService ) {
    // Initialize modelCompany properties
    this.resetCompanyForm();

    // get All Company
    if (!this.companies$) {
      this.companies$ = authService.getAllCompany();
      this.companies$.subscribe((companies) => {
        if (companies) {
          this.companies = companies?.filter(company => company?.companyID.startsWith(environment.cCode));
        }
      });
    }
  }
  ngOnInit(): void {
    initTE(
      { Validation, Input, Datepicker, Select, Modal, Collapse },
      { allowReinits: true }
    );
  }

  //============================= Company =============================

  // Add & Update Company
  onCompanyFormSubmit(): void {
    const companyData = new FormData();
    if (this.modelCompany.companyID.startsWith(environment.cCode)) {
      companyData.append('CompanyID', this.modelCompany.companyID);
    } else {
      companyData.append('CompanyID', environment.cCode + this.modelCompany.companyID);
    }
    companyData.append('Name', this.modelCompany.name);
    companyData.append('Password', this.modelCompany.password);
    if (this.editCompanyId) {
      this.editCompanySubscription = this.authService
        .updateCompany(this.editCompanyId, companyData)
        .subscribe({
          next: () => {
            this.companies$ = this.authService.getCompanyByNameCode();
            this.companies$.subscribe((companies) => {
              if (companies) {
                this.originalCompanies = companies;
                this.companies = companies;
              }
            });
            this.editCompanyId = undefined;
            this.resetCompanyForm();
          },
        });
    } else {
      this.addCompanySubscription = this.authService
        .addCompany(companyData)
        .subscribe({
          next: () => {
            this.companies$ = this.authService.getCompanyByNameCode();
            this.companies$.subscribe((companies) => {
              if (companies) {
                this.originalCompanies = companies;
                this.companies = companies;
              }
            });
            this.resetCompanyForm();
          }
        });
    }
  }

  // Edit Company
  onEditCompany(id: string): void {
    this.editCompanySubscription = this.authService
      .getCompany(id)
      .subscribe({
        next: (response) => {
          this.modelCompany.companyID = response.companyID.replace(environment.cCode, '');
          this.modelCompany.name = response.name;
          this.modelCompany.password = response.password;
          this.editCompanyId = id;
        },
      });
  }

  // Delete Company
  // onDeleteCompany(id: string): void {
  //   this.deleteCompanySubscription = this.authService
  //     .deleteCompany(id)
  //     .subscribe({
  //       next: () => {
  //         this.companies$ = this.authService.getAllCompany();
  //         this.companies$.subscribe((companies) => {
  //           if (companies) {
  //             this.originalCompanies = companies;
  //             this.companies = companies;
  //             console.log(this.companies)
  //           }
  //         });
  //       },
  //     });
  // }

  // Reset Company Form
  resetCompanyForm(): void {
    this.editCompanyId = undefined;
    this.modelCompany = {
      companyID: '',
      name: '',
      password: '',
    };
  }

   //============================= Destroy All Subscription =============================
   ngOnDestroy(): void {
    this.addCompanySubscription?.unsubscribe();
    this.editCompanySubscription?.unsubscribe();
    // this.deleteCompanySubscription?.unsubscribe();
  }

}
