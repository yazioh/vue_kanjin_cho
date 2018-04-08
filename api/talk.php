<?php

require_once "apiBase.php";

class apiTalk extends apiBase
{

    protected $table = 't_talk';
    /**
     * test
     */

    public function index()
    {
        ?>
<!DOCTYPE html>
<html lang="ja">

<head><meta charset="UTF-8">

</head>
<body>

<script src="../js/v/jquery-3.3.1.min.js"></script>
<script src="../js/v/store.legacy.min.js"></script>
<script type="text/javascript">
    $(function(){
        console.log("sorena");
        store.clearAll();
    });
</script>
</body>
</html>
<?php
exit;
    }

    /**
     * メッセージ取得
     */
    public function get($req)
    {
        $conds = array("status ='o'");
        $lastID = empty($_SESSION['lastTalkID']) ? 0 : $_SESSION['lastTalkID'];

        if (!empty($req['tkid'])) {
            // 投稿後 手前のログを取得したい
            $conds[] = "id <= " . $this->q($req['tkid']);
        }else{
            if($lastID){
                $conds[] = "id > " . $this->q($lastID);
            }
        }
        $sql = "SELECT id, chid, talk, emotion,rgst FROM t_talk "
        . $this->makeWheres($conds)
            . "order by ID desc limit 10 ";
        $this->query($sql);

        if ($this->dbError()) {
            $this->showJson(array(
                "status" => 'x',
                "dberror" => $this->dbError(),
            ));
        }
        $talks = array();
        while ($row = $this->fetchRow()) {
            $talks[] = (function ($row) {
                $row['emotion'] = json_decode($row['emotion']);
                return $row;
            })($row);

            $lastID = max($lastID, $row['id']);
        }
        $_SESSION['lastTalkID']=$lastID;
        
        $avators = $this->_checkAvators($talks);
        $this->showJson(array(
            "status" => 'o',
            "talk" => $talks,
            "updates" => $avators,
            "e" => $this->dbError(),
            "tm" => $_SESSION['avators_lastupdt'],
        ));
    }

    /**
     * 発言追加
     */
    public function set($req)
    {
        try {
            if (empty($req['chid'])) {
                throw new Exception("noID");
            }
            if (empty($req['talk'])) {
                $req['talk'] = '';
            }else{
                $req['talk'] = mb_strimwidth($req['talk'],0, 128, '…');
            }
            if (empty($req['emotion'])) {
                $req['emotion'] = [];
            }

            $emo = array();
            $chid = $this->q(strip_tags($req['chid']));
            $msg = $this->q(strip_tags($req['talk']));
            $this->safeEmotion($emo, $req['emotion'], "vol");
            $this->safeEmotion($emo, $req['emotion'], "eye");
            $this->safeEmotion($emo, $req['emotion'], "ov");
            $this->safeEmotion($emo, $req['emotion'], "bg");
            $jsonEmo = $this->q(json_encode($emo, JSON_UNESCAPED_UNICODE));
            $this->query("INSERT t_talk values(0, 0, $chid, $msg, $jsonEmo, 'o', now())");
            if ($this->dbError()) {
                throw new exception($this->dbError());
            }
            $this->showJson(array(
                "status" => 'o',
                "tkid" => $this->db->insert_id,
            ));

        } catch (Exception $ex) {
            $this->showJson(array(
                "status" => 'x',
                "msg" => $ex->getMessage(),
            ));
        }
    }
    /**
     * emo data のサニタイズ
     * TODO 許可できるフォーマットをもう少し厳密に
     */
    public function safeEmotion(&$emo, $req, $key)
    {
        if (!empty($req[$key])) {
            $emo[$key] = strip_tags($req[$key]);
        }
    }

    protected function _checkAvators($talk)
    {
        $ret = [];
        $tm = new DateTime($_SESSION['avators_lastupdt']);

        $lastUpdate = $this->q($tm->format("Y-m-d H:i:s"));
        $this->query("SELECT * FROM m_character where updt>{$lastUpdate}");
        if ($this->counts()) {
            while ($row = $this->fetchRow()) {
                // TODO Avator Apiと共用
                $ret[] = array(
                    "chid" => $row['chid'],
                    "name" => $row['name'],
                    "face" => json_decode($row['avator']),
                );
                $this->setAvaCache($row);
            }
        }
        return $ret;
    }
}

//----------------------------------
// RUN
$app = new apiTalk();
$app->run();
