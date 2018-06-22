var APP = APP || {};
/*
{APP}
  ↓ show / 
{timeLine}  
  ↓↑  (↓talk  ↑curRoom/log/change)
{ DB } 
  ↓↑ 
{ API } <-> server 
*/ 
(function(Vue){
    var DB ='' // APP.getDB();
    //----------------------------------------------------
    // timeLinePage　コンポーネント
    //----------------------------------------------------
    Vue.component("time-line", {
        template: `
<div>
  <div class="row">
    <div class="col-sm-2">
        <cmp-room-info v-bind="roomInfo"/>
    </div>
    <div class="col-sm-8 col-md-6">
    <div class="page">
        <slot /> 
        <ol class="timeline row">
            <kzc-koma  v-for="talk in curPageLog" :talk="talk" >{{talk}}</kzc-koma>
        </ol>
        </div>
    </div>
    <div class="col-sm-2">
        aaaa    
        <cmp-talk-panel :chid="chid"  />
    </div>
  </div>
  <div class="row">
    <div class="col-12 text-center">
        <cmp-paginate ref="paginate" v-model="curPage" />
    </div>
  </div>
    
</div>`,

        props:{
        },
        computed: { },
        data:function(){ return {
            chid: '',
            face: '',
            // log all
            log:[],
            curPageLog:[],

            curPage:[],
            roomInfo: {}
        }},
        mounted:function(){
            console.log("time-line")
            this._loadRoom()
            this._loadPlayer()
        },
        watch:{
            log:function(){
                console.log(this.log)
                this.curPageLog = this.log
            }
        },
        methods: {
            show:function(){
                console.log("show!!!!!")
            },
            hide:function(){
                console.log("hide!!!!!")
            },
            setLog:function(list){
                this.$refs.paginate.setList(list) 
            },

            _loadRoom: function(){
                // 名称　Appから　動的設定なので　$set で
                this.$set(this, "roomInfo", APP.roomInfo)
                // ログ DBから　---------
                DB =APP.getDB();
                console.log(APP.roomInfo)
                this.log = DB.getLog(APP.roomInfo.id)
            },

            _loadPlayer: function(){
                this.chid= APP.player.chid
                this.face= APP.player.face
            }
        },
    });

    //----------------------------------------------------
    // room メニュー
    //----------------------------------------------------
    Vue.component("cmp-room-info", {
        template:`
<div class="roomoinfo">
    <h3>{{ name }}</h3>
    {{ id }} / {{ status }}
</div>`,
        props:{
            "id":'',
            "name":'',
            "status":'',
//            "update":''
        },
        data: function(){return {

        }},
        computed:{
        }, 
        methods:{
        }
    });


    //----------------------------------------------------
    // 入力 I/F トークパネル
    //----------------------------------------------------
    Vue.component("cmp-talk-panel", {
        template:`<div>TK
<form :id="_id" v-show="1">
    <dl>
        <dt class="hidden-sm hidden-xs">
            <span>talk</span>
        </dt>
        <dd style="position: relative;">
            <txtTalk 
                rel="textArea" v-model="msg"
                @keyup.13.shift="sendMessage" 
                @keyup.13.meta="sendMessage"
            />
            <btnSend class="btnSendMessage" @click="sendMessage">
        </dd>
    </dl>
    <dl class="row">
        <dt class="col-xs-3 text-center">
            <cmp-avator :face="ava.face">NoImaege</cmp-avator>
        </dt>
        <dd class="col-xs-9 " style="min-height:64px;">
            <div class="emotions">
                <btn-emo icon="^◡^"  @click="tgleLaugh" />
                <btn-emo icon="\`^\´" @click="tglAnger"  />
                <btn-emo icon="ToT"   @click="tglCry"    />
                <btn-emo icon="╹-╹"   @click="tglEtc"    />
            </div>
        </dd>

        <dt class="avaname hidden-xs col-sm-3 text-center"> name </dt>
        <dd class="avaname col-sm-9">
            <div class="button-group">    
                <label>{{ ava.name }}</label>
                <btnConf @click="openEdit"/>
            </div>
        </dd>
    </dl>
</dorm>
        </div>`,
        components :{
            txtTalk: {
                template: `<textarea cols="30" rows="5" class="fit" /><slot /></textarea>`
            },
            btnSend:{
                template: `<button type="button"><i class="glyphicon glyphicon-send"></i></button>`
            },
            btnConf:{
                template: `<button class="btnConfig" type="button" ><i class="glyphicon glyphicon-cog"></i></button>`
            },
            btnEmo:{
                template: `<button class="" type="button" >{{ icon }}</button>`
            }
        },

        props:{
            chid:{},
            showFlg: {},
        },
        computed:{
        },
        data: function(){
            return {
                
                msg: "",
                chid: "",
                ava: {
                    name: "--",
                    face: Avator.getDefault("F")
                },
            }
        },
        created: function(){
            this.clear()
        },
        watch:{
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

            //----------------------------- component 分離
            openEdit:function(){
                APP.show("AvatorEdit")
            }
        }
    })


    //----------------------------------------------------
    // ページ送り
    //----------------------------------------------------
    Vue.component("cmp-paginate", {
        "template" : `
<ol class="button-group">
    <li class="btn" v-if="showPrev" @click="select('prev')" ><span>{{ prevLavel }}</span></li>
    <li v-for="pageNum in pages"
        class="btn" @click="select(pageNum)" 
        v-if="neighbor(pageNum)"
        ><span>{{ pageNum }}</span></li>
    <li class="btn" v-if="showNext" @click="select('next')"><span>{{ nextLavel }}</span></li>
</ol>        
        `,
        props:{
            // cuurent page <-> parent
            value:{default: 1},
            maxPage:{default: 1},
            // limit both side 
            width:{default: 2},

            prevLavel:{ default: '前'},
            nextLavel:{ default: '次'},
            hidePrevAuto:{defaulu: true},
            hideNextAuto:{defaulu: true},
            // mount callback func
            onUpdate:{},
        },
        computed:{
            showPrev:function(){
               return (this.currentPage !== 1 || this.hidePrevAuto)
            }, 
            showNext:function(){
                return (this.currentPage !== 1 || this.hideNextAuto)
            }, 

        },
        data:function(){
            return {
                currentPage:1,
                pages:[1]
            }
        },
        watch:{
            "value": function(ev){
                this.currentPage = ev.target.value
                // update  しない
            },
            "maxPage": function(ev){
                this.update(1);
                this.pages = []
                for(let i=1;i<= ev.target.value; i++){
                    this.pages.push(i)
                }
            },
        },
        methods: {
            neighbor:function( p ){
               return ( Math.abs(this.currentPage - p) <= this.width)
            },
            update:function(newPage) {
                this.currentPage = newPage
                this.$emit('input', newPage)
                // call back ?
                if(this.onUpdate){
                    this.onUpdate(newPage)
                }
            },

            select: function onPageClick(num){
                let newPage = num;
                switch(num){
                    case "prev":
                    newPage =this.curPage -1;
                    break;
                    case "next":
                    newPage =this.curPage +1;
                    break;
                }
                if(this._valid(newPage)){
                    this.update(newPage)
                }
            },

            _valid: function(pgNum){
                if(!isNaN(pgNum) || pgNUm<0 || pgNum >this.maxPage ){
                    return false
                }
                return true;
            }
        }
    });


})(Vue);
