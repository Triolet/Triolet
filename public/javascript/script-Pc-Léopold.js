Pioche = new Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[9,9,8,8,7,8,6,6,4,4,3,3,2,2,1,1]);

function piocheAuto(){
	var  childs = document.getElementById("main").childNodes;
	if(childs.length!=4){
		do{
			ajouteElement();
		}while(childs.length!==4);
	}

}
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
		var parent = document.getElementById("sc1");
		var child = document.getElementById("nbPio");
		var e = document.createElement("div");
		e.appendChild( document.createTextNode(valP) );
		e.id = "nbPio";
		parent.replaceChild(e,child);
		return valP;
	}



(function() {
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

						var target = e.target,
							draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
							clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

						while(target.className.indexOf('dropper') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
							target = target.parentNode;
						}

						//target.className = 'dropper'; // Application du design par défaut

						clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
						dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()

						draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine

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



function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
