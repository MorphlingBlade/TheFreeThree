/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {
      // call the constructor
      this._super(me.Entity, 'init', [x, y, settings]);
  
      // max walking & jumping speed
      this.body.setMaxVelocity(6, 25);
      this.body.setFriction(0.4, 0);
  
      // set the display to follow our position on both axis
      me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);
  
      // ensure the player is updated even when outside of the viewport
      this.alwaysUpdate = true;
  
      // define a basic walking animation (using all frames)
      this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);
  
      // define a standing animation (using the first frame)
      this.renderable.addAnimation("stand",  [0]);
  
      // set the standing animation as default
      this.renderable.setCurrentAnimation("stand");
    },
  
    /**
     * update the entity
     */
    update : function (dt) {
  
        if (me.input.isKeyPressed('left')) {
  
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = -this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (me.input.isKeyPressed('right')) {
  
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.body.force.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }
  
        if (me.input.isKeyPressed('jump')) {
            
            if (!this.body.jumping && !this.body.falling)
            {
                me.audio.play("jump");
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        } else {
            this.body.force.y = 0;
        }
  
        // apply physics to the body (this moves the entity)
        this.body.update(dt);
  
        // handle collisions against other shapes
        me.collision.check(this);
  
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
  
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
      // Make all other objects solid
      return true;
    }
  });


/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

  },

  onCollision : function () {
    // do something when collected
  
    me.audio.play("cling");
    // give some score
    game.data.score += 1;
  
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
  
    // remove it
    me.game.world.removeChild(this);
  }
});