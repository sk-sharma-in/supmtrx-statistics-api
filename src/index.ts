import { Server } from './server';
import { routes } from './api/routes';

Server(routes);

// list.sort((a,b) => b.created_time - a.created_time);
// var months = [...new Set(list.map(item => new Date(item.created_time).getMonth()))].length;

// var charLength = list.reduce(((count, item) => count + item.message.length ), 0);
// var longestPost = list.reduce(((count, item) => count >= item.from_id.length ? count: item.from_id.length), 0);

