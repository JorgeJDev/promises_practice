document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.querySelector('#formulario');
    const campoMatricula = document.querySelector('#matricula');
    const listaErrores = document.querySelector('#listaErrores');
    const tablaResultados = document.querySelector("#tbody");
    const vaciarTabla = document.querySelector("#vaciar");
    const regExpMatricula = /[0-9]{4}-{1}[A-Z]{3}/;

    const fragment = document.createDocumentFragment();

    let arrayLocalPropietarios = JSON.parse(localStorage.getItem('propietarioslocal')) || [];



    const arrayCoches = [

        { matricula: '4672-HTK', alta: true },
        { matricula: '4123-HKK', alta: true },
        { matricula: '8672-HTK', alta: true },
        { matricula: '4672-PTK', alta: true },
        { matricula: '1111-HTK', alta: true },
        { matricula: '2222-HKK', alta: false },
        { matricula: '3333-HTK', alta: false },
        { matricula: '4444-HTK', alta: false },
        { matricula: '5555-HTK', alta: true },
        { matricula: '6666-HTK', alta: false },

    ];



    const arrayPropietarios = [
        {
            matricula: "4672-HTK", propietario: {
                nombre: "Pepe García", telefono: "612345678", direccion: "Calle Mayor, 1", modelo: "Renault Clio",
            },
        },

        {
            matricula: "4123-HKK", propietario: {
                nombre: "Juan Martínez", telefono: "612345679", direccion: "Plaza España, 2", modelo: "Opel Astra",
            },
        },

        {
            matricula: "8672-HTK", propietario: {
                nombre: "Luisa Fernández", telefono: "612345680", direccion: "Calle Mayor, 3", modelo: "Volkswagen Golf",
            },
        },

        {
            matricula: "4672-PTK", propietario: {
                nombre: "Ana Ruiz", telefono: "612345681", direccion: "Avenida Libertad, 4", modelo: "Seat Ibiza",
            },
        },

        {
            matricula: "1111-HTK", propietario: {
                nombre: "Manuel Sánchez", telefono: "612345682", direccion: "Calle Mayor, 5", modelo: "Fiat Panda",
            },
        },

        {
            matricula: "2222-HKK", propietario: {
                nombre: "Sara González", telefono: "612345683", direccion: "Calle Real, 6", modelo: "Toyota Corolla",
            },
        },

        {
            matricula: "3333-HTK", propietario: {
                nombre: "Javier López", telefono: "612345684", direccion: "Avenida Europa, 7", modelo: "Renault Mégane",
            },
        },

        {
            matricula: "4444-HTK", propietario: {
                nombre: "María Pérez", telefono: "612345685", direccion: "Calle Mayor, 8", modelo: "Fiat Punto",
            },
        },

        {
            matricula: "5555-HTK", propietario: {
                nombre: "Antonio Torres", telefono: "612345686", direccion: "Plaza España, 9", modelo: "Ford Focus",
            },
        },

        {
            matricula: "6666-HTK", propietario: {
                nombre: "Marta Jiménez", telefono: "612345687", direccion: "Avenida Libertad, 10", modelo: "Renault Clio",
            },
        },
    ];

    const arrayMultas = [

        { matricula: '4672-HTK', multas: 4 },
        { matricula: '4123-HKK', multas: 5 },
        { matricula: '8672-HTK', multas: 6 },
        { matricula: '4672-PTK', multas: 2 },
        { matricula: '1111-HTK', multas: 8 },

    ];


    //* EVENTOS

    formulario.addEventListener('submit', (ev) => {

        ev.preventDefault();
        comprobarCoche();

    });

    vaciarTabla.addEventListener("click", (ev) => {

        if (ev.target.matches(".vaciar")) {

            arrayLocalPropietarios.length = 0;
            localStorage.removeItem("propietarioslocal");
            pintarTabla();

        }
    });


    //* FUNCIONES

    const comprobarMatricula = async () => {

        let matricula = campoMatricula.value;

        if (regExpMatricula.test(matricula) == true) {

            return matricula;

        } else {

            throw `Introduzca una matrícula válida`;

        }
    };


    const comprobarAlta = async (matricula) => {

        let altaCoche = arrayCoches.find((item) => item.matricula == matricula)?.alta;

        if (altaCoche == true) {

            return altaCoche;

        } else {

            if (altaCoche == false) {

                throw `El coche con matrícula: ${matricula} no esta dado de alta`;
            } else {

                throw `El coche con matrícula: ${matricula} no está en la base de datos`;
            }
        }
    };


    const comprobarPropietario = async (matricula) => {


        let propietario = arrayPropietarios.find((item) => item.matricula == matricula)?.propietario;

        if (propietario != undefined) {

            return propietario;

        } else {

            throw `El coche con matrícula: ${matricula}, no tiene propietario`;

        }
    };


    const comprobarMultas = async (matricula, propietario) => {

        let multa = arrayMultas.find((item) => item.matricula == matricula)?.multas;

        if (multa != undefined) {

            return multa;

        } else {

            throw ` El coche con matrícula: ${matricula} y que es el propietario: ${propietario.nombre} no tiene ninguna multa`;
        }
    };

    const comprobarCoche = async () => {

        listaErrores.innerHTML = "";

        try {

            const matriculaComprobada = await comprobarMatricula();
            const altaComprobada = await comprobarAlta(matriculaComprobada);
            const propietarioComprobado = await comprobarPropietario(matriculaComprobada);
            const multasComprobadas = await comprobarMultas(matriculaComprobada, propietarioComprobado);

            const existeRegistro = arrayLocalPropietarios.some((registro) => registro.matricula === matriculaComprobada);

            if (!existeRegistro) {

                const matriculaTabla = {
                    matricula: matriculaComprobada,
                    propietario: propietarioComprobado.nombre,
                    direccion: propietarioComprobado.direccion,
                    modelo: propietarioComprobado.modelo,
                    telefono: propietarioComprobado.telefono,
                    multas: multasComprobadas,
                };
                arrayLocalPropietarios.push(matriculaTabla);
                setLocal();
            }

            pintarTabla();

        } catch (error) {

            pintarErrores(error);

        }
    };

    const setLocal = () => {

        localStorage.setItem('propietarioslocal', JSON.stringify(arrayLocalPropietarios));

    }

    const getLocal = () => {

        return JSON.parse(localStorage.getItem('propietarioslocal')) || [];

    }

    const pintarTabla = async () => {

        tablaResultados.innerHTML = "";

        const propietariosLocal = getLocal();

        propietariosLocal.forEach((item) => {

            const elementoTabla = document.createElement("tr");

            elementoTabla.innerHTML += `<td>${item.matricula}</td><td>${item.propietario}</td><td>${item.direccion}</td><td>${item.modelo}</td><td>${item.telefono}</td><td>${item.multas}</td>`;

            fragment.append(elementoTabla);
        });

        tablaResultados.append(fragment);

        if (propietariosLocal.length > 0) {
            vaciarTabla.innerHTML = ""
            vaciarTabla.innerHTML = `<button class="vaciar">Vaciar Cesta</button>`;
        }
    };


    const pintarErrores = (errors) => {

        const message = document.createElement("P");
        message.textContent = errors;
        listaErrores.append(message);

    };

    pintarTabla()

}); //! LOAD
