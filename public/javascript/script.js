var socket = io.connect('http://localhost:3000');
(function() {

  var cpt = 0;
  if(cpt < 1)
  {
    $('.dropper').each(function(){
      var abscisse = $(this).attr('abscisse');
      var ordonnee = $(this).attr('ordonnee');
      var id = ordonnee+abscisse;
      console.log(id);
      $(this).attr('id',id);
    });
    cpt++;
  }

  //Affichage du modal dès le chargement de la page (pas fini)
  $("#test").modal('show');

  // Functions
  var EnterGameCB = function EnterGame()
  {

    document.getElementById("main").setAttribute('draggable', 'false');
    var pseudo = $("input[name=pseudo]").val();

    socket.emit('verifpseudo',pseudo);

    socket.on('verifpseudo',function(found,pseudo2){
      var cpt=0;

      if(found != null)
      {
        $("#test").modal('hide');
        $("#NomJoueur").append(pseudo2);
        socket.emit('pseudovalide',pseudo2);
      }
      else
      {
        if(cpt!=1)
        {
          alert('Veuillez renseigner votre pseudo ou entrer un pseudo correct');
          cpt=cpt+1;
        }
      }
    });}
    // Events Binding
    $("#boutonJouer").bind("click",EnterGameCB);
    $('body').on('keypress', '#test',function(e){
      if(e.which == 13)
      {
        EnterGameCB();
      }
    });



    // Socket IO Event Handling
    socket.on('idelements',function(elemDropped,destination,value){
      console.log(elemDropped);
      var newPion = document.createElement('div');
      newPion.id    = 'pion';

      newPion.setAttribute('class','draggable');
      newPion.setAttribute('value',value);
      newPion.setAttribute('draggable','true');
      var newText = document.createTextNode(value);
      newPion.appendChild(newText);
      //newPion.setAttribute('tabindex', '10');
      console.log("Recu sur le client / ElemDropped = "+elemDropped+" / destination = "+destination);
      $('#'+destination).append(newPion);

    });

    Pioche = new Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[9,9,8,8,7,8,6,6,4,4,3,3,2,2,1,1]);

    $('#bouton').click(function piocheAuto(){

      var  childs = document.getElementById("main").childNodes;
      if(childs.length!=4){
        do{
          ajouteElement();
        }while(childs.length!=4);
      }
      joueuractuel.switchTour(joueur2, joueur3, joueur4);
    });

    function ajouteElement() {
      // crée un nouvel élément div
      // et lui donne un peu de contenu
      if(verifPioche()!=0){

        var  childs = document.getElementById("main").childNodes;

        if(childs.length==4){
          alert("Vous avez déja 3 pieces dans votre main ! ");
        }

        else{

          var e = document.createElement("div");
          do{
            var val= randomIntFromInterval(0,15);

          }while(Pioche[1][val]==0);
          Pioche[1][val]--;
          e.appendChild( document.createTextNode(val) );
          e.id = "pion";
          e.className="draggable";
          e.setAttribute('draggable', 'true');
          e.setAttribute('value', val);
          main.appendChild(e);

        }
      }
      else{
        alert("La pioche est vide ! ");
      }

      verifPioche();
      //document.body.appendChild(nouveauDiv);

      // ajoute l'élément qui vient d'être créé et son contenu au DOM
      //mon_div = document.getElementById("org_div1");
      //document.body.insertBefore(nouveauDiv, mon_div);
    }





    function verifPioche(){
      var valP=0;
      for (var i = 0; i <= 15; i++) {
        valP=valP+Pioche[1][i];
      }
      //var parent = document.getElementById("sc1");
      //var child = document.getElementById("nbPio");
      //var e = document.createElement("div");
      //e.appendChild( document.createTextNode(valP) );
      //e.id = "nbPio";
      //parent.replaceChild(e,child);
      return valP;
    }

    function CaseAutour(ord,abs){
      var valP=0;

      if(parseInt(ord)>0){// eviter les bug sur les bords de plateau
          var ord2 = parseInt(ord) -1;
          var abs2 = parseInt(abs) ;
          if(plateau[ord2][abs2].getVal()!=null){
              valP=valP+1;
          }
        }
        if(parseInt(ord)<14){// eviter les bug sur les bords de plateau
          ord2 = parseInt(ord) +1;
          abs2 = parseInt(abs) ;
          if(plateau[ord2][abs2].getVal()!=null){
              valP=valP+1;
          }
        }

        if(parseInt(abs)>0){// eviter les bug sur les bords de plateau
          ord2 = parseInt(ord) ;
          abs2 = parseInt(abs) -1;
          if(plateau[ord2][abs2].getVal()!=null){
              valP=valP+1;
          }
        }

        if(parseInt(abs)<14){// eviter les bug sur les bords de plateau
          ord2 = parseInt(ord) ;
          abs2 = parseInt(abs) +1;
          if(plateau[ord2][abs2].getVal()!=null){
              valP=valP+1;
          }
        }

      //var parent = document.getElementById("sc1");
      //var child = document.getElementById("nbPio");
      //var e = document.createElement("div");
      //e.appendChild( document.createTextNode(valP) );
      //e.id = "nbPio";
      //parent.replaceChild(e,child);
      return valP;
    }



    var dndHandler = {

      draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

      applyDragEvents: function(element) {

        element.draggable = true;

        var dndHandler = this; // Cette variable est nécessaire pour que l'événement "dragstart" ci-dessous accède facilement au namespace "dndHandler"

        element.addEventListener('dragstart', function(e) {
          dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
          e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
        }, false);

      },

      applyDropEvents: function(dropper) {

        dropper.addEventListener('dragover', function(e) {
          e.preventDefault(); // On autorise le drop d'éléments
          //this.className = 'dropper drop_hover'; // Et on applique le design adéquat à notre zone de drop quand un élément la survole
        }, false);

        dropper.addEventListener('dragleave', function() {
          //	this.className = 'dropper'; // On revient au design de base lorsque l'élément quitte la zone de drop
        });

        var dndHandler = this; // Cette variable est nécessaire pour que l'événement "drop" ci-dessous accède facilement au namespace "dndHandler"

        dropper.addEventListener('drop', function(e) {

          var abs = this.getAttribute("abscisse");
          var ord = this.getAttribute("ordonnee");
          /*
          if(abs== 7){
            alert("7");
          }
          */
          //var parentname = this.parentNode.getAttribute("name");
          if(plateau[ord][abs].getVal()==null){
            if(plateau[7][7].getVal()!=null || (abs == 7 && ord == 7)){
              if(CaseAutour(ord,abs)!=0 || (abs == 7 && ord == 7)){
                //plateau[ord][abs].setVal(1);

                var nbCaseR = CaseAutour(ord,abs);
                console.log("nb case remplit : "+ nbCaseR);

                var target = e.target,
                draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
                clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

                var elemDropped = $(draggedElement).attr('id');
                var destination = $(target).attr('id');
                socket.emit('idelements', elemDropped, destination);

                while(target.className.indexOf('dropper') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                target = target.parentNode;

              }

              //target.className = 'dropper'; // Application du design par défaut
              var classeCible = target.getAttribute('class');
              console.log(classeCible);
              /* INUTILE
              if(classeCible.indexOf("bis")!=-1){
                target.className = 'bis';
              }
              else{
                if(classeCible.indexOf("double")!=-1){
                  target.className = 'double';
                }
                else{
                  if(classeCible.indexOf("triple")!=-1){
                    target.className = 'triple';
                  }
                  else{
                    if(classeCible.indexOf("centre")!=-1){
                      target.className = 'centre';
                    }
                    else {
                      target.className = '';
                    }
                  }
                }
              }
              */
              /// ici retirer classe draged a la case qui a recu l'element
              plateau[ord][abs].setVal(draggedElement.getAttribute("value"));
              console.log("case plateau :"+plateau[ord][abs].getVal());
              ///
              clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
              dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()
              clonedElement.setAttribute('draggable', 'false');
              draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine

              var valeur=$(target).children().attr('value');
              //alert(valeur+abs+ord);
              joueuractuel.actualiserScore(valeur);
              refreshScore(joueuractuel, joueur2, joueur3, joueur4);
              //triTableau(joueuractuel, joueur2, joueur3, joueur4);
              }
              else{
              alert("Les pieces doivent etre adjacente");
            }
        }
        else{
          alert("Case centre en 1er");
        }
        }else{
          alert("La case est déja occupé");
        }
      });

    }

  };


  var elements = document.querySelectorAll('.draggable'),
  elementsLen = elements.length;

  for(var i = 0 ; i < elementsLen ; i++) {
    dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux élément déplaçables
  }

  var droppers = document.querySelectorAll('.dropper'),
  droppersLen = droppers.length;

  for(var i = 0 ; i < droppersLen ; i++) {
    dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
  }

})();

var quitter = document.getElementById('boutonQuitter');

quitter.onclick = function()
{
  var test=false;
  test=confirm("Voulez-vous quitter ?");
  if(test==false)
  {
    return false;
  }
  else
  {
    return true;
  }
}

function Joueur(nomjoueur, scorejoueur) {

  this.nomjoueur = nomjoueur;
  this.scorejoueur = scorejoueur;

};

Joueur.prototype.actualiserScore = function(scorejoueur){
  this.scorejoueur = Number(Number(this.scorejoueur)+Number(scorejoueur));
}

Joueur.prototype.getScore = function(){
  return this.scorejoueur;
}

Joueur.prototype.setScore = function(scorejoueur){
  this.scorejoueur = scorejoueur;
}

Joueur.prototype.setNom = function(nomjoueur){
  this.nomjoueur = nomjoueur;
}

Joueur.prototype.getNom = function(){
  return this.nomjoueur;
}

Joueur.prototype.switchTour = function(joueur2, joueur3, joueur4){
  var buffernom;
  var bufferscore;

  buffernom = this.getNom();
  bufferscore = this.getScore();

  this.setNom(joueur2.getNom());
  this.setScore(joueur2.getScore());

  joueur2.setNom(joueur3.getNom());
  joueur2.setScore(joueur3.getScore());

  joueur3.setNom(joueur4.getNom());
  joueur3.setScore(joueur4.getScore());

  joueur4.setNom(buffernom);
  joueur4.setScore(bufferscore);

}

Joueur.prototype.getRank = function(j2, j3, j4){
  var ptscore = 0;

  if(this.getScore()>=j2.getScore()){
    ptscore = ptscore+1;
  }

  if(this.getScore()>=j3.getScore()){
    ptscore = ptscore+1;
  }

  if(this.getScore()>=j4.getScore()){
    ptscore = ptscore+1;
  }

  if(ptscore == 0){
    console.log(this.getNom());
    console.log("==4");
    return 4;

  }else if(ptscore ==1){
    console.log(this.getNom());
    console.log("==3");
    return 3;

  }else if(ptscore ==2){
    console.log(this.getNom());
    console.log("==2");
    return 2;

  }else if(ptscore == 3){
    console.log(this.getNom());
    console.log("==1");
    return 1;
  }

}

/*function triTableau(jactuel, j2, j3, j4){

var tableau = new Array();
tableau[0]=jactuel;
tableau[1]=j2;
tableau[2]=j3;
tableau[3]=j4;
var buffernom;
var bufferscore;

do{
for(var i=1; i<3; i=i+1){
if(tableau[i].getRank()>tableau[i-1].getRank()){
buffernom=tableau[i-1].getNom();
bufferscore=tableau[i-1].getScore();
console.log(bufferscore);
tableau[i-1]=tableau[i]
tableau[i].setNom(buffernom);
tableau[i].setScore(bufferScore);
console.log(bufferscore);
}
}
}while(Number(j4.getRank()-j3.getRank()-j2.getRank()-j1.getrank())!=-2);


}*/


function refreshScore(jactuel, joueur2, joueur3, joueur4) {

  if(jactuel.getRank(joueur2, joueur3, joueur4)==1){
    document.getElementById("scorej1").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
    if(joueur2.getScore()!=null){
      if(joueur2.getRank(jactuel, joueur3, joueur4)==2 || joueur2.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej2").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==3){
        document.getElementById("scorej3").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==4){
        document.getElementById("scorej4").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }
    }
    if(joueur3.getScore()!=null){
      if(joueur3.getRank(jactuel, joueur2, joueur4)==2 || joueur3.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej2").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==3){
        document.getElementById("scorej3").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==4){
        document.getElementById("scorej4").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }
    }
    if(joueur4.getScore()!=null){
      if(joueur4.getRank(jactuel, joueur2, joueur3)==2 || joueur4.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej2").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==3){
        document.getElementById("scorej3").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==4){
        document.getElementById("scorej4").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }
    }
  }



  if(jactuel.getRank(joueur2, joueur3, joueur4)==2){
    document.getElementById("scorej2").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
    if(joueur2.getScore()!=null){
      if(joueur2.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej1").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==3|| joueur2.getRank(jactuel, joueur3, joueur4)==2){
        document.getElementById("scorej3").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==4){
        document.getElementById("scorej4").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }
    }
    if(joueur3.getScore()!=null){
      if(joueur3.getRank(jactuel, joueur2, joueur4)==1 || joueur3.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej1").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==3 || joueur3.getRank(jactuel, joueur2, joueur4)==2){
        document.getElementById("scorej3").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==4){
        document.getElementById("scorej4").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }
    }
    if(joueur4.getScore()!=null){
      if(joueur4.getRank(jactuel, joueur2, joueur3)==1 || joueur4.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej1").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==3 || joueur4.getRank(jactuel, joueur2, joueur3)==2){
        document.getElementById("scorej3").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==4){
        document.getElementById("scorej4").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }
    }
  }



  if(jactuel.getRank(joueur2, joueur3, joueur4)==3){
    document.getElementById("scorej3").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
    if(joueur2.getScore()!=null){
      if(joueur2.getRank(jactuel, joueur3, joueur4)==1){
        document.getElementById("scorej1").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==2){
        document.getElementById("scorej2").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }else if(joueur2.getRank(jactuel, joueur3, joueur4)==4 || joueur2.getRank(jactuel, joueur3, joueur4)==3){
        document.getElementById("scorej4").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
      }
    }
    if(joueur3.getScore()!=null){
      if(joueur3.getRank(jactuel, joueur2, joueur4)==1){
        document.getElementById("scorej1").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==2){
        document.getElementById("scorej2").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }else if(joueur3.getRank(jactuel, joueur2, joueur4)==4 || joueur3.getRank(jactuel, joueur2, joueur4)==3){
        document.getElementById("scorej4").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
      }
    }
    if(joueur4.getScore()!=null){
      if(joueur4.getRank(jactuel, joueur2, joueur3)==1){
        document.getElementById("scorej1").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==2){
        document.getElementById("scorej2").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }else if(joueur4.getRank(jactuel, joueur2, joueur3)==4 || joueur4.getRank(jactuel, joueur2, joueur3)==3){
        document.getElementById("scorej4").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
      }
    }
  }



  if(jactuel.getRank(joueur2, joueur3, joueur4)==4){
    document.getElementById("scorej4").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
    var  scorej1 = document.getElementById("scorej1").innerHTML;
    var  scorej2 = document.getElementById("scorej2").innerHTML;
    var  scorej3 = document.getElementById("scorej3").innerHTML;
    document.getElementById("scorej3").innerHTML = scorej3;
    document.getElementById("scorej2").innerHTML = scorej2;
    document.getElementById("scorej1").innerHTML = scorej1;


    /*if(joueur2.getRank(jactuel, joueur3, joueur4)==1){
    document.getElementById("scorej1").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
  }else if(joueur2.getRank(jactuel, joueur3, joueur4)==2){
  document.getElementById("scorej2").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
}else if(joueur2.getRank(jactuel, joueur3, joueur4)==3){
document.getElementById("scorej3").innerHTML = joueur2.getRank(jactuel, joueur3, joueur4)+". "+joueur2.getScore()+"<small> "+joueur2.getNom()+"</small>";
}
if(joueur3.getRank(jactuel, joueur3, joueur4)==1){
document.getElementById("scorej1").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
}else if(joueur3.getRank(jactuel, joueur3, joueur4)==2 && joueur2.getRank(jactuel, joueur3, joueur4)==2){
document.getElementById("scorej2").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
}else if(joueur3.getRank(jactuel, joueur3, joueur4)==3 ){
document.getElementById("scorej3").innerHTML = joueur3.getRank(jactuel, joueur2, joueur4)+". "+joueur3.getScore()+"<small> "+joueur3.getNom()+"</small>";
}
if(joueur4.getRank(jactuel, joueur2, joueur3)==1){
document.getElementById("scorej1").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
}else if(joueur3.getRank(jactuel, joueur2, joueur3)==2){
document.getElementById("scorej2").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
}else if(joueur3.getRank(jactuel, joueur2, joueur3)= 3){
document.getElementById("scorej3").innerHTML = joueur4.getRank(jactuel, joueur2, joueur3)+". "+joueur4.getScore()+"<small> "+joueur4.getNom()+"</small>";
}*/
}


/*if(jactuel.getRank(joueur2, joueur3, joueur4)==2){
document.getElementById("scorej2").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
}

if(jactuel.getRank(joueur2, joueur3, joueur4)==3){
document.getElementById("scorej3").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
}

if(jactuel.getRank(joueur2, joueur3, joueur4)==4){
document.getElementById("scorej4").innerHTML = jactuel.getRank(joueur2, joueur3, joueur4)+". "+jactuel.getScore()+"<small> "+jactuel.getNom()+"</small>";
}*/
}

//obsolete par l'avenir

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

/*function Pion(abscisse, ordonnee, valeur, multiplicateur) {

this.abscisse = abscisse;
this.ordonnee = ordonnee;
this.valeur = valeur;
this.multiplicateur = multiplicateur;

};*/ //a faire----------------------------------------------


function Pion(abscisse, ordonnee, valeur) {

  this.abscisse = abscisse;
  this.ordonnee = ordonnee;
  this.valeur = valeur;

};

Pion.prototype.getAbs = function(){
  return this.abscisse;
};

Pion.prototype.getOrd = function(){
  return this.ordonnee;
};

Pion.prototype.getVal = function(){
  return this.valeur;
};

Pion.prototype.setAbs = function(abs){
  this.abscisse=abs;
};

Pion.prototype.setOrd = function(ord){
  this.ordonnee=ord;
};

Pion.prototype.setVal = function(val){
  this.valeur=val;
};



function Case(abscisse, ordonnee, valeur, multiplicateur) {

  this.abscisse = abscisse;
  this.ordonnee = ordonnee;
  this.valeur = valeur;
  this.multiplicateur = multiplicateur;

};

Case.prototype.getAbs = function(){
  return this.abscisse;
};

Case.prototype.getOrd = function(){
  return this.ordonnee;
};

Case.prototype.getVal = function(){
  return this.valeur;
};

Case.prototype.getMul = function(){
  return this.multiplicateur;
};

Case.prototype.setAbs = function(abs){
  this.abscisse=abs;
};

Case.prototype.setOrd = function(ord){
  this.ordonnee=ord;
};

Case.prototype.setVal = function(val){
  this.valeur=val;
};

Case.prototype.setMul = function(mul){
  this.multiplicateur=mul;
};

//faire une fonctionn switch joueur

var joueuractuel = new Joueur("Adrien", null);
var joueur2 = new Joueur("Léopold", null);
var joueur3 = new Joueur("Antoine", null);
var joueur4 = new Joueur("Maxime", null);

//Case(ordonnée, abscisse, valeur, multiplicateur)

var plateau = new Array(15)
plateau[0] = new Array(
  new Case(0,0, null, 1), new Case(0,1, null, 1), new Case(0,2, null, 1), new Case(0,3, null, 1), new Case(0,4, null, 1),
  new Case(0,5, null, 1), new Case(0,6, null, 1), new Case(0,7, null, 2), new Case(0,8, null, 1), new Case(0,9, null, 1),
  new Case(0,10, null, 1), new Case(0,11, null, 1), new Case(0,12, null, 1), new Case(0,13, null, 2), new Case(0,14, null, 1)
);

plateau[1] = new Array(
  new Case(1,0, null, 1), new Case(1,1, null, 2), new Case(1,2, null, 1), new Case(1,3, null, 1), new Case(1,4, null, 3),
  new Case(1,5, null, 1), new Case(1,6, null, 1), new Case(1,7, null, 1), new Case(1,8, null, 1), new Case(1,9, null, 1),
  new Case(1,10, null, 3), new Case(1,11, null, 1), new Case(1,12, null, 1), new Case(1,13, null, 2), new Case(1,14, null, 1)
);

plateau[2] = new Array(
  new Case(2,0, null, 1), new Case(2,1, null, 1), new Case(2,2, null, 1), new Case(2,3, null, 1), new Case(2,4, null, 1),
  new Case(2,5, null, 1), new Case(2,6, null, 1), new Case(2,7, null, 1), new Case(2,8, null, 1), new Case(2,9, null, 1),
  new Case(2,10, null, 1), new Case(2,11, null, 1), new Case(2,12, null, 1), new Case(2,13, null, 1), new Case(2,14, null, 1)
);

plateau[3] = new Array(
  new Case(3,0, null, 1), new Case(3,1, null, 1), new Case(3,2, null, 1), new Case(3,3, null, 1), new Case(3,4, null, 1),
  new Case(3,5, null, 1), new Case(3,6, null, 1), new Case(3,7, null, 2), new Case(3,8, null, 1), new Case(3,9, null, 1),
  new Case(3,10, null, 1), new Case(3,11, null, 1), new Case(3,12, null, 1), new Case(3,13, null, 1), new Case(3,14, null, 1)
);

plateau[4] = new Array(
  new Case(4,0, null, 1), new Case(4,1, null, 3), new Case(4,2, null, 1), new Case(4,3, null, 1), new Case(4,4, null, 2),
  new Case(4,5, null, 1), new Case(4,6, null, 1), new Case(4,7, null, 1), new Case(4,8, null, 1), new Case(4,9, null, 1),
  new Case(4,10, null, 2), new Case(4,11, null, 1), new Case(4,12, null, 1), new Case(4,13, null, 3), new Case(4,14, null, 1)
);

plateau[5] = new Array(
  new Case(5,0, null, 1), new Case(5,1, null, 1), new Case(5,2, null, 1), new Case(5,3, null, 1), new Case(5,4, null, 1),
  new Case(5,5, null, 1), new Case(5,6, null, 1), new Case(5,7, null, 1), new Case(5,8, null, 1), new Case(5,9, null, 1),
  new Case(5,10, null, 1), new Case(5,11, null, 1), new Case(5,12, null, 1), new Case(5,13, null, 1), new Case(5,14, null, 1)
);

plateau[6] = new Array(
  new Case(6,0, null, 1), new Case(6,1, null, 1), new Case(6,2, null, 1), new Case(6,3, null, 1), new Case(6,4, null, 1),
  new Case(6,5, null, 1), new Case(6,6, null, 1), new Case(6,7, null, 1), new Case(6,8, null, 1), new Case(6,9, null, 1),
  new Case(6,10, null, 1), new Case(6,11, null, 1), new Case(6,12, null, 1), new Case(6,13, null, 1), new Case(6,14, null, 1)
);

plateau[7] = new Array(
  new Case(7,0, null, 2), new Case(7,1, null, 1), new Case(7,2, null, 1), new Case(7,3, null, 2), new Case(7,4, null, 1),
  new Case(7,5, null, 1), new Case(7,6, null, 1), new Case(7,7, null, 2), new Case(7,8, null, 1), new Case(7,9, null, 1),
  new Case(7,10, null, 1), new Case(7,11, null, 2), new Case(7,12, null, 1), new Case(7,13, null, 1), new Case(7,14, null, 2)
);

plateau[8] = new Array(
  new Case(8,0, null, 1), new Case(8,1, null, 1), new Case(8,2, null, 1), new Case(8,3, null, 1), new Case(8,4, null, 1),
  new Case(8,5, null, 1), new Case(8,6, null, 1), new Case(8,7, null, 1), new Case(8,8, null, 1), new Case(8,9, null, 1),
  new Case(8,10, null, 1), new Case(8,11, null, 1), new Case(8,12, null, 1), new Case(8,13, null, 1), new Case(8,14, null, 1)
);

plateau[9] = new Array(
  new Case(9,0, null, 1), new Case(9,1, null, 1), new Case(9,2, null, 1), new Case(9,3, null, 1), new Case(9,4, null, 1),
  new Case(9,5, null, 1),	new Case(9,6, null, 1), new Case(9,7, null, 1), new Case(9,8, null, 1), new Case(9,9, null, 1),
  new Case(9,10, null, 1), new Case(9,11, null, 1), new Case(9,12, null, 1), new Case(9,13, null, 1), new Case(9,14, null, 1)
);

plateau[10] = new Array(
  new Case(10,0, null, 1), new Case(10,1, null, 3), new Case(10,2, null, 1), new Case(10,3, null, 1), new Case(10,4, null, 2),
  new Case(10,5, null, 1), new Case(10,6, null, 1), new Case(10,7, null, 1), new Case(10,8, null, 1), new Case(10,9, null, 1),
  new Case(10,10, null, 2), new Case(10,11, null, 1), new Case(10,12, null, 1), new Case(10,13, null, 3), new Case(10,14, null, 1)
);

plateau[11] = new Array(
  new Case(11,0, null, 1), new Case(11,1, null, 1), new Case(11,2, null, 1), new Case(11,3, null, 1), new Case(11,4, null, 1),
  new Case(11,5, null, 1), new Case(11,6, null, 1), new Case(11,7, null, 2), new Case(11,8, null, 1), new Case(11,9, null, 1),
  new Case(11,10, null, 1),	new Case(11,11, null, 1),12, new Case(11,12, null, 1), new Case(11,13, null, 1), new Case(11,14, null, 1)
);

plateau[12] = new Array(
  new Case(12,0, null, 1), new Case(12,1, null, 1), new Case(12,2, null, 1), new Case(12,3, null, 1), new Case(12,4, null, 1),
  new Case(12,5, null, 1), new Case(12,6, null, 1), new Case(12,7, null, 1), new Case(12,8, null, 1), new Case(12,9, null, 1),
  new Case(12,10, null, 1),	new Case(12,11, null, 1), new Case(12,12, null, 1), new Case(12,13, null, 1), new Case(12,14, null, 1)
);

plateau[13] = new Array(
  new Case(13,0, null, 1), new Case(13,1, null, 2), new Case(13,2, null, 1), new Case(13,3, null, 1), new Case(13,4, null, 3),
  new Case(13,5, null, 1), new Case(13,6, null, 1), new Case(13,7, null, 1), new Case(13,8, null, 1), new Case(13,9, null, 1),
  new Case(13,10, null, 3), new Case(13,11, null, 1), new Case(13,12, null, 1), new Case(13,13, null, 2), new Case(13,14, null, 1)
);

plateau[14] = new Array(
  new Case(14,0, null, 1), new Case(14,1, null, 1), new Case(14,2, null, 1), new Case(14,3, null, 1), new Case(14,4, null, 1),
  new Case(14,5, null, 1), new Case(14,6, null, 1), new Case(14,7, null, 2), new Case(14,8, null, 1), new Case(14,9, null, 1),
  new Case(14,10, null, 1),	new Case(14,11, null, 1), new Case(14,12, null, 1), new Case(14,13, null, 1), new Case(14,14, null, 1)
);

//alert(plateau[7][7].getAbs()+", "+plateau[7][7].getOrd()+", "+plateau[7][7].getVal()+", "+plateau[7][7].getMul());
