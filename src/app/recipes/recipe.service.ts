import {Recipe} from './recipe.model';
import {EventEmitter} from '@angular/core';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 'https://c.pxhere.com/images/85/3d/5a8e2e8aa5b6305a1f8ef7c7e685-1589197.jpg!d'),
    new Recipe('A Second Test Recipe', 'This is also simply a test', 'https://www.nps.gov/subjects/camping/images/recipe_1.jpg?maxwidth=1200&maxheight=1200&autorotate=false')
  ];

  getRecipes() {
    return this.recipes.slice();
  }
}
