/**
 * アバター表示基本コンポーネント
 */
Vue.component(
    "kzc-avator", {
        props: [
            "name",
            "img_emb",
            "img_bas",
            "img_hrb",
            "img_clt",
            "img_fca",
            "img_eye",
            "img_hra",
            "img_hrf",
            "img_emf",
            "bg_color",
        ],
        template: '<div class="avator" :title="name" :style="addStyle">'
        + '<span class="emo"   v-if="img_emb" :style="bgc(img_emb)"></span>'
        + '<span class="base"  v-if="img_bas" :style="bgc(img_bas)"></span>'
        + '<span class="hairB" v-if="img_hrb" :style="bgc(img_hrb)"></span>'
        + '<span class="cloth" v-if="img_clt" :style="bgc(img_clt)"></span>'
        + '<span class="eye  " v-if="img_fca" :style="bgc(img_fca)"></span>'
        + '<span class="eye"   v-if="img_eye" :style="bgc(img_eye)"></span>'
        + '<span class="hairA" v-if="img_hra" :style="bgc(img_hra)"></span>'
        + '<span class="hairF" v-if="img_hrf" :style="bgc(img_hrf)"></span>'
        + '<span class="emo"   v-if="img_emf" :style="bgc(img_emf)"></span>'    
        +'{{ bg_color }}</div>',
        methods: {
            bgc:function(imgnm){
                return "background-image:url("+imgnm+")";
            }
        },
        data:function() {
            return {
                name   :this.name   ,
                img_emb:this.img_emb,
                img_bas:this.img_bas,
                img_hrb:this.img_hrb,
                img_clt:this.img_clt,
                img_fca:this.img_fca,
                img_eye:this.img_eye,
                img_hra:this.img_hra,
                img_hrf:this.img_hrf,
                img_emf:this.img_emf,
            };
        },
        computed: {
            'addStyle':function(){
                let css =[];
                if(this.bg_color){
                    css.push("back-ground-color:"+this.bg_color)
                }
                return css.join(";")
            }

        },
        mounted:function(){
            console.log("avator")
            console.log(this);
        },
    });

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
     * @return JSON
     */
    toJson() {
        return {
            name: this.name,
            face: this.face
        };
    }

    static cacheExists(chid) {
        return KZC.avaCache().exists(chid);
    }

    static getCache(chid) {
        return KZC.avaCache().clone(chid);
        //  let ava = new Avator({
        //      name: KZC.avaCache().name(chid),
        //      face: KZC.avaCache().face(chid),
        //  });
        //  return ava.toJson();
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

    /**
     * 各コマに挿入されるアバターの生成
     * 
     * @param {*} face 
     * @return HTML
     */
    static build(face) {
        let urlEmoBg = "";
        let urlFace = this.urlFace(face);
        let urlEye = this.urlEye(face);

        let urlHairB = this.urlHairB(face);
        let urlHairA = this.urlHairA(face);
        let urlHairF = this.urlHairF(face);

        let urlFaceA = this.urlFaceA(face);
        let urlCloth = this.urlCloth(face);
        let urlEmoFr = this.urlEmoFr(face);

        let vw =
            (urlEmoBg ? `<span class="emo"   style="background-image:url(${urlEmoBg})"></span>` : '') +
            (urlFace ? `<span class="base"   style="background-image:url(${urlFace} )"></span>` : '') +
            (urlHairB ? `<span class="hairB" style="background-image:url(${urlHairB})"></span>` : '') +
            (urlCloth ? `<span class="cloth" style="background-image:url(${urlCloth})"></span>` : '') +
            (urlFaceA ? `<span class="eye"   style="background-image:url(${urlFaceA})"></span>` : '') +
            (urlEye ? `<span class="eye  "   style="background-image:url(${urlEye}  )"></span>` : '') +
            (urlHairA ? `<span class="hairA" style="background-image:url(${urlHairA})"></span>` : '') +
            (urlHairF ? `<span class="hairF" style="background-image:url(${urlHairF})"></span>` : '') +
            (urlEmoFr ? `<span class="emo"   style="background-image:url(${urlEmoFr})"></span>` : '');
        return vw;
    }

    /**
     * Koma からの呼び出し用
     * chid のキャラクターに emotion 表情を適用して返す
     */
    static show(chid, emotion) {
        if (this.cacheExists(chid)) {
            // キャラクターとしての既定値
            let _ava = this.getCache(chid);
            // 動的に差し替えできるパーツ 単純コピーだと発火イベントがループするらしい？
            _ava.face.emo = Vue.util.extend({}, emotion);
            return this.build(_ava.face);
        }
    }
    
    static getName(chid) {
        if (!this.cacheExists(chid)) {
            return '--';
        }
        let _ava = this.getCache(chid);
        return _ava.name;         
    }

    /**
     * アバターDB
     * @param {*} partName 
     * @param {*} gender 
     */
    static getItems(partName, gender) {
        let parts = DB.getAvatorParts(partName);
        if (typeof parts[gender] !== "undefined") {
            return parts[gender];
        }
        // 男女共用
        if (typeof parts.G !== "undefined") {
            return parts.G;
        }
        return [];
    }

    /**
     * デフォルトアバター
     * @param {*} g 性別 
     */
    static getDefault(g) {
        return DB.defaultAvator(((g == 'M') ? 'M' : 'F'));
    }

    /**
     * @param {*} partName 
     */
    static emotionItems(partName, gender) {
        return DB.emotionItems(partName, gender);
    }

    /**
     * byRef を切断
     * @param {*} orgAvator 
     */
    static clone(orgAvator) {
        let j = (orgAvator.toJson) ? orgAvator.toJson() : orgAvator;
        return new Avator(JSON.parse(JSON.stringify(j)));
    }

}