<?php

error_reporting(0);
session_start();
require_once(__DIR__ . '/../php/functions.php');

if (\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['success' => false, 'error' => 'Nu esti logat!']);
} else{
    echo json_encode(get_db_stats());
}

