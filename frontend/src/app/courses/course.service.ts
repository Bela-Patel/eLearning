import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'api/course';
 
  constructor(private http: HttpClient, 
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${this.authService.getToken()}`
    });
  }

  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl+this.apiUrl}`, { headers: this.getHeaders() });
  }

  getCourseById(courseId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl+this.apiUrl}/${courseId}`, { headers: this.getHeaders() });
  }

  addCourse(course: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl+this.apiUrl}/createCourse`, course, { headers: this.getHeaders() });
  }

  addVideo(courseId: string, video: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl+this.apiUrl}/${courseId}/videos`, video, { headers: this.getHeaders() });
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl+this.apiUrl}/${courseId}`, { headers: this.getHeaders() });
  }

  updateCourse(courseId: string, courseData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl+this.apiUrl}/${courseId}`, courseData, { headers: this.getHeaders() });
  }

  deleteVideo(courseId: string, videoId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl+this.apiUrl}/${courseId}/videos/${videoId}`, { headers: this.getHeaders() });
  }
}
