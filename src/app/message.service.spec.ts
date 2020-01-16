import { MessageService } from './message.service';
import { FormBuilder } from '@angular/forms';

describe('MessageService', () => {
  let service: MessageService;

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(() => {
    //service = new MessageService();
    // moving this to the it so full story is in the unit test
  });

  it('should have no messages to start', () => {
    //expect(service.messages).toStrictEqual([]);
    service = new MessageService(formBuilder);
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service = new MessageService(formBuilder);

    service.add('new message');

    expect(service.messages.length).toBe(1);
  });

  it('should clear all messages when clear is called', () => {
    service = new MessageService(formBuilder);
    service.add('new message');

    service.clear();

    expect(service.messages.length).toBe(0);
  });

  it('should create a email form control when createFormGroup is called', () => {
    service = new MessageService(formBuilder);
    const formGroup = service.createFormGroup();
    expect(formGroup).not.toBeFalsy();

    expect(formGroup.get('email')).not.toBeFalsy();

    expect(formGroup.get('username')).not.toBeFalsy();
  })
});
