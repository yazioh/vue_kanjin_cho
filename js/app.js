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
        this._API = new API();
    }

    /**
     * アプリケーション初期化
     */
    boot() {
        console.log("app booting ...");
        this.splashView();

        API.getAuth(this._DB.loadBrkey(), this._DB.loadToken()).
        then((res) => {

            if (res && res.status) {
                if (res.status == 'x') {
                    KZC._DB.saveBrkey(res.brkey);
                }
                KZC._DB.saveToken(res.token);
                KZC._checkChid().then(function () {
                    KZC.start();
                }, KZC.nodataStart);
            }
        }, API.commonError);
    }
    /**
     * 
     */
    nodataStart (){
        // ここでチュートリアルログを生成

        // アバターの生成画面へ
        console.log("stoped !!!!");
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

    _refreshAvator() {
        console.log("refresh");
        let _chr = this.db().load("avator_cache");
        if (!_chr) {
            // 新規のときか、LDBクリアしたあと

            return;
        }

        // 既存データは起動時に確認　→TODO あとでまとめて
        for (var chid in _chr) {
            if (chid == "staff") {
                this.avaCache().update("staff", this.db().load("staff"));

            } else {
                API.getAvator(chid).then((res) => {
                    if (res.status && res.status == 'o') {
                        this.avaCache().update(res.data.chid, res.data);
                    }
                });
            }
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
        
        //TODO css
        $('#splash .koma').animate({
            opacity: 0
        }, 2000, () => {

            //表示切り替え
            this.vApp.showFlg = 0;
            this.vMain.showFlg = 1;
            this.vTalk.showFlg = 1;

            // ポーリング開始
            this.api().startTimer((res) => {
                this.onReceveMessage(res);
            }, 1000);
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

    api() {
        return this._API;
    }

    splashView() {
        this.initView();
        this.vApp.showFlg = 1;
        this.vMain.showFlg = 0;
        this.vTalk.showFlg = 0;
    }

    initView() {
        /**
         * 最上位(表示コントロール用)
         * 
         */
        this.vApp = new Vue({
            "el": "#splash",
            "data": {
                showFlg: 1,
            },
            computed: {
                staff: function () {
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
                "lastId": 0,
                "log": [],
                "member": [],

                "que": [],
                "timer": null,
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
                    if (typeof list == "undefined") {
                        this.log = [];
                        return;
                    }
                    if(list.length >80){
                        list = list.slice(-40);
                    }
                    let _unKnown = KZC.db().findNewFace(list);
                    if (_unKnown.length > 0) {
                        _unKnown.forEach((tk) => {
                            KZC.requestAvator(tk.chid);
                        });
                    }
                    this.setQue(list);
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

                setQue(diff) {
                    if (diff && diff.length > 0) {
                        clearTimeout(this.timer);
                        this.que = diff;
                        return this.deQue();
                    }
                },

                deQue() {
                    clearTimeout(this.timer);
                    if (this.que.length > 0) {
                        let msg = this.que.shift();
                        this.lastId = msg.id;
                        this.log.push(msg);
                        var $scr = $("#main .screen").eq(0);
                        var ch = $("ol", $scr).eq(0).height();
                        // append のイベントへ移動
                        setTimeout(() => {
                            let c2 = $("ol", $scr).eq(0).height();
                            if (c2 > ch) {
                                $scr.scrollTop(c2);
                            }
                        }, 100);
                    }

                    if (this.que.length > 0) {
                        let tmm = (this.que.length > 10) ? 300 : 500;
                        this.timer = setTimeout(() => {
                            this.deQue();
                        }, tmm);

                    } else {
                        if (this.log.length > 80) {
                            this.log = this.log.slice(-40);
                        }
                    }
                }

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
                    this.ava.face.gender = '' + Cache.face(chid).gender;
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
                    let items = Avator.emotionItems("laugh", this.ava.gender);
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglAnger: function () {
                    let items = Avator.emotionItems("anger", this.ava.gender);
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglCry: function () {
                    let items = Avator.emotionItems("cry", this.ava.gender);
                    this.ava.face.emo.eye = this._toggle(items, this.ava.face.emo.eye);
                },
                tglEtc: function () {
                    let items = Avator.emotionItems("etc", this.ava.gender);
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

                    let send = KZC.db().msg(
                        this.chid,
                        this.msg,
                        Vue.util.extend({}, this.ava.face.emo)
                    );
                    // 実際に何やるかはAPP本体さんにお任せ
                    KZC.onSendMessage(send, this.clear);
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

                    let t = this.$refs.textArea;
                    if (t) {
                        t.focus();
                    }
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
                },


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
    onSendMessage(data, onSuccess, onFalure) {

        this.api().setTalk(data).then(
            (res) => {
                // view 側のあと始末
                onSuccess();

                if (res.tkid) {
                    this.api().getTalk(res.tkid).then(
                        (res) => {
                            this.onReceveMessage(res);
                        },
                        API.commonError);
                }
            },
            // view 側に失敗を通知
            onFalure
        );
    }

    /**
     * APIから 発言を受け取ったとき
     */
    onReceveMessage(res) {
        if (res.talk) {
            this.db().saveLog(res.talk);

            let q = this.db().makeQue(this.vMain.lastId);
            if (q.length > 0) {
                this.vMain.setQue(q);
            }
            if (res.updates && res.updates.length) {
                res.updates.forEach((a) => {
                    if (a.chid) {
                        let chid = a.chid
                        this.avaCache().update(chid, a);
                    }
                });
            }
        }
        if (res.msg) {
            alert(msg)
        }
        this.api().startTimer((res) => {
            this.onReceveMessage(res);
        });
    }

    /**
     * 
     * @param {*} chid
     * @return promise 
     */
    requestAvator(chid) {
        return API.getAvator(chid).then(
            function (res) {
                if (!res) {
                    return API.commonError("?");
                }
                if (res.msg) {
                    // なんかエラー帰っとるにゃ？
                    alert(res.msg);
                }
                if (res.status && res.status == 'o') {
                    let _ava = new Avator(res.data);
                    KZC.updatePlayer(chid, _ava);
                }
            },
            API.commonError
        ).promise();
    }
};

// componet 群 ->TODO 適切に分離
Vue.component(
    "cmp-koma", {
        props: ["talk"],
        // TODO 背景色 大声（x2）など
        template: '<li class="koma" :class="komaSize">' +
            '<p v-if="talk.talk" class="selif" v-html="TalkNl2Br"></p>' +
            '<span v-html="avator(talk.chid, talk.emotion)" class="avator"></span>' +
            '<i class="time">{{ fzTime }}</i>' +
            '<b class="name">{{ avaName }}</b>' +
            '</li>',
        methods: {
            avator: function (chid, emotion) {
                return Avator.show(chid, emotion);
            }
        },
        computed: {
            TalkNl2Br:function(){
                let tmp = this.talk.talk.split("\n");
                return tmp.join('<br>'); 
            },
            fzTime: function () {
                return '';
                // return "00:00";
                // return this.talk.time + "fz";
            },
            avaName: function () {
                return Avator.getName(this.talk.chid);
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