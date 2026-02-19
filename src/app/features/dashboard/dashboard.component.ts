import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbService } from '../../core/services/db.service';
import { DecisionEngineService, Mode } from '../../core/services/decision-engine.service';

import { WheelViewComponent } from './components/wheel-view/wheel-view.component';
import { ChestViewComponent } from './components/chest-view/chest-view.component';
import { CouncilViewComponent } from './components/council-view/council-view.component';
import { CardsViewComponent } from './components/cards-view/cards-view.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    WheelViewComponent,
    ChestViewComponent,
    CouncilViewComponent,
    CardsViewComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  playing = signal(false);
  showList = signal(false);

  selectedWheel = signal<'LMV' | 'MJ' | 'SD' | null>(null);
  mode = signal<Mode | null>(null);

  toast = signal<string | null>(null);

  constructor(
    public db: DbService,
    private decision: DecisionEngineService
  ) {}

  /* =========================
     FLOW
  ========================= */

  play() {
    this.playing.set(true);
  }

  selectWheel(w: 'LMV' | 'MJ' | 'SD') {
    this.selectedWheel.set(w);
    this.mode.set(null);
  }

  run() {
    if (!this.selectedWheel()) return;
    this.mode.set(this.decision.randomMode());
  }

  toggleList() {
    this.showList.update(v => !v);
  }

  /* =========================
     CRUD ESTILOS
  ========================= */

  add(nombre: string) {
    const wheel = this.selectedWheel();
    if (!nombre || !wheel) return;

    this.db.add({
      id: Date.now(),
      nombre,
      wheel
    });

    this.showToast('➕ Estilo agregado');
  }

  remove(id: number) {
    this.db.remove(id);
    this.showToast('🗑️ Estilo eliminado');
  }

  /* =========================
     DATA
  ========================= */

  getOptions() {
    const wheel = this.selectedWheel();
    if (!wheel) return [];

    return this.db.outfits().filter(o => o.wheel === wheel);
  }

  /* =========================
     TOAST
  ========================= */

  showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 2500);
  }
}
