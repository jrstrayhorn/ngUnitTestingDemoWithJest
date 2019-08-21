import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Hero } from './hero';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    // only need to mock the functions that are used by the service being
    // tested
    // HeroService only uses the add method of the messageService
    // JASMINE
    //mockMessageService = jasmine.createSpyObj(['add']);
    // JEST
    mockMessageService = {
      add: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService, { provide: MessageService, useValue: mockMessageService }]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    //let msgSvc = TestBed.get(MessageService); //one way to get service
    service = TestBed.get(HeroService);
  });

  describe('getHero', () => {
    // using longer inject way
    // it('should call get with the correct URL', inject([HeroService, HttpTestingController],
    //   (service: HeroService, controller: HttpTestingController) => {

    //     service.getHero(4).subscribe();
    // }))
    it('should call get with the correct URL', () => {
      service.getHero(4).subscribe((hero: Hero) => {
        expect(hero.id).toBe(3);
      });
      //service.getHero(3).subscribe();

      // this is doing our assertion - expect
      const req = httpTestingController.expectOne('api/heroes/4');
      // observable doesn't get a value until this line is called
      req.flush({ id: 4, name: 'SuperDude', strength: 100 });
      httpTestingController.verify();
    });
  });
});
