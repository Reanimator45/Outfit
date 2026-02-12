import { Injectable, signal } from '@angular/core';
import { OutfitCategory } from '../models/outfit.model';

@Injectable({providedIn:'root'})
export class DbService{

 private key='casino_outfits';

 outfits=signal<OutfitCategory[]>(this.load());

 private load():OutfitCategory[]{
   return JSON.parse(localStorage.getItem(this.key)||'[]');
 }

 private save(data:OutfitCategory[]){
   localStorage.setItem(this.key,JSON.stringify(data));
   this.outfits.set(data);
 }

 add(outfit:OutfitCategory){
   const data=[...this.outfits(),outfit];
   this.save(data);
 }
remove(id:number){

 this.outfits.update(list =>
  list.filter(o=>o.id!==id)
 );

}
}

