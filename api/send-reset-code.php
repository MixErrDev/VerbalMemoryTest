<?php
header('Content-Type: application/json');
session_start();

// Получаем email из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'error' => 'Email не указан']);
    exit;
}

// Генерируем 6-значный код
$resetCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

// Сохраняем код и email в сессии
$_SESSION['reset_code'] = $resetCode;
$_SESSION['reset_email'] = $email;
$_SESSION['reset_time'] = time();

// Формируем HTML-письмо
$message = "
<html>
<head>
    <title>Восстановление пароля</title>
</head>
<body>
    <h2>Восстановление пароля</h2>
    <p>Вы запросили восстановление пароля. Используйте следующий код для сброса пароля:</p>
    <h1 style='color: #4CAF50; font-size: 24px;'>{$resetCode}</h1>
    <p>Код действителен в течение 10 минут.</p>
    <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
</body>
</html>
";

// Заголовки для HTML-письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@yourdomain.com\r\n";

// Отправляем письмо
if (mail($email, 'Восстановление пароля', $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки письма']);
} 