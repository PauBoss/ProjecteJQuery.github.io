// Objeto con el array de juegos cargado.
var listadoJuegos;

/**
 * Función que se ejecuta cuando el DOM se ha cargado completamente
 */
$( ( ) => {
	$.getJSON( 'resources/juegos.json', function ( data ) {
		listadoJuegos = data;
		$( document )
		.trigger( 'juegosCargados' );
	} );
} );

/**
 * Evento que se lanza al acabar de cargar los juegos del fichero JSON
 */
$( document )
.on( 'juegosCargados', function ( ) {

	//Escondo todos los elementos referentes al año y género al cargar la página.
	$( "filter.col ul > li" )
	.hide( );
	$( ".form-check" )
	.hide( );
	$( "filter" )
	.last( )
	.hide( );

	//Para las opciones género y año.
	$( ".form-select" )
	.change( function ( ) {
		var opcion = $( this )
		.val( );
		if ( opcion == 1 ) {

			//Establezco siempre el valor de la opción 0.
			$( ".form-select" ).val('0'); 

			//Muestro los elementos del género.
			$( ".col ul > li" )
			.first()
			.show( );
			$( ".form-check" )
			.show( );

			//Escondo el elemento de la lista y los checkbox predefinidos.
			$('.form-select option[value="1"]').hide();
			$('div.form-check').eq(0).hide();
			$('div.form-check').eq(1).hide();
			
			//Muestro los géneros del json sin repetirse.
			var listadoJuego = {};
    		var unicos = listadoJuegos.filter(function (comparacion) { 
        	return listadoJuegos[comparacion.genero] ? false : (listadoJuegos[comparacion.genero] = true);
    		});

			for (const lista of unicos) {
				$('<div>', {
					'class': 'form-check'
				  })
				  .append($('<input>', {
					'class': 'form-check-input',
					'type': 'checkbox',
					'value': lista['genero']
				  }))
				  .append($('<label>', {
					'class': 'form-check-label',
					'for': lista['genero'],
					'text': ' ' + lista['genero']
				  })).appendTo('filter.form-check');
			  }

		} else if ( opcion == 2 ) {
			
			//Establezco siempre el valor de la opción 0. 
			$( ".form-select" ).val('0');

			//Muestro los elementos del año.
			$( ".col ul > li" )
			.last()
			.show( );
			$( "filter" )
			.last( )
			.show( );
			
			//Establezco el maxlenth y caract al input.
			$(".form-control").keypress(function (e) {
				var digitos = this.value.length;
				if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) || digitos >= 4 ) {

					return false;
					
			   		}
			  });		

			//Escondo el elemento de la lista.
			$('.form-select option[value="2"]').hide();
		} 
	} );

	//Escondo los elementos del género.
	$('.horizontal a:first').click(function() {
		$( ".col ul > li" )
		.first()
		.hide( );
		$( ".form-check" )
		.hide( );

		//Limpio los checkboxs.
		$('input[type=checkbox]').prop('checked',false);

		//Muestro el elemento en las opciones.
		$('.form-select option[value="1"]').show();
	});

	//Escondo los elementos del año.
	$('.horizontal a:last').click(function() {
		$( ".col ul > li" )
		.last()
		.hide( );
		$( "filter" )
		.last( )
		.hide( )
		$( "filter" )
		.last( )
		.hide( )

		//Limpio el input.
		$('input[type="text"]').val('');

		//Muestro el elemento en las opciones.
		$('.form-select option[value="2"]').show();
	});
} );
