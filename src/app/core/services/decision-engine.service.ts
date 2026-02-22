import { Injectable } from '@angular/core';

export type Mode='WHEEL'|'CHEST'|'COUNCIL'| 'CARDS'|'SLOT';

@Injectable({providedIn:'root'})
export class DecisionEngineService{

 randomMode():Mode{
   const modes:Mode[]=['WHEEL','CHEST','COUNCIL','CARDS','SLOT'];
   return modes[Math.floor(Math.random()*modes.length)];
 }

}
