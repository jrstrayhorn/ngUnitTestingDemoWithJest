import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    //service = new MessageService();
    // moving this to the it so full story is in the unit test
  });

  it('should have no messages to start', () => {
    //expect(service.messages).toStrictEqual([]);
    service = new MessageService();
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service = new MessageService();

    service.add('new message');

    expect(service.messages.length).toBe(1);
  });

  it('should clear all messages when clear is called', () => {
    service = new MessageService();
    service.add('new message');

    service.clear();

    expect(service.messages.length).toBe(0);
  });
});
