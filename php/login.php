<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') === true) {
    echo json_encode(['status' => true]);
} else {

    if(isset($_POST)) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        echo json_encode(login($username,$password));
    } else {
        echo  json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}