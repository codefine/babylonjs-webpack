import './styles/index.scss';
import Game from './components/game';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('#renderCanvas');
    game.createScene();
    game.doRender();
});