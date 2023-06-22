import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature = 'recipe';

  onNavigate(event: Event) {
    const feature = (event.target as HTMLInputElement).value;
    this.loadedFeature = feature;
  }

}
