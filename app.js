class SimonGame {
  constructor() {
    this.gameSequence = [];
    this.userSequence = [];
    this.gameButtons = ["yellow", "red", "purple", "green"];
    this.isRunning = false;
    this.strictMode = false;
    this.soundOn = true;
    this.level = 0;
    this.highScore = 0;
    
    // DOM Elements
    this.gameMessage = document.getElementById("gameMessage");
    this.currentLevelDisplay = document.getElementById("currentLevel");
    this.highScoreDisplay = document.getElementById("highScore");
    this.startBtn = document.getElementById("startBtn");
    this.strictBtn = document.getElementById("strictBtn");
    this.soundBtn = document.getElementById("soundBtn");
    this.powerLight = document.querySelector(".power-light");
    this.allBtns = document.querySelectorAll(".btn");
    
    // Initialize
    this.initEventListeners();
    this.updateDisplay();
  }
  
  initEventListeners() {
    // Start button
    this.startBtn.addEventListener("click", () => {
      if (!this.isRunning) {
        this.startGame();
      } else {
        this.resetGame();
      }
    });
    
    // Strict mode toggle
    this.strictBtn.addEventListener("click", () => {
      this.strictMode = !this.strictMode;
      this.strictBtn.classList.toggle("active");
      this.gameMessage.textContent = this.strictMode ? 
        "STRICT MODE: ON - One mistake and game over!" : 
        "STRICT MODE: OFF";
      setTimeout(() => this.updateGameMessage(), 2000);
    });
    
    // Sound toggle
    this.soundBtn.addEventListener("click", () => {
      this.soundOn = !this.soundOn;
      this.soundBtn.classList.toggle("active");
      this.gameMessage.textContent = this.soundOn ? 
        "SOUND: ON" : "SOUND: OFF";
      setTimeout(() => this.updateGameMessage(), 2000);
    });
    
    // Game buttons
    this.allBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (this.isRunning) {
          this.handleButtonPress(e.currentTarget);
        }
      });
    });
    
    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !this.isRunning) {
        this.startGame();
      }
    });
  }
  
  startGame() {
    this.isRunning = true;
    this.level = 0;
    this.gameSequence = [];
    this.userSequence = [];
    this.powerLight.classList.add("on");
    this.powerLight.classList.remove("off");
    this.startBtn.innerHTML = '<i class="fas fa-redo"></i> RESTART';
    this.nextLevel();
  }
  
  nextLevel() {
    this.level++;
    this.userSequence = [];
    this.updateDisplay();
    
    // Add new random color to sequence
    const randomIndex = Math.floor(Math.random() * 4);
    const randomColor = this.gameButtons[randomIndex];
    this.gameSequence.push(randomColor);
    
    // Play the sequence
    this.playSequence();
  }
  
  playSequence() {
    this.gameMessage.textContent = `Watch carefully... Level ${this.level}`;
    this.disableButtons();
    
    let i = 0;
    const interval = setInterval(() => {
      if (i >= this.gameSequence.length) {
        clearInterval(interval);
        this.gameMessage.textContent = `Your turn! Repeat the sequence`;
        this.enableButtons();
        return;
      }
      
      const color = this.gameSequence[i];
      const button = document.getElementById(color);
      this.animateButton(button, "gameFlash");
      this.playSound(color);
      i++;
    }, 800);
  }
  
  handleButtonPress(button) {
    const color = button.id;
    this.userSequence.push(color);
    
    this.animateButton(button, "userFlash");
    this.playSound(color);
    
    // Check if user's sequence matches so far
    const currentIndex = this.userSequence.length - 1;
    if (this.userSequence[currentIndex] !== this.gameSequence[currentIndex]) {
      this.handleWrongSequence();
      return;
    }
    
    // Check if user completed the sequence
    if (this.userSequence.length === this.gameSequence.length) {
      this.handleCorrectSequence();
    }
  }
  
  handleCorrectSequence() {
    if (this.soundOn) {
      const levelUpSound = document.getElementById("levelUpSound");
      levelUpSound.currentTime = 0;
      levelUpSound.play();
    }
    
    this.gameMessage.classList.add("level-up");
    this.gameMessage.textContent = "Perfect! Next level...";
    
    setTimeout(() => {
      this.gameMessage.classList.remove("level-up");
      this.nextLevel();
    }, 1500);
  }
  
  handleWrongSequence() {
    if (this.soundOn) {
      const gameOverSound = document.getElementById("gameOverSound");
      gameOverSound.currentTime = 0;
      gameOverSound.play();
    }
  
    this.gameMessage.classList.add("game-over");
    this.gameMessage.textContent = `Wrong sequence! Level ${this.level}`;
  
    if (this.strictMode) {
      setTimeout(() => {
        this.gameOver();
      }, 1500);
    } else {
      setTimeout(() => {
        this.gameMessage.classList.remove("game-over");
        this.gameMessage.textContent = "Try again...";
        this.userSequence = []; // Reset user sequence before replaying
        this.playSequence();
      }, 1500);
    }
  }
  
  playSequence() {
    this.gameMessage.textContent = `Watch carefully... Level ${this.level}`;
    this.disableButtons();
    this.userSequence = []; // Reset user sequence at start of each sequence play
  
    let i = 0;
    const interval = setInterval(() => {
      if (i >= this.gameSequence.length) {
        clearInterval(interval);
        this.gameMessage.textContent = `Your turn! Repeat the sequence`;
        this.enableButtons();
        return;
      }
  
      const color = this.gameSequence[i];
      const button = document.getElementById(color);
      this.animateButton(button, "gameFlash");
      this.playSound(color);
      i++;
    }, 800);
  }
  
  gameOver() {
    this.isRunning = false;
    this.powerLight.classList.remove("on");
    this.powerLight.classList.add("off");
    this.startBtn.innerHTML = '<i class="fas fa-play"></i> START';
    
    // Update high score
    if (this.level > this.highScore) {
      this.highScore = this.level;
      this.highScoreDisplay.textContent = this.highScore;
    }
    
    this.gameMessage.classList.remove("game-over");
    this.gameMessage.textContent = `Game Over! Your score: ${this.level}. Press START to play again`;
    this.updateDisplay();
  }
  
  resetGame() {
    this.isRunning = false;
    this.gameOver();
  }
  
  animateButton(button, animationClass) {
    button.classList.add(animationClass);
    setTimeout(() => {
      button.classList.remove(animationClass);
    }, 300);
  }
  
  playSound(color) {
    if (!this.soundOn) return;
    
    const sound = document.getElementById(color === "yellow" ? "C4" : 
                  color === "red" ? "E4" : 
                  color === "purple" ? "G4" : "A4");
    sound.currentTime = 0;
    sound.play();
  }
  
  disableButtons() {
    this.allBtns.forEach(btn => {
      btn.style.pointerEvents = "none";
    });
  }
  
  enableButtons() {
    this.allBtns.forEach(btn => {
      btn.style.pointerEvents = "auto";
    });
  }
  
  updateDisplay() {
    this.currentLevelDisplay.textContent = this.isRunning ? this.level : "0";
    this.highScoreDisplay.textContent = this.highScore;
  }
  
  updateGameMessage() {
    if (!this.isRunning) {
      this.gameMessage.textContent = "Press START to play";
    } else {
      this.gameMessage.textContent = `Level ${this.level}`;
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const game = new SimonGame();
});