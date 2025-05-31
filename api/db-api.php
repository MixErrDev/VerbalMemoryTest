<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Подключение к базе данных
$db = new SQLite3('verbal_memory.db');

// Создаем таблицы, если их нет
$db->exec('
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT,
        password TEXT,
        email_verified INTEGER DEFAULT 0
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS test_configs (
        test_id TEXT PRIMARY KEY,
        trial_duration INTEGER,
        main_duration INTEGER,
        max_errors INTEGER,
        min_score INTEGER
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id TEXT,
        user_id INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        score INTEGER,
        time_spent INTEGER,
        errors INTEGER,
        correct_answers INTEGER,
        total_questions INTEGER,
        FOREIGN KEY (test_id) REFERENCES test_configs(test_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
');

$db->exec('
    CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE,
        url_image TEXT,
        url_audio TEXT,
        symbol TEXT
    )
');

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Обработка запросов
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($action) {
        case 'get_test_config':
            $testId = $_GET['testId'] ?? '';
            if (empty($testId)) {
                http_response_code(400);
                echo json_encode(['error' => 'Test ID is required']);
                exit;
            }

            $stmt = $db->prepare('SELECT * FROM test_configs WHERE test_id = :test_id');
            $stmt->bindValue(':test_id', $testId, SQLITE3_TEXT);
            $result = $stmt->execute();
            $config = $result->fetchArray(SQLITE3_ASSOC);

            if ($config) {
                echo json_encode($config);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Test configuration not found']);
            }
            break;

        case 'get_test_results':
            $userId = $_GET['userId'] ?? '';
            if (empty($userId)) {
                http_response_code(400);
                echo json_encode(['error' => 'User ID is required']);
                exit;
            }

            $stmt = $db->prepare('
                SELECT * FROM test_results 
                WHERE user_id = :user_id 
                ORDER BY timestamp DESC
            ');
            $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
            $result = $stmt->execute();
            
            $results = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $results[] = $row;
            }
            
            echo json_encode($results);
            break;

        case 'get_assets':
            $word = $_GET['word'] ?? '';
            if (!empty($word)) {
                $stmt = $db->prepare('SELECT * FROM assets WHERE word = :word');
                $stmt->bindValue(':word', $word, SQLITE3_TEXT);
            } else {
                $stmt = $db->prepare('SELECT * FROM assets');
            }
            
            $result = $stmt->execute();
            $assets = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $assets[] = $row;
            }
            
            echo json_encode($assets);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'register':
            $email = $input['email'] ?? '';
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';

            if (empty($email) || empty($username) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'All fields are required']);
                exit;
            }

            $stmt = $db->prepare('INSERT INTO users (email, username, password) VALUES (:email, :username, :password)');
            $stmt->bindValue(':email', $email, SQLITE3_TEXT);
            $stmt->bindValue(':username', $username, SQLITE3_TEXT);
            $stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), SQLITE3_TEXT);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Registration failed']);
            }
            break;

        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                exit;
            }

            $stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
            $stmt->bindValue(':email', $email, SQLITE3_TEXT);
            $result = $stmt->execute();
            $user = $result->fetchArray(SQLITE3_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                exit;
            }

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'username' => $user['username'],
                    'email_verified' => (bool)$user['email_verified']
                ]
            ]);
            break;

        case 'save_test_result':
            if (!isset($input['testId']) || !isset($input['userId'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Test ID and User ID are required']);
                exit;
            }

            $stmt = $db->prepare('
                INSERT INTO test_results (
                    test_id, user_id, score, time_spent, 
                    errors, correct_answers, total_questions
                ) VALUES (
                    :test_id, :user_id, :score, :time_spent,
                    :errors, :correct_answers, :total_questions
                )
            ');

            $stmt->bindValue(':test_id', $input['testId'], SQLITE3_TEXT);
            $stmt->bindValue(':user_id', $input['userId'], SQLITE3_INTEGER);
            $stmt->bindValue(':score', $input['score'], SQLITE3_INTEGER);
            $stmt->bindValue(':time_spent', $input['timeSpent'], SQLITE3_INTEGER);
            $stmt->bindValue(':errors', $input['errors'], SQLITE3_INTEGER);
            $stmt->bindValue(':correct_answers', $input['correctAnswers'], SQLITE3_INTEGER);
            $stmt->bindValue(':total_questions', $input['totalQuestions'], SQLITE3_INTEGER);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save test result']);
            }
            break;

        case 'create_asset':
            if (!isset($input['word']) || !isset($input['urlImage']) || !isset($input['urlAudio'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Word, image URL and audio URL are required']);
                exit;
            }

            $stmt = $db->prepare('
                INSERT INTO assets (word, url_image, url_audio, symbol)
                VALUES (:word, :url_image, :url_audio, :symbol)
            ');

            $stmt->bindValue(':word', $input['word'], SQLITE3_TEXT);
            $stmt->bindValue(':url_image', $input['urlImage'], SQLITE3_TEXT);
            $stmt->bindValue(':url_audio', $input['urlAudio'], SQLITE3_TEXT);
            $stmt->bindValue(':symbol', $input['symbol'] ?? '', SQLITE3_TEXT);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'id' => $db->lastInsertRowID()]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create asset']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'update_asset':
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Asset ID is required']);
                exit;
            }

            $updates = [];
            $params = [];

            if (isset($input['word'])) {
                $updates[] = 'word = :word';
                $params[':word'] = $input['word'];
            }
            if (isset($input['urlImage'])) {
                $updates[] = 'url_image = :url_image';
                $params[':url_image'] = $input['urlImage'];
            }
            if (isset($input['urlAudio'])) {
                $updates[] = 'url_audio = :url_audio';
                $params[':url_audio'] = $input['urlAudio'];
            }
            if (isset($input['symbol'])) {
                $updates[] = 'symbol = :symbol';
                $params[':symbol'] = $input['symbol'];
            }

            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                exit;
            }

            $params[':id'] = $input['id'];
            $sql = 'UPDATE assets SET ' . implode(', ', $updates) . ' WHERE id = :id';
            
            $stmt = $db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value, SQLITE3_TEXT);
            }

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update asset']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    switch ($action) {
        case 'delete_asset':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Asset ID is required']);
                exit;
            }

            $stmt = $db->prepare('DELETE FROM assets WHERE id = :id');
            $stmt->bindValue(':id', $id, SQLITE3_INTEGER);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete asset']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?> 