<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {

        $smtp_from_name = $_POST['smtp_from_name'];
        $smtp_from_email = $_POST['smtp_from_email'];
        $smtp_host = $_POST['smtp_host'];
        $smtp_user = $_POST['smtp_user'];
        $smtp_pass = $_POST['smtp_pass'];
        $smtp_enc = $_POST['smtp_enc'];
        $smtp_port = $_POST['smtp_port'];

        echo json_encode(save_mail_settings($smtp_from_email,$smtp_from_name,$smtp_host,$smtp_user,$smtp_pass,$smtp_enc,$smtp_port));

    } else {
        echo json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}