
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // <-- Import ActivatedRoute
import { MenuService, DailyMenu, MenuItem } from '../menu.service';
import { Observable } from 'rxjs';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // We no longer need separate observables for the view.
  // The template will decide what to show based on which data is available.
  fullMenu$: Observable<DailyMenu[]> | null = null;
  upcomingMeals$: Observable<{ mealType: string, meal: MenuItem }[]> | null = null;
  viewType: 'weekly' | 'upcoming' | null = null;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute // <-- Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to the route parameters to get the 'type'
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');

      if (type === 'weekly') {
        this.viewType = 'weekly';
        this.fullMenu$ = this.menuService.getFullMenu();
      } else if (type === 'upcoming') {
        this.viewType = 'upcoming';
        this.upcomingMeals$ = this.menuService.getUpcomingMeals();
      }
    });
  }
}