import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, HttpClientModule],
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
