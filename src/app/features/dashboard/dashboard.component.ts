import { Component, signal } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { DecisionEngineService, Mode } from '../../core/services/decision-engine.service';

import { WheelViewComponent } from './components/wheel-view/wheel-view.component';
import { ChestViewComponent } from './components/chest-view/chest-view.component';
import { CouncilViewComponent } from './components/council-view/council-view.component';

import { CommonModule } from '@angular/common';

@Component({
 selector:'app-dashboard',
 standalone:true,
 imports:[
  CommonModule,
  WheelViewComponent,
  ChestViewComponent,
  CouncilViewComponent
 ],
 templateUrl:'./dashboard.component.html',
 styleUrl:'./dashboard.component.css'
})
export class DashboardComponent{

 selectedWheel = signal<'R1'|'R2'|'R3'|null>(null);

 mode = signal<Mode|null>(null);

 constructor(
  public db:DbService,
  private decision:DecisionEngineService
 ){}

 run(){

  const wheel = this.selectedWheel();

  if(!wheel) return;

  const filtered = this.db.outfits()
    .filter(o=>o.wheel===wheel);

  if(filtered.length===0){
    alert('No hay categorías');
    return;
  }

  // 🎭 solo elegimos el modo visual
  this.mode.set(this.decision.randomMode());

 }

 add(nombre:string,wheel:any){

  if(!nombre) return;

  this.db.add({
    id:Date.now(),
    nombre,
    wheel
  });

 }

 getOptions(){

  const wheel=this.selectedWheel();

  if(!wheel) return [];

  return this.db.outfits()
    .filter(o=>o.wheel===wheel);

 }

}
