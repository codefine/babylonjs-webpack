import './styles/index.scss';
import 'pepjs';

import Engine from './components/engine';

const engine = new Engine('#renderCanvas');
engine.doRender();