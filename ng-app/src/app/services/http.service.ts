import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  toggleGarageDoor(): Observable<any> {
    const url = this.configService.buildApiUrl('api', 'toggle-garage-door');
    return this.http.post<any>(url, null);
  }

  getGarageDoorStatus(): Observable<any> {
    const url = this.configService.buildApiUrl('api', 'garage-door-status');
    return this.http.get<any>(url);
  }
}
