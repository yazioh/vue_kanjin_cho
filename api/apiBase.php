<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');
//sleep(2);
require_once "../../.config.php";

/**
 * 分離するだけ　あとで整理ね
 */
class appBase
{
    protected function log($labal, $data)
    {
        return;
        error_log(
            sprintf(
                "%s %s %s\r\n"
                , date("m/d H:i:s")
                , $labal
                , print_r($data, 1)
            ),
            3, "../logs/apilog.txt");
    }

    protected $db = null;
    protected $dbResult = null;
    public function initDb()
    {
        $mysqli = new mysqli(DBHOST, DBUSER, DBPSW, DBSCHEMA);
        if ($mysqli->connect_errno) {
            throw new Exception(
                printf("Connect failed: %s\n", $mysqli->connect_error)
            );
        }
        $this->db = $mysqli;
        $this->dbResult = null;
    }

    public function query($sql)
    {
        $this->dbResult = null;
        if (!$this->db) {
            $this->initDb();
        }
        $this->dbResult = $this->db->query($sql);
        if ($this->db->error) {
            $this->log("query", $sql);
            $this->log("error", $this->db->error);
        }
    }

    public function dbError()
    {
        if ($this->db && $this->db->error) {
            return $this->db->error;
        }
        return false;
    }

    public function counts()
    {
        if (!$this->dbResult) {
            return 0;
        }
        return $this->dbResult->num_rows;
    }

    public function fetchRow()
    {
        if (!$this->dbResult) {
            return false;
        }
        $row = $this->dbResult->fetch_assoc();
        if (!$row) {
            $this->dbResult = null;
        }
        return $row;
    }

    public function q($str)
    {
        if (!$this->db) {
            $this->initDb();
        }
        return "'" . $this->db->real_escape_string($str) . "'";
    }

    protected function makeWheres($conds)
    {
        if (!count($conds)) {
            $conds[] = "1";
        }
        return " WHERE (" . implode(") AND (", $conds) . ") ";
    }

    //---------------------
    public function find($table, $idCol, $id)
    {
        $qid = $this->q($id);
        $this->query("SELECT * from $table where $idCol={$qid} AND status='o' LIMIT 1");
        if ($this->dbError()) {
            return false;
        }
        return $this->fetchRow();
    }
    //---------------------
    public function saveToken()
    {
        $brkey = $this->q($_SESSION['brkey']);
        $token = $this->q($_SESSION['token']);
        $sess = $this->q(session_id());

        $this->query("select id from m_user where browser_key={$brkey} and status='o'");
        if ($this->counts()) {
            $id = $this->q($this->fetchRow()["id"]);
            $this->db->query("UPDATE m_user set( browser_key={$brkey}, session_key={$sess}, token={$token}) where id={$id};");
            $this->db->query("UPDATE m_user set( status ='x') where id<>{$id} AND browser_key={$brkey};");
        } else {
            $this->db->query("INSERT m_user values(0, {$brkey}, {$sess},{$token},'o',now(),now())");
        }
        if ($errMsg = $this->dbError()) {
            throw new exception($errMsg);
        }
    }
}

/**
 * APIのrouter機能
 */
class apiBase extends appBase
{
    public function run()
    {
        $this->log('run', $_SERVER['REQUEST_URI']);
        try {
            session_start();
            if (empty($_REQUEST)) {
                return $this->index();
            }
            $this->command($_REQUEST);

        } catch (Exception $ex) {

            $this->log("api run ", $ex->getMessage());
        }
    }

    public function command($req)
    {
        switch ($req["cmd"]) {
            case "set":
                $this->set($req);
                break;

            case "get":
                $this->get($req);
                break;
        }
    }

    public function _isLogin()
    {
        if (empty($_SESSION['brkey'])) {
            return false;
        }
        $brKey = $this->q($_SESSION['brkey']);
        $this->query("select count(*) cnt from m_user where browser_key={$brKey} and status='o'");
        if ($errMsg = $this->dbError()) {
            throw new exception($errMsg);
        }
        if (!$this->fetchRow()['cnt']) {
            return false;
        };
        return true;
    }

    public function index()
    {
        if ($this->_isLogin()) {
            echo ($_SESSION['brkey']);
            echo "OK";
        } else {
            $this->getBrowserKey();
        }
    }

    public function mkPswd($len = 8)
    {
        return array_reduce(range(1, $len), function ($p) {return $p . str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')[0];});
    }

    public function showJson($data)
    {
        header('content-type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        //$this->log('showJson', $data);
    }

    // public function hoge($req)
    // {
    //     try {

    //     } catch (Exception $ex) {
    //         $this->showJson(array(
    //             "status" => 'x',
    //             "msg" => $ex->getMessage(),
    //         ));
    //     }
    // }

    /**
     * アバターキャッシュ
     * 情報を生データのまま保存(更新の検出用)
     */
    protected function setAvaCache($row)
    {
        if (empty($row['chid'])) {
            return;
        }
        $chid = $row['chid'];
        $_SESSION['avators'][$chid] = $row;
        $_SESSION['avators_lastupdt'] = max($_SESSION['avators_lastupdt'], $row['rgst'], $row['updt']);
        // $_SESSION['avators_udate'] = ($tm != $_SESSION['avators_lastupdt']);
    }

    protected function getAvaCache($chid)
    {
        if (empty($_SESSION['avators'])) {
            return false;
        }
        return $_SESSION['avators'][$chid];
    }

}
