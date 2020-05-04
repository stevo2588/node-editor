import web from '../shared/web';
import Api from './api';

const api = new Api();

web(api);
