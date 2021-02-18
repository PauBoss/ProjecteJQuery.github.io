var mensaje = $('<center><span><h3>' + 'Cargando Datos...' + '</h3></span></center>');

$(()=>{

	$( "#infoTabla" ).hide();

	/**
	 * Cuando el usuario haga clic sobre el botón de notificaciones, pedirá al usuario
	 * un confirm de si quiere recibir notificacones. En caso de negarlas, se mostrará un mensaje
	 * por consola y se caancelará la operación.
	 */
	$( '#notificaciones' )
	.on( 'click', function ( ) {
		if ( confirm( "Desea permitir las notificaciones en esta página?" ) ) {
			cuenta( 5, 1000 );
		} else {
			alert( "Se han negado los permisos para recibir notificaciones." );
		}
	} );

	/**
	 * Cuando el usuario haga clic sobre el botón, obtendrá las coordenadas
	 * y llamará a las respectivas funciones.
	 */
	$( '#infoCovid' ).on( 'click', () => {
		navigator.geolocation.getCurrentPosition(posicion => {
			pueblosCercanos(posicion.coords.latitude, posicion.coords.longitude);
		});
		//Muetsro el Cargando Datos..
		$(mensaje).insertAfter('#botones');
		//Muesatro la tabla que se encontraba escondida.
		$( "#infoTabla" ).show();
		
		obtenerDatos();
		obtenerInformes();
	});
});

/**
 * Aquí esta definido el timeout que devolverá una promesa.
 */
function timeout( ms ) {
	return new Promise( ( resolve, reject ) => {
		setTimeout( resolve, ms );
	} );
}

/**
 * Aquí esta definida la notificación la cual será mostrada al usuario.
 */
function mostrarNotificacion( ) {
	let notificacion = new Notification( 'Se ha publicado un nuevo juego', {
		body: 'Haga click en este enlace para poder visualizarlo.'
	, } );
	$( notificacion )
	.click( function ( ) {
		window.open( 'notificacion.html' );
	} );
}

/**
 * Tras ser clicado, descativará el botón y mostrará en el mismo input un mensaje de espera. 
 * Una vez terminado, mostrará la notificación llamando a la función, y dejará el botón como
 * estaba por predeterminado.
 */
async function cuenta( tiempo, interval ) {
	while ( tiempo >= 0 ) {
		await timeout( interval );
		$( '#notificaciones' )
		.val( 'Porfavor, espere 5 segundos...' )
		.attr( 'disabled', true );
		tiempo--
	}
	$( '#notificaciones' )
	.val( 'Habilitar Notificaciones' )
	.attr( 'disabled', false );
	mostrarNotificacion( );
}

/**
 * Le paso las coordenadas con las variables.
 */
function pueblosCercanos(lat, lng) {
	const pueblos20KMs = obtenerPueblos20Kms(lat, lng)
}

/**
 * Configuración pera obtener los municipios (GET).
 */
function listarMunicipiosConf() {
	let headers = new Headers({
	  'cache-control': 'no-cache',
	});
  
	let conf = {
	  method: 'GET',
	  mode: 'cors',
	  headers: headers,
	};
	return conf;
  }

/**
 * He definido esta función async la cual se encargará de obtener los 
 * pueblos cercanos en un radio de 20km.
 */ 
async function obtenerPueblos20Kms(lat, lng) {

	const key = 'CTT40NG134S0D9SPKAKNTVMS9C7MZMCM';
	const GET_URL = 'https://api.geodatasource.com/cities?key=' + key + '&lat=' + lat + '&lng=' + lng;

	try {

	  const resultado = await fetch(
		GET_URL,
		listarMunicipiosConf()
	  );

	  if (!resultado.ok) throw new Error(resultado.status);

	  const json = await resultado.json();
	
	} catch (error) {
	  console.log(error.message);
	}
  }

/**
 * Configuración pera obtener los informes (GET).
 */
function listarInformes() {
	let headers = new Headers({
	  'cache-control': 'no-cache',
	});
  
	let conf = {
	  method: 'GET',
	  mode: 'cors',
	  headers: headers,
	};
	return conf;
  }

/**
 * He definido otra función async la cual se encargará de obtener la fecha
 * del campo name a través de la URL y mostrarlos por pantalla.
 */ 
async function obtenerInformes() {

	const GET_URL = 'https://dadesobertes.gva.es/api/3/action/package_search?q=id:38e6d3ac-fd77-413e-be72-aed7fa6f13c2';

	try {

	  const resultado = await fetch(
		GET_URL,
		listarInformes()
	  );

	  if (!resultado.ok) throw new Error(resultado.status);

	  const json = await resultado.json();

	  //Obtengo la fecha del campo name ubicado en el último array de resources.
	  const fecha = json.result.results[0].resources.pop().name.slice(-10);
	  
	  //Defino la variable y la inserto.
	  var mySpan = $('<center><span class="fecha"><h2>' + 'Día ' + fecha + '</h2></span></center>');
	  $(mySpan).insertAfter('#botones');

	  //Como ya se que el último elemento que se va a mostrar es la fecha, cuando la muestre esconda el mensaje de Cargando Datos...
	  $(mensaje).hide();

	} catch (error) {
	  console.log(error.message);
	}
  }

/**
 * Configuración pera obtener los datos (GET).
 */
  function listarDatos() {
	let headers = new Headers({
	  'cache-control': 'no-cache',
	});
  
	let conf = {
	  method: 'GET',
	  mode: 'cors',
	  headers: headers,
	};
	return conf;
  }

/**
 * Y he definido esta última función async la cual se encargará de obtener los 
 * datos de cada municipio y mostrarlo en una tabla.
 */ 
  async function obtenerDatos() {

	const GET_URL = 'https://dadesobertes.gva.es/dataset/38e6d3ac-fd77-413e-be72-aed7fa6f13c2/resource/a6ac1919-e2ab-4103-876d-4f4f54289955/download/covid-19-casos-confirmados-por-pcr-casos-pcr-en-los-ultimos-14-dias-y-personas-fallecidas-por-mu.csv';

	try {

	  const resultado = await fetch(
		GET_URL,
		listarDatos()
	  );

	  if (!resultado.ok) throw new Error(resultado.status);
	  const text = await resultado.text();

	  //Obtengo el array y elimino el primer salto de linea y el último(estaba vacío).
	  const filas = text.split('\n'); 
	  filas.shift();
	  filas.pop();
	  
	  const municipios = [];

	  //Aquí a través de un bucle recorro cada fila y obtengo los campos indicados.
	  for (const fila of filas) {
		const campos = fila.split(';');

		const municipio = {
			nombre: campos[1],
			pcr14d: campos[4],
			acumulado: campos[5]
		  };

		//Lo añado al array.
		municipios.push(municipio);
	  }

	  //Y los elementos obtenidos en el array, los muestro con otro bucle en la tabla.
	  var tbody = $('#infoTabla tbody'),
	  props = ["nombre", "pcr14d", "acumulado"];

	  $.each(municipios, function(i, mun) {
		var tr = $('<tr>');
		$.each(props, function(i, prop) {
		  $('<td>').html(mun[prop]).appendTo(tr);  
		});
		tbody.append(tr);
	  });

	} catch (error) {
	  console.log(error.message);
	}
  }




