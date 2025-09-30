(function(){
  const lists = {
    "ASL 1–250": "asl_1_250.js",
    "ASL 251–500": "asl_251_500.js",
    "ASL 501–750": "asl_501_750.js",
    "ASL 751–1000": "asl_751_1000.js",
    "ASL 1001–1100": "asl_1001_1100.js"
  };

  const colors = ["#ffeb3b","#8bc34a","#03a9f4","#e91e63","#ff9800"];

  // inject CSS
  if(!document.getElementById("asl-style")){
    const style=document.createElement("style");
    style.id="asl-style";
    style.textContent=".asl-highlight{padding:2px;border-radius:3px;}";
    document.head.appendChild(style);
  }

  // make legend
  let legend=document.getElementById("asl-legend");
  if(!legend){
    legend=document.createElement("div");
    legend.id="asl-legend";
    legend.style="position:fixed;top:10px;right:10px;z-index:999999;background:white;padding:8px;border:1px solid #ccc;border-radius:6px;font-family:sans-serif;font-size:14px;";
    document.body.appendChild(legend);
  }
  legend.innerHTML="";
  
  let idx=0;
  for(let label in lists){
    const btn=document.createElement("button");
    btn.textContent=label;
    btn.style=`margin:2px;padding:4px;border:1px solid #aaa;background:#fff;cursor:pointer;`;
    btn.onclick=()=>{
      if(window[label+"_active"]){
        // clear
        document.querySelectorAll(".asl-"+label.replace(/\s+/g,'')).forEach(el=>{
          el.outerHTML=el.innerText;
        });
        window[label+"_active"]=false;
        btn.style.background="#fff"; btn.style.color="#000";
      } else {
        // load file then highlight
        fetch(`https://msdt463657.github.io/ASL1100/${lists[label]}`).then(r=>r.text()).then(js=>{
          eval(js);
          let words=window["asl"+(idx+1)];
          if(words){
            const regex=new RegExp("\\b("+words.join("|")+")\\b","gi");
            function walk(node){
              if(node.nodeType===3){
                const frag=document.createDocumentFragment();
                let lastIdx=0;
                node.nodeValue.replace(regex,(m,_,offset)=>{
                  if(offset>lastIdx){
                    frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIdx,offset)));
                  }
                  const span=document.createElement("span");
                  span.className="asl-highlight asl-"+label.replace(/\s+/g,'');
                  span.style.background=colors[idx];
                  span.textContent=m;
                  frag.appendChild(span);
                  lastIdx=offset+m.length;
                });
                if(lastIdx<node.nodeValue.length){
                  frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIdx)));
                }
                if(frag.childNodes.length) node.parentNode.replaceChild(frag,node);
              } else if(node.nodeType===1 && !/(script|style)/i.test(node.tagName)){
                Array.from(node.childNodes).forEach(walk);
              }
            }
            walk(document.body);
            window[label+"_active"]=true;
            btn.style.background=colors[idx]; btn.style.color="#fff";
          }
        });
      }
    };
    legend.appendChild(btn);
    idx++;
  }

  // clear button
  const clear=document.createElement("button");
  clear.textContent="Clear";
  clear.style="margin:2px;padding:4px;border:1px solid #aaa;background:#f5f5f5;cursor:pointer;";
  clear.onclick=()=>location.reload();
  legend.appendChild(clear);
})();
