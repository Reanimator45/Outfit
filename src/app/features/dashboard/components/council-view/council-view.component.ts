import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Judge = {
  name: string;
  image: string;
  visible: boolean;
  vote: any | null;
};

@Component({
  selector: 'app-council-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './council-view.component.html',
  styleUrls: ['./council-view.component.css']
})
export class CouncilViewComponent {

  @Input() options: any[] = [];

  judges = signal<Judge[]>([
    { name: 'perso', image: 'assets/judges/perso.png', visible: false, vote: null },
    { name: 'miku', image: 'assets/judges/miku.png', visible: false, vote: null },
    { name: 'bobi', image: 'assets/judges/bobi.png', visible: false, vote: null }
  ]);

  winner = signal<any>(null);
  voting = signal(false);

  startCouncil() {

    if (!this.options.length) return;

    this.voting.set(true);
    this.winner.set(null);

    this.judges.update(list => {
      list.forEach(j => {
        j.visible = false;
        j.vote = null;
      });
      return [...list];
    });

    const opts = [...this.options];

    const majority =
      opts[Math.floor(Math.random() * opts.length)];

    let minority = majority;

    if (opts.length > 1) {
      const pool = opts.filter(o => o !== majority);
      minority =
        pool[Math.floor(Math.random() * pool.length)];
    }

    const order = [0,1,2].sort(()=>Math.random()-.5);

    const plan = [
      { judge: order[0], choice: majority },
      { judge: order[1], choice: majority },
      { judge: order[2], choice: minority }
    ];

    plan.forEach((p,index)=>{

      setTimeout(()=>{

        this.judges.update(list=>{
          list[p.judge].visible = true;
          list[p.judge].vote = p.choice;
          return [...list];
        });

        if(index===2){

          setTimeout(()=>{
            this.winner.set(majority);
            this.voting.set(false);
          },1200);

        }

      },1800*(index+1));

    });

  }

}
