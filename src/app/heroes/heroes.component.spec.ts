import { HeroesComponent } from './heroes.component';
import { of } from 'rxjs';

// Isolated Tests - not using Angular to initial/render/compile component
// just testing straight up HeroesComponent JavaScript/TypeScript class
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
    // State Change Based Test
    // testing that the state of the component changed
    it('should remove the indicated hero from the heroes list', () => {
      // How to create mock return value in Jasmine
      //mockHeroService.deleteHero.and.returnValue(of(true));

      // How to create mock return value in Jest
      mockHeroService.deleteHero.mockReturnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    });

    // Interaction Based Test
    // testing that the component properly called the collaborator (in this case, the service)
    it('should call deleteHero with correct hero', () => {
      mockHeroService.deleteHero.mockReturnValue(of(true));
      component.heroes = HEROES;
      // we could also call component.ngOnInit() to initialize if we want to test that

      component.delete(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });
  });
});
