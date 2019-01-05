import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'email-compose',
  templateUrl: './email-compose.component.html',
  styleUrls: ['./email-compose.component.scss']
})
export class EmailComposeComponent implements OnInit {
  public editor;
  public editorContent;
  public editorConfig = {
    placeholder: 'Put your things hear'
  };
  constructor() { }

  ngOnInit() {
  }
  onEditorBlured(quill) {
    console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', html);
  }
}
