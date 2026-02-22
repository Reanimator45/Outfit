import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

type SymbolType = 'style' | 'bobi' | 'miku' | 'perso' | 'tortuga';

interface SymbolItem {
  id: string;
  img: string;
  type: SymbolType;
  label?: string;
}

@Component({
  selector: 'app-slot-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slot-view.component.html',
  styleUrls: ['./slot-view.component.css']
})
export class SlotViewComponent {

  @Input() options: any[] = [];

  spinning = signal(false);
  toast = signal<string | null>(null);
  activeEvent = signal<string | null>(null);

  reels: SymbolItem[][] = [[], [], []];
  finalResult: SymbolItem[] = [];
  currentFourStyles: SymbolItem[] = [];
  winnerId = signal<string | null>(null);

  /* ================================
     SIMBOLOS ESPECIALES
  ================================= */

  specialSymbols: SymbolItem[] = [
    { id: 'bobi', img: 'assets/judges/bobi.png', type: 'bobi' },
    { id: 'miku', img: 'assets/judges/miku.png', type: 'miku' },
    { id: 'perso', img: 'assets/judges/perso.png', type: 'perso' },
    { id: 'tortuga', img: 'assets/img/turtle0.png', type: 'tortuga' }
  ];

  /* ================================
     SOLO 4 ESTILOS POR GIRO
  ================================= */

  pickFourStyles(): SymbolItem[] {

    if (!this.options.length) return [];

    const shuffled = [...this.options]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    return shuffled.map((o, index) => ({
      id: o.id.toString(),
      img: `assets/img/${index + 1}.png`, // 👈 SIEMPRE 1-4
      type: 'style' as const,
      label: o.nombre
    }));
  }

  /* ================================
     SPIN
  ================================= */

  spin() {

    if (this.spinning()) return;
    if (!this.options?.length) return;

    this.spinning.set(true);
    this.activeEvent.set(null);
    this.finalResult = [];

    // 🎯 Elegimos solo 4 estilos
    this.currentFourStyles = this.pickFourStyles();

    const pool: SymbolItem[] = [
      ...this.currentFourStyles,
      ...this.specialSymbols
    ];

    // 🎯 DEFINIMOS RESULTADO REAL
    for (let i = 0; i < 3; i++) {
      this.finalResult.push(
        pool[Math.floor(Math.random() * pool.length)]
      );
    }

    // Construimos reels largos
    this.reels = this.finalResult.map(res => {

      const reel: SymbolItem[] = [];

      for (let i = 0; i < 15; i++) {
        reel.push(pool[Math.floor(Math.random() * pool.length)]);
      }

      // Colocamos el símbolo REAL en posición 12
      reel[12] = res;

      return reel;
    });

    setTimeout(() => this.animate(), 50);
  }

  /* ================================
     ANIMACIÓN REAL SINCRONIZADA
  ================================= */
isWinner(id: string): boolean {
  return this.winnerId() === id;
}

  animate() {

    const tracks = document.querySelectorAll('.reel-track');
    const symbolHeight = 120; // ⚠️ Debe coincidir con tu CSS

    tracks.forEach((track, i) => {

      const stopPosition = -(12 * symbolHeight);

      gsap.fromTo(track,
        { y: 0 },
        {
          y: stopPosition,
          duration: 2 + i * 0.4,
          ease: "power4.out",
          onComplete: () => {
            if (i === 2) this.evaluate();
          }
        }
      );

    });
  }

  /* ================================
     EVALUACIÓN REAL
  ================================= */

  evaluate() {

  const counts: Record<string, number> = {};

  this.finalResult.forEach(s => {
    counts[s.id] = (counts[s.id] || 0) + 1;
  });

  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    this.spinning.set(false);
    return;
  }

  const winnerId = entries[0][0];
  const amount = entries[0][1];

  // 🔥 guardamos SOLO EL ID
  this.winnerId.set(winnerId);

  const winner = this.finalResult.find(s => s.id === winnerId);

  if (!winner) {
    this.showToast('Nada especial...');
    this.spinning.set(false);
    return;
  }

  if (amount === 3) {
    this.triggerEvent(winner);
  }
  else if (amount >= 2) {
    this.showToast(`🎯 Gana: ${winner.label || winner.type || winner.id.toUpperCase()}`);
  }
  else {
    this.showToast('Nada especial...');
    this.winnerId.set(null);
  }

  this.spinning.set(false);
}

  /* ================================
     TOAST
  ================================= */

  showToast(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }

  /* ================================
     EVENTOS
  ================================= */

  createGlobalOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'global-event-overlay';
  document.body.appendChild(overlay);
  return overlay;
}

  triggerEvent(winner: SymbolItem) {
    if (winner.type === 'style') {this.showToast('💥 JACKPOT!');}

  const overlay = document.createElement('div');
  overlay.className = 'global-event-overlay';
  document.body.appendChild(overlay);

  const createImg = (src: string, size = 60) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.width = size + 'px';
    overlay.appendChild(img);
    return img;
  };

  const createEmoji = (emoji: string, size = 40) => {
    const el = document.createElement('div');
    el.innerText = emoji;
    el.style.position = 'absolute';
    el.style.fontSize = size + 'px';
    overlay.appendChild(el);
    return el;
  };

  // Fade in
  gsap.fromTo(overlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.5 }
  );

  const width = window.innerWidth;
  const height = window.innerHeight;

  // ==========================
  // TORTUGA
  // ==========================
  if (winner.type === 'tortuga') {

    this.showToast('💥 JACKPOT TORTUGA!');

    for (let i = 0; i < 50; i++) {

      const t = createImg('assets/img/turtle0.png', 50);

      gsap.fromTo(t,
        {
          x: Math.random() * width,
          y: -100,
          rotation: Math.random() * 360
        },
        {
          y: height + 100,
          duration: 3 + Math.random() * 2,
          ease: "none"
        }
      );
    }

    for (let i = 0; i < 70; i++) {

      const heart = createEmoji('💚', 30);

      gsap.fromTo(heart,
        { x: Math.random() * width, y: -50 },
        { y: height + 50, duration: 3 + Math.random(), ease: "none" }
      );
    }
  }

  // ==========================
  // BOBI
  // ==========================
  if (winner.type === 'bobi') {

    this.showToast('💥 JACKPOT BOBI!');

    for (let i = 0; i < 60; i++) {

      const b = createImg('assets/judges/bobi.png', 45);

      gsap.fromTo(b,
        { x: Math.random() * width, y: -100 },
        { y: height + 100, duration: 3 + Math.random() * 2 }
      );
    }
  }

  // ==========================
  // MIKU
  // ==========================
  if (winner.type === 'miku') {

    this.showToast('💥 JACKPOT MIKU!');

    const big = createImg('assets/judges/miku.png', 400);
    new Audio('assets/sounds/miku.mp3').play();
    gsap.fromTo(big,
      {
        x: width / 2 - 200,
        y: height / 2 - 200,
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)"
      }
    );
  }

  // ==========================
  // PERSO
  // ==========================
  if (winner.type === 'perso') {

    this.showToast('💥 JACKPOT PERSO!');

    const perso = createImg('assets/judges/perso.png', 350);

    gsap.fromTo(perso,
      { x: -400, y: height / 2 - 150 },
      { x: width / 2 - 150, duration: 1 }
    );

    const bubble = document.createElement('div');
    bubble.innerText = 'Yo no debería estar aquí...';
    bubble.className = 'global-speech';
    overlay.appendChild(bubble);

    gsap.fromTo(bubble,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 1 }
    );

    setTimeout(() => {

      for (let i = 0; i < 60; i++) {
        const gear = createEmoji('🔩', 30);
        gsap.fromTo(gear,
          { x: Math.random() * width, y: -50 },
          { y: height + 50, duration: 3 + Math.random() }
        );
      }

      this.showToast('🤖 Perso dejó un mensaje para Tri...');

    }, 2500);
  }

  // Fade out y cleanup
  setTimeout(() => {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => overlay.remove()
    });
    this.showToast('Este evento es tan raro que me debes fotobuba :P')
  }, 6000);
  
}
  /* ================================
     BOTONES DE TEST
  ================================= */

  testEvent(type: string) {
    const fake = this.specialSymbols.find(s => s.type === type);
    if (fake) this.triggerEvent(fake);
  }

}