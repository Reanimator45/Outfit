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
 winnerIndex = signal<number | null>(null);


 get segments(){

  if(!this.options?.length) return [];

  const slice = 360 / this.options.length;

  return this.options.map((o,i)=>({
   ...o,
   rotate:i*slice,
   slice
  }));

 }
 toast = signal<string|null>(null);
uses = signal(0);
toastCount = signal(0);



spin(){

 if(this.spinning()) return;

 this.uses.update(v=>v+1);

 if(this.uses()>3){

  this.toastCount.update(v=>v+1);

  if(this.toastCount()>=3){
   this.toast.set('⚠️ Por insistente ahora me debes fotobuba :p');
  }else{
   this.toast.set('🎭 La suerte se agotó... intenta mañana 😉');
  }

  setTimeout(()=>this.toast.set(null),3500);
  return;
 }

 if(!this.options.length) return;

 this.winnerIndex.set(null);

 this.spinning.set(true);
 this.result.set(null);

 const slice = 360 / this.options.length;

 const winnerIndex =
  Math.floor(Math.random()*this.options.length);

 /* 🔥 OFFSET REAL PARA RULETA SKEW */
 const pointerOffset = -90;
this.winnerIndex.set(winnerIndex);

 const targetAngle =
  pointerOffset
  - (winnerIndex*slice)
  - (slice/2);

 const currentAngle =
  this.rotation()%360;

 const finalRotation =
  this.rotation()
  + 5*360
  + (targetAngle-currentAngle);

 this.rotation.set(finalRotation);

 setTimeout(()=>{
  this.result.set(this.options[winnerIndex]);
  this.spinning.set(false);
 },4000);

}






}
