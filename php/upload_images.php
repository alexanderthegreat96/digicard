<?php
error_reporting(0);
session_start();
require_once(__DIR__ . '/../php/functions.php');

if (\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['success' => false, 'message' => 'Nu esti logat!']);
} else {

    $settings = get_app_settings();

    $max_upload_size = 10;

    if ($settings['status']) {
        $max_upload_size = $settings['settings']['max_file_size'];
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['images'])) {
        $uploadedImages = $_FILES['images'];
        $uploadDirectory = '../default_images/';
        $uploadedImageUrls = [];

        foreach ($uploadedImages['tmp_name'] as $key => $tmpName) {

            $originalFilename = basename($uploadedImages['name'][$key]);
            $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
            $newFilename = uniqid() . '.' . $extension;

            $destination = $uploadDirectory . $newFilename;

            $maxFileSize = $max_upload_size * 1024 * 1024;

            if ($uploadedImages['size'][$key] <= $maxFileSize) {
                if (move_uploaded_file($tmpName, $destination)) {
                    $uploadedImageUrls[] = $destination;
                }
            }
        }

        if (!empty($uploadedImageUrls)) {
            echo json_encode(['success' => true, 'images' => $uploadedImageUrls]);
        } else {
            echo json_encode(['success' => false]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
    }
}
