import { Injectable } from '@angular/core';

export type Mode='WHEEL'|'CHEST'|'COUNCIL';

@Injectable({providedIn:'root'})
export class DecisionEngineService{

 randomMode():Mode{
   const modes:Mode[]=['WHEEL','CHEST','COUNCIL'];
   return modes[Math.floor(Math.random()*modes.length)];
 }

}
