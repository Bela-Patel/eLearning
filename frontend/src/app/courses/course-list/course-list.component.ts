import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  courses: any[];
  errorMessage: string;
  role : string = sessionStorage.getItem('role');
  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((data: any[]) => {
      this.courses = data;
    }, error => {
      this.errorMessage = error.error.error || 'Something went wrong. Please try again.';
    }
    );
  }

  deleteCourse(courseId: string): void {
    this.courseService.deleteCourse(courseId).subscribe(response => {
      alert(response.message);
      this.courses = this.courses.filter(course => course._id !== courseId);
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);

  }
}
