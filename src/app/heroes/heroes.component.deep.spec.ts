import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';

// Deep Integrated Tests - using Angular to render component (can dig into template)
// Also want to test interaction between parent and child component

// we don't want to use the real HeroService b/c it makes HTTP calls
// and b/c we only want to test one unit at a time so we need to draw
// boundaries around this unit test by creating mocks
describe('HeroesComponent (deep tests)', () => {
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
      declarations: [HeroesComponent, HeroComponent],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  // good way to start test to make sure test setup in beforeEach is working
  // it('should be true', () => {
  //   expect(true).toBe(true);
  // });

  // test that input is being passed into the child component correctly
  it('should render each hero as a HeroComponent', () => {
    // JASMINE
    //mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // JEST
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    // better way to find child components (stongly typed)
    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentDEs.length).toEqual(3);
    heroComponentDEs.forEach((componentDE, idx) => {
      expect((componentDE.componentInstance as HeroComponent).hero).toEqual(HEROES[idx]);
    });
  });
});
