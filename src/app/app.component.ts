import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'hospitech';
  constructor(private location: Location) { }

  // Reload the page or perform any other actions
  ngOnInit() {
    // this.location.subscribe(() => {
    //   window.location.reload();
    // });
  }
}
