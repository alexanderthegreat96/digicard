<?php

if ($_POST) {
    if (isset($_POST['amm_canvas'])) {
        $data = $_POST['amm_canvas'];

        $imageName = "image_" . time() . ".png"; // Generate a unique filename


        if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
            $data = substr($data, strpos($data, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
                throw new \Exception('invalid image type');
            }
            $data = str_replace( ' ', '+', $data );
            $data = base64_decode($data);

            if ($data === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        // Specify the path where you want to save the image
        $imagePath = __DIR__ . "/../generated_images/" . $imageName;

        // Save the decoded data to the image file
        if (file_put_contents($imagePath, $data)) {
            echo json_encode([
                'status' => true,
                'image' => $imageName
            ]);
        } else {
            echo json_encode(['status' => false, 'error' => "Nu s-a putut salva imaginea."]);
        }
    }
}