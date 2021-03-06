module.exports = {
    name: 'ranger',
    run: function(creep) {
        creep.flee = creep.flee || !creep.hasActiveOffensivePart();
        creep.attacking = false;
        creep.attackingRanged = false;
        // Assign next Action
        let oldTargetId = creep.data.targetId;
        if( creep.action == null || creep.action.name == 'idle' || ( creep.action.name == 'guarding' && (!creep.flag || creep.flag.pos.roomName == creep.pos.roomName ) ) ) {
            this.nextAction(creep);
        }
        if( creep.data.targetId != oldTargetId ) {
            delete creep.data.path;
        }
        // Do some work
        if( creep.action && creep.target ) {
            creep.action.step(creep);
        } else {
            logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
        }

        if( creep.data.body.heal !== undefined  &&  creep.hits < creep.hitsMax ){
            creep.heal(creep);
        }
    },
    nextAction: function(creep){
        let priority = [
            Creep.action.defending,
            Creep.action.invading,
            Creep.action.guarding,
            Creep.action.idle
        ];
        for(var iAction = 0; iAction < priority.length; iAction++) {
            var action = priority[iAction];
            if(action.isValidAction(creep) &&
                action.isAddableAction(creep) &&
                action.assign(creep)) {
                    return;
            }
        }
    }
}