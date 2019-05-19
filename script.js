let bsize=2;
let board=[];
let bombs=[];
let bombCount=1;
let firstClick=true;
let totalRevealed=0;
let timeT=0;
let x;
const generateBoard=()=>{
    totalRevealed=0;
    board=[];
    bombs=[];
    const difficulty=document.querySelector(".difficultySelector");
    const size=Number(difficulty.value);
    bsize=size;
    let html=``;
    const div=document.querySelector(".board");
    for(let i=0;i<size;i++){
        html+='<div style="font-size: 0">';
        for(let j=0;j<size;j++){
            const cell=size*i+j;
            html+=`<img src="covered.png" class="board-cell" onclick="checkCell(${cell})" id="${cell}" width="20px" height="20px"/>`;
        }
        html+="</div>";
    }
    div.innerHTML=html;
    switch(size){
        case 8:bombCount=10;break;
        case 16:bombCount=27;break;
        case 24:bombCount=40;break;
    }
    for(let i=0;i<bombCount;i++)
    {
        const pos=Math.floor(Math.random()*size*size);
        if(bombs.includes(pos))
            i--;
        else
        {
            bombs.push(pos);
        }
    }
    document.getElementById("mines").innerText=`${bombCount} Mines planted 👍`;
    for(let i=0;i<size*size;i++){
        let newCell={
            rowx:Math.floor(i/size),
            coly:i%size,
            hasBomb:false,
            danger:0,
            revealed:false,
            src:''
        };
        if(bombs.includes(i)){
            newCell.hasBomb=true;
            newCell.danger=9;
            newCell.src='bomb.png';
        }
        board.push(newCell);
    };
    for(let i=0;i<size*size;i++){
        if(!(board[i].hasBomb)){
            calculateDanger(i);
            board[i].src=`${board[i].danger}.png`;     
        } 
    }
    console.log(board);
    timeT=0;
    clearInterval(x);
    x=null;
    document.getElementById("timer").innerText=String(timeT);
    x=setInterval(function(){
        timeT++;
        document.getElementById("timer").innerText=String(timeT);
       
        
    },1000);
}

const calculateDanger=(i)=>{
    const r=board[i].rowx;
    const c=board[i].coly;
    if(r+1<bsize && board[bsize*(r+1)+c].hasBomb)//down
        board[i].danger++;
    if(c+1<bsize && board[bsize*r+(c+1)].hasBomb)//right
        board[i].danger++;
    if(r+1<bsize && c+1<bsize && board[bsize*(r+1)+(c+1)].hasBomb)//down-right
        board[i].danger++;
    if(c-1>=0 && board[bsize*r+(c-1)].hasBomb)//left
        board[i].danger++;
    if(r+1<bsize && c-1>=0 && board[bsize*(r+1)+(c-1)].hasBomb)//down-left
        board[i].danger++;
    if(r-1>=0 && board[bsize*(r-1)+c].hasBomb)//up
        board[i].danger++;
    if(r-1>=0 && c+1<bsize && board[bsize*(r-1)+(c+1)].hasBomb)//up-right
        board[i].danger++;
    if(r-1>=0 && c-1>=0 && board[bsize*(r-1)+(c-1)].hasBomb)//up-left
        board[i].danger++;
}


function spread(r,c){    
    if(r>=0 && r<bsize && c>=0 && c<bsize && !(board[bsize*r+c].revealed) && board[bsize*r+c].danger==0){
    //if(cell>=0 && cell<bsize*bsize && !(board[cell].revealed) && board[cell].danger==0){
        board[bsize*r+c].revealed=true;
        const butt=document.getElementById(`${bsize*r+c}`);
        butt.src='0.png';
        totalRevealed++;
        spread(r,c+1);//right
        spread(r,c-1);//left
        spread(r-1,c);//up
        spread(r+1,c);//down
        spread(r-1,c-1);//up-left
        spread(r-1,c+1);//up-right
        spread(r+1,c-1);//down-left
        spread(r+1,c+1);//down-right
        
    }
}
const checkCell=(cellNumber)=>{
    
   
    const butt=document.getElementById(`${cellNumber}`); 
    
    
    if(board[cellNumber].hasBomb){
        butt.src="bomb.png";
        board[cellNumber].revealed=true;
        clearInterval(x);
        
        for(let i=0;i<bsize*bsize;i++){
            document.getElementById(`${i}`).src=`${board[i].src}`;
            board[i].revealed=true;
        }
        document.getElementById("mines").innerText=`Game Over 😢`;
    }
    else if(board[cellNumber].danger==0){
        spread(Math.floor(cellNumber/bsize),cellNumber%bsize);
    }
    else{
        butt.src=`${board[cellNumber].danger}.png`;
        board[cellNumber].revealed=true;
        totalRevealed++;
    }

    if(totalRevealed==bsize*bsize-bombCount){
        document.getElementById("mines").innerText='Victory 🎉😃';
        clearInterval(x);
    }
    
}
