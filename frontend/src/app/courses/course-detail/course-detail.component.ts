import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  course: any = [];
  videoForm: FormGroup;
  submitted: boolean;
  isEditing = false;
  courseForm: FormGroup;
  role: string = sessionStorage.getItem('role');
  constructor(
    private route: ActivatedRoute, 
    private courseService: CourseService, 
    private fb: FormBuilder, 
    private router: Router) 
    {
    this.videoForm = this.fb.group({
      video: [null, [Validators.required]]
    });
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    this.courseService.getCourseById(courseId).subscribe(data => {
      this.course = data;
      this.courseForm.patchValue({
        title: this.course.title,
        description: this.course.description,
      });

    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.videoForm.patchValue({
        video: file
      });
    }
  }

  addVideo(): void {
    this.submitted = true;
    if (this.videoForm.valid) {
      const courseId = this.route.snapshot.paramMap.get('id');
      const formData = new FormData();
      formData.append('video', this.videoForm.get('video').value);
      this.courseService.addVideo(courseId, formData).subscribe(() => {
        this.loadCourse();
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateCourse(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    console.log(this.courseForm.value)
    this.courseService.updateCourse(courseId, this.courseForm.value).subscribe(updatedCourse => {
      this.loadCourse();
      this.isEditing = false;
    });
  }

  getVideoUrl(filePath: string): string {
    return `${environment.apiUrl}${filePath}`;
  }

  deleteVideo(videoId: string) {
    const courseId = this.route.snapshot.paramMap.get('id');
    this.courseService.deleteVideo(courseId, videoId).subscribe(message => {
      this.loadCourse()
    });
  }

  allCourses(): void {
    this.router.navigate(['/courses']);
  }
}
