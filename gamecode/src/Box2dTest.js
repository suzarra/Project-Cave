var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;

Box2DTestLayer = cc.Layer.extend({
    world:null,
    ctor:function () {
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        //setAccelerometerEnabled(true);
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            , b2DebugDraw= Box2D.Dynamics.b2DebugDraw;
                                 
        var screenSize = cc.Director.getInstance().getWinSize();
        this.world = new b2World(new b2Vec2(0, -10), false);
        this.world.SetContinuousPhysics(true);
                                 


        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.6;

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(20, 1.8);
        bodyDef.position.Set(10, screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        bodyDef.position.Set(10, -1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        fixDef.shape.SetAsBox(1.8, 14);
        bodyDef.position.Set(-1.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        bodyDef.position.Set(26.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //Set up sprite

        var mgr = cc.SpriteBatchNode.create(s_pathBlock, 150);
        this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

        this.addNewSpriteWithCoords(cc.p(screenSize.width / 2, screenSize.height / 2));
        this.addNewSpriteWithCoords(cc.p(100,400));
        this.scheduleUpdate();
                                
        //setup debug draw
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
        debugDraw.SetDrawScale(PTM_RATIO);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(10.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
                                 
    },
    draw:function(){
        var c=document.getElementById("gameCanvas");
        var ctx=c.getContext("2d");
        ctx.moveTo(0,0);
        ctx.rotate(180*Math.PI/180);
        ctx.scale(-1, 1);
                                 
        this.world.DrawDebugData();
        ctx.scale(-1, 1);
        ctx.rotate(-180*Math.PI/180);
    },
    addNewSpriteWithCoords:function (p) {
        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);
        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (cc.RANDOM_0_1() > .5 ? 0 : 1);
        var idy = (cc.RANDOM_0_1() > .5 ? 0 : 1);
        var sprite = cc.Sprite.createWithTexture(batch.getTexture(), cc.rect(32 * idx, 32 * idy, 32, 32));
        
       // batch.addChild(sprite);

        sprite.setPosition(cc.p(p.x, p.y));
        sprite.setOpacity(100);
        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = this.world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;
        fixtureDef.restitution = 0.3;
        body.CreateFixture(fixtureDef);

    },
    update:function (dt) {
        var velocityIterations = 8;
        var positionIterations = 1;
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.setPosition(cc.p(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO));
                myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
                //console.log(b.GetAngle());
            }
        }

    },
    onKeyDown:function(e){
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        console.log("down");
        if(e === cc.KEY.left){
            console.log("left");
        }
        this.world.SetGravity(new b2Vec2(0, 10));
    },
    onKeyUp:function(e){
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        console.log("up");
        this.world.SetGravity(new b2Vec2(0, -10));

    },
    onTouchesEnded:function (touches, event) {
        //Add a new body/atlas sprite at the touched location
        for (var it = 0; it < touches.length; it++) {
            var touch = touches[it];

            if (!touch)
                break;

            var location = touch.getLocation();
            //location = cc.Director.getInstance().convertToGL(location);
            this.addNewSpriteWithCoords(location);
        }
    }

    //CREATE_NODE(Box2DTestLayer);
});
