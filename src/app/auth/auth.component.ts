import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService,
              private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
      });

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
