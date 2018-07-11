var db; //variable global

(function(){
    if (!('indexedDB' in window)){
        console.err("El navegador no soporta indexedDB");
        return;
    }

    var solicitud = window.indexedDB.open("facebook", 1);//Parametros: nombre, version. La version debe ser entero
    
    
    //Se ejecutara en caso de que pueda abrir la BD sin problemas
    solicitud.onsuccess = function(evento){
        console.log("Se abrio la base de datos");
        db = solicitud.result;//importante

        //Leer la informacion del objectstore e imprimirla en la tabla html
        llenar();
        llenarlosPost();
    }    

    //Se ejecutar en caso no se pueda abrir la base de datos
    solicitud.onerror = function(evento){
        console.err("No se pudo abrir la base datos");
    }
    solicitud.onupgradeneeded = function(evento){
        console.log("La base de datos se creara");
        db = evento.target.result; //Obteniendo la refencia la base de datos creada (facebook)
        var objectStoreUsuarios = db.createObjectStore("usuarios", {keyPath: "codigo", autoIncrement: true});
        

        objectStoreUsuarios.transaction.oncomplete = function(evento){
            console.log("El object store de usuarios se creo con exito");
        }

        objectStoreUsuarios.transaction.onerror = function(evento){
            console.log("Error al crear el object store de usuarios");
        }
        //En este punto se debe crear la estructura de la base de datos
        //Es necesario crear almacenes de objetos en la base de datos (Object Store)
    }
})();


function llenar(){
    //Leer el objectstore de usuarios para imprimir la informacion,
    //debe ser en este punto porque esta funcion se ejecuta si se abrio la BD correctamente
    var transaccion = db.transaction(["usuarios"],"readonly");///readwrite: Escritura/lectura, readonly: Solo lectura
    var objectStoreUsuarios = transaccion.objectStore("usuarios");
    var cursor = objectStoreUsuarios.openCursor();
    cursor.onsuccess = function(evento){
        //Se ejecuta por cada objeto del objecstore
        if(evento.target.result){
            console.log(evento.target.result.value);
            document.getElementById("datos").innerHTML += 
                    "<option>"+ evento.target.result.value.firstname+" "+ evento.target.result.value.lastname+"</option>";
            evento.target.result.continue();
        }
    }
}


function Registrarpost(){
    if (
        validarCampoVacio("pensamiento")&&
        validarCampoVacio("fecha")
    ){
        var pensamiento = {};
        pensamiento.nombre =  document.getElementById("datos").value;
        pensamiento.pensamiento =  document.getElementById("pensamiento").value;
        pensamiento.fecha =  document.getElementById("fecha").value;       
        
        ///Guardar informacion en el objectstore de usuarios de la base de datos de facebook
        var transaccion = db.transaction(["pensamientos"],"readwrite");///readwrite: Escritura/lectura, readonly: Solo lectura
        var objectStorePost = transaccion.objectStore("pensamientos");
        var solicitud = objectStorePost.add(pensamiento);
        solicitud.onsuccess = function(evento){
        console.log("Se agrego el post correctamente");
        llenarlosPost();
            //llenarTablaUsuarios();
        }

        solicitud.onerror = function(evento){
            console.log("Ocurrio un error al guardar");
        }
        console.log(pensamiento);
        
    }
    
}


function llenarlosPost(){

    
    //Leer el objectstore de usuarios para imprimir la informacion, debe ser en este punto porque esta funcion se ejecuta si se abrio la BD correctamente
    var transaccion = db.transaction(["pensamientos"],"readonly");//readwrite: Escritura/lectura, readonly: Solo lectura
    var objectStorePost = transaccion.objectStore("pensamientos");
    var cursor = objectStorePost.openCursor();
    cursor.onsuccess = function(evento){
        //Se ejecuta por cada objeto del objecstore
        if(evento.target.result){
            console.log(evento.target.result.value);
            document.getElementById("post").innerHTML += 
                    "<div class='col-12 col-md-6 col-lg-4 col-xl-4' style='margin-top:40px'>"+ 
                       "<form class='form-control h-100'>"+
                            "<div class='font-weight-bold mt-2'>"+
                                    "<img src='img/profile.jpg' class='rounded-circle img-thumbnail' width='40'>"+
                                    "<label for='exampleInputEmail1'>"+ evento.target.result.value.nombre +"</label>"+
                                    "<small class = 'text-muted'>("+evento.target.result.value.fecha+")</small>"+
                            "</div>"+
                            "<hr>"+
                            "<div class='text-left pre-scrollable' style='height:250px'>"+
                                  "<p>"+evento.target.result.value.pensamiento+"</p>"+
                            "</div>"+
                        "</form>"+
                    "</div>";     
                    evento.target.result.continue();    
        }
         
    }
}