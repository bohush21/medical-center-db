const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const db = new sqlite3.Database('./MedicalCenter.db', (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log('Успішно підключено до бази даних Медичного центру.');
    


app.get('/doctors', (req, res) => {
    db.all('SELECT * FROM Doctors', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Сервер запущено! Перевір у браузері: http://localhost:3000/doctors');
});

// POST - додати нового пацієнта (Create)
app.post('/patients', (req, res) => {
    const { full_name, phone } = req.body;
    db.run('INSERT INTO Patients (full_name, phone) VALUES (?, ?)',
        [full_name, phone],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Пацієнта успішно додано', id: this.lastID });
        }
    );
});

// PUT - оновити дані лікаря (Update)
app.put('/doctors/:id', (req, res) => {
    const { specialization } = req.body;
    const { id } = req.params;
    db.run('UPDATE Doctors SET specialization=? WHERE doctor_id=?',
        [specialization, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Дані лікаря оновлено', changes: this.changes });
        }
    );
});

// DELETE - видалити запис на прийом (Delete)
app.delete('/appointments/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM Appointments WHERE appointment_id=?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Запис на прийом видалено' });
    });
});
