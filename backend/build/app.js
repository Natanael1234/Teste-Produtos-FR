"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express_1.default();
app.use(cors());
app.use(bodyParser.json());
var port = 3000;
app.post('/produto', function (req, res) {
    res.send(req.body);
});
app.listen(port, function () {
    console.log("Servidor - ouvindo na porta: " + port);
});
//# sourceMappingURL=app.js.map