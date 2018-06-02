var APP = APP || {};
(function(APP){
    var sec = 1000

    // Class の隠蔽 ----------------------------------
    class API {
        constructor() {
            this.timer = null;
            this.brkey='',
            this.sessionToken='',
            this.ready = new Promise(function(resolve, reject){
                console.log("API ready")
                resolve()
            })
        }

        
        apiUrl(apiName) {
            //todo 
            return "./api/" + apiName + ".php";
        }
        commonError(err) {
            alert("通信状態がよくありません\n" +
                "しばらくたってからアクセスしてみてください\n(" + err + ")");
            console.log(err);
        }
        
        /**
         * サーバーに使用お伺い
         * メモリ上に生きてる場合 session キーを
         */
        getAuth() {
            return $.ajax({
                url: this.apiUrl("auth"),
                data: {
                    cmd: "get",
                    brkey: this.brkey,
                },
                dataType: "json"
            });
        }
    
        static getChid() {
            return $.ajax({
                url: this.apiUrl("avator"),
                data: {
                    cmd: "cid",
                },
                dataType: "json"
            });
        }
    
        static getAvator(chid) {
            return $.ajax({
                url: this.apiUrl("avator"),
                data: {
                    cmd: "get",
                    chid: chid
                },
                type: "post",
                dataType: "json"
            });
        }
    
        static setAvator(chid, upAvator) {
            let data = upAvator.toJson();
            data.cmd = 'set';
            data.chid = chid;
            return $.ajax({
                url: this.apiUrl("avator"),
                data,
                type: "post",
                dataType: "json"
            });
        }

        setBrkey( brkey ){
            this.brkey = brkey
        }
        setToken( token ){
            this.sessionToken = token
        }
    
        /**
         * 発言
         * @param {*} data 
         * @param {*} upAvator 
         */
        setTalk(data) {
            data.cmd = "set";
            return $.ajax({
                url: API.apiUrl("talk"),
                data: data,
                type: "post",
                dataType: "json"
            });
        }
    
        /**
         * チャット取得
         * @param {*} tkid 
         */
        getTalk(tkid) {
            let data = {
                'cmd': "get",
            };
            if (tkid) {
                data.tkid = tkid;
            }
            return $.ajax({
                url: API.apiUrl("talk"),
                data: data,
                type: "post",
                dataType: "json"
            });
        }
    
        // test
        static get(url, okTask, errorTask) {
            var request = new XMLHttpRequest();
            request.open("get", url, true);
            request.onload = function (event) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        if (okTask) {
                            okTask(request.statusText);
                        }
                    } else {
                        if (errorTask) {
                            okTask(request.statusText);
                        } else {
                            console.log("error status");
                            console.log(request.statusText); // => Error Message
                        }
                    }
                }
            };
            request.onerror = function (event) {
                if (errorTask("coonnitukuhounannjya ectio error"));
                console.log(event.type); // => "error"
            };
            request.send(null);
        }
    
        
        stopTtimer(){
            clearTimeout(this.timer);
        }
    
        startTimer(callback, wait= 3*sec) {
            this.stopTtimer();
            this.timer = setTimeout(()=> {
                //  引数なし＝最新のみ取得
                this.getTalk().then(callback, this.commonError);
            }, wait);
        }
        
    }
    
    APP.API = new API();

})(APP);