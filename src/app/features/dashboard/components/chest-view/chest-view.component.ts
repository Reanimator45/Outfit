import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector:'app-chest-view',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./chest-view.component.html',
 styleUrls:['./chest-view.component.css']
})
export class ChestViewComponent{

 @Input() options:any[]=[];

 opened = signal(false);
 result = signal<any>(null);
 uses = signal(0);
 linkVisible = signal(false);

 private audio = new Audio('assets/sounds/fanfare.mp3');

 openChest(){


     this.uses.update(v=>v+1);

 this.opened.set(false);
 this.result.set(null);

 if(this.uses()>3){

  setTimeout(()=>{
   this.opened.set(true);
   this.result.set({nombre:' NADA ⭐'});
  },1200);

  return;
 }

 

  if(!this.options.length)return;

  this.opened.set(false);
  this.result.set(null);
  this.linkVisible.set(false);

  const choice =
   this.options[Math.floor(Math.random()*this.options.length)];

  // aparece link
  setTimeout(()=>{
   this.linkVisible.set(true);
   this.audio.currentTime=0;
   this.audio.play().catch(()=>{});
  },400);

  // abre cofre
  setTimeout(()=>{
   this.opened.set(true);
   this.result.set(choice);
  },1500);

 }

}
