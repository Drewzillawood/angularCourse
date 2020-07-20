import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  dbUrl: string = 'https://ng-course-recipe-book-4988e.firebaseio.com/recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService) {

  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put(
        this.dbUrl,
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(this.dbUrl)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
