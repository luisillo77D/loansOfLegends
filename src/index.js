import app from './app.js';
import {connectdb} from './db.js';

const PORT = 3000;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);

connectdb();