import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA, Component, Input, Directive } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';

// write stubs to test built in directives
@Directive({
  selector: '[routerLink]',
  host: {
    '(click)': 'onClick()'
  } // list to the click event of the parent, when it happens
  // call onClick
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

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
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService
        }
      ]
      //schemas: [NO_ERRORS_SCHEMA]
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

  it(`should call delete (from parent) when the Hero Component's (child)
   delete button is clicked`, () => {
    // JASMINE - find the method on the component and 'watch' to see if it gets called
    //spyOn(fixture.componentInstance, 'delete');
    // JEST
    // important!! - by default.. jest.spyOn does not override the implementation
    // this is the opposite of jasmine.spyOn which will watch/spy but not call the method
    // if you don't want to call through, you have to mock the implementation
    // in this case we DONT want to actually call the implementation of the delete
    // method on heroes component, we're just testing to make sure that delete method
    // on the heroes is being called with correct parameter
    // so need to mock implementation
    jest.spyOn(fixture.componentInstance, 'delete').mockImplementation(() => {});

    // JASMINE
    //mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // JEST
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));

    fixture.detectChanges();

    // a component is a subclass of a directive
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    // passing a dummy object to click method since it expects to call stopPropagation() in the
    // onDeleteClick method
    heroComponents[0].query(By.css('button')).triggerEventHandler('click', { stopPropagation: () => {} });

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it(`should call heroService.deleteHero when the Hero Component's (child)
    delete button is clicked`, () => {
    // in this test we DO want to call the implementation of the delete method
    // so we can spy on heroService.deleteHero method
    // no need to mockImplementation
    jest.spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));
    mockHeroService.deleteHero.mockReturnValue(of(true));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    heroComponents[0].query(By.css('button')).triggerEventHandler('click', { stopPropagation: () => {} });

    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[0]);
  });

  it(`should call delete (from parent) when the Hero Component's (child)
   delete event emitter is emitted`, () => {
    jest.spyOn(fixture.componentInstance, 'delete').mockImplementation(() => {});
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    (heroComponents[0].componentInstance as HeroComponent).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it(`should call delete (from parent) when the Hero Component's (child)
   delete event emitter is emitted`, () => {
    jest.spyOn(fixture.componentInstance, 'delete').mockImplementation(() => {});
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    // just trigger the delete event directly on the child directly
    heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list wen the add button is clicked', () => {
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));
    fixture.detectChanges();
    const name = 'Mr. Ice';
    mockHeroService.addHero.mockReturnValue(of({ id: 5, name: name, strength: 4 } as Hero));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name; // typing Mr. Ice into input box
    addButton.triggerEventHandler('click', null); // we don't use the $event object so can pass a null
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);

    // could also grab all li's and check the text of the 4th one
  });

  // testing to make sure routerLink is configured correctly
  // if test breaks means someone broke router/app links
  it('should have the correct route for the first hero (is it configured corrected?)', () => {
    mockHeroService.getHeroes.mockReturnValue(of(HEROES));
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});
