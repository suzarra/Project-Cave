var TestScene = cc.Scene.extend({
    ctor:function (bPortrait) {
        this._super();
        this.init();
    },
    onEnter:function () {
        this._super();
        var label = cc.LabelTTF.create("MainMenu", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this, this.MainMenuCallback);

        var menu = cc.Menu.create(menuItem, null);
        var s = cc.Director.getInstance().getWinSize();
        menu.setPosition(cc.PointZero());
        menuItem.setPosition(cc.p(s.width - 50, 25));

        this.addChild(menu, 1);
    },
    runThisTest:function () {

    },
    MainMenuCallback:function () {
        var scene = cc.Scene.create();
        var layer = new TestController();
        scene.addChild(layer);
        cc.Director.getInstance().replaceScene(scene);
    }
});
var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        
        
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            this,
            function () {
                var box =new Box2DTestScene();
		
				box.runThisTest();
            }
        );
        
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem, null);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        this.helloLabel = cc.LabelTTF.create("Press the Power Button", "Arial", 38);
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        this.addChild(this.helloLabel, 5);

        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);
/*
		
        this.sprite = cc.Sprite.create("res/Pony_Pinky.png");
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setScale(.5,.5);
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        lazyLayer.addChild(this.sprite, 0);
*/

        return true;
    },
    
    scale:function(){
        //var scaleTo = cc.ScaleTo.create(10, 2.1, 2.1);
		//scaleTo.startWithTarget(this.sprite);
		var actionBy2 = cc.ScaleBy.create(2, 0.25, 4.5);

        this.sprite.runAction(actionBy2);
    }


});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
      //  layer.scale();
    }
});
