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
        aCache:[],
        tCache:[],

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
                    API.getAuth()
                        .then((res)=>{
                            if(!res || !res.status){
                                reject ("getLastLogin service not found")
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
                        })
                        .then(resolve,reject)
                })
            })
        },

        getCurAvator:function(){
            console.log('getCurAvator')
            
            return new Promise((resolve, reject)=>{
                var chid = DB._getLS("chid")
                API.getChid()
                    .then((res)=>{

                        if(!res || !res.status){
                            reject ("getCurAvator service not found")
                        }
                        if(res.chid!= chid){
                            chid = res.chid
                            console.log(DB)
                            DB._setLS("chid", chid)
                        } 
                        API.setChid(chid)
                   }).then(()=>{

                    let AC = DB._getLS("avator_cache")
                    DB.aCache = (AC)? AC: {}

                    if(!DB.aCache[chid]){
                        const Avator = APP.getAvator()
                        Avator.setName("未設定")
                        DB.aCache[chid] = Avator.toJson()
                    }
                    if(!DB.aCache.staff){
                        DB.aCache.staff = APP.getStaff()
                    }
                    console.log('getCurAvator end')
                }).then(()=>{
                    let chid = DB._getLS("chid")
                    API.getAvator(chid).then((res)=>{
                        if(res && res.status){
                            if(res.data.name !=='' || res.data.face){
                                console.log("skip")
                                // skip
                                return
                            }
                            // サーバーにもPushしといて
                            console.log("push")
                            API.setAvator(chid, APP.getAvator(DB.aCache[chid])).then(()=>{
                                console.log("pushed")
                            })
                        }
                    })

                })
                .then(resolve,reject)

            })
        },

        getCurRoom(rn){
            // 最後に居たルーム情報取得
            return new Promise((resolve, reject)=>{
                console.log('getCurRoom ')
                var roomInfo = DB._getLS("last_room")
                // no
                let roomID = (roomInfo && roomInfo.id)? roomInfo.id : 1;
              
                API.getRoominfo(roomID).then((res)=>{
                    if(!res || !res.status || !res.roomInfo){
                        reject ("getCurRoom service not found")
                    }
                    DB._setLS("last_room", res.roomInfo)
                    APP.setCurRoom(res.roomInfo)

                    console.log('getCurRoom end')
                }).then(resolve,reject)
            })
        },

        // 初回はほんとなら　ルームリストとって TODO
        getLog(roomNo, cuurNo, backFlg ){
            console.log('getLog ')

            const limit = 10
            //未指定は false
            backFlg = backFlg || false


            // cuurNo 指定されてない場合 last befoe 10 に
            if(!cuurNo){
                cuurNo = 999999
                backFlg = 1
            }
            //　バックのとき予めreverce 取得
            const talks = DB._lsLog(roomNo, backFlg)

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

        _mergeTalkLog( roomNo, res){

        },
        

        // LS からログを抽出
        _lsLog: function(roomID, rev){
            rev = rev || false
            if( !tCache || !tCache[roomID]){
                let lgAry = DB._getLS("talk_log_"+roomID)
                tCache[roomID] = (lgAry)? lgAry:[]
            }

            // LS上は時系列に並んでるものとする
            let talks = tCache[roomID]
            // reverce 指定があったらソート
            if(rev){
                talks.sort((A,B)=>{
                    return  (A.logNo < B.logNo ) ? 1: -1
                })
            }
            return talks
        },

        //-----------------------------------------
        // raw data section        
        //-----------------------------------------
        defaultAvator: function (gender) {
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

        , getAvatorParts: function (partName) {
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
    
        ,emotionItems: function (partName) {
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



