import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MessagesPopups } from "@app/helpers/messagesPopups";

import { MaterialModule } from '@app/material.module';
import { CoreService } from '@app/services/core.service';
import { LoginService } from '@app/services/login.service'

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
  providers: [LoginService],
})

export class AppSideLoginComponent implements OnInit{

  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;
  alignhide = true;

  options = this.settings.getOptions();
  msg = '';
  constructor(
    private settings: CoreService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messagesPopups: MessagesPopups,
  ) {
    // redirect to home if already logged in
    if (this.loginService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  } 

  onSubmit() {
    this.submitted = true;

    // reset alert on submit
    this.error = '';

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.loginService.login(this.form.controls['username'].value, this.form.controls['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
          this.messagesPopups.popupMessage('Logged');
        },
        error: error => {
          console.log(error);
          this.messagesPopups.popupMessage(error);
          this.error = error;
          this.loading = false;
        }
    });
  }
}
