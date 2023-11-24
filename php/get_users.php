<?php
session_start();
require_once (__DIR__."/../php/functions.php");

if(\dthtoolkit\Session::getParam('logged_in') === true) {
    $users = get_users();

    $returns = [];
    if ($users['status']) {
        foreach ($users['users'] as $user) {
            $returns[] = [

                'id' => $user['_id'],
                'username' => $user['username'],
                'createdAt' => $user['createdAt'] ? $user['createdAt'] : 'N/A'
            ];
        }

        echo json_encode(['status' => true, 'users' => $returns]);
    } else {
        echo json_encode(['status' => false,'error' => $users['error']]);
    }

} else {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
}