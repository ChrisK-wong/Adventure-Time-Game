hitbox = (e) => {
    if (game.settings.hitbox) {
        game.settings.hitbox = false;
    }
    else {
        game.settings.hitbox = true;
    }
    e.blur();
}

panning = (e) => {
    if (game.settings.panning) {
        game.settings.panning = false;
    }
    else {
        game.settings.panning = true;
    }
    e.blur();
}