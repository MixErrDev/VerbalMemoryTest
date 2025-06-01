import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trial-process',
  standalone: true,
  imports: [],
  templateUrl: './trial-processRu.component.html'
})
export class TrialProcessComponent implements OnInit, OnDestroy{
  private clickCount: number = 0;
  private assetsCount: number = 5;
  private answerAssets: {id: number, urlImg: string, letter: string}[];
  private currentAsset: {id: number, urlImg: string, letter: string};
  private isCorrect: boolean;
  private isClicked: boolean;
  private timeoutCheck: any;
  private timeoutNext: any;
  timeoutClicked: any;
  private correctLetterIndex: number;

  private assets = [
    { id: 1, urlImg: "assets/pictures/1.png", letter: 'Р' },
    { id: 2, urlImg: "assets/pictures/2.png", letter: 'А' },
    { id: 3, urlImg: "assets/pictures/3.png", letter: 'А' },
    { id: 4, urlImg: "assets/pictures/4.png", letter: 'А' },
    { id: 5, urlImg: "assets/pictures/5.png", letter: 'Б' }
  ];

  image: any;
  button: any;
  correct: any;
  incorrect: any;
  countdown: any;
  lettersBlock: any;
  letters: any;
  randomLetter;
  usedLetters;


  constructor(private router: Router) {}


  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  ngOnInit(): void {
    this.shuffle(this.assets);

    this.image = <HTMLImageElement> document.getElementById('image-showed');
    this.correct = document.getElementById('correct');
    this.incorrect = document.getElementById('incorrect');
    this.countdown = document.getElementById('countdown');
    this.lettersBlock = document.querySelector('.letters-block');
    this.letters = this.lettersBlock.children;

    for (let i = 0; i < 4; i++) {
      this.letters[i].addEventListener('click', () => {
        this.clickHandler(i);
      });
    }


    this.correct.style.display = 'none';
    this.incorrect.style.display = 'none';
    this.lettersBlock.style.display = 'none';
    this.image.style.display = 'none';

    this.startCount();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutNext);
    clearTimeout(this.timeoutCheck);
  }


  startCount() {
    let count = 3;
    
    this.countdown.style.display = 'block';
    const interval = setInterval(() => {
      this.countdown.innerHTML = count.toString(); // display countdown numbers (3, 2, 1)
      count--;
      if (count === 0) {
        clearInterval(interval);
        setTimeout(() => {
          this.countdown.style.display = 'none';
          this.showImages();
        }, 1000); // wait 1 seconds before showing images
      }
    }, 1000);
  }


  showImages() {
    clearTimeout(this.timeoutCheck);
    this.lettersBlock.style.display = 'none'
    this.image.style.display = 'block';

    if (this.clickCount === this.assetsCount){
      this.clickCount = 0;
      this.router.navigate(['/verbal-memory/main/start']);  
    }
  
    this.currentAsset = this.assets[this.clickCount];
    this.image.src = this.currentAsset.urlImg;
  
    this.timeoutNext = setTimeout(() => {
      this.image.style.display = 'none';
      this.showLetters();
    }, 3000)
  }


  showLetters() {
    this.isClicked = false;
    this.clickCount++;
    let randomLetter;

    this.lettersBlock.style.display = 'block';

    this.correctLetterIndex = Math.floor(Math.random() * 4);
    this.letters[this.correctLetterIndex].textContent = this.currentAsset.letter;

    // Массив русских букв, исключая "ъ" и "ы"
    const russianLetters = [
        'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и',
        'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т',
        'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я'
    ];

    this.usedLetters = [this.currentAsset.letter.toLowerCase()];

    for (let i = 0; i < 4; i++) {
        if (i !== this.correctLetterIndex) {
            do {
                // Выбор случайной буквы из массива русских букв
                randomLetter = russianLetters[Math.floor(Math.random() * russianLetters.length)];
            } while (this.usedLetters.includes(randomLetter));

            this.usedLetters.push(randomLetter);
            this.letters[i].textContent = randomLetter.toUpperCase();
        }
    }
    this.usedLetters = [];

    // Логика таймера
    clearTimeout(this.timeoutCheck);
    this.timeoutCheck = setTimeout(() => {
        if (!this.isClicked) {
            this.checkPass();
        }
    }, 3000);
}


  checkPass() {
    this.incorrect.style.display = 'block';
    setTimeout(() => {
      this.incorrect.style.display = 'none';
      this.showImages();
    }, 1000)
  }

  clickHandler(i) {
    clearTimeout(this.timeoutCheck);
    if (this.letters[i].textContent === this.currentAsset.letter) {
      this.letters[i].style.border = '2px solid #95c11f';
      this.letters[i].style.background = '#95c11f';
    } else {
      console.log('okkkkk')
      this.letters[i].style.border = '2px solid #c11f1f';
      this.letters[i].style.background = '#c11f1f';
    }

    this.timeoutClicked = setTimeout(() => {
        this.letters[i].style.border = '2px solid #fbbb21';
        this.letters[i].style.background = '';

        this.showImages();

    }, 1000)
    
  }
}
