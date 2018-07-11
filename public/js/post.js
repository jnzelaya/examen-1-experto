var db;

/*(function(){

var solicitud = window.indexedDB.open("Post", 1);

solicitud.onsuccess = function(evento){
    db = solicitud.result;
    llenarlosPost();
}


solicitud.onupgradeneeded = function(evento){
        console.log("La base de datos se creara");
        db = evento.target.result; //Obteniendo la refencia la base de datos creada (facebook)
        var objectStorePost = db.createObjectStore("pensamientos", {keyPath: "codigo", autoIncrement: true});

        objectStorePost.transaction.oncomplete = function(evento){
            console.log("El object store de usuarios se creo con exito");
        }

        objectStorePost.transaction.onerror = function(evento){
            console.log("Error al crear el object store de usuarios");
        }
        //En este punto se debe crear la estructura de la base de datos
        //Es necesario crear almacenes de objetos en la base de datos (Object Store)
        
    }
    
})();*/

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

function validarCampoVacio(id){
    if (document.getElementById(id).value==""){
        document.getElementById(id).classList.remove("is-valid");
        document.getElementById(id).classList.add("is-invalid");
        return false;
    } else{
        document.getElementById(id).classList.remove("is-invalid");
        document.getElementById(id).classList.add("is-valid");
        return true;
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