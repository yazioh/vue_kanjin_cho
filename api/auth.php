<?php
require_once "apiBase.php";

class apiAuth extends apiBase
{
    protected $table = 'm_user';

    public function get($req)
    {
        if (!empty($_SESSION['brkey'])) {
            // リロード
            if (!empty($req["brkey"]) && $_SESSION['brkey'] == $req["brkey"]) {
                // ホントはtoken 作り直したほうが？
                return $this->showJson(array(
                    "status" => 'o',
                    "token" => $_SESSION['token'],
                ));
            }
        } else {
            // SESSIONは切れてます
            if (!empty($req["brkey"] && preg_match("/^[0-9a-f]{32}$/", $req["brkey"]))) {
                $row = $this->find($this->table, 'browser_key', $req["brkey"]);
                if ($row && !empty($row['id'])) {
                    // token は再発行
                    $_SESSION['brkey'] = striptags($req["brkey"]);
                    $_SESSION['token'] = $this->mkPswd(16);
                    $this->saveToken();

                    return $this->showJson(array(
                        "status" => 'o',
                        "token" => $_SESSION['token'],
                    ));
                }
            }
        }

        // お初 or 違反
        // if (empty($req['brkey'])) {
        $this->getBrowserKey();
        // 問答無用で再発行
        return $this->showJson(array(
            "status" => 'x',
            "brkey" => $_SESSION['brkey'],
            "token" => $_SESSION['token'],
        ));
        //}
    }

    /**
     * browser ID （不変）
     * tokensessionごとに再発行
     */
    public function getBrowserKey()
    {
        $d = array($_SERVER['REQUEST_TIME_FLOAT'], $_SERVER['HTTP_USER_AGENT'], $_SERVER['HTTP_HOST'], "ANY SALT0000");
        $_SESSION['brkey'] = md5(print_r($d, 1));
        $_SESSION['token'] = $this->mkPswd(16);
        $this->saveToken();
    }
}
$app = new apiAuth();
$app->run();
