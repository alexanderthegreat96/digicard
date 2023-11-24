<?php
session_start();
require_once (__DIR__.'/../php/functions.php');

/**
 * @param string $raw
 * @param array $vars
 * @return string
 */
function append_params_to_string(
    string $raw='', array $vars=[]): string
{
    if ($vars && $raw) {
        foreach ($vars as $key=>$val) {
            if(str_contains($raw, '{' . $key . '}')) {
                $raw = str_replace('{' . $key . '}', $val, $raw);
            }
        }
    }

    return $raw;
}
if(!\dthtoolkit\Session::getParam('csrf_token')) {
    echo json_encode(['status' => false, 'error' => 'Token invalid, reincarca pagina!']);
} else {
    
    if(isset($_POST)) {

        $csrf_token = \dthtoolkit\Session::getParam('csrf_token');

        $from_name = remove_profanity($_POST['from_name']);
        $to_name = remove_profanity($_POST['to_name']);
        $to_email = remove_profanity($_POST['to_email']);

        $message = remove_profanity($_POST['message']);
        $subject = remove_profanity($_POST['subject']);
        $image = $_POST['image'];
        $token = $_POST['csrf_token'];

        if ($token === $csrf_token) {
            
            $settings = get_app_settings();

            $img_code = "";
            $app_name = "";
            $app_url = "";

            if ($settings['status']) {
                
                $app_url = $settings['settings']['app_url'];
                $app_name = $settings['settings']['app_name'];
                
                /**
                 * This is if we set custom
                 * predefined subject and message for the
                 * app
                 */

                $vars = [
                    'from_name' => $from_name,
                    'to_name' => $to_name,
                    'to_email' => $to_email,
                    'date_with_hours' => date('d/m/Y H:i'),
                    'date_simple' =>  date('d/m/Y'),
                    'app_name' => $app_name,
                    'app_url' => $app_url
                ];

                if(!$settings['settings']['enable_edit_subject']) {
                    $subject = $settings['settings']['subject_text'];
                    $subject = append_params_to_string($subject,$vars);
                }

                if(!$settings['settings']['enable_edit_message']) {
                    $message = $settings['settings']['message_text'];
                    $message = append_params_to_string($message, $vars);
                }

                if (!$settings['settings']['enable_edit_from']) {
                    $from_name = $settings['settings']['sent_from_text'];
                    $from_name = append_params_to_string($from_name, $vars);
                }

                /**
                 * Different image paths if image editor is enabled or not
                 */

                if ($settings['settings']['enable_image_editor']) {
                    $img_code = '<img align="center" border="0"
                             src="'.$app_url.'/generated_images/'.$image.'"
                             alt="" title=""
                             style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;
                             clear: both;display: inline-block !important;border: none;height: auto;
                             float: none;width: 100%;max-width: 630px;"
                             width="630"/>';
                } else {
                    $img_code = '<img align="center" border="0"
                             src="'.$app_url.'/default_images/'.$image.'"
                             alt="" title=""
                             style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;
                             clear: both;display: inline-block !important;border: none;height: auto;
                             float: none;width: 100%;max-width: 630px;"
                             width="630"/>';
                }
            }

            $template = file_get_contents(__DIR__ . '/../mail_template/mail.html');

            $template = str_replace('{NUME}', $from_name, $template);
            $template = str_replace('{EMAIL_SLOGAN}', $message, $template);
            $template = str_replace('{EMAIL_SITEDESC1}', '', $template);
            $template = str_replace('{EMAIL_SITEDESC2}', '', $template);



            $template = str_replace('{IMG_SRC}', $img_code, $template);
            $template = str_replace('{BUTTON_TITLE}', $app_name, $template);


            $send = sendEmail($to_email,$to_name,$subject, $template, $image);

            if ($send['status']) {

                log_sent_email($from_name,$to_email,$to_name,$subject,$message,$image);

                \dthtoolkit\Session::unsetSession('csrf_token');
                $new_token = generate_csrf_token();
                if ($new_token['status']) {
                    echo json_encode(['status' => true, 'new_token' => $new_token['token']]);
                } else {
                    echo json_encode(['status' => true , 'new_token' => null]);
                }

            } else {
                echo json_encode(['status' => false, 'error' => $send['error']]);
            }
        } else {
            echo json_encode(['status' => false, 'error' => 'Token invalid, reincarca pagina!']);
        }


    } else {
        echo  json_encode(['status' => false, 'error' => 'No data was actually posted!']);
    }

}