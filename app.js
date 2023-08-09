import pg from 'pg';

const {Pool} = pg;

const config = {
    user: 'bastianpoloni',
    password: '',
    database: 'always_music',    
    port: 5432,
    max : 20,
    idleTimeoutMillis : 5000,
    connectionTimeoutMillis : 2000,
};

const pool = new Pool(config);

const opcion = process.argv[2];
const nombre = process.argv[3];
const rut = process.argv[4];
const curso = process.argv[5];
const nivel = process.argv[6];



async function preparedStatement(queryInfo, params){
    const client = await pool.connect();
    try{
        const query = {
            name : 'query-name',
            text : queryInfo,
            values : params,
            rowMode : 'array',
        }
        const res = await client.query(query);
        return res.rows;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

async function nuevoAlumno (nombre, rut, curso, nivel){
    const query = `INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)`;
    const params = [nombre, rut, curso, nivel];
    await preparedStatement(query, params);
    console.log(`Estudiante ${nombre} agregado con exito`);
}

async function editarAlumno (nombre, rut, curso, nivel){
    const query = `UPDATE estudiantes SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE rut = $2`;
    const params = [nombre, rut, curso, nivel];
    await preparedStatement(query, params);
    console.log(`Estudiante ${nombre} editado con exito`);
};

async function eliminarAlumno(nombre){
    const query = `DELETE FROM estudiantes WHERE rut = $1`;
    const params = [nombre];
    await preparedStatement(query, params);
    console.log(`Estudiante ${nombre} eliminado con exito`);
};

async function consulta(){
    const query = `SELECT * FROM estudiantes`;
    const res = await preparedStatement(query, []);
    console.log(res);  
};

async function rutAlumno(rut){
    const query = `SELECT * FROM estudiantes WHERE rut = $1`;
    const params = [rut];
    const res = await preparedStatement(query, params);
    console.log(res);
};



switch (opcion) {
    
    case 'nuevo':    
        nuevoAlumno(nombre, rut, curso, nivel);
        break;
    case 'editar':
        editarAlumno(nombre, rut, curso, nivel);
        break;
    case 'eliminar':
        eliminarAlumno(nombre);
        break;
    case 'consulta':
        consulta();     
        break;
    case 'rut':
        rutAlumno(nombre);
        break;
    default:
        console.log('Opcion no valida');
        break;
};
