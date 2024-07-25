import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role:['']
    });
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.value.email == "admin.simplilearn@gmail.com") {
        this.registerForm.value.role = "admin";
    } else {
      this.registerForm.value.role = "student";
    }
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error)
          this.errorMessage = error.error || 'Something went wrong. Please try again.';
        }
      );
    }
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
