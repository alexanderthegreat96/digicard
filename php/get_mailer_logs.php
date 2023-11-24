<?php
session_start();
require_once (__DIR__."/../php/functions.php");

/**
 * @param $a
 * @param $b
 * @return int
 */
function sortByCreatedAt($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
}

function existsInFolder(string $img = '') {
    if (file_exists(__DIR__. '/../default_images/' . $img)) {
        return '../default_images/' . $img;
    } elseif (file_exists(__DIR__. '/../generated_images/' . $img)) {
        return '../generated_images/' . $img;
    } else {
        return 'https://aeroclub-issoire.fr/wp-content/uploads/2020/05/image-not-found.jpg';
    }
}
$logs = get_mailer_logs();
$settings = get_app_settings();


$returns = [];

if ($logs['status']) {

    foreach ($logs['logs'] as $log) {
        $returns[] = [
            'id' => $log['_id'],
            'smtp_server' => $log['smtp_server'] ? $log['smtp_server']: 'N/A',
            'smtp_port' => $log['smtp_port']  ? $log['smtp_port'] : 'N/A',
            'smtp_encryption' => $log['smtp_encryption'] ? $log['smtp_encryption'] : 'N/A',
            'from_name' => $log['from_name'] ? $log['from_name'] : 'N/A',
            'to_email' =>  $log['to_email'] ? $log['to_email'] : 'N/A',
            'to_name' =>  $log['to_name'] ? $log['to_name'] : 'N/A',
            'subject' =>  $log['subject'] ? $log['subject'] : 'N/A',
            'message' =>  $log['message'] ? $log['message'] : 'N/A',
            'image' =>  $log['image'] ? existsInFolder($log['image']) : 'N/A',
            'sender_email' =>  $log['sender_email'] ? $log['sender_email'] : 'N/A',
            'sender_name' =>  $log['sender_name'] ? $log['sender_name'] : 'N/A',
            'created_at' =>  $log['created_at'] ? $log['created_at'] : 'N/A',
        ];
    }

    if ($returns) {
        usort($returns, 'sortByCreatedAt');
        echo json_encode(['status' => true, 'logs' => $returns]);
    } else {
        echo json_encode(['status' => true, 'logs' => []]);
    }


} else {
    echo json_encode(['status' => false,'error' => $logs['error']]);
}
