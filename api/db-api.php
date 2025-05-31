<?php
require_once 'cors.php';

// Подключение к базе данных
$db = new SQLite3('memory_test.db');

// Получаем действие из GET параметра
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        // Получаем данные из POST запроса
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $username = $data['username'] ?? '';
        $age = $data['age'] ?? '';
        $gender = $data['gender'] ?? '';

        if (empty($email) || empty($password) || empty($username)) {
            echo json_encode(['success' => false, 'error' => 'Не все поля заполнены']);
            exit;
        }

        // Проверяем, существует ли пользователь
        $stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $result = $stmt->execute();

        if ($result->fetchArray()) {
            echo json_encode(['success' => false, 'error' => 'Пользователь с таким email уже существует']);
            exit;
        }

        // Хешируем пароль
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Добавляем пользователя
        $stmt = $db->prepare('INSERT INTO users (email, password, username, age, gender) VALUES (:email, :password, :username, :age, :gender)');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
        $stmt->bindValue(':username', $username, SQLITE3_TEXT);
        $stmt->bindValue(':age', $age, SQLITE3_INTEGER);
        $stmt->bindValue(':gender', $gender, SQLITE3_TEXT);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Ошибка при регистрации']);
        }
        break;

    case 'login':
        // Получаем данные из POST запроса
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Email и пароль обязательны']);
            exit;
        }

        // Проверяем пользователя
        $stmt = $db->prepare('SELECT id, password, username FROM users WHERE email = :email');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['success' => false, 'error' => 'Неверный email или пароль']);
            exit;
        }

        // Создаем сессию
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        echo json_encode(['success' => true, 'username' => $user['username']]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Неизвестное действие']);
}
?> 