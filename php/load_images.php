<?php
$folderPath = __DIR__ . "/../default_images/";
require_once (__DIR__.'/../php/functions.php');

$settings = get_app_settings();

$imageLimit = 10;



if ($settings['status']) {
    $imageLimit = $settings['settings']['image_limit'];
}

$imageExtensions = array("jpg", "jpeg", "png", "gif");
$imageUrls = array();
$imagesAvailable = array();

if ($handle = opendir($folderPath)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && is_file($folderPath . "/" . $entry)) {
            $extension = strtolower(pathinfo($entry, PATHINFO_EXTENSION));
            if (in_array($extension, $imageExtensions)) {
                $imagesAvailable[] = "default_images/" . $entry;
            }
        }
    }
    closedir($handle);

    $selectedImages = array_slice($imagesAvailable, 0, $imageLimit);

    shuffle($selectedImages);

    foreach ($selectedImages as $selectedImage) {
        $imageUrls[] = $selectedImage;
    }
}
// Set cache control headers to prevent caching
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

header('Content-Type: application/json');
echo json_encode($imageUrls);
