/**
 * アバター生成Util
 */
class Avator {
    constructor(param) {
        this.name = "nanashi";
        this.face = Avator.getDefault("F");
        if (typeof param == "undefined" || param == "F") {
            return;
        }
        if (param == "M") {
            this.face = Avator.getDefault("M");
            return;
        }

        this.load(param);
    }

    /**
     * JSON(cacheなど)から初期化 
     * TODO バリデーションしてね
     * @param object json 
     */
    load(json) {
        if (typeof json.name != "undefined") {
            this.name = json.name;
        }
        if (typeof json.face != "undefined") {
            Vue.util.extend(this.face, JSON.parse(JSON.stringify(json.face)));
        }
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setFaceProp(block, prop, val) {
        if (typeof this.face[block] == undefined) {
            return false;
        }
        if (typeof this.face[block][prop] == undefined) {
            return false;
        }
        this.face[block][prop] = val;
        return this;
    }

    change(partName, item) {
        switch (partName) {
            case "baseColor":
                return this.setBaseColor(item);
            case "baseType":
                return this.setBaseType(item);

            case "eyeColor":
                return this.setEyeColor(item);
            case "eyeType":
                return this.setEyeType(item);
            case "faceAcc":
                return this.setFaceAcc(item);


            case "hairColor":
                return this.setHairColor(item);
            case "hairFront":
                return this.setHairFront(item);
            case "hairBack":
                return this.setHairBack(item);
            case "hairExtend":
                return this.setHairExtend(item);

            case "cloth":
                return this.setCloth(item);

        }
    }

    setGender(mf) {
        this.face.gender = mf;
        return this;
    }

    setBaseColor(str) {
        return this.setFaceProp("base", "color", str);
    }
    setBaseType(imgName) {
        return this.setFaceProp("base", "type", imgName);
    }
    setEyeColor(str) {
        return this.setFaceProp("eye", "color", str);
    }
    setEyeType(imgName) {
        return this.setFaceProp("eye", "type", imgName);
    }
    setFaceAcc(imgName) {
        return this.setFaceProp("acc", "face", imgName);
    }

    // TODO 
    setHairColor(str) {
        return this.setFaceProp("hair", "color", str);
    }
    setHairFront(imgName) {
        return this.setFaceProp("hair", "front", imgName);
    }
    setHairBack(imgName) {
        return this.setFaceProp("hair", "back", imgName);
    }
    setHairExtend(imgName) {
        return this.setFaceProp("hair", "extend", imgName);
    }

    setCloth(imgName) {
        return this.setFaceProp("acc", "cloth", imgName);
    }

    /**
     * export
     */
    toJson() {
        return {
            name: this.name,
            face: this.face
        };
    }

    toHtml(){
        return Avator.build(this.face);
    }

    static cacheExists(chid) {
        return KZC.avaCache().exists(chid);
    }
    static getCache(chid) {
        let ava = new Avator({
            name: KZC.avaCache().name(chid),
            face: KZC.avaCache().face(chid),
        });
        return ava.toJson();
    }

    static urlFace(face) {
        let img = "skin/" + face.base.color + "/" + face.base.type;
        return "img/av/" + 　img;
    }
    static urlEye(face) {
        let img = "eye/" + ((face.emo.eye) ? 'sp/' + face.gender + "/" + face.emo.eye : face.eye.color + '/' + face.eye.type);
        return "img/av/" + img;
    }

    static urlHairB(face) {
        let img = face.hair.color + "/" + face.hair.back;
        return "img/av/" + img;
    }
    static urlHairA(face) {
        let img = face.hair.color + "/" + face.hair.extend;
        return "img/av/" + img;
    }
    static urlHairF(face) {
        let img = face.hair.color + "/" + face.hair.front;
        return "img/av/" + img;
    }

    static urlFaceA(face) {
        let img = "acc0/" + face.acc.face;
        return "img/av/" + 　img;
    }

    static urlCloth(face) {
        let img = "cloth/" + face.acc.cloth;
        return "img/av/" + 　img;
    }

    static urlEmoBg(face) {
        if (!face.emo.bg) {
            return '';
        }
        let img = "emo/" + face.gender + '/' + face.emo.bg;
        return "img/av/" + 　img;
    }

    static urlEmoFr(face) {
        if (!face.emo.over) {
            return '';
        }
        let img = "" + face.emo.over;
        if (img.substr(0, 2) == 'sp') {
            img = "eye/" + +"/" + img;
        } else {
            "emo/" + face.gender + '/' + img;
        }
        return "img/av/" + img;
    }

    static build(face){
        let urlEmoBg = "";
        let urlFace = this.urlFace(face);
        let urlEye = this.urlEye(face);
        let urlHairB = this.urlHairB(face);
        let urlHairA = this.urlHairA(face);
        let urlHairF = this.urlHairF(face);
        let urlFaceA = this.urlFaceA(face);
        let urlCloth = this.urlCloth(face)
        let urlEmoFr = this.urlEmoFr(face)
        let vw =
            (urlEmoBg ? `<span class="emo"   style="background-image:url(${urlEmoBg})"></span>` : '') +
            (urlFace ? `<span class="base"   style="background-image:url(${urlFace} )"></span>` : '') +
            (urlHairB ? `<span class="hairB" style="background-image:url(${urlHairB})"></span>` : '') +
            (urlCloth ? `<span class="cloth" style="background-image:url(${urlCloth})"></span>` : '') +
            (urlEye ? `<span class="eye"   style="background-image:url(${urlEye}  )"></span>` : '') +
            (urlHairA ? `<span class="hairA" style="background-image:url(${urlHairA})"></span>` : '') +
            (urlHairF ? `<span class="hairF" style="background-image:url(${urlHairF})"></span>` : '') +
            (urlFaceA ? `<span class="eye"   style="background-image:url(${urlFaceA}  )"></span>` : '') +
            (urlEmoFr ? `<span class="emo"   style="background-image:url(${urlEmoFr})"></span>` : '');
        return vw;
    }

    static show(chid, emotion) {
        if (this.cacheExists(chid)) {
            // キャラクターとしての既定値
            let _ava = this.getCache(chid);
            // 動的に差し替えできるパーツ 単純コピーだと発火イベントがループするらしい？
            _ava.face.emo = Vue.util.extend({}, emotion);
            return this.build(_ava.face);
            // let urlEmoBg = "";
            // let urlFace = this.urlFace(_ava.face);
            // let urlEye = this.urlEye(_ava.face);
            // let urlHairB = this.urlHairB(_ava.face);
            // let urlHairA = this.urlHairA(_ava.face);
            // let urlHairF = this.urlHairF(_ava.face);
            // let urlFaceA = this.urlFaceA(_ava.face);
            // let urlCloth = this.urlCloth(_ava.face)
            // let urlEmoFr = this.urlEmoFr(_ava.face)
            // let vw =
            //     (urlEmoBg ? `<span class="emo"   style="background-image:url(${urlEmoBg})"></span>` : '') +
            //     (urlFace ? `<span class="base"   style="background-image:url(${urlFace} )"></span>` : '') +
            //     (urlHairB ? `<span class="hairB" style="background-image:url(${urlHairB})"></span>` : '') +
            //     (urlCloth ? `<span class="cloth" style="background-image:url(${urlCloth})"></span>` : '') +
            //     (urlEye ? `<span class="eye"   style="background-image:url(${urlEye}  )"></span>` : '') +
            //     (urlHairA ? `<span class="hairA" style="background-image:url(${urlHairA})"></span>` : '') +
            //     (urlHairF ? `<span class="hairF" style="background-image:url(${urlHairF})"></span>` : '') +
            //     (urlFaceA ? `<span class="eye"   style="background-image:url(${urlFaceA}  )"></span>` : '') +
            //     (urlEmoFr ? `<span class="emo"   style="background-image:url(${urlEmoFr})"></span>` : '');
            // return vw;
        }
    }


    static getPartNames(partName, gender) {
        return [
            'BaeColr',
            '',
            '',
            '',
            '',
            '',
        ];
    }

    /**
     * アバターDB
     * @param {*} partName 
     * @param {*} gender 
     */
    static getItems(partName, gender) {
        console.log("get:" + partName);
        switch (partName) {
            // この辺共通
            case 'baseColor':
                return ["01", "03", "00", "02", "04"];

            case 'eyeColor':
                return ["blk", "blu", "red", "dbr", "grn"];

            case 'hairColor':
                return ["blk", "dbrwn", "org", "red", "pink", "viol", "grn", "lgrn", "gold", "silv", "lvio", "blue"]; //, "lbrwn"

                // 性差あり
            case 'base':
                return ((gender == 'F') ? ["base_00.gif", "base_00c.gif", "base_01.gif", "base_01c.gif", "base_02.gif", "base_02c.gif"] : ["base_m000.gif", "base_m001.gif", "base_m002.gif", "base_m003.gif", "base_m004.gif", "base_m005.gif"]);

            case 'hairBack':
                return ((gender == 'F') ? ["back_00.gif", "back_00s.gif", "back_01.gif", "back_02.gif", "back_02s.gif", "back_03.gif", "back_04.gif", "back_05.gif", "back_06.gif", "back_07.gif", "back_12.gif", "back_13.gif"] : ["back_m00.gif", "back_m01.gif", "back_m02.gif", "back_m03.gif", "back_m04.gif", "back_m05.gif"]);

            case 'hairFront':
                return ((gender == 'F') ? ["front_00.gif", "front_01.gif", "front_02.gif", "front_03.gif", "front_04.gif", "front_05.gif", "front_06.gif", "front_kiku.gif"] : ["front_m00.gif", "front_m02.gif", "front_m02.gif", "front_m03.gif", "front_m04.gif", "front_m05.gif", "front_m06.gif"]);

            case 'hairExtend':
                return ((gender == 'F') ? ["", "hacc_01.gif", "hacc_02.gif", "hacc_03.gif", "hacc_01s.gif"] : ["", "hacc_05m.gif", "hacc_06m.gif"]);

            case 'baseType':
                return ((gender == 'F') ? ["base_00.gif", "base_00c.gif", "base_01.gif", "base_01c.gif", "base_02.gif", "base_02c.gif"] : ["base_m000.gif", "base_m001.gif", "base_m002.gif", "base_m003.gif", "base_m004.gif"]);

            case 'eyeType':
                return ((gender == 'F') ? ["f01.gif", "f02.gif", "f03.gif", "f04.gif", "f05.gif", "f06.gif", "f07.gif"] : ["m01.gif", "m02.gif", "m03.gif", "m04.gif", "m05.gif", "m06.gif"]);

           case 'faceAcc':
                return ((gender == 'F') ? ["", "acc_fg_00.gif", "acc_fg_01.gif", "acc_fg_04.gif"] : ["", "acc_mg_00.gif", "acc_mg_01.gif", "acc_mg_02.gif", "acc_mg_03.gif", "acc_mg_04.gif"]);
            case 'cloth':
                return ((gender == 'F') ? ["tmf/01.gif", "tmf/02.gif", "tmf/03.gif", "tmf/04.gif", "tmf/05.gif", "tmf/06.gif", "chfr/shf02.gif", "chfr/shf03.gif", "cloth_005.gif", "cloth_006.gif", "cloth_006b.gif", "cloth_07.gif", "cloth_08.gif", "miko.gif", "tearoom.gif"] : ["tmm/t01.gif", "tmm/t02.gif", "tmm/t03.gif", "tmm/w000.gif", "tmm/w001.gif", "tmm/w002.gif", "chfr/shm01.gif", "chfr/shm02.gif", "chfr/shm03.gif"]);

            default:
                return ((gender == 'F') ? [] : []);
        }
        return [];
    }

    /**
     * デフォルトアバター
     * @param {*} g 性別 
     */
    static getDefault(g) {
        g = (g == 'M') ? 'M' : 'F';
        return ((g == 'F') ? {
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
        } : {
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
        });
    }
    static clone(orgAvator) {
        let j = (orgAvator.toJson) ? orgAvator.toJson() : orgAvator;
        return new Avator(JSON.parse(JSON.stringify(j)));
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
}

function test(a) {
    console.log(a);
}