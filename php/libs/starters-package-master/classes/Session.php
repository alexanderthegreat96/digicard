<?php
namespace dthtoolkit;
class Session
{
    /**
     * @return array
     */
    public static function initSession():void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        /**
         * Generate a session id
         */
        if(!isset($_SESSION['session_id']))
        {
            $_SESSION['session_id'] = self::generateRandomString(15);
        }

        return;
    }

    /**
     * @param int $length
     * @return string
     */
    public static function generateRandomString(int $length = 10) {
        return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
    }

    /**
     * @param array $array
     * @param array $result
     * Maps any array structure and
     * sends it to session
     * ['name' => 'Aleaxander', 'is_logged_in' => 'True]
     */
    public static function sendTheseToSession(array $array = [], array &$result = [])
    {
        self::initSession();
        if($array)
        {
            foreach($array as $key=>$value)
            {
                self::setSession($key,$value);
                $result[$key] = [$key => $value];
            }
            return $result;
        }
    }

    /**
     * @return array
     */
    public static function getSession()
    {
        return $_SESSION;
    }

    /**
     * @param string $param
     */
    public static function unsetSession(string $param)
    {
        if(isset($_SESSION[$param]))
        {
            unset($_SESSION[$param]);
        }
    }

    /**
     * @param string $param
     * @return mixed|string
     */

    public static function getParam(string $param)
    {
        self::initSession();
        if(isset($_SESSION[$param]))
        {
            return $_SESSION[$param];
        }
        else
        {
            return null;
        }
    }

    /**
     * @param string $param
     * @return mixed
     */

    public static function setSession(string $param,$value)
    {
        self::initSession();
        if(isset($_SESSION[$param]))
        {
            self::unsetSession($param);
            return $_SESSION[$param] = $value;
        }
        else
        {
            return $_SESSION[$param] = $value;
        }

    }

    /**
     * @return bool
     */
    public static function session_destroy()
    {
        return session_destroy();
    }

}