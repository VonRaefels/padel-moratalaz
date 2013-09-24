var App = {
    init: function(){
        App.initEvents();
    },
    crearPareja: function(){
        var pareja = {};
        for(var i=1; i<=2; i++){
            var nombre = $('#nombre' + i).val();
            var email = $('#email' + i).val();
            var tel = $('#tel' + i).val();
            var edad = $('#edad' + i).val();
            var nivel = $('#nivel' + i).val();
            var sexo = $('input:radio[name=sexo' + i + ']:checked').val();
            var jugador = {'nombre': nombre, 'email': email, 'tel': tel, 'edad': edad, 'nivel': nivel, 'sexo': sexo};
            pareja['jugador' + i] = jugador;
        }
        return pareja;
    },
    validarPareja: function(pareja){
        return true;
    },
    postPareja: function(){
        var pareja = App.crearPareja();
        if()
    },
    initEvents: function(){
        $('#reset1').on('click', {'numeroJugador': '1'}, App.resetJugador);
        $('#reset2').on('click', {'numeroJugador': '2'}, App.resetJugador);
        $('#inscripcion').on('click', App.crearJSON);
    },
    resetJugador: function(ev){
        var numJugador = ev.data.numeroJugador;
        $('#nombre' + numJugador).val('');
        $('#email' + numJugador).val('');
        $('#tel' + numJugador).val('');
        $('#edad' + numJugador).val('');
    }
};

App.init();