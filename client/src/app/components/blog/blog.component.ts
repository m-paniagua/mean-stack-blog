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
  commentForm;
  processing: boolean = false;
  username: string;
  blogPosts: Array<object>;
  newComment = [];
  enabledComments = [];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private blogService: BlogService) {
    this.createNewBlogForm();
    this.createCommentForm();
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

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(1)
      ])]
    });
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable();
  }

  disableCommentForm() {
    this.commentForm.get('comment').disable();
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
    if (regExp.test(controls.value)) {
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
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmit(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
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
        this.getAllBlogs();
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

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe((data) => {
      this.blogPosts = data.blogs;
    })
  }

  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    })
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    })
  }

  postComment(id) {
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) {
        this.expand(id);
      }
    })
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe((profile) => {
        this.username = profile.user.username;
      })
    }

    this.getAllBlogs();
  }

}
