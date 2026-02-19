import { Component, Input, ElementRef, ViewChildren, QueryList, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

type Rareza = 'normal' | 'rara' | 'legendaria';

interface Card {
 id:number;
 nombre:string;
 rareza:Rareza;
 bonus?:number;
 total?:number;
}

@Component({
 selector:'app-cards-view',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./cards-view.component.html',
 styleUrls:['./cards-view.component.css']
})
export class CardsViewComponent implements AfterViewInit{

 @Input() options:any[]=[];

 @ViewChildren('cardEl') cardElements!:QueryList<ElementRef>;

 cards = signal<Card[]>([]);
 winner = signal<Card|null>(null);

 ngAfterViewInit(){}

 generateCards(){

  if(!this.options.length) return;

  const pool = [...this.options]
   .sort(()=>Math.random()-.5)
   .slice(0,6);

  const generated:Card[] = pool.map(o=>({
   id:o.id,
   nombre:o.nombre,
   rareza:this.getRareza()
  }));

  this.cards.set(generated);

  setTimeout(()=>{
   this.animateReveal();
  },200);

 }

 getRareza():Rareza{

  const r = Math.random();

  if(r<0.1) return 'legendaria';
  if(r<0.4) return 'rara';
  return 'normal';
 }

 animateReveal(){

  const elements = this.cardElements.toArray();

  elements.forEach((el,index)=>{

   gsap.to(el.nativeElement,{
    rotateY:180,
    duration:0.6,
    delay:index*0.4,
    ease:'power2.out'
   });

  });

  setTimeout(()=>{
   this.pickWinner();
  }, elements.length*400 + 600);

 }

 pickWinner(){

 const rarezaBase = {
  legendaria:3,
  rara:2,
  normal:1
 };

 const scored = this.cards().map(card=>({
  ...card,
  base:rarezaBase[card.rareza],
  total:rarezaBase[card.rareza]
 }));

 const maxBase = Math.max(...scored.map(c=>c.base));
 const top = scored.filter(c=>c.base === maxBase);

 // 🔥 SI HAY EMPATE
 if(top.length > 1){

  this.showFinalDuelEffect();

  // 🎯 elegimos UNA sola carta para recibir +1
  const chosen =
   top[Math.floor(Math.random()*top.length)];

  chosen.total += 1;

  this.showBonusEffect(chosen);

  this.winner.set(chosen);

 }else{

  this.winner.set(top[0]);

 }

 setTimeout(()=>{
  this.animateWinnerVisual();
 },800);

}
showBonusEffect(card:any){

 const elements = this.cardElements.toArray();

 elements.forEach(el=>{

  const name = el.nativeElement.innerText;

  if(name.includes(card.nombre)){

   const bonusEl = document.createElement('div');
   bonusEl.className = 'bonus-pop';
   bonusEl.innerText = '+1 ⚡';

   el.nativeElement.appendChild(bonusEl);

   gsap.fromTo(bonusEl,
    {y:0,opacity:0,scale:0.5},
    {y:-50,opacity:1,scale:1.3,duration:0.5}
   );

   gsap.to(bonusEl,{
    opacity:0,
    delay:1,
    duration:0.5,
    onComplete:()=>bonusEl.remove()
   });

  }

 });

}

showTieEffect(tiedCards:any[]){

 const elements = this.cardElements.toArray();

 elements.forEach(el=>{
  const name = el.nativeElement.innerText;

  tiedCards.forEach(card=>{
   if(name.includes(card.nombre)){

    const bonusEl = document.createElement('div');
    bonusEl.className = 'bonus-pop';
    bonusEl.innerText = '+1 ⚡';

    el.nativeElement.appendChild(bonusEl);

    gsap.fromTo(bonusEl,
     {y:0,opacity:0,scale:0.5},
     {y:-40,opacity:1,scale:1,duration:0.5}
    );

    gsap.to(bonusEl,{
     opacity:0,
     delay:0.8,
     duration:0.4
    });

   }
  });

 });

}

showFinalDuelEffect(){

 const duel = document.createElement('div');
 duel.className = 'duel-text';
 duel.innerText = '⚔️ DESEMPATE ⚔️';

 document.body.appendChild(duel);

 gsap.fromTo(duel,
  {scale:0.5,opacity:0},
  {scale:1.2,opacity:1,duration:0.5}
 );

 gsap.to(duel,{
  opacity:0,
  delay:1,
  duration:0.6,
  onComplete:()=>duel.remove()
 });

}

animateWinnerVisual(){

 const winner = this.winner();
 if(!winner) return;

 const elements = this.cardElements.toArray();

 elements.forEach(el=>{

  const name = el.nativeElement.innerText;

  if(name.includes(winner.nombre)){
   gsap.to(el.nativeElement,{
    scale:1.2,
    boxShadow:'0 0 60px gold',
    duration:0.6,
    yoyo:true,
    repeat:1
   });
  }else{
   gsap.to(el.nativeElement,{
    opacity:0.35,
    duration:0.6
   });
  }

 });

}





}
