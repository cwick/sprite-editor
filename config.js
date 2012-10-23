"use strict";
YUI.GlobalConfig = {
  groups: {
    game: {
      patterns: {
        'game-': {
          configFn: function(me) {
            me.fullpath = '/' + me.name.substr('game-'.length) + '.js'
          }
        }
      }
    }
  }
}
