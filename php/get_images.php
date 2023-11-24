<?php

error_reporting(0);
session_start();
require_once(__DIR__ . '/../php/functions.php');

if (\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['success' => false, 'error' => 'Nu esti logat!']);
} else{
    $imagesDirectory = __DIR__ . '/../default_images';

    if (!is_dir($imagesDirectory)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Images directory not found']);
        exit;
    }

    $imageFiles = [];
    $imageExtensions = array("jpg", "jpeg", "png", "gif");

    $dirContents = scandir($imagesDirectory);
    foreach ($dirContents as $file) {
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($extension, $imageExtensions)) {
            $imageFiles[] = $file;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($imageFiles);
}

