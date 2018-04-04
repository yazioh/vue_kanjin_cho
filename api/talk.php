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
        echo "Extend:";
        parent::index();
    }

    /**
     * メッセージ取得
     */
    public function get($req)
    {
        $conds = array("status ='o'");
        if (!empty($req['tkid'])) {
            $conds[] = "id < " . $this->q($req['tkid']);
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
        }
        $this->showJson(array(
            "status" => 'o',
            "talk" => $talks,
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
            }
            if (empty($req['emotion'])) {
                $req['emotion'] = [];
            }

            $emo = array();
            $chid = $this->q(strip_tags($req['chid']));
            $msg = $this->q(strip_tags($req['talk']));
            $this->safeEmotion($emo,$req['emotion'], "vol");
            $this->safeEmotion($emo,$req['emotion'], "eye");
            $this->safeEmotion($emo,$req['emotion'], "ov");
            $this->safeEmotion($emo,$req['emotion'], "bg");
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
    public function safeEmotion(&$emo, $req,$key)
    {
        if (!empty($req[$key])) {
            $emo[$key] = strip_tags($req[$key]);
        }
    }
}

//----------------------------------
// RUN 
$app = new apiTalk();
$app->run();
