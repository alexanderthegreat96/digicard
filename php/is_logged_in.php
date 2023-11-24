<?php
session_start();
require_once (__DIR__ . "/../php/functions.php");

if(\dthtoolkit\Session::getParam('logged_in') === true) {
    echo json_encode([
        'status' => true ,
        'username' => \dthtoolkit\Session::getParam('user_name'),
        'user_id' => \dthtoolkit\Session::getParam('user_id')
    ]);
} else {
    echo json_encode(['status' => false]);
}