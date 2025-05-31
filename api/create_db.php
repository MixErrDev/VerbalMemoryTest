<?php
// Подключение к базе данных
$db = new SQLite3('memory_test.db');

// Создаем таблицу пользователей
$db->exec('
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        username TEXT,
        age INTEGER,
        gender TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

echo "База данных успешно создана\n";
?> 