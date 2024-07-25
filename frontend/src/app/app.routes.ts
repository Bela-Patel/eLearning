import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CourseListComponent },
    { path: 'add-course', component: AddCourseComponent },
    { path: 'course-detail/:id', component: CourseDetailComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
