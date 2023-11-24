<?php
session_start();
require_once (__DIR__."/../php/functions.php");

if(\dthtoolkit\Session::getParam('logged_in') === true) {
    echo json_encode(get_mail_settings());
} else {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
}