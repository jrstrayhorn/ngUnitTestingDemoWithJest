import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('HeroDetailCompoennt', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockHeroService = {
      getHero: jest.fn(),
      updateHero: jest.fn()
    };

    mockLocation = {
      back: jest.fn()
    };

    // example of using jest to create nested mock object
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn(() => 3)
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule], // import this to deal with ngModel
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ]
    });
    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.mockReturnValue(of({ id: 3, name: 'SuperDude', strength: 100 }));
  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h2').textContent).toContain('SUPERDUDE');
  });

  // use fakeAsync to call async code like its sync code
  // works with promises as well better to default to this
  it('should call updateHero when save is called.', fakeAsync(() => {
    mockHeroService.updateHero.mockReturnValue(of({})); // we ignore the return object
    fixture.detectChanges();

    fixture.componentInstance.save();
    // test will call save then tick forward 250 ms
    // and call any callback after that 250 ms
    //tick(250);
    // will look for any waiting tasks then fast forward
    // clock to find any waiting tasks and run them
    // simplier option when you don't know how long to wait
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();

    // don't do this as it makes your unit tests slower....
    // setTimeout(() => {
    //   expect(mockHeroService.updateHero).toHaveBeenCalled();
    //   done();
    // }, 300);
  }));

  // //only works with promises
  // it('should call updateHero when save is called', async(() => {
  //   mockHeroService.updateHero.mockReturnValue(of({}));
  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   // wait til promise resolves
  //   fixture.whenStable().then(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   });
  // }));
});
