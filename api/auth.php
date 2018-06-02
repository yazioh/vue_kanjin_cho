<?php
require_once "apiBase.php";

class apiAuth extends apiBase
{
    protected $table = 'm_user';

    public function get($req)
    {
        if (empty($_SESSION['brkey'])) {
            $this->getSessionToken();
        }

        // セッション維持
        if (!empty($_SESSION['brkey'])) {
            // リロード　brkey 保持してた
            if (!empty($req["brkey"]) && $_SESSION['brkey'] == $req["brkey"]) {
                return $this->showJson(array(
                    "status" => 'o',
                    "brkey" => $_SESSION['brkey'],
                    "token" => $_SESSION['token'],
                ));
            }

            //-------------------------------------
            // SESS ハイジャック？ JS がおかしい？
            // token  だけ更新して継続 TODO 場合によっては少し対策
            $this->saveToken();
            getSessionToken();
            return  $this->showJson(array(
                "status" => 'o',
                "brkey" => $_SESSION['brkey'],
                "token" => $_SESSION['token'],
            ));

        } else {
            // SESSIONは切れてます

            // ブラウザー閉じ　→　復帰チェック
            if (!empty($req["brkey"]) && preg_match("/^[0-9a-f]{32}$/", $req["brkey"])) {

                $req['brkey'] = strip_tags($req["brkey"]);
                $row = $this->find($this->table, 'browser_key', $req["brkey"]);

                if ($row && !empty($row['id'])) {
                    $_SESSION['brkey'] = strip_tags($req["brkey"]);
                    // token は再発行
                    $this->getSessionToken();
                    $this->saveToken();

                    return $this->showJson(array(
                        "status" => 'o',
                        "brkey" => $_SESSION['brkey'],
                        "token" => $_SESSION['token'],
                    ));
                }
            }
        }

        // お初 or 違反 
        // if (empty($req['brkey'])) {
        $this->getBrowserKey();
        $this->getSessionToken();
        $this->saveToken();
        
        // 問答無用で再発行
        return $this->showJson(array(
            "status" => 'x',
            "brkey" => $_SESSION['brkey'],
            "token" => $_SESSION['token'],
        ));
    }

    /**
     * browser ID （不変）
     */
    public function getBrowserKey()
    {
        $d = array($_SERVER['REQUEST_TIME_FLOAT'], $_SERVER['HTTP_USER_AGENT'], $_SERVER['HTTP_HOST'], "ANY SALT0000");
        $_SESSION['brkey'] = md5(print_r($d, 1));
    }

    /**
     * token  sessionごとに更新
     */
    public function getSessionToken()
    {
        $_SESSION['token'] = $this->mkPswd(16);
    }

}
$app = new apiAuth();
$app->run();
