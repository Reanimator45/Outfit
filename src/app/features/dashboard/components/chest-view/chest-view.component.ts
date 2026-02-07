import { Component, Input } from '@angular/core';

@Component({
 selector:'app-chest-view',
 standalone:true,
 template:`<h2>🧰 COFRE</h2><h1>{{result?.nombre}}</h1>`
})
export class ChestViewComponent{ @Input() result:any



 }

