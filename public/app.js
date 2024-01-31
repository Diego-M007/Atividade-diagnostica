const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const app = express();

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: false
}));

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: 'aluno',
    database: 'atividade1'
});

connection.connect();

// Rotas
app.get('/', (req, res) => {
    // Página inicial (HOME)
    res.render('home');
});

app.get('/sobre', (req, res) => {
    // Página SOBRE
    res.render('sobre');
});

app.get('/contato', (req, res) => {
    // Página CONTATO
    res.render('contato');
});

app.get('/login', (req, res) => {
    // Página de login
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica se o usuário e a senha correspondem ao administrador
    if (username === 'admin' && password === 'admin') {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

app.get('/admin', (req, res) => {
    // Verifica se o usuário está logado como admin
    if (req.session.admin) {
        res.render('admin');
    } else {
        res.redirect('/login');
    }
});

app.post('/postagem', (req, res) => {
    // Rota para criar uma nova postagem
    const { titulo, conteudo } = req.body;

    // Verifica se o usuário está logado como admin
    if (req.session.admin) {
        const postagem = { titulo, conteudo };
        connection.query('INSERT INTO postagens SET ?', postagem, (error, results) => {
            if (error) throw error;
            res.redirect('/admin');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/postagens', (req, res) => {
    connection.query('SELECT * FROM postagens ORDER BY data DESC', (error, results) => {
        if (error) throw error;
        res.render('postagens', { postagens: results });
    });
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
