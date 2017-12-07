import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  message: string;
  messageClass: string;
  processing: boolean = false;
  emailValid: boolean;
  emailMessage: string;
  usernameValid: boolean;
  usernameMessage: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm();

   }

  // add fields to form
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        this.validUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
        this.validPassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')})
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();    
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();   
  }

  validEmail(controls) {
    var regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validEmail': true };
    }
}

  validUsername(controls) {
    var regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validUsername': true };
    }
  }

  validPassword(controls) {
    var regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if(regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validPassword': true };
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true };
      }
    }
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();

    // create user object
    var user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    // post user account to server
    this.authService.registerUser(user).subscribe(data => {
      // set message and messageClass to display
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
      }
    })
  }

  checkUsername() {
    var username = this.form.get('username').value;

    if (username) {
      this.authService.checkUsername(username).subscribe(data => {
        if(!data.success) {
          this.usernameValid = false;
          this.usernameMessage = data.message;
        } else {
          this.usernameValid = true;
          this.usernameMessage = data.message;
        }
      }) 
    } 
    
  }

  checkEmail() {
    var email = this.form.get('email').value;

    if (email) {
      this.authService.checkEmail(email).subscribe(data => {
        if(!data.success) {
          this.emailValid = false;
          this.emailMessage = data.message;
        } else {
          this.emailValid = true;
          this.emailMessage = data.message;
        }
      })
    }
  }

  ngOnInit() {
  }

}
