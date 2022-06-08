//Crear la base de datos y las tablas
$(document).ready(function(){
	//Open Database
	var request = indexedDB.open('almacen',1);
	
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		
    //crear tabla clientes
		if(!db.objectStoreNames.contains('cliente')){
			var os = db.createObjectStore('cliente',{keyPath: "id", autoIncrement:true});
			os.createIndex('nombre','nombre',{unique:false});
		}
		if(!db.objectStoreNames.contains('producto')){
			var os = db.createObjectStore('producto',{keyPath: "id", autoIncrement:true});
			os.createIndex('nombre','nombre',{unique:false});
		}
		if(!db.objectStoreNames.contains('usuario')){
			var os = db.createObjectStore('usuario',{keyPath: "id", autoIncrement:true});
			os.createIndex('nombre','nombre',{unique:false});
		}
	};
	
	//Success
	request.onsuccess = function(e){
		console.log('Hecho: Base de datos abierta...');
		db = e.target.result;
		//Show Customers
		mostrarCliente();
		mostrarProducto();
		mostrarUsuario();
	};
	
	//Error
	request.onerror = function(e){
		console.log('Error: No se pudo abrir la base de datos...');
	};
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//INICIO CRUD CLIENTES
//agregar cliente
function agregarCliente(){
	var nombre = $('#nombre').val();
	var ci = $('#ci').val();
	
	var transaction = db.transaction(["cliente"],"readwrite");
	//Ask for ObjectStore
	var tablaCliente = transaction.objectStore("cliente");
	
	//Define Customer
	var cliente = {
		nombre: nombre,
		ci: ci
	};
	
	//Perform the Add
	var request = tablaCliente.add(cliente);
	
	//Success
	request.onsuccess = function(e){
		alert("Cliente Agregado Correctamente");
		console.log("Cliente Agregado Correctamente");
	};
	
	//Error
	request.onerror = function(e){
		alert("No se pudo agregar al cliente");
		console.log('Error', e.target.error.name);
	};
}

//Mostrar clientees
function mostrarCliente(e){
	var transaction = db.transaction(["cliente"],"readonly");

	var store = transaction.objectStore("cliente");
	var index = store.index('nombre');
	
	var output = '';
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='cliente_"+cursor.value.id+"'>";
			output += "<td>"+cursor.value.id+"</td>";
			output += "<td><span class='cursor cliente' contenteditable='true' data-field='nombre' data-id='"+cursor.value.id+"'>"+cursor.value.nombre+"</span></td>";
			output += "<td><span class='cursor cliente' contenteditable='true' data-field='ci' data-id='"+cursor.value.id+"'>"+cursor.value.ci+"</span></td>";
			output += "<td><a onclick='borrarCliente("+cursor.value.id+")' href=''>Borrar</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		$('#cliente').html(output);
	};
}

//borrar cliente
function borrarCliente(id){
	var transaction = db.transaction(["cliente"],"readwrite");

	var store = transaction.objectStore("cliente");
	
	var request = store.delete(id);
	
	//Success
	request.onsuccess = function(){
		console.log('cliente '+id+' Borrado');
		$('.cliente_'+id).remove();
	};
	
	//Error
	request.onerror = function(e){
		alert("Error, El cliente no pudo ser borrado");
		console.log('Error', e.target.error.name);
	};
}

//borrar todo
function borrarClientes(){
	indexedDB.deleteDatabase('almacen');
	window.location.href="index.html";
	alert("Se borro Correctamente");
	console.log("Borrados");
}

//actualizar clientes
$('#cliente').on('blur','.cliente',function(){
	//nuueva entrada
	var newText = $(this).html();
	//campo
	var field = $(this).data('field');
	//id del cliente
	var id = $(this).data('id');
	

	var transaction = db.transaction(["cliente"],"readwrite");
	var store = transaction.objectStore("cliente");
	
	var request = store.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'nombre'){
			data.nombre = newText;
		} else if(field == 'ci'){
			data.ci = newText;
		}
		
		var requestUpdate = store.put(data);
		
		requestUpdate.onsuccess = function(){
			alert('Cliente Actualizado...');
			console.log('Cliente Actualizado...');
		};
		
		requestUpdate.onerror = function(){
			console.log('Error: No se pudo actualizar al cliente...');
		};
	};
});

//FIN CRUD CLIENTES

/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//INICIO CRUD CLIENTES
//agregar producto
function agregarProducto(){
	var nombre = $('#nombre').val();
	var marca = $('#marca').val();
	var cantidad = $('#cantidad').val();
	var precio = $('#precio').val();
	
	var transaction = db.transaction(["producto"],"readwrite");
	//Ask for ObjectStore
	var tablaProducto = transaction.objectStore("producto");
	
	//Define Customer
	var producto = {
		nombre: nombre,
		marca: marca,
		cantidad:cantidad,
		precio:precio
	};
	
	//Perform the Add
	var request = tablaProducto.add(producto);
	
	//Success
	request.onsuccess = function(e){
		alert("Producto Agregado Correctamente");
		console.log("Cliente Agregado Correctamente");
	};
	
	//Error
	request.onerror = function(e){
		alert("No se pudo agregar el producto");
		console.log('Error', e.target.error.name);
	};
}

//Mostrar productos
function mostrarProducto(e){
	var transaction = db.transaction(["producto"],"readonly");

	var store = transaction.objectStore("producto");
	var index = store.index('nombre');
	
	var output = '';
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='producto_"+cursor.value.id+"'>";
			output += "<td>"+cursor.value.id+"</td>";
			output += "<td><span class='cursor producto' contenteditable='true' data-field='nombre' data-id='"+cursor.value.id+"'>"+cursor.value.nombre+"</span></td>";
			output += "<td><span class='cursor producto' contenteditable='true' data-field='marca' data-id='"+cursor.value.id+"'>"+cursor.value.marca+"</span></td>";
			output += "<td><span class='cursor producto' contenteditable='true' data-field='cantidad' data-id='"+cursor.value.id+"'>"+cursor.value.cantidad+"</span></td>";
			output += "<td>Bs. <span class='cursor producto' contenteditable='true' data-field='precio' data-id='"+cursor.value.id+"'>"+cursor.value.precio+"</span></td>";
			output += "<td><a onclick='borrarProducto("+cursor.value.id+")' href=''>Borrar</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		$('#producto').html(output);
	};
}

//borrar cliente
function borrarProducto(id){
	var transaction = db.transaction(["producto"],"readwrite");

	var store = transaction.objectStore("producto");
	
	var request = store.delete(id);
	
	//Success
	request.onsuccess = function(){
		console.log('producto '+id+' Borrado');
		$('.cliente_'+id).remove();
	};
	
	//Error
	request.onerror = function(e){
		alert("Error, El producto no pudo ser borrado");
		console.log('Error', e.target.error.name);
	};
}

//borrar todo
function borrarProductos(){
	indexedDB.deleteDatabase('almacen');
	window.location.href="index.html";
	alert("Se borro Correctamente");
	console.log("Borrados");
}

//actualizar clientes
$('#producto').on('blur','.producto',function(){
	//nuueva entrada
	var newText = $(this).html();
	//campo
	var field = $(this).data('field');
	//id del cliente
	var id = $(this).data('id');
	

	var transaction = db.transaction(["producto"],"readwrite");
	var store = transaction.objectStore("producto");
	
	var request = store.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'nombre'){
			data.nombre = newText;
		} else if(field == 'marca'){
			data.marca = newText;
		} else if (field == 'cantidad') {
			data.cantidad = newText;
		} else if (field == 'precio') {
			data.precio = newText;
		}
		
		var requestUpdate = store.put(data);
		
		requestUpdate.onsuccess = function(){
			alert('Producto Actualizado...');
			console.log('Producto Actualizado...');
		};
		
		requestUpdate.onerror = function(){
			console.log('Error: No se pudo actualizar el producto...');
		};
	};
});

//FIN CRUD PRODUCTOS

/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//INICIO CRUD USUARIOS
//agregar usuario
function agregarUsuario(){
	var nombre = $('#nombre').val();
	var email = $('#email').val();
	var user = $('#user').val();
	var password = $('#password').val();
	
	var transaction = db.transaction(["usuario"],"readwrite");
	//Ask for ObjectStore
	var tablaUsuario = transaction.objectStore("usuario");
	
	//Define Customer
	var usuario = {
		nombre: nombre,
		email: email,
		user:user,
		password:password
	};
	
	//Perform the Add
	var request = tablaUsuario.add(usuario);
	
	//Success
	request.onsuccess = function(e){
		alert("Usuario Registrado Correctamente");
		console.log("Usuario Agregado Correctamente");
	};
	
	//Error
	request.onerror = function(e){
		alert("No se pudo agregar al usuario");
		console.log('Error', e.target.error.name);
	};
}

//Mostrar usuarios
function mostrarUsuario(e){
	var transaction = db.transaction(["usuario"],"readonly");

	var store = transaction.objectStore("usuario");
	var index = store.index('nombre');
	
	var output = '';
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='usuario_"+cursor.value.id+"'>";
			output += "<td>"+cursor.value.id+"</td>";
			output += "<td><span class='cursor usuario' contenteditable='true' data-field='nombre' data-id='"+cursor.value.id+"'>"+cursor.value.nombre+"</span></td>";
			output += "<td><span class='cursor usuario' contenteditable='true' data-field='email' data-id='"+cursor.value.id+"'>"+cursor.value.email+"</span></td>";
			output += "<td><span class='cursor usuario' contenteditable='true' data-field='user' data-id='"+cursor.value.id+"'>"+cursor.value.user+"</span></td>";
			output += "<td><span class='cursor usuario' contenteditable='true' data-field='password' data-id='"+cursor.value.id+"'>"+cursor.value.password+"</span></td>";
			output += "<td><a class='btn btn-danger' onclick='borrarUsuario("+cursor.value.id+")' href=''> X</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		$('#usuario').html(output);
	};
}

//borrar usuario
function borrarUsuario(id){
	var transaction = db.transaction(["usuario"],"readwrite");
	var store = transaction.objectStore("usuario");
	var request = store.delete(id);
	
	//Success
	request.onsuccess = function(){
		console.log('usuario '+id+' Borrado');
		$('.usuario_'+id).remove();
		alert("El usuario ha sido borrado");
	};
	
	//Error
	request.onerror = function(e){
		alert("Error, El usuario no pudo ser borrado");
		console.log('Error', e.target.error.name);
	};
}

//borrar todo
function borrarUsuarios(){
	indexedDB.deleteDatabase('almacen');
	alert("Se borro Correctamente");
	console.log("Borrados");
	window.location.href="index.html";
}

//actualizar usuarios
$('#usuario').on('blur','.usuario',function(){
	//nuueva entrada
	var newText = $(this).html();
	//campo
	var field = $(this).data('field');
	//id del cliente
	var id = $(this).data('id');
	

	var transaction = db.transaction(["usuario"],"readwrite");
	var store = transaction.objectStore("usuario");
	
	var request = store.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'nombre'){
			data.nombre = newText;
		} else if(field == 'email'){
			data.email = newText;
		} else if (field == 'user') {
			data.user = newText;
		} else if (field == 'password') {
			data.password = newText;
		}
		
		var requestUpdate = store.put(data);
		
		requestUpdate.onsuccess = function(){
			alert('Usuario Actualizado...');
			console.log('Usuario Actualizado...');
		};
		
		requestUpdate.onerror = function(){
			console.log('Error: No se pudo actualizar el usuario...');
		};
	};
});

//login
function login() {

    var transaction = db.transaction(["usuario"]);
            var objectStore = transaction.objectStore("usuario");
            var request = objectStore.get(1);// 1 is Key Value
            
            request.onerror = function(event) {
               alert("Unable to retrieve data from database!");
            };
            
            request.onsuccess = function(event) {
               // Do something with the request.result!
               if(request.result) {
                 if(request.result.user == Credential.user && request.result.password == Credential.password){
                   alert("Ok");
                 }
                 else{
                   $scope.ErrorMessage = "Enter Valid Credentials!!!"
                   $scope.$apply($scope.tooltipIsOpen = true);
                 }
               }               
               else {
                 $scope.ErrorMessage = "No User Available!!!"
                   $scope.$apply($scope.tooltipIsOpen = true);
               }
            };
}