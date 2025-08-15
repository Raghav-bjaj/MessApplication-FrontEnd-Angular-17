
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MenuItem {
  name: string;
  description?: string;
}

export interface DailyMenu {
  day: string;
  breakfast: MenuItem;
  lunch: MenuItem;
  dinner: MenuItem;
  snacks?: MenuItem;
}

// The hardcoded weekly menu data based on your college's menu
const WEEKLY_MENU: DailyMenu[] = [
  { 
    day: 'Monday', 
    breakfast: { name: 'Idly, Vada', description: 'Sambar, Chutney, Fruit, Bread Butter Jam, Milk, Tea, Coffee' }, 
    lunch: { name: 'Plain/Lemon/Coconut Rice', description: 'Roti, Rajma, Dal Tadka, White Rice, Seasonal Veg / Black Chana, Sambhar, Rasam, Fryums, Buttermilk' }, 
    dinner: { name: 'Roti', description: 'Aloo Bhindi Dry, White Rice, Dal Fry, Rasam & Pickle' },
    snacks: { name: 'Kachori/Noodles', description: 'Sauce, Tea / Coffee / Milk' }
  },
  { 
    day: 'Tuesday', 
    breakfast: { name: 'Poori, Vermicelli', description: 'Bhal Chutney, Fruit, Bread Butter Jam, Milk, Tea, Coffee' }, 
    lunch: { name: 'Ghee Rice', description: 'Roti, Dal Tadka, White Rice, Sambhar, Greens Kottu, Jeera Rasam, Salad, Curd' }, 
    dinner: { name: 'Roti', description: 'Dal Fry, White Rice, Aloo Gobi Fry, Rasam & Pickle' },
    snacks: { name: 'Pani Poori/Chana Sundal', description: 'Tea / Coffee / Milk' }
  },
  { 
    day: 'Wednesday', 
    breakfast: { name: 'Onion/Veg Uttapam', description: 'Sambhar, Tomato Chutney, Fruits, Bread Butter Jam, Milk, Tea, Coffee, Boiled Egg, Sprouts' }, 
    lunch: { name: 'Puli Kulambu', description: 'Roti, Dal Makhani, White Rice, Avial, Garlic Rasam & Pickle, Salad, Boondi' }, 
    dinner: { name: 'Roti', description: 'Plain Dal, White Rice, Kadai Chicken/Chicken Masala, Paneer Masala, Rasam & Pickle' },
    snacks: { name: 'Samosa', description: 'Sauce, Tea / Coffee / Milk' }
  },
  { 
    day: 'Thursday', 
    breakfast: { name: 'Poha, Jalebi', description: 'Pongal, Sambar, Chutney, Fruits, Bread Butter Jam, Milk, Tea, Coffee' }, 
    lunch: { name: 'Veg Kofta', description: 'Roti, Jeera Aloo, White Rice, Tomato Dal, Sambhar, Beatroot Poriyal, Drumstick Rasam, Pickle & Appalam' }, 
    dinner: { name: 'Aloo Paneer Kappattatha', description: 'Roti, White Rice, Egg Masala, Dal Fry, Rasam & Pickle, Tomato Soup/Veg Soup' },
    snacks: { name: 'Sweet Corn Salad/Burger', description: 'Tea / Coffee / Milk' }
  },
  { 
    day: 'Friday', 
    breakfast: { name: 'Bhatura', description: 'Chole Masala, Fruits, Bread Butter Jam, Milk, Tea, Coffee' }, 
    lunch: { name: 'Veg Biryani', description: 'Roti, Brinjal Masala/Dum Aloo, Masoor Dal, Plain Rice, Sambhar Rice, Raw Banana Poriyal, Rasam, Boondi Raitha' }, 
    dinner: { name: 'Roti', description: 'Dal Tadka, White Rice, Butter Chicken, Chili Paneer, Rasam & Pickle' },
    snacks: { name: 'Vada Pav', description: 'Green Chutney, Tea / Coffee / Milk' }
  },
  { 
    day: 'Saturday', 
    breakfast: { name: 'Rava Upma & Pav Bhaji', description: 'Chutney, Fruits, Bread Butter Jam, Milk, Tea, Coffee, Boiled Egg / Sprouts' }, 
    lunch: { name: 'Poori', description: 'Roti, Chole Masala, Jeera Rice, Seasonal Veg, White Rice, Pakado Kulambu, Rasam & Pickle, Potato Poriyal, Salad, Butter Milk' }, 
    dinner: { name: 'Fried Rice', description: 'Roti, Masala Dal, White Rice, Veg Manchurian/ Aloo Soya Dry, Rasam & Pickle' },
    snacks: { name: 'Cutlet/Dabeli', description: 'Tea / Coffee / Milk' }
  },
  { 
    day: 'Sunday', 
    breakfast: { name: 'Masala Dosa', description: 'Sambar, Chutney, Fruits, Bread Butter Jam, Milk, Tea, Coffee' }, 
    lunch: { name: 'Masala Dal', description: 'Roti, Chicken Dum Biryani (Limited), Jeera Rice, Veg Biryani, Paneer Masala, White Rice, Rasam, Pickle, Salad, Onion Cucumber Raitha' }, 
    dinner: { name: 'Roti', description: 'Masoor Dal, Mix Veg Dry, White Rice, Rasam & Pickle, Gulab Jamun' },
    snacks: { name: 'Dhokla / Pasta', description: 'Green Chutney/Sweet Chutney, Tea / Coffee / Milk' }
  }
];

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  // Method for admins to get the entire weekly menu
  getFullMenu(): Observable<DailyMenu[]> {
    return of(WEEKLY_MENU);
  }

  // "Smart" method for students to get the next two upcoming meals
  getUpcomingMeals(): Observable<{ mealType: string, meal: MenuItem }[]> {
    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7; // Monday is 0, Sunday is 6
    const currentHour = now.getHours();

    const upcomingMeals: { mealType: string, meal: MenuItem }[] = [];
    const today = WEEKLY_MENU[currentDayIndex];
    const tomorrow = WEEKLY_MENU[(currentDayIndex + 1) % 7];

    if (currentHour < 12) { // Before lunch
      upcomingMeals.push({ mealType: `Today's Lunch (${today.day})`, meal: today.lunch });
      upcomingMeals.push({ mealType: `Today's Dinner (${today.day})`, meal: today.dinner });
    } else if (currentHour < 20) { // Before dinner
      upcomingMeals.push({ mealType: `Today's Dinner (${today.day})`, meal: today.dinner });
      upcomingMeals.push({ mealType: `Tomorrow's Breakfast (${tomorrow.day})`, meal: tomorrow.breakfast });
    } else { // After dinner
      upcomingMeals.push({ mealType: `Tomorrow's Breakfast (${tomorrow.day})`, meal: tomorrow.breakfast });
      upcomingMeals.push({ mealType: `Tomorrow's Lunch (${tomorrow.day})`, meal: tomorrow.lunch });
    }

    return of(upcomingMeals);
  }
}