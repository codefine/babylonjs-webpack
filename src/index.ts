import './styles/index.scss';
import 'pepjs';

import Game from './components/game';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('#renderCanvas');
    game.doRender();
});