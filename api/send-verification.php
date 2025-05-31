<?php
header('Content-Type: application/json');

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
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

// Настройки для отправки письма
$to = $email;
$subject = 'Подтверждение email для игры Кликер';
$message = "
<html>
<head>
    <title>Подтверждение email</title>
</head>
<body>
    <h2>Подтверждение email для игры Кликер</h2>
    <p>Ваш код подтверждения: <strong>{$verificationCode}</strong></p>
    <p>Код действителен в течение 10 минут.</p>
    <p>Если вы не запрашивали подтверждение email, проигнорируйте это письмо.</p>
</body>
</html>
";

// Заголовки письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: Clicker Game <noreply@clicker.com>\r\n";

// Отправляем письмо
$mailSent = mail($to, $subject, $message, $headers);

if ($mailSent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки письма']);
}
?> 