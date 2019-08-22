import { TestBed, ComponentFixture } from '@angular/core/testing';
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
});
