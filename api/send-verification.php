<?php
require_once 'cors.php';

// Включаем отображение ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email не указан']);
    exit;
}

// Генерируем 4-значный код
$verificationCode = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

// Сохраняем код в сессии
session_start();
$_SESSION['verification_code'] = $verificationCode;
$_SESSION['verification_email'] = $email;
$_SESSION['verification_time'] = time();

// Для тестирования, сохраняем код в файл
$logFile = 'verification_codes.log';
$logMessage = date('Y-m-d H:i:s') . " - Email: {$email}, Code: {$verificationCode}\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);

// Возвращаем код в ответе для тестирования
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Код подтверждения отправлен',
    'debug' => [
        'code' => $verificationCode,
        'email' => $email
    ]
]);
?> 