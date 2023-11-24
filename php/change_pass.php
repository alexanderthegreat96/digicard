<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {
        $old = $_POST['old'];
        $password = $_POST['password'];
        $confirm = $_POST['confirm'];
        echo json_encode(change_password($old,$password,$confirm));
    } else {
        echo  json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}