<?php
require_once 'cors.php';

// Настройки сессии
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Установите в 1, если используете HTTPS
ini_set('session.cookie_samesite', 'Lax');
session_start();

// Подключение к базе данных
$db = new SQLite3('memory_test.db');

// Создаем таблицу test_results, если она не существует
$db->exec('CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    score INTEGER NOT NULL,
    percent INTEGER NOT NULL,
    level TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)');

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
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        session_write_close(); // Сохраняем сессию

        echo json_encode(['success' => true, 'username' => $user['username']]);
        break;

    case 'user-data':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Не авторизован']);
            exit;
        }

        $stmt = $db->prepare('SELECT email, username, age, gender FROM users WHERE id = :id');
        $stmt->bindValue(':id', $_SESSION['user_id'], SQLITE3_INTEGER);
        $result = $stmt->execute();
        $userData = $result->fetchArray(SQLITE3_ASSOC);

        if ($userData) {
            echo json_encode(['success' => true, 'data' => $userData]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Пользователь не найден']);
        }
        break;

    case 'user-results':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Не авторизован']);
            exit;
        }

        $stmt = $db->prepare('SELECT date, score, percent, level FROM test_results WHERE user_id = :user_id ORDER BY date DESC');
        $stmt->bindValue(':user_id', $_SESSION['user_id'], SQLITE3_INTEGER);
        $result = $stmt->execute();
        
        $results = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $results[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $results]);
        break;

    case 'delete-account':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Не авторизован']);
            exit;
        }

        $userId = $_SESSION['user_id'];

        // Начинаем транзакцию
        $db->exec('BEGIN TRANSACTION');

        try {
            // Удаляем результаты тестов пользователя
            $stmt = $db->prepare('DELETE FROM test_results WHERE user_id = :user_id');
            $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
            $stmt->execute();

            // Удаляем пользователя
            $stmt = $db->prepare('DELETE FROM users WHERE id = :id');
            $stmt->bindValue(':id', $userId, SQLITE3_INTEGER);
            $stmt->execute();

            // Завершаем транзакцию
            $db->exec('COMMIT');

            // Очищаем сессию
            session_destroy();

            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            // В случае ошибки откатываем транзакцию
            $db->exec('ROLLBACK');
            echo json_encode(['success' => false, 'error' => 'Ошибка при удалении аккаунта']);
        }
        break;

    case 'save_test_result':
        // Очищаем любой предыдущий вывод
        if (ob_get_level()) ob_end_clean();
        
        // Устанавливаем заголовки
        header('Content-Type: application/json; charset=utf-8');
        
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Не авторизован']);
            exit;
        }

        // Получаем и декодируем данные
        $input = file_get_contents('php://input');
        error_log('Raw input: ' . $input);
        
        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('JSON decode error: ' . json_last_error_msg());
            echo json_encode(['success' => false, 'error' => 'Ошибка при разборе данных: ' . json_last_error_msg()]);
            exit;
        }
        
        // Отладочная информация
        error_log('Received data: ' . print_r($data, true));
        error_log('Session user_id: ' . $_SESSION['user_id']);

        // Проверяем наличие всех необходимых полей
        if (!isset($data['score']) || !isset($data['percent']) || !isset($data['level'])) {
            echo json_encode(['success' => false, 'error' => 'Отсутствуют необходимые поля']);
            exit;
        }

        // Преобразуем и проверяем значения
        $score = filter_var($data['score'], FILTER_VALIDATE_INT);
        $percent = filter_var($data['percent'], FILTER_VALIDATE_INT);
        $level = htmlspecialchars(trim($data['level']), ENT_QUOTES, 'UTF-8');

        error_log('Processed values - score: ' . $score . ', percent: ' . $percent . ', level: ' . $level);

        if ($score === false || $score < 0) {
            echo json_encode(['success' => false, 'error' => 'Некорректное значение результата: ' . $data['score']]);
            exit;
        }

        if ($percent === false || $percent < 0 || $percent > 100) {
            echo json_encode(['success' => false, 'error' => 'Некорректное значение процента: ' . $data['percent']]);
            exit;
        }

        if (empty($level)) {
            echo json_encode(['success' => false, 'error' => 'Некорректное значение уровня: ' . $data['level']]);
            exit;
        }

        try {
            // Проверяем существование таблицы
            $tableExists = $db->querySingle("SELECT name FROM sqlite_master WHERE type='table' AND name='test_results'");
            
            if (!$tableExists) {
                // Создаем таблицу, если она не существует
                $db->exec('CREATE TABLE IF NOT EXISTS test_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    score INTEGER NOT NULL,
                    percent INTEGER NOT NULL,
                    level TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )');
            } else {
                // Проверяем наличие всех необходимых колонок
                $columns = $db->query("PRAGMA table_info(test_results)");
                $existingColumns = [];
                while ($column = $columns->fetchArray(SQLITE3_ASSOC)) {
                    $existingColumns[$column['name']] = true;
                }
                
                // Добавляем отсутствующие колонки
                if (!isset($existingColumns['percent'])) {
                    $db->exec('ALTER TABLE test_results ADD COLUMN percent INTEGER NOT NULL DEFAULT 0');
                }
                if (!isset($existingColumns['level'])) {
                    $db->exec('ALTER TABLE test_results ADD COLUMN level TEXT NOT NULL DEFAULT ""');
                }
            }

            $sql = 'INSERT INTO test_results (user_id, score, percent, level) VALUES (:user_id, :score, :percent, :level)';
            error_log('SQL query: ' . $sql);
            
            $stmt = $db->prepare($sql);
            if ($stmt === false) {
                throw new Exception('Failed to prepare statement: ' . $db->lastErrorMsg());
            }

            $stmt->bindValue(':user_id', $_SESSION['user_id'], SQLITE3_INTEGER);
            $stmt->bindValue(':score', $score, SQLITE3_INTEGER);
            $stmt->bindValue(':percent', $percent, SQLITE3_INTEGER);
            $stmt->bindValue(':level', $level, SQLITE3_TEXT);

            $result = $stmt->execute();
            
            if ($result) {
                $response = ['success' => true, 'message' => 'Результат успешно сохранен'];
                error_log('Sending response: ' . json_encode($response));
                echo json_encode($response);
            } else {
                $error = 'Ошибка при сохранении результата: ' . $db->lastErrorMsg();
                error_log('SQLite error: ' . $error);
                echo json_encode(['success' => false, 'error' => $error]);
            }
        } catch (Exception $e) {
            $error = 'Ошибка при сохранении результата: ' . $e->getMessage();
            error_log('Exception: ' . $error);
            echo json_encode(['success' => false, 'error' => $error]);
        }
        exit;
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Неизвестное действие']);
}
?> 