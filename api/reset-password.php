<?php
header('Content-Type: application/json');
session_start();

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$code = $data['code'] ?? '';
$newPassword = $data['new_password'] ?? '';

if (empty($email) || empty($code) || empty($newPassword)) {
    echo json_encode(['success' => false, 'error' => 'Не все данные указаны']);
    exit;
}

// Проверяем, не истек ли срок действия кода (10 минут)
if (!isset($_SESSION['reset_time']) || time() - $_SESSION['reset_time'] > 600) {
    echo json_encode(['success' => false, 'error' => 'Срок действия кода истек']);
    exit;
}

// Проверяем email и код
if ($_SESSION['reset_email'] !== $email || $_SESSION['reset_code'] !== $code) {
    echo json_encode(['success' => false, 'error' => 'Неверный код подтверждения']);
    exit;
}

// Подключаемся к базе данных
$db = new SQLite3('database.sqlite');

// Хешируем новый пароль
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Обновляем пароль в базе данных
$stmt = $db->prepare('UPDATE users SET password = :password WHERE email = :email');
$stmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
$stmt->bindValue(':email', $email, SQLITE3_TEXT);

if ($stmt->execute()) {
    // Очищаем данные восстановления из сессии
    unset($_SESSION['reset_code']);
    unset($_SESSION['reset_email']);
    unset($_SESSION['reset_time']);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка обновления пароля']);
}

$db->close(); 