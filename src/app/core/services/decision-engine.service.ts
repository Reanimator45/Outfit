import { Injectable } from '@angular/core';

export type Mode='WHEEL'|'CHEST'|'COUNCIL'| 'CARDS';

@Injectable({providedIn:'root'})
export class DecisionEngineService{

 randomMode():Mode{
   const modes:Mode[]=['WHEEL','CHEST','COUNCIL','CARDS'];
   return modes[Math.floor(Math.random()*modes.length)];
 }

}
