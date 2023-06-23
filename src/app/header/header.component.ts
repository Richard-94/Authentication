import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import {  Subscription } from 'rxjs';

@Component({//we creating a new subscrition to take track if the user is logged in or not if the user is null or if it exists
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false
  private userSub!:Subscription


  constructor(private dataStorageService: DataStorageService, private authSvc:AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authSvc.user.subscribe(user=>{
      this.isAuthenticated =!!user // if we dont have a user is true/false, true if we have a user / false if not
      console.log(!user);
      console.log(!!user);
    })

  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logout(){
    this.authSvc.logout()
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }
}
