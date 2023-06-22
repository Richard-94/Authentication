import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode:boolean = false;
  recipeForm!: FormGroup;
  recipeIngredients!: FormArray;
  editedItemIndex!: number;
  editedItem: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }
  onAddIngredient() {
    this.recipeIngredients.push(
      this.formBuilder.group({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }


  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  private initForm() {
    let recipeName: string | null = null;
    let recipeImagePath: string | null = null;
    let recipeDescription: string | null = null;
    this.recipeIngredients = this.formBuilder.array([]);

    if (this.editedItem) {
      const recipeId = this.editedItemIndex;
      console.log(recipeId);

      const recipe = this.recipeService.getRecipeById(recipeId);
      console.log(recipe);

      recipeName = this.editedItem.name || null;
      recipeImagePath = this.editedItem.imagePath || null;
      recipeDescription = this.editedItem.description || null;
      console.log('recipeNames:', recipeName);
      console.log('recipeImagePathsss:', recipeImagePath);
      console.log('recipeDescription:', recipeDescription);
      if (recipe && recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          const ingredientGroup = this.formBuilder.group({
            ingredients: [ingredient.name],
            amount: [ingredient.amount]
          });
          this.recipeIngredients.push(ingredientGroup);
          console.log(ingredientGroup);

        }
      }
    }

    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      imagePath: [recipeImagePath, Validators.required],
      description: [recipeDescription, Validators.required],
      ingredients: this.recipeIngredients
    });
  }


}
