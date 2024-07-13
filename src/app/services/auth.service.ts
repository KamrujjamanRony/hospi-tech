import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  // private companyID: any = "";

  // setCompanyID(value: any) {
  //   this.companyID = value;
  // }

  // getCompanyID() {
  //   return this.companyID;
  // }

  private localStorageKey = 'companyID';
  private companyID?: any;

  setCompanyID(value: any) {
    if (value.startsWith(environment.cCode)) {
      this.companyID = value;
    } else {
      this.companyID = environment.cCode + value;
    }
    
    // Save companyID to local storage
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.companyID));
  }

  getCompanyID() {
    // Retrieve companyID from local storage
    const storedCompanyID = localStorage.getItem(this.localStorageKey);
    return storedCompanyID ? JSON.parse(storedCompanyID) : null;
  }

  deleteCompanyID() {
    // Remove companyID from local storage
    localStorage.removeItem(this.localStorageKey);
  }

  addCompany(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.CompanyApi, model)
  }

  getAllCompany(): Observable<any[]> {
    return this.http.get<any[]>(environment.CompanyApi);
  }

  getCompanyByNameCode(): Observable<any[]> {
    return this.getAllCompany().pipe(
      map(company => company.filter(data => data.companyID.startsWith(environment.cCode)))
    );
  }

  getCompanyById(companyID: any): Observable<any[]> {
    return this.getAllCompany().pipe(
      map(company => company.filter(data => data.companyID == companyID))
    );
  }

  getCompany(id: string): Observable<any>{
    return this.http.get<any>(`${environment.CompanyApi}/GetCompanyNameById?id=${id}`);
  }

  updateCompany(id: string, updateCompanyRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.CompanyApi}/EditCompanyName/${id}`, updateCompanyRequest);
  }

  deleteCompany(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.CompanyApi}/DeleteCompanyName?id=${id}`);
  }
}
