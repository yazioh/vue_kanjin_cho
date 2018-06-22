var APP = APP || {};
(function(Vue){

/**
 * アバターの変更　ウインドウ（モーダル）コンポーネント
 *  
 */
// -------------------
Vue.component("config", {
    template: `
<div id="mdlEdit" class="modal fade">
    <div class="modal-dialog modal-content">
        <div class="modal-header">
            <i class="glyphicon glyphicon-cog"></i>
            プロフィールの変更
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                <i class="glyphicon glyphicon-remove"></i>
            </button>
        </div>
        <div class="modal-body">

            <div class="media">
                <dt class="media-left">
                    <cmp-avator :face="edit.face" class="x2">NoImaege</cmp-avator>
                </dt>
                <dd class="media-body">

                    <div class="form-horizontal">
                        <dl class="form-group">
                            <dt class="col-sm-3 control-label">名前</dt>
                            <dd class="col-sm-9">
                                <input type="text" class="form-contral" v-model="edit.name">
                            </dd>
                        </dl>
                        <dl class="form-group">

                            <dt class="col-sm-3 control-label">性別変更</dt>
                            <dd class="col-sm-9">
                                <div class="btn-group" role="group">
                                    <button class="btn btn-default" @click="onChangeGender('M')">男性</button>
                                    <button class="btn btn-default" @click="onChangeGender('F')">女性</button>
                                </div>
                            </dd>
                        </dl>
                    </div>
                    <p class="note text-info">
                        <i class="glyphicon glyphicon-exclamation-sign"></i>
                        性別を変更すると、容姿の選択がリセットされます</p>
                </dd>
            </div>

            <h4>容姿選択</h4>
            <div class="selectPart btn-group" role="group">
                <button class="btn btn-default" @click="onChangePart('hairColor')">髪色</button>
                <button class="btn btn-default" @click="onChangePart('hairBack')">後髪</button>
                <button class="btn btn-default" @click="onChangePart('hairFront')">前髪</button>
                <button class="btn btn-default" @click="onChangePart('hairExtend')">装飾</button>
            </div>
            |
            <div class="selectPart btn-group" role="group">
                <button class="btn btn-default" @click="onChangePart('baseColor')">肌色</button>
                <button class="btn btn-default" @click="onChangePart('eyeColor')">目色</button>
                <button class="btn btn-default" @click="onChangePart('eyeType')">目形</button>
                <button class="btn btn-default" @click="onChangePart('faceAcc')">装飾</button -->
            </div>
            |
            <button class="btn btn-default" @click="onChangePart('cloth')">服</button>

            <div class="scroll">
                <ul class="changes">
                    <li v-for="avator in previews" 　@click="onChangeItem(avator.name)">
                        <cmp-avator :face="avator.face" :size=1>NoImaege</cmp-avator>
                    </li>
                </ul>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default" @click="onAttach">
                    <i class="glyphicon glyphicon-ok"></i>変更する</button>
            </div>
        </div>
    </div>
</div>
    `,
    props:{
    },
    computed: { },
    data:function(){
        return {

            crtPage:[]
        }
    },
    mounted:function(){
        console.log("time-line")
    },
    watch:{
    },
    methods: {
        show:function(){
            console.log("show!!!!!")
        },
        hide:function(){
            console.log("hide!!!!!")
        },


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
        
    },
});