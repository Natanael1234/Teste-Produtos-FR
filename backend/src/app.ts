import express, { Request, Response } from 'express';
var cors = require('cors');
const bodyParser = require('body-parser');

const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
const port: number = 3000;

app.post('/produto', (req: Request, res: Response)=>{
    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Servidor - ouvindo na porta: ${port}`);
});