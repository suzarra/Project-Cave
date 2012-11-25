var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
                              
                              
        this.map = cc.TMXTiledMap.create("res/tile.tmx");
        this.map.setAnchorPoint(cc.p(0, 0));
        this.addChild(this.map);
                              
        var physics = new Box2DTestLayer();
        this.addChild(physics);
                              console.log(physics);
        this.scheduleUpdate();
    },
    update:function (dt){
        this.z += dt;
        this.setScale(this.z);
    }
});
