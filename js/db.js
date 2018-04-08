/**
 * きゃらとローカルDB
 * 
 */
let id = 1;

class DB {
    constructor(app) {
        this._app = app;
        // 
        this._que = [];
        this._talk = [];
        this._avatorCache = new avaCache(this);
    }

    /**
     * アバターの取得
     * ※キャッシさせたいので外出しした
     */
    avator() {
        return this._avatorCache;
    }
    avaCache() {
        return this._avatorCache;
    }


    saveBrkey(str) {
        store.set("brkey", str);
    }

    loadBrkey() {
        let x = store.get("brkey");
        if (typeof x == 'undefined') {
            return '';
        }
        return x;
    }

    saveToken(str) {
        store.set("token", str);
    }
    loadToken() {
        let x = store.get("token");
        if (typeof x == 'undefined') {
            return '';
        }
        return x;
    }

    /**
     * @param {*} addList 
     */
    saveLog(addList) {
        let list = store.get("talk_log");
        if (typeof list == 'undefined') {
            list = [];
        }
        // 重複を除こう まず存在確認
        let ids = {};
        list = list.filter(function (o) {
            if (!ids[o.id]) {
                ids[o.id] = 1;
                return true;
            }
            return false;
        });
        // 重複ID以外を追加
        $.each(addList, function (i, o) {
            if (!ids[o.id]) {
                list.push(o); // console.log(o);
                ids[o.id] = 1;
            }
        });
        list.sort(function (a, b) {
            return (Number(a.id) > Number(b.id) ? 1 : -1);
        });

        store.set("talk_log", list);
    }

    /**
     * 
     * @param {*} lastID 
     * @return array
     */
    makeQue(lastID) {
        let logs = this.load("logs");
        if (typeof logs == 'undefined') {
            return [];
        }
        return logs.filter((msg) => {
            return (Number(msg.id) > Number(lastID));
        });
    }

    /**
     * 新着アバターの検出
     * @param {*} log ログまたはキュー
     */
    findNewFace(log) {
        var chids = {};
        let newCommer = log.filter((tk) => {
            if (typeof chids[tk.chid] != 'undefined') {
                return false;
            }
            chids[tk.chid] = 1;
            if(this.avator().exists(tk.chid)){
                return false;
            }
            chids[tk.chid] = 0;
            return true;
        });
        // Talk 全体が帰るけど 取得先でchid拾ってね
        return newCommer;
    }

    /**
     * 各種データの読み込み
     * @param {*} key 
     */
    load(key) {

        switch (key) {
            case "avator_cache":
                //store.remove("chid");
                //store.remove("avator_cache");
                let ch = store.get("avator_cache");
                if (typeof ch == 'undefined') {
                    ch = {};
                }
                return ch;

            case "staff":
                if (!this._avatorCache.exists("staff")) {
                    let _staff = new Avator();
                    _staff.setHairColor("lbrwn").setHairBack("back_05.gif").setHairFront("front_00.gif").setCloth("lobby.gif");
                    this._avatorCache.update("staff", _staff);
                }
                return this._avatorCache.clone("staff");

            case "last_room":
                //未実装 ルーム選択機能追加後に
                return {
                    id: 1,
                    status: "OK",
                    name: "ひだまりの放課後",
                    lastAccess: new Date("2018/03/27 12:15:31")
                }

            case "logs":
                //store.remove("talk_log");
                let logs = store.get("talk_log");
                if (typeof logs !== 'undefined') {
                    logs.sort(function (a, b) {
                        return (Number(a.id) > Number(b.id) ? 1 : -1);
                    });
                    store.set("talk_log", logs);
                    return logs;
                } else {
                    let t = [];
                    this.saveLog(t);
                    return t;
                }

            case "player_id":
                let chid = store.get("chid");
                return chid;


        }
    }

    // 汎用なのって必要なさげです？
    save(key, v) {

    }

    /**
     * ローカルストレージの特定キーを削除
     */
    clearLS(key) {
        switch (key) {
            case 'talk':
                return store.remove('talk_log');

            case 'avator':
                return store.remove('avator_cache');


        }
    }

    static getAvatorParts(partName) {
        switch (partName) {
            // この辺共通
            case 'baseColor':
                return {
                    G: ["01", "03", "00", "02", "04"]
                };

            case 'eyeColor':
                return {
                    G: ["blk", "blu", "red", "dbr", "grn"]
                };

            case 'hairColor':
                return {
                    G: ["blk", "dbrwn", "org", "red", "pink", "viol", "grn", "lgrn", "gold", "silv", "lvio", "blue"]
                }; //, "lbrwn" 今の所staff専用

                // 性差ありの部品
            case 'base':
                return {
                    F: ["base_00.gif", "base_00c.gif", "base_01.gif", "base_01c.gif", "base_02.gif", "base_02c.gif"],
                    M: ["base_m000.gif", "base_m001.gif", "base_m002.gif", "base_m003.gif", "base_m004.gif", "base_m005.gif"]
                };

            case 'hairBack':
                return {
                    F: ["back_00.gif", "back_00s.gif", "back_01.gif", "back_02.gif", "back_02s.gif", "back_03.gif", "back_04.gif", "back_05.gif", "back_06.gif", "back_07.gif", "back_12.gif", "back_13.gif"],
                    M: ["back_m00.gif", "back_m01.gif", "back_m02.gif", "back_m03.gif", "back_m04.gif", "back_m05.gif"]
                };

            case 'hairFront':
                return {
                    F: ["front_00.gif", "front_01.gif", "front_02.gif", "front_03.gif", "front_04.gif", "front_05.gif", "front_06.gif", "front_kiku.gif"],
                    M: ["front_m00.gif", "front_m02.gif", "front_m02.gif", "front_m03.gif", "front_m04.gif", "front_m05.gif", "front_m06.gif"]
                };

            case 'hairExtend':
                return {
                    F: ["", "hacc_01.gif", "hacc_02.gif", "hacc_03.gif", "hacc_01s.gif"],
                    M: ["", "hacc_05m.gif", "hacc_06m.gif"]
                };

            case 'baseType':
                return {
                    F: ["base_00.gif", "base_00c.gif", "base_01.gif", "base_01c.gif", "base_02.gif", "base_02c.gif"],
                    M: ["base_m000.gif", "base_m001.gif", "base_m002.gif", "base_m003.gif", "base_m004.gif"]
                };

            case 'eyeType':
                return {
                    F: ["f01.gif", "f02.gif", "f03.gif", "f04.gif", "f05.gif", "f06.gif", "f07.gif"],
                    M: ["m01.gif", "m02.gif", "m03.gif", "m04.gif", "m05.gif", "m06.gif"]
                };

            case 'faceAcc':
                return {
                    F: ["", "acc_fg_00.gif", "acc_fg_01.gif", "acc_fg_04.gif"],
                    M: ["", "acc_mg_00.gif", "acc_mg_01.gif", "acc_mg_02.gif", "acc_mg_03.gif", "acc_mg_04.gif"]
                };
            case 'cloth':
                return {
                    F: ["tmf/01.gif", "tmf/02.gif", "tmf/03.gif", "tmf/04.gif", "tmf/05.gif", "tmf/06.gif", "chfr/shf02.gif", "chfr/shf03.gif", "cloth_005.gif", "cloth_006.gif", "cloth_006b.gif", "cloth_07.gif", "cloth_08.gif", "miko.gif", "tearoom.gif"],
                    M: ["tmm/t01.gif", "tmm/t02.gif", "tmm/t03.gif", "tmm/w000.gif", "tmm/w001.gif", "tmm/w002.gif", "chfr/shm01.gif", "chfr/shm02.gif", "chfr/shm03.gif"]
                };

            default:
                return {
                    G: []
                };
        }
    }

    static emotionItems(partName) {
        switch (partName) {
            case "laugh":
                return ["sp_smile.gif", "sp_laugh.gif", "sp_nyan.gif", ""];
            case "anger":
                return ["sp_angry.gif", "sp_gorula.gif", ""];
            case "cry":
                return ["sp_sob.gif", "sp_cry.gif", "sp_au.gif", "sp_fear.gif", "sp_munku.gif", ""];
            case "etc":
                return ["sp_akirame.gif", "sp_azen.gif", "sp_megaten.gif", "sp_nyuron.gif", ""];

        }
    }

    static defaultAvator(gender) {
        switch (gender) {
            case 'M':
                return {
                    gender: "M",
                    base: {
                        color: "00",
                        type: "bm01.gif"
                    },
                    eye: {
                        color: "blk",
                        type: "m01.gif"
                    },
                    hair: {
                        color: "dbrwn",
                        back: "back_m00.gif",
                        front: "front_m03.gif",
                        extend: ""
                    },
                    acc: {
                        cloth: "tmm/t01.gif",
                        face: "",
                        hair: ""
                    },
                    emo: {
                        bg: "",
                        eye: "",
                        over: "",
                        vol: ""
                    }
                };

            case 'F':
            default:
                return {
                    gender: "F",
                    base: {
                        color: "00",
                        type: "bf01.gif"
                    },
                    eye: {
                        color: "blu",
                        type: "f01.gif"
                    },
                    hair: {
                        color: "blk",
                        back: "back_00.gif",
                        front: "front_02.gif",
                        extend: ""
                    },
                    acc: {
                        cloth: "tmf/01.gif",
                        face: "",
                        hair: ""
                    },
                    emo: {
                        bg: "",
                        eye: "",
                        over: "",
                        vol: ""
                    }
                };

        }
    }

    /**
     * ユーザーメッセージのフォーマット
     * @param {*} strID 
     * @param {*} txtMessage 
     * @param {*} jsonEmotion 
     * @param {*} time 
     */
    msg(strID, txtMessage, jsonEmotion, time) {
        let _time = (time ? new Date(time) : new Date());
        return {
            id: id++,
            chid: strID,
            emotion: jsonEmotion,
            talk: txtMessage,
            rgst: _time,
        };
    }
}

/**
 * ログ表示用アバター管理
 */
class avaCache {
    constructor(db) {
        this.cache = db.load("avator_cache");
        if (!this.cache) {
            this.cache = {};
        }
        console.log("avator cache ready");
    }

    update(chid, upAva) {
        if (!this.exists(chid)) {
            this.append(chid, upAva);
        } else {
            console.log("avator " + chid + " modefied");
            this.cache[chid] = upAva;
        }
        store.set("avator_cache", this.cache);
        // DB.saveAvaCache(this.cache);
    }

    append(chid, ava) {
        console.log("new avator " + chid);
        this.cache[chid] = ava.toJson();
    }

    exists(chid) {
        return ((typeof this.cache[chid]) !== "undefined");
    }

    name(chid) {
        if (!this.exists(chid)) {
            return "ななし";
        }
        return this.cache[chid].name;
    }

    face(chid) {
        if (!this.exists(chid)) {
            return false;
        }
        return this.cache[chid].face;
    }

    clone(chid) {
        if (!this.exists(chid)) {
            return false;
        }
        // 返した先でオリジナルを汚染しないように参照を切断
        return JSON.parse(JSON.stringify(this.cache[chid]));
    }
}