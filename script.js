// Pegando os elementos HTML
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

let score = 0;
let isGameOver = false;

// Propriedades do jogador (avião)
let playerX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
const playerSpeed = 5;

// Mísseis
let missiles = [];

// Alvos
let targets = [];
const targetSpeed = 3;

// Função para mover o avião apenas para os lados
function movePlayer(dx) {
    playerX += dx;

    // Previne que o avião saia da tela
    if (playerX < 0) playerX = 0;
    if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;

    player.style.left = playerX + 'px';
}

// Função para disparar mísseis
function shootMissile() {
    if (isGameOver) return;

    const missile = document.createElement('div');
    missile.classList.add('missile');
    missile.style.left = playerX + player.offsetWidth / 2 - 2 + 'px'; // Alinha o míssil com o avião
    missile.style.bottom = player.offsetHeight + 10 + 'px'; // Mísseis saem de cima do avião
    gameContainer.appendChild(missile);

    missiles.push(missile);

    // Movimento do míssil
    const missileInterval = setInterval(() => {
        missile.style.bottom = parseInt(missile.style.bottom) + 5 + 'px';

        // Verifica se o míssil saiu da tela
        if (parseInt(missile.style.bottom) >= gameContainer.offsetHeight) {
            clearInterval(missileInterval);
            missile.remove();
        }

        // Verifica colisão com alvos
        targets.forEach((target, index) => {
            const missileRect = missile.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            if (
                missileRect.left < targetRect.right &&
                missileRect.right > targetRect.left &&
                missileRect.top < targetRect.bottom &&
                missileRect.bottom > targetRect.top
            ) {
                target.remove();
                missile.remove();
                targets.splice(index, 1);
                score += 10;
                scoreElement.innerText = 'Pontuação: ' + score;
            }
        });
    }, 10);
}

// Função para criar alvos
function createTarget() {
    if (isGameOver) return;

    const target = document.createElement('div');
    target.classList.add('target');
    target.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
    target.style.top = '0px';
    gameContainer.appendChild(target);

    targets.push(target);

    // Movimento do alvo
    const targetInterval = setInterval(() => {
        target.style.top = parseInt(target.style.top) + targetSpeed + 'px';

        // Verifica se o alvo saiu da tela
        if (parseInt(target.style.top) >= gameContainer.offsetHeight) {
            clearInterval(targetInterval);
            target.remove();
            targets = targets.filter(t => t !== target);
            gameOver();
        }
    }, 20);
}

// Função para encerrar o jogo
function gameOver() {
    isGameOver = true;
    gameOverElement.style.display = 'block';
}

// Movimentação do jogador com as setas do teclado (somente para os lados)
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.code === 'ArrowLeft') movePlayer(-playerSpeed); // Move para a esquerda
    if (e.code === 'ArrowRight') movePlayer(playerSpeed); // Move para a direita

    // Disparar com a tecla de espaço
    if (e.code === 'Space') shootMissile();
});

// Criação de alvos a cada 2 segundos
setInterval(createTarget, 2000);

// Inicializar o jogo
function startGame() {
    score = 0;
    isGameOver = false;
    scoreElement.innerText = 'Pontuação: ' + score;
    gameOverElement.style.display = 'none';
}

startGame();
