<?php
// Secure contact form handler for Miguel Guerrero's portfolio
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set content type to JSON
header('Content-Type: application/json');

// CSRF Protection - Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Rate limiting (simple session-based)
session_start();
$rate_limit_key = 'contact_last_sent';
$rate_limit_seconds = 60; // 1 minute between submissions

if (isset($_SESSION[$rate_limit_key]) && 
    (time() - $_SESSION[$rate_limit_key]) < $rate_limit_seconds) {
    http_response_code(429);
    echo json_encode(['error' => 'Please wait before sending another message']);
    exit;
}

// Input validation
$required_fields = ['name', 'email', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate email
if (!empty($_POST['email']) && !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address';
}

// Validate name (no HTML/script tags)
if (!empty($_POST['name']) && (strlen($_POST['name']) > 100 || preg_match('/<[^>]*>/', $_POST['name']))) {
    $errors[] = 'Invalid name format';
}

// Validate message length
if (!empty($_POST['message']) && (strlen($_POST['message']) > 5000 || strlen($_POST['message']) < 10)) {
    $errors[] = 'Message must be between 10 and 5000 characters';
}

// Check for spam patterns
$spam_patterns = ['/\b(viagra|cialis|casino|lottery|winner)\b/i', '/http[s]?:\/\//i'];
$message_content = $_POST['message'] ?? '';
foreach ($spam_patterns as $pattern) {
    if (preg_match($pattern, $message_content)) {
        $errors[] = 'Message contains prohibited content';
        break;
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(strip_tags(trim($_POST['name'])), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$phone = !empty($_POST['phone']) ? htmlspecialchars(strip_tags(trim($_POST['phone'])), ENT_QUOTES, 'UTF-8') : '';
$message = htmlspecialchars(strip_tags(trim($_POST['message'])), ENT_QUOTES, 'UTF-8');

// Email configuration
$to = 'miguel@saturdays.ai'; // Updated to your actual email
$subject = 'Portfolio Contact: ' . $name;
$email_body = "New contact form submission:\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
if (!empty($phone)) {
    $email_body .= "Phone: $phone\n";
}
$email_body .= "\nMessage:\n$message\n\n";
$email_body .= "---\n";
$email_body .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
$email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "Time: " . date('Y-m-d H:i:s') . "\n";

// Secure headers to prevent header injection
$headers = [
    'From' => 'noreply@apolmig.github.io',
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Priority' => '3'
];

$header_string = '';
foreach ($headers as $key => $value) {
    $header_string .= $key . ': ' . $value . "\r\n";
}

// Send email
if (mail($to, $subject, $email_body, $header_string)) {
    $_SESSION[$rate_limit_key] = time();
    echo json_encode(['success' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}
?>
