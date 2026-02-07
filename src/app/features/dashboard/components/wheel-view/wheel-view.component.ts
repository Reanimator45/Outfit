import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector:'app-wheel-view',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./wheel-view.component.html',
 styleUrl:'./wheel-view.component.css'
})
export class WheelViewComponent implements OnChanges{

 @Input() result:any;
 @Input() allOptions:any[]=[];
 @Input() spinning=false;

 rotation=signal(0);
 gradient=signal('');

 ngOnChanges(changes:SimpleChanges){

   this.buildGradient();

   if(changes['result'] && this.result){

     const index=this.allOptions
       .findIndex(o=>o.id===this.result.id);

     if(index===-1) return;

     const segment=360/this.allOptions.length;

     const targetAngle=(index*segment)+(segment/2);

     const spins=1440; // 4 vueltas completas

     const finalRotation=spins + (360-targetAngle);

     this.rotation.set(finalRotation);

   }
   if(this.spinning && !this.result){

 const freeSpin=720 + Math.floor(Math.random()*360);

 this.rotation.set(freeSpin);

 return;

}
 }

 buildGradient(){

 if(!this.allOptions.length) return;

 const step=360/this.allOptions.length;

 let current=0;
 let parts:string[]=[];

 this.allOptions.forEach((_,i)=>{

   const color=i%2===0?'#1e1e1e':'#444';

   parts.push(`${color} ${current}deg ${current+step}deg`);

   current+=step;

 });

 this.gradient.set(`conic-gradient(${parts.join(',')})`);

}


}
