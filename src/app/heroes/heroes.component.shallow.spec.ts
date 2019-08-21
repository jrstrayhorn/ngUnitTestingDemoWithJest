import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';

// we don't want to use the real HeroService b/c it makes HTTP calls
// and b/c we only want to test one unit at a time so we need to draw
// boundaries around this unit test by creating mocks
describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'SpiderDude', strength: 8 }, { id: 2, name: 'Wonderful Woman', strength: 24 }, { id: 3, name: 'SuperDude', strength: 55 }];
    // JASMINE
    //mockHeroService = Jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    // JEST
    mockHeroService = {
      getHeroes: jest.fn(),
      addHero: jest.fn(),
      deleteHero: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignoring the child componenent here
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    // JASMINE
    //mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // JEST
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));

    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });
});
