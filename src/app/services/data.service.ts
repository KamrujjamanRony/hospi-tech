import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '../../assets/data.json';

  constructor(private http: HttpClient) { }

  // Method to fetch JSON data with cache disabled
  getJsonData(): Observable<any> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    });
    const params = new HttpParams().set('cacheBuster', Date.now().toString());

    return this.http.get<any>(this.jsonUrl, { headers, params });
  }
}
