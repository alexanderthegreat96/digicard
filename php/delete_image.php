<?php
error_reporting(0);
session_start();
require_once(__DIR__ . '/../php/functions.php');

if (\dthtoolkit\Session::getParam('logged_in') !== true) {
    echo json_encode(['success' => false, 'error' => 'Nu esti logat!']);
} else{
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['image_url'])) {
        $imagePath = $_POST['image_url'];
        $fullImagePath = '../default_images/' . $imagePath;

        if (file_exists($fullImagePath)) {
            try {
                if (unlink($fullImagePath)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to delete image']);
                }
            } catch (\Exception $e) {
                echo json_encode(['success' => false, 'message' => 'Unable to delete: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Image not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
    }
}
