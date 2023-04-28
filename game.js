let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');
let deg = Math.PI / 180;
let frames = 0;
let sprite = new Image();
sprite.src = './source/GLC.png';

let state = {
    current : 0,
    getready : 0,
    game : 1,
    over: 2
}

let music = new Audio('./musics/game.mp3') 
let overmusic = new Audio('./musics/over.mp3') 


function clickhandler(){
    switch(state.current){
        case state.getready:
        state.current = state.game;
        music.load();
        music.play();
        break;
        case state.game:
        bird.flap();
        break;

        default:
        bird.speed = 0;
        bird.rotation = 0;
        pipes.position = [];
        bg.dnIndex =0;
        score.value = 0;
        state.current = state.getready
            break;
    }
}

document.addEventListener('click',clickhandler)
document.addEventListener('keydown',function e(){
    if(e.which = 32){
        clickhandler();
    }
})

let bg ={
    dn:[
        {sx:0},{sx:295}
    ],
    sy:0,
    w:285,
    h:700,
    x:0,
    y:0,
    dnIndex:0,
    draw: function(){
        let bg = this.dn[this.dnIndex]
        ctx.drawImage(sprite,bg.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,bg.sx,this.sy,this.w,this.h,this.x+this.w,this.y,this.w,this.h)

    },
    update: function(){
        if(state.current == state.game){
            if(frames % 500 ==0){
                if(this.dnIndex == 0){
                    this.dnIndex =1 
                }else{
                    this.dnIndex =0
                }
            }
        }
    
        }
}
let fg ={
    sx:585,
    sy:0,
    w:285,
    h:200,
    x:0,
    y:400,
    dx: 2,
    draw: function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x+this.w-1,this.y,this.w,this.h)

    },
    update: function(){
        if(state.current == state.game){
            this.x = (this.x-this.dx) % (this.w/2);
        }
    }

}
let bird ={
    animation:[
        {sX:230,sY:761},
        {sX:230,sY:813},
        {sX:230,sY:865},
        {sX:230,sY:813},
    ],
    w:34,
    h:26,
    x:50,
    y:150,
    speed: 0,
    gravity: 0.25,
    animationIndex: 1,
    jump: -4.6,
    rotation : 0,
    radius: 12,
    draw: function(){
        let bird = this.animation[this.animationIndex]
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sX,bird.sY,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);
        ctx.restore();

    },
    update: function(){
        let period = state.current == state.getready ? 13 : 5;
        this.animationIndex += frames % period == 0 ? 1 : 0;
        this.animationIndex = this.animationIndex % this.animation.length;
        if(state.current == state.getready){
            this.y = 150
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            if(this.speed < -this.jump){
                this.rotation = -25 * deg
            }else{
                this.rotation = 90 * deg
            }
        };

        if(this.y+this.h/2 >= 400){
            this.y =  400-this.h/2;
            this.animationIndex = 1;
            if(state.current == state.game){
                state.current = state.over;
                music.pause();
                overmusic.play()
            }
        }
    },
    flap : function(){
        this.speed = this.jump
    }
}

let pipes={
    top:{
        sx:107,
        sy:640

    },
    bottom:{
        sx:165,
        sy:640
    },
    w:58,
    h:340,
    gap:75,
    dx:2,
    position:[],
    maxYpos: -150,
    draw: function(){
        for(let i = 0;i<this.position.length ;i++){
            let p = this.position[i]


            let topYpos = p.y
            let bottomYpos = p.y+ this.h+ this.gap

            ctx.drawImage(sprite, this.top.sx, this.top.sy, this.w, this.h, p.x, topYpos, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.sx, this.bottom.sy, this.w, this.h, p.x, bottomYpos, this.w, this.h);

        }
 
    },
    update: function(){
        if(state.current != state.game) return;
        if(frames % 100 == 0){
            this.position.push({
                x:cvs.width,
                y:this.maxYpos*(Math.random()+1)
            })
        }

        for(let i = 0;i<this.position.length ;i++){
            let p = this.position[i]
            p.x -= this.dx
            
            let buttompipespos = p.y + this.h + this.gap;
            if(bird.x+bird.radius > p.x && bird.x-bird.radius < p.x+this.w && bird.y+bird.radius > p.y && bird.y+bird.radius < p.y+this.h){
                    state.current = state.over
                    music.pause()
                    overmusic.play()

            }
            if(bird.x+bird.radius > p.x && bird.x-bird.radius < p.x+this.w && bird.y+bird.radius > buttompipespos && bird.y+bird.radius < buttompipespos+this.h){
                state.current = state.over
                music.pause()
                overmusic.play()

        }



            if(p.x + this.w <= 0){
                this.position.shift();
                score.value +=1;
                score.best = Math.max(score.value,score.best);
                localStorage.setItem('best',score.best)
            }
        }
            
    }
}

let getready ={
    sx:585,
    sy:115,
    w:190,
    h:52,
    x:cvs.width/2-190/2,
    y:80,
    draw: function(){
      if(state.current == state.getready){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
      }  

    }
}
let gameover ={
    sx:785,
    sy:115,
    w:200,
    h:45,
    x:cvs.width/2-200/2,
    y:80,
    draw: function(){
      if(state.current == state.over){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h)
        
      }

    }
}


let score = {
    best: localStorage.getItem('best') || 0,
    value: 0,
    draw: function(){
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = '#000';

        if(state.current == state.game){
                ctx.lineWidth = 2;
                ctx.font = '35px IMPACT';

                ctx.fillText(this.value, cvs.width/2 , 50);
                ctx.strokeText(this.value, cvs.width/2 , 50)
        }else if(state.current == state.over){
                ctx.lineWidth = 2;
                ctx.font = '35px IMPACT';

                ctx.fillText('score'+' '+this.value, 10 , 50);
                ctx.strokeText('score'+' '+this.value, 10 , 50);

                ctx.fillText('best'+' '+this.best, cvs.width-110 , 50);
                ctx.strokeText('best'+' '+this.best, cvs.width-110 , 50)




        }
    
    }
}





function update(){
    bg.update()
    bird.update()
    fg.update()
    pipes.update()
}
function draw(){
    ctx.fillStyle = '#70c5ce'
    ctx.fillRect(0,0, cvs.width, cvs.height)
    bg.draw()
    pipes.draw()
    fg.draw()
    bird.draw()
    getready.draw()
    gameover.draw()
    score.draw()

} 

function animate(){
    update()
    draw()
    frames ++;
    requestAnimationFrame(animate)

}

animate()

