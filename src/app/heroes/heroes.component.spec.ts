import { HeroesComponent } from './heroes.component';
import { of } from 'rxjs';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [{ id: 1, name: 'SpiderDude', strength: 8 }, { id: 2, name: 'Wonderful Woman', strength: 24 }, { id: 3, name: 'SuperDude', strength: 55 }];

    // How to create mock service in Jasmine
    //mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'deleteHero']);

    // How to create mock service in Jest
    mockHeroService = {
      getHeroes: jest.fn(),
      addHero: jest.fn(),
      deleteHero: jest.fn()
    };

    component = new HeroesComponent(mockHeroService);
  });

  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      // How to create mock return value in Jasmine
      //mockHeroService.deleteHero.and.returnValue(of(true));

      // How to create mock return value in Jest
      mockHeroService.deleteHero.mockReturnValue(of(true));

      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    });
  });
});
