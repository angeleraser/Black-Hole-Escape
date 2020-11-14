const blackHoleElement = document.querySelector('#black-hole');
const theBigBlack_mp3 = document.querySelector('#level-music');
const rocketElement = document.querySelector('#rocket');
const safeZone = document.querySelector('#safe-zone');
const BAR_LINE = document.querySelector('#bar-line');
const starsBackground = document.querySelector('#background');
const percentageProgress = document.querySelector('#percentage');
const blackHoleFace = document.querySelector('#face');
const key1 = document.querySelector('#key1');
const key2 = document.querySelector('#key2');
const keysCounterElement = document.querySelector('#keys-counter');
const playButton = document.querySelector('.play-button');
const mainScreen = document.querySelector('.main-screen');
const levelPassScreen = document.querySelector('.level-pass');
const gameTitle = document.querySelector('.game-title');
const autor = document.querySelector('.autor');
const keyTapSound = document.querySelector('#key-tap');
const failSound = document.querySelector('#fail-sound');
const space = document.querySelector('#space');
class BlackHole {
  constructor(element, safeZone, face) {
    this.blackHole = element;
    this.safeZone = safeZone;
    this.face = face;
  }

  getOffSetWidth() {
    return this.blackHole.offsetWidth;
  }
  getAnimationName() {
    return this.blackHole.style.animationName
  }
  setTransitionTime(timing, duration) {
    if (timing) this.blackHole.style.transitionDuration = `.${duration}s`
  }
  growing(size) {
    this.blackHole.style.height = `${size}rem`;
    this.blackHole.style.width = `${size}rem`;
  }
  setAnimation(name, duration) {
    this.blackHole.style.animationName = `${name}`;
    this.blackHole.style.animationDuration = `.${duration}s`
  }
  setBoxShadow(x, y) {
    this.blackHole.style.boxShadow = `${x}px ${y}px 15px 15px`
  }
  setGrowAnimation(timing, grow, animationName, animationDuration) {
    if (timing) {
      this.growing(grow);
      this.setAnimation(animationName, animationDuration)
    }
  }
  showHiddenFace() {
    if (this.getAnimationName() !== 'rotate') {
      this.face.style.visibility = 'visible';
    } else {
      this.face.style.visibility = 'hidden';
    }
  }
  initState() {
    this.blackHole.style.left = '1.2rem';
    this.setGrowAnimation(true, 3, '', '');
    this.face.style.visibility = 'hidden'
  }
  gameOverAnimation() {
    failSound.currentTime = 0;
    failSound.play();
    this.setGrowAnimation(true, 8, 'dance', 6);
    this.showHiddenFace();
    this.setTransitionTime(true, '6');
    this.blackHole.style.left = '35%';
  }

}
class Rocket {
  constructor(element) {
    this.rocket = element;
    this.distance = 0;
  }
  keyPressEvents(key1, key2) {
    this.keyupEvent(key1);
    this.keyupEvent(key2);
    this.keydownEvent(key1);
    this.keydownEvent(key2);
    key1.clickEvents();
    key2.clickEvents();
  }
  setMinPosition(min, rocketDistance) {
    this.rocket.style.left = `${min + this.distance}px`
  }
  keyupEvent(key) {
    let {
      letter: keyLetter,
      isPressingKey
    } = key;
    document.addEventListener('keyup', (e) => {
      if (e.key == keyLetter) {
        key.press(false);
        playTapSound();
        key.toggleKeyStyle('remove');
        switch (keyLetter) {
          case 's':
            if (keysToPress % 2 == 0) {
              this.increaseDistance();
              keysCounter.decreaseCount();
            }
            break;
          case 'd':
            if (keysToPress % 2 !== 0) {
              this.increaseDistance();
              keysCounter.decreaseCount();
            }
            break;
          default:
            break;
        }
      }
    });
  }
  keydownEvent(key) {
    let {
      letter: keyLetter,
      isPressingKey,
    } = key;
    document.addEventListener('keydown', (e) => {
      if (e.key == keyLetter) {
        key.press(true);
        key.toggleKeyStyle('add');
      }
    })
  }
  evaluateKeysPressed(key1, key2) {
    let {
      isPressingKey: pressinKeyOne
    } = key1, {
      isPressingKey: pressinKeyTwo
    } = key2;
    if (pressinKeyOne && pressinKeyTwo) {
      ROCKET.distance -= 30;
    }
    return pressinKeyOne && pressinKeyTwo
  }
  increaseDistance() {
    if (this.distance < safeZoneLength * .5) {
      this.distance += 12;
    };
  }
  decreaseDistance(num) {
    if (this.distance > 0) this.distance -= num;
  }
  initState() {
    this.rocket.style.transform = 'scale(1) rotate(45deg)';
    this.rocket.style.animationName = '';
  }
  deadAnimation() {
    this.rocket.style.transform = 'scale(.01)';
    this.rocket.style.animationName = 'rotate';
  }
}
class Background {
  constructor(element) {
    this.element = element
  }
  setAnimation(animationName, animationDuration, timing) {
    if (timing) {
      this.element.style.animationName = `${animationName}`;
      this.element.style.animationDuration = `${animationDuration}`;
    }
  }
  removeAnimation(timing) {
    this.setAnimation('', '', timing);
  }
}
class Space {
  constructor(element) {
    this.element = element;
  }
  reverse(deg, timing) {
    if (timing) this.element.style.transform = `rotate(${deg}deg)`
  }
  changeBgColorAnimation(animationName, animationDuration, timing) {
    if (timing) {
      space.style.animationName = animationName;
      space.style.animationDuration = animationDuration;
    }
  }
  setAnimationDuration(animationDuration, timing) {
    if (timing) space.style.animationDuration = animationDuration;
  }
  removeBgAnimation(timing) {
    if (timing) {
      space.style.animationName = '';
      space.style.animationDuration = '';
    }
  }
  initState() {
    this.removeBgAnimation(true)
  }
}
class PressingKeys {
  constructor(element, letter) {
    this.key = element;
    this.letter = letter;
    this.isPressingKey = false;
  }
  press(con) {
    this.isPressingKey = con;
  }
  clickEvents() {
    this.onClickUp();
    this.onClickDown();
  }
  toggleKeyStyle(method) {
    switch (method) {
      case 'add':
        this.key.classList.add('button-active');
        break;
      case 'remove':
        this.key.classList.remove('button-active');
        break;
      default:
        break;
    }
  }
  onClickDown() {
    this.key.addEventListener('mousedown', () => {
      this.press(true);
      this.toggleKeyStyle('add');
    })
  }
  onClickUp() {
    let keyLetter = (this.key.innerText).toLowerCase();
    this.key.addEventListener('mouseup', () => {
      this.press(false);
      playTapSound();
      this.toggleKeyStyle('remove');
      switch (keyLetter) {
        case 's':
          if (keysToPress % 2 == 0) {
            ROCKET.increaseDistance();
            keysCounter.decreaseCount();
          }
          break;
        case 'd':
          if (keysToPress % 2 !== 0) {
            ROCKET.increaseDistance();
            keysCounter.decreaseCount();
          }
          break;
        default:
          break;
      }
    })
  }
}
class KeyCounter {
  constructor(element) {
    this.element = element;
  }
  setCurrentCount() {
    this.element.innerText = `${keysToPress}`;
  }
  decreaseCount() {
    if (keysToPress > 0) keysToPress -= 1;
  }
}
const updateLevelProgressBar = percentage => {
  BAR_LINE.style.width = `${percentage}%`
}
const setBackgroundAnimation = (animationName, animationDuration, timing) => {
  if (timing) {
    starsBackground.style.animationName = `${animationName}`;
    starsBackground.style.animationDuration = `${animationDuration}`;
  }
}
const levelPassScreenText = (text, timeout = 4000) => {
  levelPassScreen.style.top = '0%';
  levelPassScreen.innerHTML = `${text}`;
  setTimeout(() => {
    levelPassScreen.style.top = '-100%';
  }, timeout);
};
const showRetryScreen = (time) => {
  setTimeout(() => {
    mainScreen.style.visibility = 'visible';
    mainScreen.style.backgroundColor = 'hsla(240, 70%, 3%,.95)';
    gameTitle.style.display = 'none';
    autor.style.display = 'none';
    playButton.innerText = '-RETRY-';
    SPACE.removeBgAnimation(true)
  }, time);
}
const showFinalScreen = () => {
  mainScreen.style.visibility = 'visible';
  mainScreen.style.backgroundColor = 'hsla(240, 70%, 3%,.95)';
  mainScreen.innerHTML = 'The end.'
}
const playTapSound = () => {
  keyTapSound.currentTime = 0;
  keyTapSound.play();
}
const span = (text) => `<span class='stage'>${text}</span>`;
const timing = (lapse1, lapse2 = lapse1 + 1) => ((currentPercentage >= lapse1 && currentPercentage <= lapse2));
const BLACK_HOLE = new BlackHole(blackHoleElement, safeZone, blackHoleFace);
const ROCKET = new Rocket(rocketElement);
const BACKGROUND = new Background(starsBackground);
const SPACE = new Space(safeZone);
const keysCounter = new KeyCounter(keysCounterElement);
theBigBlack_mp3.volume = .8;
// theBigBlack_mp3.currentTime = 
let keysToPress = 0;
const safeZoneLength = safeZone.offsetWidth - BLACK_HOLE.getOffSetWidth();
ROCKET.distance = Number((safeZoneLength * .5).toFixed(0));
let currentSongTime = 0;
let currentPercentage = 0;
let gameInterval = null;
let keyOne = new PressingKeys(key1, 's');
let keyTwo = new PressingKeys(key2, 'd');
let keysPressed = [keyOne, keyTwo];
const gameOver = () => {
  theBigBlack_mp3.pause();
  theBigBlack_mp3.currentTime = 0;
  currentPercentage = 0;
  ROCKET.distance = Number((safeZoneLength * .4).toFixed(0));
  ROCKET.deadAnimation();
  keysToPress = 0;
  setTimeout(() => {
    BLACK_HOLE.gameOverAnimation();
  }, 100);
  showRetryScreen(800)
  clearInterval(gameInterval);
}
const playGame = () =>{
  {
    mainScreen.style.visibility = 'hidden';
    failSound.pause(); {
      BLACK_HOLE.initState();
      ROCKET.initState();
      SPACE.initState();
      theBigBlack_mp3.play();
      ROCKET.keyPressEvents(keyOne, keyTwo);
      gameInterval = setInterval(() => {
        updateLevelProgressBar(currentPercentage);
        ROCKET.evaluateKeysPressed(keyOne, keyTwo);
        keysCounter.setCurrentCount();
        currentSongTime = theBigBlack_mp3.currentTime;
        currentPercentage = Number(((currentSongTime * 100) / theBigBlack_mp3.duration).toFixed(1));
        ROCKET.setMinPosition(BLACK_HOLE.getOffSetWidth(), ROCKET.distance);
        percentageProgress.innerText = `${currentPercentage.toFixed(0)}%`
        if (timing(13, 100)) {
          BLACK_HOLE.showHiddenFace();
        };
        BACKGROUND.setAnimation('transition', '2s', timing(0));
  
        if (timing(0, 2)) levelPassScreenText('Keep the distance from Black Hole by tapping alternately the red buttons S & D')
        // LEVEL 1 from 5% to 28% 
        if (timing(4)) levelPassScreenText(`${span('- STAGE 1 -')}Tap S & D 200 times.`);
        BLACK_HOLE.setGrowAnimation(timing(4.7), 5, 'rotate', 45);
        if (timing(4.7, 4.8)) keysToPress = 200;
        if (timing(5, 28) && keysToPress > 0) {
          ROCKET.decreaseDistance(2);
        }
        if (timing(28, 28.01) && keysToPress == 0) {
          levelPassScreenText('¡LEVEL COMPLETED!');
        }
  
        BACKGROUND.setAnimation('transition', '.6s', timing(4.7));
        BLACK_HOLE.setGrowAnimation(timing(8.4), 7, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(10.4), 8, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(10.7), 6, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(11.2), 8, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(11.4), 5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(11.7), 8, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(12), 6, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(12.2), 9, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(12.3), 10.5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(12.6), 4, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(12.8), 6, 'shake', 1);
        BACKGROUND.setAnimation('transition', '.3s', timing(13.2));
        BLACK_HOLE.setGrowAnimation(timing(13.1), 9, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(13.8, ), 6, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(14.6), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(14.9), 5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(15.4), 7, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(16), 9, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(16.2), 5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(16.7), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(17.1), 6, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(17.2), 4, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(17.5), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(18.3), 5, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(19), 7, 'rotate', 1);
        BLACK_HOLE.setGrowAnimation(timing(19.3), 9, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(20), 7, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(20.3), 8.5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(20.5), 6, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(21), 4, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(21.3), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(21.5), 5, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(22), 8.5, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(22.3), 6, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(23), 4, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(23.5), 7, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(24), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(24.3), 5, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(24.6), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(25.2), 6, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(25.5), 5, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(25.8), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(26), 3, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(26.1), 9, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(26.3), 4, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(26.5), 9, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(26.8), 5, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(27.2), 7, 'rotate', 25);
        BLACK_HOLE.setGrowAnimation(timing(27.4), 8, 'shake', 1);
        BLACK_HOLE.setGrowAnimation(timing(27.8), 4, 'rotate', 55);
  
        // Verify if the keys goal is not completed 
        if (timing(28) && keysToPress > 0) gameOver();
  
        // BREAK TIME  28% to 35%
        BACKGROUND.setAnimation('transition', '.6s', timing(28));
  
        // LEVEL 2 from 35% to 60%
        if (timing(35)) {
          levelPassScreenText(`${span('- STAGE 2 -')}Tap 250 times.`);
        }
        if (timing(35.5, 35.6)) keysToPress = 250;
        if (timing(35.5, 59) && keysToPress > 0) {
          ROCKET.decreaseDistance(3);
        }
        BLACK_HOLE.setGrowAnimation(timing(35.5), 5, 'rotate', 55);
        BACKGROUND.setAnimation('transition', '.5s', timing(35.5));
        BLACK_HOLE.setTransitionTime(timing(42), 2)
        BLACK_HOLE.setGrowAnimation(timing(42.7), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(43.1), 4, 'rotate', 25);
        BACKGROUND.removeAnimation(timing(43.1));
        BLACK_HOLE.setGrowAnimation(timing(43.2), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(43.3), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(43.4), 4, 'shake2', 1);
        SPACE.reverse(180, timing(43.4));
        BACKGROUND.setAnimation('rotate', '.4s', timing(43.3))
        BACKGROUND.setAnimation('transition', '.1s', timing(43.5));
        SPACE.changeBgColorAnimation('changeColors1', '.1s', timing(43.5));
        BACKGROUND.removeAnimation(timing(44.2));
        BLACK_HOLE.setGrowAnimation(timing(44.2), 8, 'shake2', 1);
        SPACE.setAnimationDuration('5s', timing(44.2));
        SPACE.reverse(0, timing(44.4));
        BLACK_HOLE.setGrowAnimation(timing(44.4), 4, 'shake2', 1);
        SPACE.setAnimationDuration('.1s', timing(44.4));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(44.5));
        BACKGROUND.removeAnimation(timing(45.1));
        BLACK_HOLE.setGrowAnimation(timing(45.1), 9, 'shake2', 1);
        SPACE.setAnimationDuration('5s', timing(45.1));
        BLACK_HOLE.setGrowAnimation(timing(45.3), 5, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(45.3));
        SPACE.setAnimationDuration('.1s', timing(45.3));
        BLACK_HOLE.setGrowAnimation(timing(46.1), 9, 'shake2', 1);
        SPACE.setAnimationDuration('.3s', timing(46.1));
        BACKGROUND.setAnimation('transition', '.1s', timing(46.1));
        BLACK_HOLE.setGrowAnimation(timing(46.3), 3, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(46.3));
        BLACK_HOLE.setGrowAnimation(timing(46.5), 6, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.3s', timing(46.5));
        BLACK_HOLE.setGrowAnimation(timing(46.7), 8, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(46.7));
        BLACK_HOLE.setGrowAnimation(timing(46.8), 5, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(46.8));
        BLACK_HOLE.setGrowAnimation(timing(47.1), 7, 'shake2', 1);
        SPACE.removeBgAnimation(timing(47.1))
        BACKGROUND.removeAnimation(timing(47.1));
        BACKGROUND.setAnimation('transition', '.1s', timing(47.3));
        BLACK_HOLE.setGrowAnimation(timing(47.4), 9, 'shake2', 1);
        SPACE.setAnimationDuration('.2s', timing(47.4));
        BLACK_HOLE.setGrowAnimation(timing(47.6), 4, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(47.8));
        BLACK_HOLE.setGrowAnimation(timing(48), 8, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(48));
        BLACK_HOLE.setGrowAnimation(timing(48.2), 5, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(48.2));
        BLACK_HOLE.setGrowAnimation(timing(48.7), 9, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.3s', timing(48.7));
        BLACK_HOLE.setGrowAnimation(timing(48.9), 4, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(48.8));
        BACKGROUND.removeAnimation(timing(49.2));
        BACKGROUND.setAnimation('rotate', '.3s', timing(49.3));
        BLACK_HOLE.setGrowAnimation(timing(49.7), 9, 'shake2', 1);
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(49.9));
        BLACK_HOLE.setGrowAnimation(timing(49.9), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(50.3), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(50.4), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(50.5), 8, 'shake2', 1);
        SPACE.reverse(180, timing(51));
        BLACK_HOLE.setGrowAnimation(timing(51), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(51.2), 7, 'shake2', 1);
        SPACE.changeBgColorAnimation('changeColors1', '.1s', timing(51));
        SPACE.setAnimationDuration('.1s', timing(51.2));
        SPACE.reverse(0, timing(51.9));
        BLACK_HOLE.setGrowAnimation(timing(51.9), 9, 'shake2', 1);
        SPACE.reverse(180, timing(52.8));
        BLACK_HOLE.setGrowAnimation(timing(52.8), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(53), 3, 'shake2', 1);
        SPACE.setAnimationDuration('.2s', timing(53));
        BLACK_HOLE.setGrowAnimation(timing(53.2), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(53.3), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(53.4), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(53.7), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(53.9), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.2), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.3), 8, 'shake2', 1);
        SPACE.reverse(0, timing(54.4));
        BACKGROUND.setAnimation('rotate', '.3s', timing(54.4));
        BACKGROUND.setAnimation('transition', '.1s', timing(54.6));
        BLACK_HOLE.setGrowAnimation(timing(54), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.2), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.3), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.4), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.7), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(54.9), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(55), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(55.2), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(55.3), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(55.4), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(55.7), 3, 'shake2', 1);
        SPACE.reverse(180, timing(55.7));
        BLACK_HOLE.setGrowAnimation(timing(55.9), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(56), 6, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(56.2), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(56.3), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(56.4), 9, 'shake2', 1);
        SPACE.reverse(0, timing(56.4));
        BLACK_HOLE.setGrowAnimation(timing(56.7), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(56.9), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(57), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(57.2), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(57.3), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(57.4), 9, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.3s', timing(57.3));
        BLACK_HOLE.setGrowAnimation(timing(57.7), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(57.9), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(58), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(58.1), 9, 'shake2', 1);
        SPACE.setAnimationDuration('2s', timing(58.1));
        BLACK_HOLE.setGrowAnimation(timing(58.3), 4, 'shake2', 1);
        SPACE.removeBgAnimation(timing(58.4));
        BACKGROUND.setAnimation('transition', '.6s', timing(58.4));
  
        // Verify if the keys goal is not completed 
        if (timing(59) && keysToPress > 0) gameOver();
        if (timing(59) && keysToPress == 0) levelPassScreenText('¡LEVEL COMPLETED!');
  
        // BREAK TIME 58% to 73%
        BLACK_HOLE.setGrowAnimation(timing(58.6), 5, 'rotate', 55);
        // LEVEL 3 from 66% to 100% 
        if (timing(66.1, 66.2)) keysToPress = 350;
        if (timing(66)) {
          levelPassScreenText(`${span('- FINAL STAGE -')}Tap 350 times.`);
        }
        if (timing(66.1, 98) && keysToPress > 0) {
          ROCKET.decreaseDistance(4);
        }
        BLACK_HOLE.setGrowAnimation(timing(66.1), 7, 'rotate', 35);
        BACKGROUND.setAnimation('transition', '.5s', timing(66.1));
        BACKGROUND.setAnimation('transition', '.4s', timing(73.2));
        BLACK_HOLE.setGrowAnimation(timing(73.2), 3, 'rotate', 45);
        BACKGROUND.setAnimation('transition', '.6s', timing(4.7));
        BLACK_HOLE.setGrowAnimation(timing(76.8), 5, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(78.7), 7, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(78.8), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(79), 7, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(79.2), 4, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(79.3), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(79.4), 4, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(79.5), 3, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(79.6), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(79.7), 5, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(79.9), 7, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(80.1), 8.5, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(80.2), 9.5, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(80.3), 10, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(80.6), 5, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(80.9), 9, 'rotate', 35);
        BLACK_HOLE.setGrowAnimation(timing(81.1), 2, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.2s', timing(81.1));
        BACKGROUND.removeAnimation(timing(81.3));
        BLACK_HOLE.setGrowAnimation(timing(81.4), 6, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(81.4));
        BLACK_HOLE.setGrowAnimation(timing(81.4), 3, 'scale', 1);
        SPACE.changeBgColorAnimation('changeColors2', '.2s', timing(81.4));
        BACKGROUND.removeAnimation(timing(82.1));
        BLACK_HOLE.setGrowAnimation(timing(82.1), 6, 'shake', 1);
        SPACE.setAnimationDuration('1s', timing(82.1));
        BACKGROUND.setAnimation('rotate', '.2s', timing(82.25));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(82.4));
        SPACE.setAnimationDuration('.2s', timing(82.4));
        SPACE.removeBgAnimation(timing(82.4))
        BACKGROUND.removeAnimation(timing(83));
        BLACK_HOLE.setGrowAnimation(timing(83), 9, 'shake2', 1);
        SPACE.setAnimationDuration('1s', timing(83));
        BACKGROUND.setAnimation('rotate', '.3s', timing(83));
        BLACK_HOLE.setGrowAnimation(timing(83.2), 5, 'shake2', 1);
        SPACE.reverse(180, timing(83.2));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(83.3))
        SPACE.setAnimationDuration('.2s', timing(83.3));
        BLACK_HOLE.setGrowAnimation(timing(83.4), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(83.5), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(83.6), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(83.7), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(83.8), 8, 'shake2', 1);
        BLACK_HOLE.setTransitionTime(timing(84), 1);
        SPACE.changeBgColorAnimation('changeColors1', '.15s', timing(84));
        BLACK_HOLE.setGrowAnimation(timing(84.1), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.2), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.3), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.4), 5, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.5), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.6), 3, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.7), 7, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(84.8), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(85.1), 3, 'scale', 1);
        SPACE.changeBgColorAnimation('changeColors2', '.2s', timing(85.1));
        BLACK_HOLE.setGrowAnimation(timing(85.7), 6, 'shake2', 1);
        SPACE.reverse(0, timing(85.9));
        SPACE.setAnimationDuration('.5s', timing(85.9));
        BLACK_HOLE.setGrowAnimation(timing(86), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(86.2), 5, 'shake2', 1);
        SPACE.reverse(180, timing(86.5));
        BACKGROUND.setAnimation('rotate', '.2s', timing(86.5));
        SPACE.reverse(0, timing(86.7));
        BACKGROUND.setAnimation('transition', '.1s', timing(86.7));
        BLACK_HOLE.setGrowAnimation(timing(86.8), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(87), 2, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(87.2), 6, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.2s', timing(87.6));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(87.8));
        BLACK_HOLE.setGrowAnimation(timing(87.9), 9, 'shake2', 1);
        SPACE.changeBgColorAnimation('changeColors2', '2s', timing(87.9));
        BACKGROUND.removeAnimation(timing(88.1));
        BLACK_HOLE.setGrowAnimation(timing(88.3), 2, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(88.7));
        SPACE.changeBgColorAnimation('changeColors1', '.1s', timing(88.7));
        BLACK_HOLE.setGrowAnimation(timing(88.7), 4, 'scale', 1);
        BLACK_HOLE.setGrowAnimation(timing(89.3), 8, 'shake2', 1);
        SPACE.changeBgColorAnimation('changeColors2', '.2s', timing(89.3));
        BACKGROUND.setAnimation('rotate', '.2s', timing(89.4));
        BLACK_HOLE.setGrowAnimation(timing(89.8), 3, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(89.8));
        SPACE.removeBgAnimation(timing(89.8))
        SPACE.reverse(180, timing(90.5));
        SPACE.changeBgColorAnimation('changeColors1', '.2s', timing(90.5));
        BLACK_HOLE.setGrowAnimation(timing(90.5), 5, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.2s', timing(90.2));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(90.5));
        BLACK_HOLE.setGrowAnimation(timing(90.8), 2, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(91), 8, 'shake2', 1);
        SPACE.reverse(0, timing(91.2));
        BLACK_HOLE.setGrowAnimation(timing(91.4), 4, 'scale', 1);
        SPACE.changeBgColorAnimation('changeColors2', '.3s', timing(91.4));
        BLACK_HOLE.setGrowAnimation(timing(92.4), 4, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.2s', timing(92.6));
        BLACK_HOLE.setGrowAnimation(timing(92.4), 7, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(92.9))
        SPACE.reverse(180, timing(92.9));
        SPACE.removeBgAnimation(timing(92.9))
        BLACK_HOLE.setGrowAnimation(timing(93.1), 2, 'shake2', 1);
        BACKGROUND.setAnimation('rotate', '.2s', timing(93));
        SPACE.reverse(180, timing(93.2));
        BACKGROUND.setAnimation('transitionReverse', '.1s', timing(93.2));
        BLACK_HOLE.setGrowAnimation(timing(93.4), 8, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(93.8), 3, 'shake2', 1);
        SPACE.reverse(0, timing(94.1));
        SPACE.changeBgColorAnimation('changeColors1', '.2s', timing(94.1));
        BLACK_HOLE.setGrowAnimation(timing(94.2), 8, 'shake2', 1);
        BACKGROUND.setAnimation('transition', '.1s', timing(94.2));
        BACKGROUND.setAnimation('rotate', '.2s', timing(94.4));
        BLACK_HOLE.setGrowAnimation(timing(94.4), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(94.6), 9, 'shake2', 1);
        BACKGROUND.removeAnimation(timing(94.4));
        BACKGROUND.setAnimation('transition', '.1s', timing(94.6));
        BLACK_HOLE.setGrowAnimation(timing(95), 4, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(95.2), 9, 'shake2', 1);
        BLACK_HOLE.setGrowAnimation(timing(96.2), 5, 'rotate', 25);
        BACKGROUND.setAnimation('transition', '.2s', timing(96.2));
        SPACE.removeBgAnimation(timing(96.1));
        // Verify if the keys goal is not completed 
        if (timing(97) && keysToPress > 0) gameOver();
        if (timing(97) && keysToPress == 0) levelPassScreenText('¡You escaped from the Black Hole!', 2000);
        // END... 
        if (currentPercentage == 100) {
          clearInterval(gameInterval)
        };
        if (ROCKET.distance <= 0) {
          gameOver();
        }
        if (currentPercentage == 97 && ROCKET.distance > 0) {
          BLACK_HOLE.setTransitionTime(true, 9)
          BLACK_HOLE.blackHole.style.left = '-100%';
          setTimeout(() => {
            showFinalScreen();
          }, 2000);
        }
      }, 100);
    }
  }
}
window.addEventListener('load', (e)=>{
  playButton.addEventListener('click', playGame)
})
