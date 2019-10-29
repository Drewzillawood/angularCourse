import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipeDetail: Recipe;

  constructor() { }

  ngOnInit() {
  }

  onSelect(recipe: Recipe): void {
    this.recipeDetail = recipe;
  }
}
