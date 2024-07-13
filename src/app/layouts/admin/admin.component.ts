import { Component } from '@angular/core';
import { environment } from '../../../environments/environments';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SideBarComponent, FormsModule, CommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  isAuthorized: boolean = false;
  pass: string = "";
  err: string = '';

  onSubmitAuth(data: any): void {
    this.pass === environment.authKey ? this.isAuthorized = true : this.err = "Please enter correct password";
  }

}
