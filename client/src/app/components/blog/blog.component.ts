import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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

  ngOnInit() {
  }

}
