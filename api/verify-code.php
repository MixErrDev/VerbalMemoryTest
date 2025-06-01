<?php
require_once 'cors.php';

// Включаем отображение ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$code = $data['code'] ?? '';

// Для отладки
error_log("Received email: " . $email);
error_log("Received code: " . $code);

if (empty($email) || empty($code)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email или код не указаны']);
    exit;
}

// Читаем последний код из файла
$logFile = 'verification_codes.log';
$codes = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$lastCode = end($codes);

if (!$lastCode) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Код не найден']);
    exit;
}

// Парсим последнюю запись
preg_match('/Email: (.*), Code: (\d+)/', $lastCode, $matches);
if (count($matches) !== 3) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Неверный формат кода']);
    exit;
}

$storedEmail = $matches[1];
$storedCode = $matches[2];

// Проверяем email и код
if ($storedEmail !== $email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email не соответствует']);
    exit;
}

if ($storedCode !== $code) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Неверный код']);
    exit;
}

// Проверяем время (10 минут)
preg_match('/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/', $lastCode, $timeMatches);
if (count($timeMatches) !== 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Неверный формат времени']);
    exit;
}

$codeTime = strtotime($timeMatches[1]);
if (time() - $codeTime > 600) { // 10 минут
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Код истек']);
    exit;
}

// Очищаем файл с кодами
file_put_contents($logFile, '');

http_response_code(200);
echo json_encode(['success' => true]);
?> 