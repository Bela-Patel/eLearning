import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent {
  errorMessage: string;
  courseForm!: FormGroup;
  submitted: boolean = false;

  constructor(private courseService: CourseService, private router: Router, private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: [null, [Validators.required]]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.courseForm.patchValue({
        video: file
      });
    }
  }

  addCourse() {
    this.submitted = true;
    if (this.courseForm.valid) {
      const formData = new FormData();
      formData.append('title', this.courseForm.get('title').value)
      formData.append('description', this.courseForm.get('description').value)
      formData.append('video', this.courseForm.get('video').value);
      this.courseService.addCourse(formData).subscribe(() => {
        this.router.navigate(['/courses']);
      });
    }
  }

  allCourses(): void {
    this.router.navigate(['/courses']);
  }
}
