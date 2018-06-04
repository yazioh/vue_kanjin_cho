var APP = APP || {}

/**
 * アバター表示基本コンポーネント
 */
Vue.component( "kzc-avator", {
    // 画像レイヤー
    components:{
        aImg: {
            template: '<span class="emo"  v-if="src" :style="myStyle"></span>',
            props: ["src","z"],
            computed:{
                myStyle: function(){
                    return {
                        "z-index": (this.z || 1),
                        "background-image": "url("+this.src+")"
                    };
                } 
            }
        }

    },
    // アバター全体　レイヤーの表示順調整
    template: `
<div class="avator" :title="name" :style="boxStyle">
    <aImg class="emo"   :src="img_emb" :z=1 />
    <aImg class="base"  :src="img_bas" :z=1 />
    <aImg class="hairB" :src="img_hrb" :z=1 />
    <aImg class="cloth" :src="img_clt" :z=1 />
    <aImg class="eye  " :src="img_fca" :z=1 />
    <aImg class="eye"   :src="img_eye" :z=1 />
    <aImg class="hairA" :src="img_hra" :z=1 />
    <aImg class="hairF" :src="img_hrf" :z=1 />
    <aImg class="emo"   :src="img_emf" :z=1 />
{{ bg_color }}</div>
    `,

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
        "rotate",
        "reverce",
    ],
    computed: {
        'boxStyle':function(){
            let css =[];
            if(this.bg_color){
                css.push("back-ground-color:"+this.bg_color)
            }
            return css
        }

    },
    data:function() {
        return {
            
        };
    },
    methods: {
    },
    mounted:function(){
    // console.log("avator")
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
        let parts = APP.getDB().getAvatorParts(partName);
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
        return APP.getDB().defaultAvator(((g == 'M') ? 'M' : 'F'));
    }

    /**
     * @param {*} partName 
     */
    static emotionItems(partName, gender) {
        return APP.getDB().emotionItems(partName, gender);
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


