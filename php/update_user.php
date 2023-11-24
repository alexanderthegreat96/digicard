<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {

        $id = $_POST['user_id'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm = $_POST['confirm'];

        echo json_encode(updateUser($id, $username, $password, $confirm));
    } else {
        echo  json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}