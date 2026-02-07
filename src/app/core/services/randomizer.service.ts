import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class RandomizerService{

 private simple(list:any[]){
   return list[Math.floor(Math.random()*list.length)];
 }

 private shuffle(list:any[]){
   return [...list].sort(()=>0.5-Math.random())[0];
 }

 pick(list:any[]){
   const algos=[this.simple,this.shuffle];
   const algo=algos[Math.floor(Math.random()*algos.length)];
   return algo.call(this,list);
 }

}
