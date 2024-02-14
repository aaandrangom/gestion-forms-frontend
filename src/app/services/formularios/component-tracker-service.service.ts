import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComponentTrackerServiceService {
  private currentComponentNameSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  currentComponentName$: Observable<string | null> =
    this.currentComponentNameSubject.asObservable();

  setCurrentComponentName(componentName: string) {
    this.currentComponentNameSubject.next(componentName);
  }

  getCurrentComponent(): string | null {
    return this.currentComponentNameSubject.getValue();
  }
}
