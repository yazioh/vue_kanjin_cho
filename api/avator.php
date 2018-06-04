<?php
require_once "apiBase.php";

class apiAvator extends apiBase
{
    protected $table = 'm_character';
    
    function command($req){
        switch ($req["cmd"]) {
            case "cid":
                $this->getChid($req);
                break;

            default:
                parent::command($req);
                break;
        }
    }

    /**
     * キャラクター取得
     */
    public function get($req)
    {
        try {
            if (!empty($req['chid'])) {
                $row = $this->find($this->table, "chid", $req['chid']);
            }
            if (empty($row['id'])) {
                throw new Exception("該当なし");
            }

            // あとで更新判定に使う
            $this->setAvaCache($row);
            $this->showJson(array(
                "status" => 'o',
                "data" => array(
                    "chid" => $row['chid'],
                    "name" => $row['name'],
                    "face" => json_decode($row['avator']),
                ),
            ));

        } catch (Exception $ex) {
            $this->showJson(array(
                "status" => 'x',
                "msg" => $ex->getMessage(),
            ));
        }

    }

    /**
     * キャラクタ更新
     */
    public function set($req)
    {
        try {
            if (empty($req['chid'])) {
                throw new Exception("設定キーがありません");
            }
           
            if (empty($req['name'])) {
                throw new Exception("キャラクター名設定がありません");
            }
            if (empty($req['face'])) {
                // jsonで来るのでそのまま解かない
                throw new Exception("設定値がありません");
            }
            $row = $this->find($this->table, "chid", $req['chid']);

            if (!empty($row['id'])) {
               // throw new Exception("test");

                $id = $this->q($row["id"]);
                $qName = $this->q($req['name']);
                $qFace = $this->q(json_encode($req['face'], JSON_UNESCAPED_UNICODE));
                $sql = "UPDATE " . $this->table . " SET name={$qName}, avator={$qFace} WHERE id={$id}";
                $this->db->query($sql);
                if ($errMsg = $this->dbError()) {
                    throw new exception($errMsg);
                }
            }else{
                throw new Exception("nodat");
            }
            $this->showJson(array(
                "status" => 'o',
            ));

        } catch (Exception $ex) {
            $this->showJson(array(
                "status" => 'x',
                "msg" => $ex->getMessage(),
            ));
        }
    }

    /**
     * 初期化
     */
    public function getChid($req)
    {
        try {
            if(empty($_SESSION['brkey'])){
                throw new Exception("設定キーがありません");
            }
            $brkey = $_SESSION['brkey'];
             
            // if (empty($req['brkey'])) {
            //     throw new Exception("設定キーがありません");
            // }
            $row = $this->find($this->table, "browser_key", $brkey);
            if($row['id']){
                $this->showJson(array(
                    "status" => 'o',
                    "chid" => $row['chid'],
                ));
                exit;
            }
            // chidh発行後 br
      
            // キャラクター枠の新設
            $id = $this->_createCharactor($brkey);
            $chid= $this->_setChid( $id );
            $this->showJson(array(
                "status" => 'o',
                "chid" => $chid,
            ));


        } catch (Exception $ex) {
            $this->showJson(array(
                "status" => 'x',
                "msg" => $ex->getMessage(),
            ));
        }
    }

    protected function _createCharactor($brkey ){
        $qBrkey = $this->q($brkey);

        $sql = "INSERT " . $this->table . " VALUES(0, {$qBrkey},'','','','o', now(), now())";
        $this->query($sql);
        if ($this->dbError()) {
            throw new exception($this->dbError());
        }
        return $this->db->insert_id;
    }

    protected function _setChid( $id ){
        $chid= sprintf("%s%05d", $this->mkPswd(2), $id);
        $qChid = $this->q($chid); 

        $sql = "UPDATE " . $this->table . " set chid={$qChid} where id={$id}";
        $this->query($sql);
        if ($this->dbError()) {
            throw new exception($this->dbError());
        }
        return $chid;
    }


}

$app = new apiAvator();
$app->run();
