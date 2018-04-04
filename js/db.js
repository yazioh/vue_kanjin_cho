/**
 * ログ表示用アバター管理
 */
class avaCache {
    constructor(app, db) {
        this._app = app;
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
            this.cache[chid] = upAva.toJson();
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
}

/**
 * message obj
 */
let id = 1;

function msg(strID, txtMessage, jsonEmotion, time) {
    let _time = (time ? new Date(time) : new Date());
    return {
        id: id++,
        chid: strID,
        emotion: jsonEmotion,
        talk: txtMessage,
        rgst: _time,
    };
}

class DB {
    constructor(app) {
        this._app = app;
        this.API = new API(app);
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

    saveLog(addList) {
        let list = store.get("talk_log");
        if (typeof list == 'undefined') {
            list = [];
        }
        // 重複を除こう
        let ids = {};
        list = list.filter(function (o) {
            if (!ids[o.id]) {
                ids[o.id] = 1;
                return true;
            }
            return false;
        });
        $.each(addList, function (i, o) {
            if (!ids[o.id]) {
                list.push(o); // console.log(o);
                ids[o.id] = 1;
            }
        });
        list.sort(function (a, b) {
            return (a.id > b.id) ? 1 : -1;
        });
        store.set("talk_log", list);
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
                let _staff = new Avator();
                _staff.setHairColor("lbrwn").setHairBack("back_05.gif").setHairFront("front_00.gif").setCloth("lobby.gif");
                ch.staff = _staff.toJson();

                store.set("avator_cache", ch);
                return ch;

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
}