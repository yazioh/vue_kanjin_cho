class API {
    static apiUrl(apiName) {
        //todo 
        return "./api/" + apiName + ".php";
    }
    static commonError(err) {
        alert("通信状態がよくありません\n" +
            "しばらくたってからアクセスしてみてください\n(" + err + ")");
    }
    /**
     * 
     */
    static getAuth(brkey, token) {
        return $.ajax({
            url: this.apiUrl("auth"),
            data: {
                cmd: "get",
                brkey: brkey,
                token: token,
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

    /**
     * 発言
     * @param {*} data 
     * @param {*} upAvator 
     */
    static setTalk(data) {
        data.cmd = "set";
        return $.ajax({
            url: this.apiUrl("talk"),
            data: data,
            type: "post",
            dataType: "json"
        });
    }

    static getTalk(tkid) {
        let data = {
            'cmd': "get",
        };
        if (tkid) {
            data.tkid = tkid;
        }
        return $.ajax({
            url: this.apiUrl("talk"),
            data: data,
            type: "post",
            dataType: "json"
        });
    }

    /**
     * 
     * @param {*} app 
     */
    constructor(app) {
        this._app = app;
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

    static setNext() {
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            console.log("* pole ")
            KZC.getMessage();
        }, 10000);
    }

}
API.timer = null;