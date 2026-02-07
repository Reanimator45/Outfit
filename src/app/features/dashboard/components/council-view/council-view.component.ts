import { Component, Input } from '@angular/core';

@Component({
 selector:'app-council-view',
 standalone:true,
 template:`<h2>⚖️ CONSEJO</h2><h1>{{result?.nombre}}</h1>`
})
export class CouncilViewComponent{ @Input() result:any


 }

