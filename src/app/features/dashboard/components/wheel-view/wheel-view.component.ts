import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector:'app-wheel-view',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./wheel-view.component.html',
 styleUrls:['./wheel-view.component.css']
})
export class WheelViewComponent{

 @Input() options:any[]=[];

 rotation = signal(0);
 spinning = signal(false);
 result = signal<any>(null);

 get segments(){

  if(!this.options?.length) return [];

  const slice = 360 / this.options.length;

  return this.options.map((o,i)=>({
   ...o,
   rotate:i*slice,
   slice
  }));

 }

 spin(){

  if(this.spinning() || !this.options.length) return;

  this.spinning.set(true);
  this.result.set(null);

  const count=this.options.length;
  const slice=360/count;

  const index=Math.floor(Math.random()*count);
  const chosen=this.options[index];

  const center=index*slice+slice/2;

  const pointerAngle=270;

  const neededRotation=pointerAngle-center;

  const extraSpins=5*360;

  this.rotation.update(r=>r+extraSpins+neededRotation);

  setTimeout(()=>{
   this.result.set(chosen);
   this.spinning.set(false);
  },4200);

 }

}
