import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  message: string;
  messageClass: string;
  newPost: boolean = false;
  loadingBlogs: boolean = false;
  form: FormGroup;
  processing: boolean = false;
  username: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private blogService: BlogService) { 
    this.createNewBlogForm()
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  enableNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();    
  }

  disableNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();  
  }

  alphaNumericValidation(controls) {
    var regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)) {
      return null
    } else {
      return { 'alphaNumericValidation': true };
    }
  }

  newBlogForm() {
    this.newPost = true;
  }

  reloadBlogs() {
    this.loadingBlogs = true;

    // get all blogs
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }

  draftComment() {
    
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableNewBlogForm();
    
    var blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username,

    }

    this.blogService.newBlog(blog).subscribe((data) => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = "";
          this.form.reset();
          this.enableNewBlogForm();
        }, 2000)
      }
    });
  }

  goBack() {
    window.location.reload();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe((profile) => {
      this.username = profile.user.username;
    })
  }

}
