/**
 * DataObject
 *                 
 * {APP} <--> {DB} <--> localStorage 
 *             ↓↑
 *    　　　   {API} <--> server 
 * 
 * DB :Appからデータ要求を処理
 * 
 * 起動時に Local Storage / Session Storage を確認
 * - 最小データがなければ構築(主に初回起動)
 * - 発言等のアクショントリガーもDB経由でAPIをコールする
 * 
 * 
 */
// grobals 
 var APP = APP || {};
 const DB_CONF = {
        

};
//----------------------------------------
//privates 
(function(APP, DB_CONF, store){
    var sec = 1000
    const API = APP.getAPI()

    const DB = {
        conf:{
            dbv:2.00,

        },
        init : function (storageEngine){
            $.extend( DB.conf, DB_CONF)
            // store.js
            DB.LS = storageEngine 
            if(DB.LS.enabled){
                //console.log(DB.LS)
                console.log("local storage ready")
            }
        },
        // LOCAL STORAGE HANDLEER -----------------------------
        LocalStorage:{},
        _getLS:function(table){

            return DB.LS.get(table)
        },
        _setLS:function(table, allVars){
            DB.LS.set(table, allVars)
        },
        _appendLS:function(table, record) {
            let tbl = DB._getLS(table) || []
            tbl.push(vl)
            DB.LS.set(table, record)
        },
        _clearLS:function(table) {
            if(!table){
               // DB.LocalStorage.clearAll()
            } else{
                DB.LS.remove(table)
            }
        },

        // -------------------------------------------------
        getLastLogin:function(){
            return new Promise((resolve, reject)=>{
                console.log('getLastLogin')
                // データがあったらOK
                // なければブラウザーキーだけ取りに行く
                API.ready.then(()=>{
                    let brkey = DB._getLS("brkey")
                    if(brkey){
                        API.setBrkey(brkey)
                    }
                    API.getAuth().then(
                        (res)=>{
                            if(!res || !res.status){
                                reject ("service not found")
                            }
                            if(res.status=='x'){
                                console.log("is New brouser")
                                console.log(res.brkey)
                            }                            
                            if(res.status=='o'){
                                console.log("reconnect")
                            }                            
                            API.setBrkey(res.brkey)
                            API.setToken(res.token)
                            DB._setLS("brkey", res.brkey)
                            
                            console.log('getLastLogin end')
                            
                            resolve()
                        },
                        reject)
                })
            })
        },
        getCurAvator:function(){
            return new Promise((resolve, reject)=>{
                console.log('getCurAvator')
                // データがあったらOK
                // なかったら名無しアバターをセットして
                // サーバー側にプッシュしておく

                setTimeout(resolve, 1000)
            })
        },
        getCurRoom(rn){
            // 最後に居たルーム情報取得
            return new Promise((resolve, reject)=>{
                console.log('getCurRoom')
                // データがあったらOK
                // なかったら名無しアバターをセットして
                // サーバー側にプッシュしておく
                this.getLog
                setTimeout(resolve, 1000)
            })
        },
        // 初回はほんとなら　ルームリストとって
        // 選択させる　
        // とりまなし
        
        getLog(roomNo, cuurNo, backFlg ){
            const limit = 10
            //未指定は false
            backFlg = backFlg || false

            // backFlg false:after,　true:befoer
            // after の際は一定間隔で問い合わせも行う
            if(!this.connect){
                this.watch(roomNo)
            }

            // cuurNo 指定されてない場合 last befoe 10 に
            if(!cuurNo){
                cuurNo = 999999
                backFlg = 1
            }
            //　バックのとき予めreverce 取得
            const talks = _lsLog(roomNo, backFlg)

            var cnt = 0
            let res = talks.filter((row,ix,arr)=>{
                if (cnt>limit) return false
                if(backFlg){
                    return ( row.logNo <= cuurNo )
                }
                return (row.logNo > cuurNo)
            })
            return talks
        },

        _lsLog: function(roomNo, rev){
            rev = rev || false

            // LS上は時系列に並んでるものとする
            talks = []
            
            // reverce 指定があったらソート
            if(rev){
                talks.sort((A,B)=>{
                    return  (A.logNo < B.logNo ) ? 1: -1
                })
            }
            return talks
        },

        connect:'',
        interval:1000,
        watch: function(roomNNo){
            if(!this.connect){}
        },
    };
     

    //--------------------------------
    // APPへの組み込み　起動の通知
    APP.DB = DB;
    DB.init(store)

    DB.ready = new Promise(function(resolve, reject){
        // 起動データの確認
        DB.getLastLogin()
            .then(DB.getCurAvator,()=>{reject("login fail")})
            .then(DB.getCurRoom,()=>{reject("avator fail")})
            .then(resolve,()=>{reject("room fail")})

        // watch dog
        setTimeout(()=>{
            reject("起動タイムアウト")
        },30*sec)
    
    })
})(APP, DB_CONF, store);



