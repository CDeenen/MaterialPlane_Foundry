import { IRtokens } from "./analyzeIR.js";

let timeout = [];
let tokenActive = [];
let tapTimeout = [];
let raiseData = [];
let touches = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

export async function analyzeTouch(type,data) {

    if (game.paused) return;

    const changedTouches = data.changedTouches;
    
    for (let touch of changedTouches) {
        let id = touches.findIndex(t => t == touch.identifier);
        if (id == -1) {
            id = touches.findIndex(t => t == -1);
            touches[id] = touch.identifier;
        }

        if (type == 'end') {
            touches[id] = -1;
        }

        const coordinates = {x: touch.screenX, y: touch.screenY};
        const scaledCoordinates = scaleTouchInput(coordinates)
        const forceNew = type == 'start';
        const tapMode = game.settings.get('MaterialPlane','tapMode');
        
        
        if (tapMode == 0) {             //Tap disabled
            if (type == 'end')
                dropToken(id);
            else {
                if (type == 'start') tokenActive[id] = true;
                else if (!tokenActive[id]) return;
                if (timeout[id] != undefined) clearTimeout(timeout[id]);
                timeout[id] = setTimeout(dropToken,game.settings.get('MaterialPlane','touchTimeout'),id);
                await moveToken(id,coordinates,scaledCoordinates,forceNew);
            }    
        }
        else if (tapMode == 1) {        //Tap Timeout
            if (type == 'end') {
                clearTimeout(tapTimeout[id]);
                if (!tokenActive[id]) 
                    genericTouch(type,coordinates,scaledCoordinates);
                else
                    tokenActive[id] = false;
            }
            else if (type == 'start')
                tapTimeout[id] = setTimeout(tapDetect,game.settings.get('MaterialPlane','tapTimeout'),{id,coordinates,scaledCoordinates,forceNew}); 
            else if (tokenActive[id]) {
                if (timeout[id] != undefined) clearTimeout(timeout[id]);
                timeout[id] = setTimeout(dropToken,game.settings.get('MaterialPlane','touchTimeout'),id);
                await moveToken(id,coordinates,scaledCoordinates,forceNew);
            }

        }
        else if (tapMode == 2) {        //Raise Mini
            if (type == 'end') {
                if (!tokenActive[id]) genericTouch(type,coordinates,scaledCoordinates);
                //else {
                    clearTimeout(tapTimeout[id]);
                    dropToken(id);
                    raiseData.push({
                        id,
                        coordinates,
                        scaledCoordinates,
                        time: Date.now()
                    });
                    tokenActive[id] = false;
                //}      
            }
            else if (type != 'start' && tokenActive[id]) {
                if (timeout[id] != undefined) clearTimeout(timeout[id]);
                timeout[id] = setTimeout(dropToken,game.settings.get('MaterialPlane','touchTimeout'),id);
                await moveToken(id,coordinates,scaledCoordinates,forceNew);
            }
            else if (type == 'start') {
                const currentTime = Date.now();
                let raiseDetected = false;
                if (raiseData.length == 0) {
                    raiseData.push({
                        id,
                        coordinates,
                        scaledCoordinates,
                        time: Date.now()
                    });
                }
                else {
                    for (let i=raiseData.length-1; i>=0; i--) {
                        const elapsedTime = currentTime-raiseData[i].time;
                        if (elapsedTime >= game.settings.get('MaterialPlane','tapTimeout')) {
                            raiseData.splice(i,1);
                        }
                        else {
                            const dx =  Math.abs(raiseData[i].scaledCoordinates.x - scaledCoordinates.x);
                            const dy = Math.abs(raiseData[i].scaledCoordinates.y - scaledCoordinates.y);
                            const distance = Math.sqrt( dx*dx + dy*dy );
                            if (distance < canvas.scene.data.grid) {
                                raiseDetected = true;
                                raiseData.splice(i,1);
                                break;
                            }
                        }
                    }
                }
                
                if (raiseDetected) {
                    if (type == 'start') tokenActive[id] = true;
                    if (tokenActive[id]) {
                        if (timeout[id] != undefined) clearTimeout(timeout[id]);
                        timeout[id] = setTimeout(dropToken,game.settings.get('MaterialPlane','touchTimeout'),id);
                        raiseDetected = await moveToken(id,coordinates,scaledCoordinates,forceNew);
                    }
                    else
                        raiseDetected = false;
                    
                }
                if (!raiseDetected) {
                    genericTouch(type,coordinates,scaledCoordinates);
                    tokenActive[id] = false;
                }
                    
            }
            
        }
    }
}

async function tapDetect(data) {
    tokenActive[data.id] = true; 
    await moveToken(data.id,data.coordinates,data.scaledCoordinates,data.forceNew);
}

async function moveToken(id,coordinates,scaledCoordinates,forceNew) {
    return await IRtokens[id].update(coordinates,scaledCoordinates,forceNew);
}

function dropToken(id=0) {
    clearTimeout(timeout[id]);
    timeout[id] = undefined;
    IRtokens[id].dropIRtoken();
    tokenActive[id] = false;
}

function scaleTouchInput(coords) {
    //Calculate the amount of pixels that are visible on the screen
    const horVisible = screen.width/canvas.scene._viewPosition.scale;
    const vertVisible = screen.height/canvas.scene._viewPosition.scale;

    //Calculate the scaled coordinates
    const posX = (coords.x/screen.width)*horVisible+canvas.scene._viewPosition.x-horVisible/2;
    const posY = (coords.y/screen.height)*vertVisible+canvas.scene._viewPosition.y-vertVisible/2;

    //Return the value
    return {x:Math.round(posX),y:Math.round(posY)};
}

function genericTouch(type,coordinates,scaledCoordinates) {
    let element = document.elementFromPoint(coordinates.x,coordinates.y);
    if (element.id == 'board') {
        if (type == 'end') checkDoorClick(scaledCoordinates);
        else canvas.tokens.releaseAll();
    }
}

function checkDoorClick(data) {
    const doors = canvas.walls.doors;
    for (let door of doors) {
        const position = door.doorControl.position;
        const hitArea = door.doorControl.hitArea;

        if (Math.abs(data.x - position.x - hitArea.width/2) <= hitArea.width/2 && Math.abs(data.y - position.y - hitArea.height/2) <= hitArea.height/2) {
            const event = {
                data: {
                    originalEvent: {
                        button: 0
                    }
                },
                stopPropagation: event => {return;}
            }
            door.doorControl._onMouseDown(event);
        }
    }
}