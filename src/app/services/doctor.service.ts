import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  addDoctor(model: any | FormData): Observable<void>{
    return this.http.post<void>(environment.DoctorApi, model)
  }

  getAllDoctors(): Observable<any[]> {
    return this.http.get<any[]>(environment.DoctorApi);
  }

  getCompanyDoctors(companyID: any): Observable<any[]> {
    return this.getAllDoctors().pipe(
      map(doctors => doctors.filter(data => data.companyID == companyID))
    );
  }

  getDoctor(id: string): Observable<any>{
    return this.http.get<any>(`${environment.DoctorApi}/GetRefDrById?id=${id}`);
  }

  updateDoctor(id: string, updateDoctorRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.DoctorApi}/EditRefDr/${id}`, updateDoctorRequest);
  }

  deleteDoctor(id: string): Observable<any>{
    return this.http.delete<any>(`${environment.DoctorApi}/DeleteRefDr?id=${id}`);
  }
}
