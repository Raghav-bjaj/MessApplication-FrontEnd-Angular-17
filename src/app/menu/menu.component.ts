import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MenuService, DailyMenu, MenuItem } from '../menu.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion'; // <-- Import Expansion Panel

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule // <-- Add Expansion Panel to imports
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isAdmin$: Observable<boolean>;
  fullMenu: DailyMenu[] = [];
  upcomingMeals: { mealType: string, meal: MenuItem }[] = [];

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  ngOnInit(): void {
    this.authService.userRole$.pipe(take(1)).subscribe(role => {
      if (role === 'admin') {
        this.menuService.getFullMenu().subscribe(data => this.fullMenu = data);
      } else if (role === 'student') {
        this.menuService.getUpcomingMeals().subscribe(data => this.upcomingMeals = data);
      }
    });
  }
}
