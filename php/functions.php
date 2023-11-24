<?php
error_reporting(E_ALL && ~E_WARNING && ~E_DEPRECATED);

require __DIR__ ."/libs/sleekdb/Store.php";
require_once (__DIR__ . "/libs/starters-package-master/Boot.php");
require_once (__DIR__ . "/libs/PHPMailer-master/src/Exception.php");
require_once (__DIR__ . "/libs/PHPMailer-master/src/PHPMailer.php");
require_once (__DIR__ . "/libs/PHPMailer-master/src/SMTP.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use SleekDB\Store;
use dthtoolkit\Session;


if (!function_exists('createUser')) {
    /**
     * @param string $username
     * @param string $password
     * @return array
     */
    function createUser(string $username='', string $password='') {

        $user_id = 0;
        $status = null;
        $error = null;

        try{

            $user = new Store('users',__DIR__.'/databases');

            if(!$user->findOneBy(['username' , '=', $username])) {
                $user->insert([
                    'username' => $username,
                    'password' => md5($password),
                    "createdAt" => date("Y-m-d")
                ]);

                $user_id = $user->getLastInsertedId();
                $status = true;
            } else {
                $status = false;
                $error = 'Exista deja un utilizator cu username-ul specificat!';
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true, 'user_id' => $user_id] : ['status' => false,'error' => $error];
    }


}

if (!function_exists('loginUser')) {

    /**
     * @param string $username
     * @param string $password
     * @return array
     */
    function loginUser(string $username  = '' , string $password='') {
        $user_name = null;
        $user_id = null;

        $status = null;
        $error = null;

        try{

            $user = new Store('users',__DIR__.'/databases');

            $getUser = $user->findOneBy(
                [
                    [
                        ["username", "=", $username]
                    ],
                    "AND",
                    [
                        ["password", "=", md5($password)]
                    ]
                ]);

            if($getUser) {
                $status = true;
                $user_name = $getUser['username'];
                $user_id = $getUser['_id'];
            } else {
                $status = false;
                $error = 'Date de logare incorecte!';
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true, 'user_id' => $user_id, 'username' => $user_name] : ['status' => false,'error' => $error];
    }
}

if(!function_exists('login')) {
    /**
     * @param string $username
     * @param string $password
     * @return array
     */
    function login(string $username = '', string $password='') {
        $login = loginUser($username,$password);

        if ($login['status']) {

            $user_id = $login['user_id'];
            $user_name = $login['username'];

            if (Session::getParam('logged_in') === true) {
                return ['status' => false, 'error' => 'Esti deja logat!', 'session' => Session::getSession()];
            } else {
                Session::sendTheseToSession([
                    'logged_in' => true,
                    'user_id' => $user_id,
                    'user_name' => $user_name
                ]);

                return ['status' => true, 'session' => Session::getSession()];
            }


        } else {
            return ['status' => false, 'error' => $login['error']];
        }
    }
}

if(!function_exists('logout')) {

    /**
     * @return void
     */

    function logout():void {
        if(Session::getParam('logged_in') === true) {
            Session::session_destroy();
        }
    }
}
/**
 * Change password
 */
if(!function_exists('change_password')) {
    /**
     * @param $password
     * @param $confirm
     * @return array|bool[]
     */
   function change_password($old_pass='', $password='', $confirm='') {
       if (Session::getParam('user_id')) {
           $user_id = Session::getParam('user_id');

           if ($password == $confirm) {
               $status = null;
               $error = null;

               try{
                   $user =  new Store('users',__DIR__.'/databases');

                   if ($user->findOneBy(
                       [
                           [
                               ["_id", "=", $user_id]
                           ],
                           "AND",
                           [
                               ["password", "=", md5($old_pass)]
                           ]
                       ]))
                   {
                       if ($user->updateById($user_id, ['password' => md5($password)])) {
                           $status = true;
                       } else {
                           $status = false;
                           $error = 'Nu s-a gasit nici un utilizator cu id-ul specificat!';
                       }
                   } else {
                       $status = false;
                       $error  = 'Parola veche nu coincide cu ce se gaseste in baza de date.';
                   }

               } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
                   $status = false;
                   $error = $e->getMessage();
               } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
                   $status = false;
                   $error = $e->getMessage();
               } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
                   $status = false;
                   $error = $e->getMessage();
               } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
                   $status = false;
                   $error = $e->getMessage();
               }

               return $status ? ['status' => true] : ['status' => false, 'error' => $error];
           } else {
               return ['status' => false, 'error' => 'Parolele nu se potrivesc!'];
           }

       } else {
           return ['status' => false, 'error' => 'Nu esti logat!'];
       }
   }
}

if(!function_exists('get_users')) {
    function get_users() {
        if (Session::getParam('user_id')) {
            $status = null;
            $error = null;
            $users = null;

            try{
                $status = true;
                $user =  new Store('users',__DIR__.'/databases');
                $users= $user->findAll(['createdAt' => 'DESC']);

            } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
                $status = false;
                $error = $e->getMessage();
            }

            return $status ? ['status' => true ,'users' => $users] : ['status' => false, 'error' => $error];
        } else {
            return ['status' => false, 'error' => 'Trebuie sa fii logat ca sa poti vedea continutul!'];
        }
    }
}

/**
 * Updarte user
 */
if(!function_exists('updateUser')) {
    /**
     * @param int $userId
     * @param string $username
     * @param $password
     * @param $confirm
     * @return array|void
     */
    function updateUser(int $userId = 0, string $username= '', string $password = '', string $confirm='')
    {
        if ($password === $confirm) {
            $status = null;
            $error = null;

            try {
                $user = new Store('users', __DIR__ . '/databases');

                if ($user->findById($userId)) {
                    $update = $user->updateById($userId, [
                        'username' => $username,
                        'password' => md5($password)
                    ]);

                    if ($update) {
                        $status = true;
                    } else {
                        $status = false;
                        $error = 'Nu s-a putut actualiza userul.';
                    }
                } else {
                    $status = false;
                    $error = 'Nu s-a gasit nici un user pentru id-ul introdus!';
                }

            } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
                $status = false;
                $error = $e->getMessage();
            }

            return $status ? ['status' => true] : ['status' => false, 'error' => $error];
        } else {
            return ['status' => false, 'error' => 'Parolele nu se potrivesc!'];
        }
    }
}

/**
 * Delete users
 */

if(!function_exists('deleteUser')) {
    /**
     * @param int $userId
     * @return array|bool[]
     */
    function deleteUser(int $userId = 0){
        $status = null;
        $error = null;

        try {
            $user = new Store('users', __DIR__ . '/databases');

            if ($user->findById($userId)) {

                $delete = $user->deleteById($userId);

                if ($delete) {
                    $status = true;
                } else {
                    $status = false;
                    $error = 'Nu s-a putut sterge userul.';
                }
            } else {
                $status = false;
                $error = 'Nu s-a gasit nici un user pentru id-ul introdus!';
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true] : ['status' => false, 'error' => $error];

    }
}

/**
 * get email settings
 */
if(!function_exists('get_mail_settings')) {

    /**
     * @return array
     */

    function get_mail_settings() {
        $status = null;
        $error = null;
        $settings = null;

        try{
            $status = true;
            $mail =  new Store('mail_settings',__DIR__.'/databases');

            $get_settings = $mail->findById(1);

            if ($get_settings) {
                $settings  = $get_settings;
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true ,'settings' => $settings] : ['status' => false, 'error' => $error];
    }
}

if (!function_exists('save_mail_settings')) {
    function save_mail_settings(
        string $smtp_from_email='',
        string $smtp_from_name='',
        string $smtp_host='',
        string $smtp_user='',
        string $smtp_pass='',
        string $encryption='',
        int $port=0
    ) {
        $status = null;
        $error = null;
        try{

            $mail = new Store('mail_settings',__DIR__.'/databases');

            if ($mail->findById(1)) {
                $mail->updateById(1, [
                    'smtp_from_email' => $smtp_from_email,
                    'smtp_from_name' => $smtp_from_name,
                    'smtp_host' => $smtp_host,
                    'smtp_user' => $smtp_user,
                    'smtp_pass' => $smtp_pass,
                    'encryption' => $encryption,
                    'port' => $port
                ]);
            } else {
                $mail->insert([
                    'smtp_from_email' => $smtp_from_email,
                    'smtp_from_name' => $smtp_from_name,
                    'smtp_host' => $smtp_host,
                    'smtp_user' => $smtp_user,
                    'smtp_pass' => $smtp_pass,
                    'encryption' => $encryption,
                    'port' => $port
                ]);
            }

            $status = true;

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true] : ['status' => false, 'error' => $error];
    }
}

if (!function_exists('test_mail')) {
    function test_mail(
                       $to_email,
                       $to_name,
                       $subject,
                       $message) {


        $settings = get_mail_settings();

        if ($settings['status'] && $settings['settings']) {
            $settings = $settings['settings'];

            $mail = new PHPMailer();

            try {
                // SMTP Configuration
                $mail->isSMTP();
                $mail->Host       = $settings['smtp_host'];
                $mail->SMTPAuth   = true;
                $mail->Username = $settings['smtp_user'];
                $mail->Password = $settings['smtp_pass'];
                $mail->SMTPSecure = $settings['encryption'];
                $mail->Port       = $settings['port'];
                $mail->SMTPDebug = true;

                // Sender and Recipient
                $mail->setFrom($settings['smtp_from_email'], $settings['smtp_from_name']);
                $mail->addAddress($to_email, $to_name);

                // Email Content
                $mail->isHTML(true); // Set email format to HTML
                $mail->Subject =  $subject;
                $mail->Body    = $message;

                // Send the email
                $mail->send();
            } catch (Exception $e) {
                //echo "Mailer Error: {$mail->ErrorInfo}";
            }

        } else {
            echo 'Nu s-au definit credentiale de logare!';
        }
    }
}

/***
 * Send postcard
 * email
 */
if (!function_exists('sendEmail')) {
    /**
     * @param string $to_email
     * @param string $to_name
     * @param string $subject
     * @param string $message
     * @param string $imagePath
     * @return array|bool[]
     */
    function sendEmail(string $to_email,
                       string $to_name,
                       string $subject,
                       string $body,
                       string $imagePath
    ) {
        $settings = get_mail_settings();

        if ($settings['status'] && $settings['settings']) {
            $settings = $settings['settings'];

            $mail = new PHPMailer();

            try {
                // SMTP Configuration
                $mail->isSMTP();
                $mail->Host       = $settings['smtp_host'];
                $mail->SMTPAuth   = true;
                $mail->Username = $settings['smtp_user'];
                $mail->Password = $settings['smtp_pass'];
                $mail->SMTPSecure = $settings['encryption'];
                $mail->Port       = $settings['port'];
                $mail->CharSet = 'UTF-8';

                // Sender and Recipient
                $mail->setFrom($settings['smtp_from_email'], $settings['smtp_from_name']);
                $mail->addAddress($to_email, $to_name);

                /**
                 * Add image
                 */

                 if(!$settings['enable_image_editor']) {
                    $mail->addAttachment(__DIR__.'/../default_images/' . $imagePath, $imagePath);
                 } else {
                    $mail->addAttachment(__DIR__.'/../generated_images/' . $imagePath, $imagePath);
                 }

                // Email Content
                $mail->isHTML(true);
                $mail->Subject =  $subject;

                $mail->Body = $body;
                // Send the email
                if ($mail->send()) {
                    return ['status' => true];
                } else {
                    return ['status' => false, 'error' => $mail->ErrorInfo];
                }

            } catch (\Exception $e) {
                return ['status' => false, 'error' => $e->getMessage()];
            }
        }
        else {
            return ['status' => false, 'error' => 'Nu s-au configurat setari pentru mailer.'];
        }
    }
}

/**
 * CSRF Protection
 */

if (!function_exists('generate_csrf_token')) {

    /**
     * @return array
     * @throws \Exception
     */

    function generate_csrf_token() {
        try {
            $token = bin2hex(random_bytes(32));
            if (!\dthtoolkit\Session::getParam('csrf_token')) {
                \dthtoolkit\Session::sendTheseToSession([
                    'csrf_token' => $token
                ]);
            } else{
                $token = \dthtoolkit\Session::getParam('csrf_token');
            }

            return ['status' => true, 'token' => $token];

        } catch (\Exception $e) {
            return ['status' => false, 'error' => $e->getMessage()];
        }

    }
}

if (!function_exists('log_sent_email')) {

    /**
     * @param string $from_name
     * @param string $to_email
     * @param string $to_name
     * @param string $subject
     * @param string $message
     * @param string $imagePath
     * @return array|bool[]
     */

    function log_sent_email(
        string $from_name,
        string $to_email,
        string $to_name,
        string $subject,
        string $message,
        string $imagePath
    ) {
        $settings = get_mail_settings();

        if ($settings['status'] && $settings['settings']) {
            $settings = $settings['settings'];

            $status = null;
            $error = null;

            try{

                $mail =  new Store('mailer_logs',__DIR__.'/databases');

                if ($mail->insert([
                    'smtp_server' => $settings['smtp_host'],
                    'smtp_port' => $settings['port'],
                    'smtp_encryption' => $settings['encryption'],
                    'from_name' => $from_name,
                    'to_email' => $to_email,
                    'to_name' => $to_name,
                    'subject' => $subject,
                    'message' => $message,
                    'image' => $imagePath,
                    'sender_email' => $settings['smtp_from_email'],
                    'sender_name' => $settings['smtp_from_name'],
                    'created_at' => date('Y-m-d H:i:s')
                ])) {
                    $status = true;
                } else {
                    $status = false;
                    $error = 'Nu s-au putut loga datele';
                }

            } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
                $status = false;
                $error = $e->getMessage();
            } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
                $status = false;
                $error = $e->getMessage();
            }

            return $status ? ['status' => true] : ['status' => false, 'error' => $error];
        }
        else{
            return ['status' => false, 'error'  => 'Credentiale de mailer negasite!'];
        }

    }
}

if(!function_exists('get_mailer_logs')) {

    /**
     * @return array
     */

    function get_mailer_logs() {
        $status = null;
        $error = null;
        $logs = null;

        try{
            $status = true;
            $log =  new Store('mailer_logs',__DIR__.'/databases');
            $logs = $log->findAll(['created_at' => 'desc'],100);

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true ,'logs' => $logs] : ['status' => false, 'error' => $error];
    }
}


if (!function_exists('get_store_count')) {
    function get_store_count($store_name, $condition=null) {
        $status = null;
        $error = null;
        $count = 0;

        try{
            $store = new Store($store_name,__DIR__.'/databases');

            if ($condition) {
                $get = $store->findBy($condition);
                $count = count($get);
            }

            $count = $store->count();

            $status = true;

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true ,'count' => $count] : ['status' => false, 'error' => $error];
    }
}


if(!function_exists('countImagesInFolder')) {
    function countImagesInFolder($folderPath) {
        // Ensure the folder path ends with a directory separator
        $folderPath = rtrim($folderPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        // List all files in the folder
        $files = scandir($folderPath);

        // Initialize a counter for image files
        $imageCount = 0;

        // Define an array of valid image extensions
        $validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        foreach ($files as $file) {
            // Check if the file has a valid image extension
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($extension, $validExtensions)) {
                $imageCount++;
            }
        }

        return $imageCount;
    }
}
if (!function_exists('get_db_stats')) {

    /**
     * @return array
     * @throws \Exception
     */
    function get_db_stats() {

        $date = new DateTime(date('Y-m-d H:i:s'));
        $date->add(new DateInterval('P1M'));
        $next_month = $date->format('Y-m-d H:i:s');
        $countLogsFromThisMonth = get_store_count('mailer_logs', ['created_at', '>=', $next_month]);

        return [
            'users' => get_store_count('users')['status'] ? get_store_count('users')['count'] : 0,
            'logs' => get_store_count('mailer_logs')['status'] ? get_store_count('mailer_logs')['count'] : 0,
            'logs_this_month' => $countLogsFromThisMonth['status'] ? $countLogsFromThisMonth['count'] : 0,
            'generated_images' => countImagesInFolder(__DIR__.'/../generated_images'),
            'uploaded_images' => countImagesInFolder(__DIR__.'/../default_images')
        ];
    }
}

/**
 * Delete a certain store / database
 */

if (!function_exists('delete_database')) {

    /**
     * @param $store_name
     * @return array|bool[]
     */
    function delete_database($store_name): array
    {
        $status = null;
        $error = null;
        $count = 0;

        try{

            $store = new Store($store_name,__DIR__.'/databases');
            if ($store->deleteStore()) {
                $status = true;
            } else {
                $status = false;
                $error = 'Nu s-a putut sterge baza de date';
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true] : ['status' => false, 'error' => $error];
    }
}

if(!function_exists('delete_images')) {
    /**
     * @param $directoryPath
     * @return bool
     */
    function delete_images($directoryPath): bool
    {
        if (!is_dir($directoryPath)) {
            return false; // Return false if the directory path is not valid
        }

        $files = glob($directoryPath . '/*'); // Get a list of all files in the directory

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file); // Delete the file
            }
        }

        return true; // Return true after deleting all files
    }
}

/**
 * Get app settings
 */

function mergeConfigWithDefaults($databaseConfig, $defaultConfig) {
    // Loop through the default configuration
    foreach ($defaultConfig as $key => $value) {
        // If the key doesn't exist in the database config, add it with the default value
        if (!isset($databaseConfig[$key])) {
            $databaseConfig[$key] = $value;
        }
    }

    return $databaseConfig;
}


if(!function_exists('get_app_settings')) {

    /**
     * @return array
     */

    function get_app_settings() {
        $status = null;
        $error = null;
        $settings = null;

        try{
            $status = true;
            $app =  new Store('app_settings', __DIR__.'/databases');

            $get_settings = $app->findById(1);

            if ($get_settings) {

                if (json_decode(file_get_contents(__DIR__ . '/../core/default_config.json'))) {
                    $default_settings = json_decode(file_get_contents(__DIR__ . '/../core/default_config.json'), true);
                    $settings = mergeConfigWithDefaults($get_settings, $default_settings);
                } else {
                    $settings = $get_settings;
                }

            } else {

                if (json_decode(file_get_contents(__DIR__ . '/../core/default_config.json'))) {
                    $settings = json_decode(file_get_contents(__DIR__ . '/../core/default_config.json'), true);
                } else {
                    $settings = [];
                }
            }

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true ,'settings' => $settings] : ['status' => false, 'error' => $error];
    }
}

/**
 * Save app settings
 */

if (!function_exists('save_app_settings')) {
    function save_app_settings(
        string $app_logo="",
        string $app_name="",
        string $app_url="",
        int $image_limit=10,
        string $copyright_text="",
        string $sent_from_text="",
        string $subject_text="",
        string $message_text="",
        string $meta_keywords="",
        string $default_theme="light",
        int $max_file_size=1000,
        bool $enable_image_editor=true,
        bool $enable_edit_from=true,
        bool $enable_edit_subject=true,
        bool $enable_edit_message=true,
        string $cookie_policy="",
        string $terms_policy=""

    ) {
        $status = null;
        $error = null;
        try{

            $app = new Store('app_settings',__DIR__.'/databases');

            if ($app->findById(1)) {
                $app->updateById(1, [
                    'app_logo' => $app_logo,
                    'app_name' => $app_name,
                    'app_url' => $app_url,
                    'image_limit' => $image_limit,
                    'copyright_text' => $copyright_text,
                    'sent_from_text' => $sent_from_text,
                    'subject_text' => $subject_text,
                    'message_text' => $message_text,
                    'meta_keywords' => $meta_keywords,
                    'default_theme' => $default_theme,
                    'max_file_size' => $max_file_size,
                    'enable_image_editor' => (bool) $enable_image_editor,
                    'enable_edit_from' => (bool) $enable_edit_from,
                    'enable_edit_subject' => (bool) $enable_edit_subject,
                    'enable_edit_message' => (bool) $enable_edit_message,
                    'cookie_policy' => $cookie_policy,
                    'terms_policy' => $terms_policy
                ]);
            } else {
                $app->insert([
                    'app_logo' => $app_logo,
                    'app_name' => $app_name,
                    'app_url' => $app_url,
                    'image_limit' => $image_limit,
                    'copyright_text' => $copyright_text,
                    'sent_from_text' => $sent_from_text,
                    'subject_text' => $subject_text,
                    'message_text' => $message_text,
                    'meta_keywords' => $meta_keywords,
                    'default_theme' => $default_theme,
                    'max_file_size' => $max_file_size,
                    'enable_image_editor' => $enable_image_editor,
                    'enable_edit_from' => (bool) $enable_edit_from,
                    'enable_edit_subject' => $enable_edit_subject,
                    'enable_edit_message' => $enable_edit_message,
                    'cookie_policy' => $cookie_policy,
                    'terms_policy' => $terms_policy
                ]);
            }

            $status = true;

        } catch (\SleekDB\Exceptions\IOException|\SleekDB\Exceptions\JsonException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidArgumentException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\InvalidConfigurationException $e) {
            $status = false;
            $error = $e->getMessage();
        } catch (\SleekDB\Exceptions\IdNotAllowedException $e) {
            $status = false;
            $error = $e->getMessage();
        }

        return $status ? ['status' => true] : ['status' => false, 'error' => $error];
    }
}

/**
 * Remove profanity
 */
if(!function_exists('remove_profanity')) {
    /**
     * @param $inputString
     * @return array|string|string[]|null
     */
    function remove_profanity($inputString) {
        // Define an array of profanity words to be removed
        $profanity = array(
            'pula',
            'cur',
            'tate',
            'pizda',
            'muie',
            'mata',
            'bou',
            'vaca',
            'idiot',
            'cacat',
            'retard',
            'retardat',
            'laba',
            'curva',
            'pulă',
            'cur',
            'țâțe',
            'pizdă',
            'muie',
            'mătă',
            'bou',
            'vacă',
            'idiot',
            'căcat',
            'retard',
            'retardat',
            'laba',
            'curvă',
            'handicapat',
            'fut',
            'futere',
            'futelniță',
            'jegos',
            'homosexual',
            'homalau',
            'homo',
            'gay',
            'lesbian',
            'fuck',
            'motherfucker',
            'bastard',
            'bitch',
            'bloody',
            'bollocks',
            'brotherfucker',
            'bugger',
            'bullshit',
            'fag',
            'dyke',
            'shit',
            'hell'
        );

        // Create a regular expression pattern to match any profanity words in the string
        $pattern = '/\b(' . implode('|', array_map('preg_quote', $profanity)) . ')\b/i';

        // Replace profanity words with an empty string
        return preg_replace($pattern, '', $inputString);
    }

}