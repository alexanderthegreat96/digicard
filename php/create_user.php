<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm = $_POST['confirm'];

        if($password === $confirm) {
            echo json_encode(createUser($username,$password));
        } else {
            echo json_encode(['status' => false, 'error'=> 'Parolele nu se potrivesc']);
        }

    } else {
        echo json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}