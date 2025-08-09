import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  Validation,
  Input,
  initTE,
  Datepicker,
  Select,
  Modal,
  Collapse,
} from 'tw-elements';
import { MainUIService } from '../../services/main-ui.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-test-count',
  imports: [CommonModule, FormsModule],
  templateUrl: './test-count.component.html',
  styleUrl: './test-count.component.css'
})
export class TestCountComponent implements OnInit, OnDestroy {
  modelTestCount: any;
  companies$?: Observable<any[]>;
  rest: any[] = [];
  companies: any[] = [];
  testCountSubscription?: Subscription;

  constructor(private mainUIService: MainUIService, private authService: AuthService) {
    this.resetTestCountForm();
  }

  ngOnInit(): void {
    initTE(
      { Validation, Input, Datepicker, Select, Modal, Collapse },
      { allowReinits: true }
    );

    // disable future date
    const FromDate = document.getElementById('FromDate-disable-future');
    new Datepicker(FromDate, { disableFuture: true });

    const ToDate = document.getElementById('ToDate-disable-future');
    new Datepicker(ToDate, { disableFuture: true });
  }

  onTestCountFormSubmit(): void {
    if (this.modelTestCount.FromDate && this.modelTestCount.ToDate) {
      const countData = new FormData();
      countData.append('FromDate', this.modelTestCount.FromDate);
      countData.append('ToDate', this.modelTestCount.ToDate);

      this.testCountSubscription = this.mainUIService
        .companyWiseTest(countData)
        .subscribe({
          next: (data) => {
            this.rest = [];
            this.companies$ = this.authService.getAllCompany();
            this.companies$.subscribe((companies) => {
              companies.forEach((c) => {
                const matchingData = data.find((d: any) => d.companyID === c.companyID);
                if (matchingData) {
                  this.rest.push({
                    id: c.companyID,
                    name: c.name,
                    count: matchingData.total
                  });
                }
              });
              // Filter companies based on environment.cCode
              this.companies = this.rest.filter((c) =>
                c.id.startsWith(environment.cCode)
              );
            });
          },
        });
    }
  }

  resetTestCountForm(): void {
    this.modelTestCount = {
      FromDate: '',
      ToDate: '',
    };
    this.resetCompanies();
  }

  resetCompanies(): void {
    this.companies = [];
  }

  ngOnDestroy(): void {
    this.testCountSubscription?.unsubscribe();
  }
}