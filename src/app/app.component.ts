import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  inputDir = { x: 0, y: 0 };
  foodSound = new Audio('assets/music/food.mp3');
  gameOverSound = new Audio('assets/music/gameover.mp3');
  moveSound = new Audio('assets/music/move.mp3');
  musicSound = new Audio('assets/music/music.mp3');
  speed = 5;
  score = 0;
  lastPaintTime = 0;
  snakeArr = [{ x: 1, y: 3 }];
  @ViewChild('boardElement', { static: false }) boardElement: ElementRef | undefined;

  food = { x: 6, y: 7 };
  hiscoreval: number = 0;
  constructor(private renderer: Renderer2) {

  }
  ngOnInit() {
    let hiscore = localStorage.getItem('hiscore');
    if (hiscore === null) {
      this.hiscoreval = 0;
      localStorage.setItem('hiscore', JSON.stringify(this.hiscoreval));
    } else {
      this.hiscoreval = JSON.parse(hiscore);
    }

    window.requestAnimationFrame(this.main.bind(this));
  }

  main(ctime: any) {
    window.requestAnimationFrame(this.main.bind(this));
    if ((ctime - this.lastPaintTime) / 1000 < 1 / this.speed) {
      return;
    }
    this.lastPaintTime = ctime;
    setTimeout(() => {
      this.gameEngine();
    }, 100);
  }

  isCollide(snake: any) {
    // If you bump into yourself
    for (let i = 1; i < this.snakeArr.length; i++) {
      if (
        snake[i].x === this.snakeArr[0].x &&
        snake[i].y === this.snakeArr[0].y
      ) {
        return true;
      }
    }
    // If you bump into the wall
    if (
      this.snakeArr[0].x >= 18 ||
      this.snakeArr[0].x <= 0 ||
      this.snakeArr[0].y >= 18 ||
      this.snakeArr[0].y <= 0
    ) {
      return true;
    }

    return false;
  }

  gameEngine() {
    // Part 1: Updating the snake array & Food
    this.musicSound.play();

    if (this.isCollide(this.snakeArr)) {
      this.gameOverSound.play();
      this.musicSound.pause();
      this.inputDir = { x: 0, y: 0 };
      alert('Game Over. Press any key to play again!');
      this.snakeArr = [{ x: 1, y: 3 }];
      this.musicSound.play();
      this.score = 0;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (
      this.snakeArr[0].y === this.food.y &&
      this.snakeArr[0].x === this.food.x
    ) {
      this.foodSound.play();
      this.score += 1;
      if (this.score > this.hiscoreval) {
        this.hiscoreval = this.score;
        localStorage.setItem('hiscore', JSON.stringify(this.hiscoreval));
      }
      this.snakeArr.unshift({
        x: this.snakeArr[0].x + this.inputDir.x,
        y: this.snakeArr[0].y + this.inputDir.y
      });
      let a = 2;
      let b = 16;
      this.food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random())
      };
    }

    // Moving the snake
    for (let i = this.snakeArr.length - 2; i >= 0; i--) {
      this.snakeArr[i + 1] = { ...this.snakeArr[i] };
    }

    this.snakeArr[0].x += this.inputDir.x;
    this.snakeArr[0].y += this.inputDir.y;

    // Part 2: Display the snake and Food

    if (this.boardElement) {
      this.boardElement.nativeElement.innerHTML = ''
    }
    this.snakeArr.forEach((e, index) => {
      const snakeElement = document.createElement('div');
      snakeElement.style.gridRowStart = e.y as unknown as string;
      snakeElement.style.gridColumnStart = e.x as unknown as string;

      if (index === 0) {
        let eye1 = document.createElement('div');
        let eye2 = document.createElement('div');
        eye1.className = 'eye1'
        eye1.style.background = 'black !important';
        eye1.style.border = '2px solid black';
        eye1.style.margin = '10px';
        eye1.style.borderRadius = '87px';
        eye1.style.height = '2px';
        eye1.style.width = '2px';
        eye1.style.marginLeft = '4px';
        eye1.style.marginBottom = '4px';
        snakeElement.appendChild(eye1)

        eye2.className = 'eye2'
        eye2.style.background = 'black !important';
        eye2.style.border = '2px solid black';
        // eye1.style.margin = '10px';
        eye2.style.borderRadius = '33px';
        eye2.style.height = '2px';
        eye2.style.width = '2px';
        eye2.style.marginLeft = '14px!important;'
        eye2.style.marginTop = '-10px';

        snakeElement.appendChild(eye2)
        snakeElement.classList.add('head');

      } else {
        snakeElement.classList.add('snake');
      }
      if (this.boardElement) {
        snakeElement.style.background = 'linear-gradient(rgb(240, 124, 124), rgb(228, 228, 129))';
        snakeElement.style.border = '2px solid rgb(34, 4, 34)'
        snakeElement.style.transform = 'scale(1.02)'
        snakeElement.style.borderRadius = '9px'
        this.boardElement.nativeElement.appendChild(snakeElement);
      }
    });
    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.food.y as unknown as string;
    foodElement.style.gridColumnStart = this.food.x as unknown as string;;
    foodElement.classList.add('food');
    if (this.boardElement) {
      foodElement.style.background = 'linear-gradient(red, purple)';
      foodElement.style.border = '.25vmin solid black';
      foodElement.style.borderRadius = '18px';
      this.renderer.appendChild(this.boardElement.nativeElement, foodElement);
    }

  }

  // Add @HostListener to handle keyboard events
  @HostListener('window:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    this.inputDir = { x: 0, y: 1 }; // Start the game
    this.moveSound.play();
    switch (event.key) {
      case 'ArrowUp':
        console.log('ArrowUp');
        this.inputDir.x = 0;
        this.inputDir.y = -1;
        break;

      case 'ArrowDown':
        console.log('ArrowDown');
        this.inputDir.x = 0;
        this.inputDir.y = 1;
        break;

      case 'ArrowLeft':
        console.log('ArrowLeft');
        this.inputDir.x = -1;
        this.inputDir.y = 0;
        break;

      case 'ArrowRight':
        console.log('ArrowRight');
        this.inputDir.x = 1;
        this.inputDir.y = 0;
        break;
      default:
        break;
    }
  }
}
