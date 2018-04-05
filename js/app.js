/**
 * きゃらと〰く 
 * ver201804
 * ------------------------------
 */
class APP {
    /**
     * サブ/Util初期化
     */
    constructor() {
        console.log("constluctor ...");
        //------------
        this._DB = new DB(this);
        this._API = new API(this);
    }

    /**
     * アプリケーション初期化
     */
    boot() {
        console.log("app booting ...");
        this.splashView();

        API.getAuth(this._DB.loadBrkey(), this._DB.loadToken()).
        then(function (res) {

            if (res && res.status) {
                if (res.status == 'x') {
                    KZC._DB.saveBrkey(res.brkey);
                }
                KZC._DB.saveToken(res.token);
                KZC._checkChid().then(function () {
                    KZC.start();

                }, KZC.terminate);
            }
        }, API.commonError);
    }

    /**
     * 発言するためのキャラクターID取得
     * 初回ｰ>サーバーに新規キャラクタの問い合わせ（生成）
     * 次回以降ローカルDBから
     * ---------------------------
     * TODO 書き換え対策
     */
    _checkChid() {
        let chid = KZC._DB.load("player_id");
        if (chid) {
            //2回目以降
            return API.getAvator(chid).then(
                function (res) {
                    return KZC.requestAvator(chid)
                }, API.commonError).promise();

        } else {
            // 初回起動 chid も予約しておく
            return API.getChid().then(
                function (res) {
                    if (res.status == 'o') {
                        store.set("chid", res.chid);
                    }
                }, API.commonError).promise();
        }
    }

    /**
     * ローカルDBからログを取得、ページ初期化
     */
    start() {
        this.vMain.loadRoom(this._DB.load("last_room"));
        this.vMain.loadLog(this._DB.load("logs"));
        let chid = this._DB.load("player_id");
        this.vTalk.loadPlayer(chid, this._DB.avator());

        $('#splash .koma').animate({
            opacity: 0
        }, 2000, () => {

            //表示切り替え
            this.vApp.showFlg = 0;
            this.vMain.showFlg = 1;
            this.vTalk.showFlg = 1;

            // ポーリング開始
            API.setNext();
            console.log("*** welcome to きゃらと ***");
        });
    }

    /**
     * public
     * ローカルのアバターDBにアクセス
     */
    avaCache() {
        return this._DB.avator();
    }
    /**
     * public
     */
    db() {
        return this._DB;
    }

    splashView() {
        this.initView();
        this.vApp.showFlg = 1;
        this.vMain.showFlg = 0;
        this.vTalk.showFlg = 0;
    }

    initView() {
        this.vApp = new Vue({
            "el": "#splash",
            "data": {
                showFlg: 1,
            },
            computed: {
                staff: function () {
                    console.log(KZC);
                    let _staffAva = new Avator(KZC.db().load("staff"));
                    return _staffAva.toHtml();
                }

            },
            methods: {

            }
        });

        /**
         * メインビュー TimeLine
         */
        this.vMain = new Vue({
            "el": "#main",
            "data": {
                "showFlg": 0,
                "roomID": "",
                "status": "",
                "roomName": "",
                "log": [],
                "member": []
            },
            "computed": {
                //
            },
            "methods": {
                // localstorage から部屋情報を取得（ダミー）
                loadRoom: function (roomInfo) {
                    this.roomID = roomInfo.id;
                    this.status = roomInfo.status;
                    this.roomName = roomInfo.name;
                },

                // local storage からログを復元
                // こっちは一括表示
                loadLog: function (list) {
                    if (typeof list == undefined) {
                        this.log = [];
                        return;
                    }
                    let _unKnown = [];
                    list.forEach(msg => {
                        if (!KZC.avaCache().exists(msg.chid)) {
                            _unKnown.push(msg.chid);
                        }
                    });
                    if (_unKnown.length > 0) {
                        _unKnown = _unKnown.filter(function (x, i, self) {
                            return self.indexOf(x) === i;
                        });
                        console.log(_unKnown);
                        _unKnown.forEach(chid => {
                            KZC.requestAvator(chid);
                        });
                    }
                    this.log = list;
                },

                // TODO ここを起点にコマの挿入アニメーションへ
                append: function (msg) {
                    if (msg.chid) {
                        if (!KZC.avaCache().exists(msg.chid)) {
                            KZC.requestAvator(msg.chid);
                        }
                    }
                    this.log.push(msg);
                },
            }
        });

        /**
         * 発言ビュー 
         */
        this.vTalk = new Vue({
            el: "#talk",
            data: {
                showFlg: 0,
                msg: "",
                chid: "",
                AvaCache: this.avaCache(),
                ava: {
                    name: "--",
                    face: Avator.getDefault("F")
                },
                //---
                edit: {
                    name: "--",
                    face: Avator.getDefault("F")
                },
                changePart: '',
                previews: [],

            },
            computed: {
                test: function () {
                    console.log(this);
                    return "OK";
                }
            },
            methods: {
                loadPlayer: function (chid, Cache) {
                    if (!Cache.exists(chid)) {
                        throw ("該当なし");
                    }

                    this.chid = chid;
                    this.ava.name = Cache.name(chid);
                    //this.ava.face = Cache.face(chid);
                    $.extend(this.ava.face.gender, Cache.face(chid).gender);
                    $.extend(this.ava.face.base, Cache.face(chid).base);
                    $.extend(this.ava.face.eye, Cache.face(chid).eye);
                    $.extend(this.ava.face.hair, Cache.face(chid).hair);
                    $.extend(this.ava.face.acc, Cache.face(chid).acc);
                    this.clear(this.ava);
                },

                /**
                 * 表情の変更本体
                 */
                _toggle: function (ary, curVal) {
                    if (!ary) {
                        return "";
                    }
                    let curPos = ary.findIndex(function (el, idx) {
                        if (el == curVal) {
                            return true;
                        }
                        return false;
                    });
                    return ary[(!curPos < 0 ? 0 : (curPos + 1) % ary.length)];
                },
                /**
                 * 表情変更ボタンイベントハンドラ
                 */
                tgleLaugh: function () {
                    let items = Avator.emotionItems("laugh");
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglAnger: function () {
                    let items = Avator.emotionItems("anger");
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglCry: function () {
                    let items = Avator.emotionItems("cry");
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglEtc: function () {
                    let items = Avator.emotionItems("etc");
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                // TODO 汗とかエモアイコン追加

                /**
                 * 発言時のイベントハンドラ 
                 * 発火の受け取りとチェック
                 */
                sendMessage: function () {
                    if (!this._canSend()) {
                        console.log("send cancel");
                        return false;
                    }
                    let send = msg(
                        this.chid,
                        this.msg,
                        Vue.util.extend({}, this.ava.face.emo)
                    );
                    // 実際に何やるかはAPP本体さんにお任せ
                    KZC.sendMessage(send, this.clear, API.commonError);
                },
                /**
                 * 送信前バリデーション
                 */
                _canSend: function () {
                    if (this.msg != '' || this.ava.face.emo.bg != '' || this.ava.face.emo.eye != '' || this.ava.face.emo.over != '') {
                        return true;
                    }
                    console.log(this.msg);
                    console.log(this.ava.face);
                    return false;
                },
                /**
                 * 入力欄空に
                 */
                clear: function () {
                    this.msg = '';
                    this.ava.face.emo.bg = '';
                    this.ava.face.emo.eye = '';
                    this.ava.face.emo.over = '';
                    this.ava.face.emo.vol = '';
                },
                alertAccessError: function (res) {
                    alert("通信に失敗　しばしまて");
                },

                //----------------------------- TODO component 分離
                /**
                 * アバターの変更ウインドウ表示
                 */
                openEdit: function () {
                    if (!this.chid) {
                        alert("初期化error");
                        return;
                    }
                    this.edit = new Avator(Avator.getCache(this.chid));

                    // 選択肢初期化
                    this.changePart = 'hairColor';
                    this.previews = this._makeSamples();

                    $("#mdlEdit").modal();
                },

                _makeSamples: function () {

                    var cngPart = this.changePart;
                    if (!cngPart) {
                        return [];
                    }
                    let items = Avator.getItems(cngPart, this.edit.face.gender);
                    if (items.length == 0) {
                        return [];
                    }

                    // avatorを生成
                    this.previews = [];
                    var cngAva = Avator.clone(this.edit);

                    var list = [];
                    $(items).each(function (i, o) {
                        cngAva.setName(o).change(cngPart, o);
                        list.push(Avator.clone(cngAva));
                    });
                    return list;
                },
                onChangeGender(gen) {
                    this.edit = new Avator(gen);
                    this.onChangePart("hairColor");
                },

                onChangePart(partName) {
                    console.log(partName);
                    this.changePart = '' + partName;
                    this.previews = this._makeSamples();
                },
                onChangeItem: function (itemName) {
                    this.edit.change(this.changePart, itemName);
                },
                onAttach() {
                    KZC.updatePlayer(this.chid, this.edit);
                    this.loadPlayer(this.chid, KZC.avaCache());
                    this.closeConfig();
                },

                closeConfig() {
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    $('#mdlEdit').modal('hide');
                }
            }
        });
    }

    /**
     * 着替え/アバター変更をサーバーに通知
     * @param {*} chid 
     * @param {*} upAvator 
     */
    updatePlayer(chid, upAvator) {
        this.avaCache().update(chid, upAvator);
        API.setAvator(chid, upAvator).then(function (res) {
            if (res && res.msg) {
                alert(res.msg);
            }
            console.log("player avator loaded OK");
        }, API.commonError);
    }

    /**
     * 発言する
     *  @param {*} data 
     * @param function onSuccess 
     * @param function onFalure 
     */
    sendMessage(data, onSuccess, onFalure) {
        API.setTalk(data).then(
            function (res) {
                onSuccess();
                if (res.tkid) {
                    API.getTalk(res.tkid + 2).then(
                        function (res) {
                            if (res.talk) {
                                KZC._DB.saveLog(res.talk)
                                KZC.vMain.loadLog(KZC._DB.load("logs"));
                            }
                            if (res.msg) {
                                alert(msg)
                            }
                            API.setNext();
                        }
                    );
                }
            },
            onFalure
        );
    }

    getMessage() {
        API.getTalk().then(
            function (res) {
                if (res.talk) {
                    KZC._DB.saveLog(res.talk)
                    KZC.vMain.loadLog(KZC._DB.load("logs"));
                }
                if (res.msg) {
                    alert(msg)
                }
                API.setNext();
            }
        );
    }

    requestAvator(chid) {
        return API.getAvator(chid).then(
            function (res) {
                if (!res) {
                    return API.commonError("?");
                }
                if (res.status && res.status == 'o') {
                    console.log(res);
                    let _ava = new Avator({
                        name: res.data.name,
                        face: res.data.face
                    });
                    //console.log(_ava);
                    KZC.updatePlayer(chid, _ava);
                }
                if (res.msg) {
                    alert(res.msg);
                }
            }, API.commonError
        );
    }
};

// componet 群 ->TODO 適切に分離
Vue.component(
    "cmp-koma", {
        props: ["talk"],
        // TODO 背景色 大声（x2）など
        template: '<li class="koma" :class="komaSize">' +
            '<p v-if="talk.talk" class="selif">{{ talk.talk }}</p>' +
            '<span v-html="avator(talk.chid, talk.emotion)" class="avator"></span>' +
            '<i class="time">{{ fzTime }}</i>' +
            '<b class="name">{{ talk.avaName }}</b>' +
            '</li>',
        methods: {
            avator: function (chid, emotion) {
                return Avator.show(chid, emotion);
            }
        },
        computed: {
            fzTime: function () {
                return '';
                // return "00:00";
                // return this.talk.time + "fz";
            },

            komaSize: function () {
                let len = ("" + this.talk.talk).length;
                if (len == 0) {
                    return "w0";
                }
                if (len > 40) {
                    return "w4";
                }
                if (len > 10) {
                    return "w2";
                }
                return "w1";
            },
        }
    }
);

Vue.component(
    "cmp-avator", {
        props: ["face"],
        template: '<span class="avator" v-html="myFace"></span>',
        methods: {},
        computed: {
            "size": function (cmp) {
                console.log(cmp);
                return "";
            },
            "myFace": function (cmp) {
                let ava = new Avator({
                    'name': "--",
                    'face': this.face
                });
                //console.log(cmp);
                //console.log(this.face);
                return ava.toHtml({});
            }
        }
    });

/**
 * ユーザーメッセージのフォーマット
 * @param {*} strID 
 * @param {*} txtMessage 
 * @param {*} jsonEmotion 
 * @param {*} time 
 */
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