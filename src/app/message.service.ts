import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable()
export class MessageService {

  constructor(private fb: FormBuilder) {}

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      'email': [],
      'password': [],
      'username': []
    });
  }
}
