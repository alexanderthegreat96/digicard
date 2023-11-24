<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {
        $user_id = $_POST['user_id'];
        echo json_encode(deleteUser($user_id));
    } else {
        echo json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}