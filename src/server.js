import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
const dotenv = require('dotenv');
import { v4 as uuidv4 } from 'uuid';
import * as sapper from '@sapper/server';
const MongoClient = require('mongodb');

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

dotenv.config();
const app = polka();

MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('variants');
        const rooms = db.collection('rooms');

        app.use(function(req, res, next) {
            res.redirect = location => {
                let str = `Redirecting to ${location}`;
                res.writeHead(302, {
                    Location: location,
                    'Content-Type': 'text/plain',
                    'Content-Length': str.length,
                });
                res.end(str);
            };
            next();
        });

        // n, g, c
        app.get('/api/create/', (req, res) => {
            console.log(req.query);
            const id = uuidv4();
            let teams = [];
            for (let i = 0; i < req.query.c; i++) {
                teams[i] = [];
            }
            rooms.insertOne({
                "id": id, 
                "name": req.query.n,
                "group": req.query.g,
                "memberCount": req.query.c,
                "teams": teams
            });

            res.redirect(`${process.env.URL}/room/?id=${id}`);
        });

        // id
        app.get('/api/join/', (req, res) => {
            rooms.findOne({ "id": req.query.id }).then(room => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(room));
                res.end();
            });
        });

        // id, team, name
        app.get('/api/select/', (req, res) => {
            rooms.findOne({ "id": req.query.id }).then(room => {
                room.teams[req.query.team].push(req.query.name);
                rooms.findOneAndReplace({ "id": req.query.id }, room).then(() => res.end());
            });
        });

        // id, team, name
        app.get('/api/delete/', (req, res) => {
            rooms.findOne({ "id": req.query.id }).then(room => {
                const index = room.teams[req.query.team].indexOf(req.query.name);
                if (index > -1) {
                    room.teams[req.query.team].splice(index, 1);
                }
                rooms.findOneAndReplace({ "id": req.query.id }, room).then(() => res.end());
            });
        });

        app.use(
            compression({ threshold: 0 }),
            sirv('static', { dev }),
            sapper.middleware() 
        )
        .listen(PORT, err => {
            if (err) console.log('error', err);
        });
    });