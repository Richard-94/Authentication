import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient,
    private recipeService: RecipeService,
    private authSvc:AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-book-1c025-default-rtdb.europe-west1.firebasedatabase.app/food/.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
        alert('recipe sent')
      });
  }
  fetchRecipes() {
        return this.http.get<Recipe[]>(
          'https://recipe-book-1c025-default-rtdb.europe-west1.firebasedatabase.app/food/.json',

        )

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
          alert('fetched');
        })
      )


  }


}

// make sure to get the user once and then unsubscribe thus its interested in one element, exhaustMap to avoid two sunbscription to an observable
//it waits for the first observable thus the user observable containg the contain to complete then we get the data from the first obserbvable meaning the token is valid so the execution can continue
