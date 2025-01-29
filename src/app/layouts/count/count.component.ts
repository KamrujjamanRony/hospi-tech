import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
    selector: 'app-count',
    imports: [FormsModule, CommonModule, RouterOutlet],
    templateUrl: './count.component.html',
    styleUrl: './count.component.css'
})
export class CountComponent {
  isAuthorized: boolean = false;
  pass: string = "";
  err: string = '';

  onSubmitAuth(data: any): void {
    this.pass === environment.viewKey ? this.isAuthorized = true : this.err = "Please enter correct password";
  }
}
