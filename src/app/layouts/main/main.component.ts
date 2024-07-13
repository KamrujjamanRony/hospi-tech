import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Input,
  Ripple,
  initTE,
} from "tw-elements";
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  Company$?: Observable<any[]>;
  Company: any[] = [];
  companyID: any;
  isAuthorized: boolean = false;          // to be false
  code: any = "";
  password: any = "";
  errCode: string = '';
  errPass: string = '';
  constructor(private authService: AuthService) {// Retrieve environment variable
    this.companyID = this.authService.getCompanyID();
    if (this.companyID) {
      this.isAuthorized = true
    }
    // get All Company
    if (!this.Company$) {
      this.Company$ = authService.getAllCompany();
      this.Company$.subscribe((data) => {
        this.Company = data;
      });
    }
  };
  ngOnInit() {
    initTE({ Input, Ripple }, { allowReinits: true });
    // Retrieve environment variable
    this.companyID = this.authService.getCompanyID();
  }

  onSubmitAuth(): void {
    this.errCode = "";
    this.errPass = "";
    if (this.code && this.password) {
      const company: any = this.Company.find(data => data.companyID == (environment.cCode + this.code));
      company ? this.authService.setCompanyID(company.companyID) : this.errCode = "Incorrect Company ID";
      if(company){
        company?.password === this.password ? this.isAuthorized = true : this.errPass = "Incorrect password";
      }
    } else if (this.code) {
      this.errPass = "Password Required";
    } else {
      this.errCode = "Company ID Required";
    }
  }
}
