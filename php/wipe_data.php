<?php
session_start();
require_once (__DIR__."/../php/functions.php");

if(\dthtoolkit\Session::getParam('logged_in') === true) {

    if(isset($_POST)) {
        $list = $_POST['list'];
        if(count($list) > 0) {

            foreach ($list as $item) {
                if ($item == "uploaded") {
                    delete_images(__DIR__.'/../default_images');
                }

                if ($item == "generated") {
                    delete_images(__DIR__.'/../generated_images');
                }

                if ($item == "logged") {
                    delete_database('mailer_logs');
                }
            }

            echo json_encode(['status' => true]);
        } else {
            echo json_encode(['status' => false, 'error' => 'Nu element to wipe.']);
        }
    } else {
        echo json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

} else {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
}