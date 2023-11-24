<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

if(\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['status' => false, 'error' => 'Nu esti logat!']);
} else {

    if(isset($_POST)) {
        $app_logo = $_POST['app_logo'];
        $app_name = $_POST['app_name'];
        $app_url = $_POST['app_url'];
        $image_limit = (int) $_POST['image_limit'];
        $copyright_text = $_POST['copyright_text'];
        $sent_from_text = $_POST['sent_from_text'];
        $subject_text = $_POST['subject_text'];
        $message_text = $_POST['message_text'];
        $meta_keywords = $_POST['meta_keywords'];
        $default_theme = $_POST['default_theme'];
        $max_file_size = (int) $_POST['max_file_size'];
        $cookie_policy = $_POST['cookie_policy'];
        $terms_policy = $_POST['terms_policy'];


        $enable_image_editor = false;
        $enable_edit_from = false;
        $enable_edit_subject = false;
        $enable_edit_message = false;

        if ($_POST['enable_image_editor'] == "true") {
            $enable_image_editor = true;
        }

        if ($_POST['enable_edit_from'] == "true") {
            $enable_edit_from = true;
        }

        if ($_POST['enable_edit_subject'] == "true") {
            $enable_edit_subject = true;
        }

        if ($_POST['enable_edit_message'] == "true") {
            $enable_edit_message = true;
        }


        if($app_name && $app_url && $app_logo && $copyright_text) {
            echo json_encode(
                save_app_settings(
                    $app_logo,
                    $app_name,
                    $app_url,
                    $image_limit,
                    $copyright_text,
                    $sent_from_text,
                    $subject_text,
                    $message_text,
                    $meta_keywords,
                    $default_theme,
                    $max_file_size,
                    $enable_image_editor,
                    $enable_edit_from,
                    $enable_edit_subject,
                    $enable_edit_message,
                    $cookie_policy,
                    $terms_policy
                ));
        } else {
            echo json_encode(['status' => false, 'error' => 'Ai campuri obligatorii necompletate!']);
        }



    } else {
        echo json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}