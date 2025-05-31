<?php
header('Content-Type: application/json');

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$code = $data['code'] ?? '';

if (empty($email) || empty($code)) {
    echo json_encode(['success' => false, 'error' => 'Не указан email или код']);
    exit;
}

// Проверяем код
session_start();

// Проверяем, не истекло ли время действия кода (10 минут)
if (!isset($_SESSION['verification_time']) || (time() - $_SESSION['verification_time']) > 600) {
    echo json_encode(['success' => false, 'error' => 'Код истек. Запросите новый код.']);
    exit;
}

// Проверяем email и код
if ($_SESSION['verification_email'] === $email && $_SESSION['verification_code'] === $code) {
    // Очищаем данные верификации
    unset($_SESSION['verification_code']);
    unset($_SESSION['verification_email']);
    unset($_SESSION['verification_time']);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Неверный код']);
}
?> 