import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DoorStatus } from '../../models/door-status';

import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  toggle = false;
  canvasEl = document.createElement('canvas');
  ctx = this.canvasEl.getContext('2d');
  particles = [];
  ratio = window.innerHeight < 400 ? 0.6 : 1;
  counter = 0;
  radiusOfCircle = 120;
  r = 0;
  frameRate = interval(1000 / 80);
  currentPortalInstance: Subscription;
  portalStatus: Subscription;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.createElement();
    this.currentPortalInstance = this.frameRate.subscribe(this.loop.bind(this, true));
    this.getGarageDoorStatus();
    const checkRate = interval(1000 * 3);
    this.portalStatus = checkRate.subscribe(this.getGarageDoorStatus.bind(this));
    window.addEventListener('resize', this.createElement.bind(this), true);
  }

  ngOnDestroy() {
    this.currentPortalInstance.unsubscribe();
    this.currentPortalInstance = null;
    this.portalStatus.unsubscribe();
    this.portalStatus = null;
    this.frameRate = null;
  }

  toggleGarageDoor(): void {
    this.httpService.toggleGarageDoor().subscribe((data: DoorStatus) => {
      if (data.doorStatus === this.toggle) {
        return;
      }
      this.toggle = data.doorStatus;
      this.togglePortal();
    });
  }

  togglePortal(): void {
    if (!this.toggle) {
      document.querySelector('.portal-wrapper').innerHTML = '';
      this.counter = 0;
      this.particles = [];
      this.createElement();
    }
    this.loop();
  }

  getGarageDoorStatus(): void {
    this.httpService.getGarageDoorStatus().subscribe((data: DoorStatus) => {
      if (data.doorStatus === this.toggle) {
        return;
      }
      this.toggle = data.doorStatus;
      this.togglePortal();
    });
  }

  createElement() {
    const scale = this.ratio;
    this.canvasEl.width = window.innerWidth - 32;
    this.canvasEl.height = window.innerHeight - 200;
    this.ctx.transform(
      scale,
      0,
      0,
      -scale,
      this.canvasEl.width / 2,
      this.canvasEl.height / 2
    );
    document.querySelector('.portal-wrapper').innerHTML = '';
    document.querySelector('.portal-wrapper').appendChild(this.canvasEl);
    for (let i = 0; i < 400; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    this.particles.push({
      color:
        Math.random() > 0.5 ? 'rgba(63, 81, 181, 1)' : 'rgba(63, 81, 181, 0.4)',
      radius: Math.random() * 5,
      x: Math.cos(Math.random() * 7 + Math.PI) * this.r,
      y: Math.sin(Math.random() * 7 + Math.PI) * this.r,
      ring: Math.random() * this.r * 3,
      move: (Math.random() * 4 + 1) / 500,
      random: Math.random() * 7
    });
  }

  moveParticle(p) {
    p.ring = Math.max(p.ring - 1, this.r);
    p.random += p.move;
    p.x = Math.cos(p.random + Math.PI) * p.ring;
    p.y = Math.sin(p.random + Math.PI) * p.ring;
  }

  resetParticle(p) {
    p.ring = Math.random() * this.r * 3;
    p.radius = Math.random() * 5;
  }

  disappear(p) {
    if (p.radius < 0.8) {
      this.resetParticle(p);
    }
    p.radius *= 0.994;
  }

  draw(p) {
    this.ctx.beginPath();
    this.ctx.fillStyle = p.color;
    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop(firstTime?: boolean) {
    this.ctx.clearRect(
      -this.canvasEl.width,
      -this.canvasEl.height,
      this.canvasEl.width * 2,
      this.canvasEl.height * 2
    );
    if (this.counter < this.particles.length && !this.toggle) {
      this.counter++;
      if (this.r < this.radiusOfCircle) {
        this.r++;
      }
    } else if (this.counter > 1 && this.toggle) {
      if (this.r > 1) {
        this.r--;
      }
    }
    if (firstTime) {
      if (this.counter < this.particles.length) {
        this.counter++;
      }
    }

    for (let i = 0; i < this.counter; i++) {
      this.disappear(this.particles[i]);
      this.moveParticle(this.particles[i]);
      this.draw(this.particles[i]);
    }

    this.loop.bind(this);
  }

}
