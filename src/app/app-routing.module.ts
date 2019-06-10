import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LearnComponent } from './learn/learn.component';
import { TaskComponent } from './learn/task/task.component';
import { ChapterComponent } from './learn/chapter/chapter.component';
import { ProgressComponent } from './learn/progress/progress.component';


const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'profile', component: UserProfileComponent},
  {path: 'learn', component: LearnComponent},
  {path: 'learn/chapters/:chapter/:task', component: TaskComponent},
  {path: 'learn/chapters/:chapter', component: ChapterComponent},
  {path: 'learn/progress', component: ProgressComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
